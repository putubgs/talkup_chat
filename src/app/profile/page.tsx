"use client";
import React, { useEffect, useState } from "react";
import PointsIcon from "@/components/icons/PointsIcon";
import StarIcon from "@/components/icons/StarIcon";
import GiftIcon from "@/components/icons/GiftIcon";
import { FeedbackData } from "@/dummy/feedback";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Image from "next/image";
import styles from "./AvatarWithOverlay.module.css";
import { Dialog, DialogTitle, Box } from "@mui/material";
import { styled } from "@mui/system";
import AvatarChanger from "@/components/profile/AvatarChanger";
import { avatars } from "@/dummy/avatars";
import axios from "axios";

interface CustomUser extends Session {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    username?: string;
    points?: number;
    rating?: number;
    tier?: number;
    avatar?: number;
  };
}

const ProfilePage: React.FC = () => {
  let { data: session, update } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/profile");
    },
  }) as { data: CustomUser | null; update: any };
  console.log(session?.user?.points);
  console.log(session?.user?.tier);
  console.log(session?.user?.avatar);
  const [selectedAvatar, setSelectedAvatar] = useState<number | undefined>();
  const [pendingAvatar, setPendingAvatar] = useState<number | undefined>();

  useEffect(() => {
    setSelectedAvatar(session?.user?.avatar);
    setPendingAvatar(session?.user?.avatar);
  }, [session]);

  const clickedAvatar = (num: number) => {
    setPendingAvatar(num);
  };

  const agreeAvatarChange = async () => {
    if (pendingAvatar !== null) {
      try {
        const response = await axios.put("/api/editProfile/update-avatar", {
          userId: session?.user?.id,
          newAvatar: pendingAvatar,
        });
        const updatedUser = response.data.data;
        setSelectedAvatar(updatedUser.avatar);

        await update({
          ...session,
          user: {
            ...session?.user,
            token: "dddd",
            avatar: updatedUser.avatar,
          },
        });
      } catch (error) {
        console.error(error);
      }
      console.log(session?.user?.avatar);
      setPendingAvatar(session?.user?.avatar);
    }
    handleClose();
  };

  let totalRating = 0;

  FeedbackData.forEach((data) => {
    totalRating += data.rating;
  });

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      width: "100%",
      maxWidth: 800,
      height: "35%",
      padding: "20px",
    },
  }));

  const averageRating = (totalRating / FeedbackData.length).toFixed(1);
  return (
    <section className="flex flex-col min-w-0">
      <div className="flex h-[150px] p-7 justify-between min-w-0 items-center">
        <div className="flex pl-12 items-center justify-between">
          <div
            className={`${styles.avatarContainer} cursor-pointer`}
            onClick={handleOpen}
          >
            <Image
              src={avatars[selectedAvatar ?? 0]}
              alt="avatar"
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
            <div className={styles.overlay}>
              <PhotoCameraIcon sx={{ color: "white" }} />
            </div>
          </div>
          <CustomDialog
            onClose={handleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <DialogTitle id="customized-dialog-title" className="text-center">
              <div className="text-xl font-bold">
                Choose Your Avatar Profile
              </div>
            </DialogTitle>
            <Box sx={{ bgcolor: "background.paper", borderRadius: 2, p: 2 }}>
              <AvatarChanger
                session={session}
                update={update}
                onClose={handleClose}
                setAvatar={setSelectedAvatar}
              />
            </Box>
          </CustomDialog>
          <div className="flex flex-col pl-4">
            <div className="font-bold text-xl">{session?.user?.username}</div>
            <div className="flex pt-2 space-x-5">
              <div className="flex">
                <PointsIcon size={15} color="#0D90FF" />
                <p className="pl-1 text-[#0D90FF]">
                  {session?.user?.points} Point
                </p>
              </div>
              <div className="flex">
                <StarIcon size={15} color="#0D90FF" />
                <p className="pl-1 text-[#0D90FF]">{averageRating}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-right pr-12">
          <GiftIcon size={80} color={"#85878A"} />
          <div className="-mt-[10px] text-[#85878A]">
            Tier {session?.user?.tier}
          </div>
        </div>
      </div>
      <hr className="ml-3 mr-3 border border-[1px] " />
      <div className="flex flex-col p-7 min-w-0">
        <div className="flex flex-col relative justify-center items-center min-w-0">
          <div className="flex flex-col bg-[#F6FAFF] h-[270px] rounded-xl w-[950px] yourShadowClass">
            <div className="flex flex-col p-7">
              <div className="flex text-xl font-bold pb-3">
                Your Listening and Story
              </div>
              <div className="flex justify-between">
                <div className="flex pt-2">
                  <svg
                    width="399"
                    height="157"
                    viewBox="0 0 399 157"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_130_241)">
                      <rect
                        width="399.451"
                        height="157.322"
                        rx="20"
                        fill="#3817E2"
                      />
                      <circle
                        opacity="0.5"
                        cx="318.778"
                        cy="154.855"
                        r="68.0721"
                        fill="#0D90FF"
                      />
                      <circle
                        opacity="0.5"
                        cx="389.867"
                        cy="118.052"
                        r="47.3912"
                        fill="#0D90FF"
                      />
                      <text
                        x="20"
                        y="95"
                        fill="white"
                        fontSize="20"
                        fontFamily="Verdana"
                      >
                        Listening
                      </text>
                      <text
                        x="20"
                        y="130"
                        fill="white"
                        fontSize="20"
                        fontFamily="Verdana"
                      >
                        23 Story
                      </text>
                    </g>
                    <defs>
                      <clipPath id="clip0_130_241">
                        <rect width="399" height="157" rx="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div className="flex pt-2">
                  <svg
                    width="399"
                    height="157"
                    viewBox="0 0 399 157"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clip-path="url(#clip0_130_241)">
                      <rect
                        width="399.451"
                        height="157.322"
                        rx="20"
                        fill="#0D90FF"
                      />
                      <circle
                        opacity="0.5"
                        cx="318.778"
                        cy="154.855"
                        r="68.0721"
                        fill="#3817E2"
                      />
                      <circle
                        opacity="0.5"
                        cx="389.867"
                        cy="118.052"
                        r="47.3912"
                        fill="#3817E2"
                      />
                      <text
                        x="20"
                        y="95"
                        fill="white"
                        fontSize="20"
                        fontFamily="Verdana"
                      >
                        Your Story
                      </text>
                      <text
                        x="20"
                        y="130"
                        fill="white"
                        fontSize="20"
                        fontFamily="Verdana"
                      >
                        23 Story
                      </text>
                    </g>
                    <defs>
                      <clipPath id="clip0_130_241">
                        <rect width="399" height="157" rx="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col bg-[#F6FAFF] w-[950px] mt-10 rounded-xl yourShadowClass">
            <div className="flex flex-col p-7">
              <div className="flex text-xl font-bold pb-2">All Feedback</div>
              <table className="table-auto bg-transparent w-full">
                <thead className="text-left text-[#B5B7C0]">
                  <tr>
                    <th className="border-b px-4 py-6">Name</th>
                    <th className="border-b px-4 py-6">Date</th>
                    <th className="border-b px-4 py-6">Feedback</th>
                    <th className="border-b px-4 py-6 pr-8 text-right">
                      Rating
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {FeedbackData.map((data, index) => (
                    <tr key={index}>
                      <td className="border-b px-4 py-6">{data.name}</td>
                      <td className="border-b px-4 py-6">{data.date}</td>
                      <td className="border-b px-4 py-6 text-[13px]">
                        {data.feedback}
                      </td>
                      <td className="border-b px-4 py-6 text-right">
                        <div className="bg-[#A1E4D8] border border-[#008767] text-[#008767] px-7 inline-block rounded">
                          {data.rating}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
