"use client";
import React, { FC, useState } from "react";
import ArrowIcon from "@/components/icons/ArrowIcon";
import HighlightedText from "./HighlightedText";
import { usePathname } from "next/navigation";
import { Dialog, DialogTitle, Box } from "@mui/material";
import { styled } from "@mui/system";
import Image from "next/image";
import { avatars } from "@/dummy/avatars";
import { formatDistanceToNow } from "date-fns";
import DeleteIcon from "@mui/icons-material/DeleteOutline";
import { Toast } from "./Toast";

interface StoryCardProps {
  id: string;
  story: string;
  category: string;
  searchQuery: string;
  storyType: string;
  schedules: Array<Schedule>;
  userId: string;
  activation: boolean;
  username: string | undefined;
  avatar: number | undefined;
  createdAt: Date;
  refetch: () => Promise<void>
  setToastMessage: (toastMsg: string) => void;
  setToastVisible: (toast: boolean) => void;
  setError: (error: boolean) => void;
}

type Schedule = {
  date: string;
  time: string;
};

const categoryColors = {
  "Social Connection": "#EA6E9A",
  "Personal Growth": "#1DCF5C",
  Family: "#3817E2",
  Health: "#5449AB",
  Spirituality: "#C1EB5E",
  Finance: "#0D90FF",
} as const;

const StoryCard: FC<StoryCardProps> = ({
  id,
  story,
  category,
  searchQuery,
  storyType,
  schedules,
  userId,
  username,
  avatar,
  activation,
  createdAt,
  refetch,
  setToastMessage,
  setToastVisible,
  setError
}) => {
  const cardColor = categoryColors[category as keyof typeof categoryColors];
  const isProfile = usePathname()
    ? usePathname()?.startsWith("/profile")
    : false;
  const textColor = category === "Spirituality" ? "black" : "white";
  const circleColor =
    category === "Finance" ? "rgba(28,28,28,0.2)" : "rgba(59,130,246,0.2)";
  const [open, setOpen] = useState(false);
  const date = new Date(createdAt);
  const timeAgo = formatDistanceToNow(new Date(date), {
    addSuffix: true,
    includeSeconds: true,
  });

  async function handleDelete(id: any) {
    setToastVisible(false);
    try {
      const res = await fetch(`/api/getData/getAndDeleteStory?id=${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error deleting story");
      setToastMessage("Successfully deleted the story!");
      setToastVisible(true);
      handleClose()
      refetch();
    } catch (err: any) {
      console.error(err);
      setToastMessage(err);
      setToastVisible(true);
      setError(true);
      handleClose()
    }
  }
  
  

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      width: "100%",
      maxWidth: 350,
      // height: "50%",
    },
  }));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div
      key={id}
      className="relative rounded-lg shadow-lg overflow-hidden w-80 h-60 p-4 flex-shrink-0"
      style={{ backgroundColor: cardColor }}
    >

      <div className="absolute bottom-0 right-0 flex justify-end items-end">
        <div
          className="rounded-full w-24 h-24 -mr-[140px] mb-4"
          style={{ backgroundColor: circleColor }}
        ></div>
        <div
          className="rounded-full w-24 h-24 -mr-1 -mb-8"
          style={{ backgroundColor: circleColor }}
        ></div>
      </div>
      <div className="flex flex-col">
        <div className="flex text-xs h-6 bg-white self-end rounded items-center pl-2 pr-2">
          <p className="text-black">{category}</p>
        </div>
        <div className="h-[157px] w-60 p-3">
          <p className="text-xl font-bold" style={{ color: textColor }}>
            <HighlightedText text={story} highlight={searchQuery} />
          </p>
        </div>
        <button
          className="flex items-center space-x-2 bg-white text-black rounded absolute bottom-2 right-2 text-[14px] p-1 pl-2 pr-2"
          onClick={handleOpen}
        >
          {isProfile && <div className="text-black">See details</div>}
          {!isProfile && <div className="text-black">Listen to full story</div>}
          <ArrowIcon width={22} height={8} color={"black"} />
        </button>
      </div>
      <CustomDialog
        onClose={handleClose}
        aria-labelledby="points-prize"
        open={open}
      >
        <Box
          sx={{
            bgcolor: cardColor,
            p: 4,
            alignItems: "center",
            color: "white",
          }}
        >
          <div className="flex flex-col space-y-4">
            <div className="flex text-xs h-6 bg-white self-end rounded items-center pl-2 pr-2">
              <p className="text-black">{category}</p>
            </div>
            <div className="text-xl w-60">{story}</div>
          </div>
        </Box>
        <Box
          sx={{
            bgcolor: "background.paper",
            p: 2,
            alignItems: "center",
          }}
        >
          <div className="flex space-x-2">
            {activation && (
              <div className="p-1 border bg-[#A1E4D8] border-[#008767] text-[#008767] text-xs rounded-xl w-[120px] text-center">
                Active Story
              </div>
            )}
            {!activation && (
              <div className="p-1 border bg-[#FFB0B0] border-[#E41A1A] text-[#E41A1A] text-xs rounded-xl w-[120px] text-center">
                Inactive Story
              </div>
            )}
            <div className="p-1 border bg-[#BADFFF] border-[#0D90FF] text-[#0D90FF] text-xs rounded-xl w-[100px] text-center">
              {storyType}
            </div>
          </div>
          <div className="flex flex-col pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Image
                  src={avatars[avatar ?? 0]}
                  width={30}
                  height={30}
                  alt="avatar"
                />
                <div className="text-xs">{username}</div>
              </div>
              <div className="text-xs">{timeAgo}</div>
            </div>
            {storyType == "Scheduled" && (
              <div>
                <hr />
                <div className="text-xs">Category: {category}</div>
                <hr />
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <div
              className="flex items-center w-[100px] p-2 border bg-[#FFB0B0] border-[#E41A1A] text-[#E41A1A] rounded-xl text-center mt-10 cursor-pointer"
              onClick={() => handleDelete(id)}
            >
              <DeleteIcon />
              <div>Delete</div>
            </div>
          </div>
        </Box>
      </CustomDialog>
    </div>
  );
};

export default StoryCard;
