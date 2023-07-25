"use client";
import React, { ReactNode, useEffect, useState } from "react";
import PointsIcon from "@/components/icons/PointsIcon";
import { useSession } from "next-auth/react";
import StarIcon from "@/components/icons/StarIcon";
import GiftIcon from "@/components/icons/GiftIcon";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LockIcon from "@mui/icons-material/Lock";
import Image from "next/image";
import styles from "./AvatarWithOverlay.module.css";
import { Dialog, DialogTitle, Box } from "@mui/material";
import AvatarChanger from "@/components/profile/AvatarChanger";
import { avatars } from "@/dummy/avatars";
import { styled } from "@mui/system";
import { Session } from "next-auth";
import axios from "axios";

interface CustomUser extends Session {
  user: {
    id?: string;
    name?: string | null;
    username?: string;
    points?: number;
    rating?: number;
    tier?: number;
    avatar?: number;
    updateTier?: (newTier: number) => void;
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
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [tierColor, setTierColor] = useState("#000000");
  const [totalRating, setTotalRating] = useState<string | null>("0");


  useEffect(() => {
    setSelectedAvatar(session?.user?.avatar);
  
    const fetchFeedback = async () => {
      try {
        const res = await fetch("/api/getData/getFeedback");
        const data = await res.json();
        const userId = session?.user.id;
        const filteredFeedbacks = data.feedbacks.filter((feedback:any) => feedback.userId === userId);
        let ratingTemp = 0;
        filteredFeedbacks.forEach((data:any) => {
          ratingTemp += data.rating;
        });
        
        let average = parseFloat((ratingTemp / filteredFeedbacks.length).toFixed(1));
        
        // Check if average is NaN and if so, set it to 0
        if (isNaN(average)) {
          average = 0;
        }
        
        setTotalRating(average.toString())
        
      } catch (error) {
        console.error("Failed to fetch feedbacks", error);
      }
    };
  
    fetchFeedback()
  }, [session]);
  
  useEffect(() => {
    if (session && session.user) {
      const newTier = getTierFromPoints(session.user.points ?? 0);

      switch (newTier) {
        case 1:
          setTierColor("#AF9500");
          break;
        case 2:
          setTierColor("#9E9E9E");
          break;
        case 3:
          setTierColor("#6A3805");
          break;
        default:
          setTierColor("#000000");
          break;
      }
      updateTier(newTier);
    }
  }, [session?.user?.points]);





  const getTierFromPoints = (points: number) => {
    if (points >= 1000) return 1;
    if (points >= 500) return 2;
    if (points >= 250) return 3;
    return 0;
  };

  const updateTier = async (newTier: number) => {
    console.log(getTierFromPoints(session?.user.points ?? 0));
    try {
      const response = await axios.put("/api/editProfile/update-tier", {
        userId: session?.user?.id,
        newTier: newTier,
      });
      const updatedUser = response.data.data;

      await update({
        ...session,
        user: {
          ...session?.user,
          token: "dddd",
          tier: updatedUser.tier,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen2 = () => {
    setOpen2(true);
  };

  const handleClose2 = () => {
    setOpen2(false);
  };

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      width: "100%",
      maxWidth: 800,
      height: "35%",
      padding: "20px",
    },
  }));

  const CustomDialog2 = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      width: "100%",
      maxWidth: 650,
      height: "35%",
      padding: "20px",
    },
  }));

  const maxPoints = 1000;
  let currentPoints = session?.user.points ?? 0;

  let percentage = Math.floor((currentPoints / maxPoints) * 100);

  const prizes = [
    {
      label: "The Psychology (E-Book)",
      pointsRequired: 1000,
      downloadLink: "/api/prizes/getPrize3",
    },
    {
      label: "The Mental Health (E-Book)",
      pointsRequired: 500,
      downloadLink: "/api/prizes/getPrize2",
    },
    {
      label: "The Alchemist (E-Book)",
      pointsRequired: 250,
      downloadLink: "/api/prizes/getPrize1",
    },
  ];

  // const averageRating = (totalRating / feedbackData.length).toFixed(1);
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
            aria-labelledby="avatar-changer"
            open={open}
          >
            <DialogTitle id="avatar-changer" className="text-center">
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
                <p className="pl-1 text-[#0D90FF]">{totalRating}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div
            onClick={handleOpen2}
            className="flex flex-col items-center justify-right pr-12 cursor-pointer"
          >
            <GiftIcon size={80} color={tierColor} />
            <div className={`-mt-[10px] text-[${tierColor}]`}>
              Tier {session?.user?.tier}
            </div>
          </div>
        </div>
        <CustomDialog2
          onClose={handleClose2}
          aria-labelledby="points-prize"
          open={open2}
        >
          <DialogTitle id="points-prize" className="text-center">
            <div className="text-xl font-bold">Download your prize now!</div>
          </DialogTitle>
          <Box sx={{ bgcolor: "background.paper", borderRadius: 2, p: 2 }}>
            <div className="flex justify-between">
              <div className="flex flex-col space-y-4 text-white font-bold">
                {prizes.map((prize, index) => {
                  const isUnlocked = currentPoints >= prize.pointsRequired;
                  return (
                    <a
                      key={index}
                      href={isUnlocked ? prize.downloadLink : "#"}
                      download={isUnlocked}
                      onClick={
                        isUnlocked ? () => {} : (e) => e.preventDefault()
                      }
                    >
                      <div
                        key={index}
                        className={`cursor-pointer relative rounded-xl p-3 text-xl text-center ${
                          isUnlocked ? "bg-[#0D90FF]" : "bg-black bg-opacity-50"
                        }`}
                      >
                        {isUnlocked ? (
                          prize.label
                        ) : (
                          <>
                            <LockIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white" />
                            <span className="pl-6">
                              You need {prize.pointsRequired} points to unlock
                              this
                            </span>
                          </>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
              <div className="pr-6 flex flex-col text-center items-center space-y-4">
                <div className="w-6 h-full bg-gray-300 rounded-xl relative overflow-hidden">
                  <div
                    className="h-full bg-[#3817E2] rounded-xl absolute bottom-0 transition-all duration-500 ease-in-out"
                    style={{ width: "100%", height: `${percentage}%` }}
                  ></div>
                </div>
                <div className="flex">
                  <PointsIcon size={15} color="#0D90FF" />
                  <p className="pl-1 text-[#0D90FF]">{currentPoints} Point</p>
                </div>
              </div>
            </div>
          </Box>
        </CustomDialog2>
      </div>
      <hr className="ml-3 mr-3 border border-[1px] " />
      {children}
    </section>
  );
}
