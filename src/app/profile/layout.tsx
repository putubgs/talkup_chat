"use client";
import React, { ReactNode, useEffect, useState } from "react";
import PointsIcon from "@/components/icons/PointsIcon";
import { useSession } from "next-auth/react";
import StarIcon from "@/components/icons/StarIcon";
import GiftIcon from "@/components/icons/GiftIcon";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Image from "next/image";
import styles from "./AvatarWithOverlay.module.css";
import { Dialog, DialogTitle, Box } from "@mui/material";
import AvatarChanger from "@/components/profile/AvatarChanger";
import { avatars } from "@/dummy/avatars";
import { FeedbackData } from "@/dummy/feedback";
import { styled } from "@mui/system";
import { Session } from "next-auth";

interface CustomUser extends Session {
  user: {
    id?: string;
    name?: string | null;
    username?: string;
    points?: number;
    rating?: number;
    tier?: number;
    avatar?: number;
  };
}

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  let { data: session, update } = useSession({
    required: true,
  }) as { data: CustomUser | null; update: any };
  const [selectedAvatar, setSelectedAvatar] = useState<number | undefined>();
  const [cardCount, setCardCount] = useState(0);

  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        const res = await fetch(
          `/api/getData/getTotalStory?userId=${session?.user?.id}`
        );
        const data = await res.json();
        setCardCount(data.cardCount);
      } catch (err) {
        console.error(err);
      }
    };

    if (session?.user?.id) {
      fetchUserCards();
    }
  }, [session]);

  useEffect(() => {
    setSelectedAvatar(session?.user?.avatar);
  }, [session]);

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
      {children}
    </section>
  );
}
