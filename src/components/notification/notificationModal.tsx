import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogTitle, Box } from "@mui/material";
import { styled } from "@mui/system";
import { avatars } from "@/dummy/avatars";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import NotificationChanger from "./notificationChanger";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

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

const Notification: React.FC<{
  handleClose: () => void;
  open: boolean;
}> = ({ open, handleClose }) => {
  let { data: session } = useSession() as { data: CustomUser | null; update: any };
  const onSelectedDecision = (approval: string) => {
    console.log(approval);
  };
  const [cardData, setCardData] = useState<any[] | null>(null);
  const [notifData, setNotifData] = useState<any[] | null>(null);
  const [requestAvailability, setRequestAvailability] = useState<boolean | undefined>(false)

  const fetchNotification = async () => {
    try {
      const res = await fetch("/api/getData/getUpdateDeleteNotif");
      const data = await res.json();
      setNotifData(data.data)
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    console.log(cardData);
    
    const activeCardData = cardData?.filter((card) => card.activation === true);
    console.log(activeCardData)
    
    const matchingCards = activeCardData?.filter(card => card.userId == session?.user?.id);
    console.log(matchingCards)
    const hasMatchingCard = activeCardData?.some(card => card.userId == session?.user?.id);
    console.log(hasMatchingCard)
    const requestCheck = matchingCards?.some(card => 
      notifData?.some(notif => notif.cardId == card._id)
    );
    console.log(requestCheck);
    setRequestAvailability(requestCheck)
  }, [cardData]);

  const fetchStory = async () => {
    try {
      const res = await fetch("/api/getData/getAndDeleteStory");
      const data = await res.json();
      setCardData(data.data)
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotification()
    fetchStory()
  }, [])

  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      width: "100%",
      maxWidth: 700,
      padding: "20px",
    },
  }));
  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="notification"
    >
      <DialogTitle id="avatar-changer">
        <div className="text-xl font-bold">Your Notification</div>
        <hr />
      </DialogTitle>
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 2,
        }}
      >
        {
          requestAvailability ? (

        <div className="flex bg-[#EEEEEE] w-full rounded-xl p-4 px-5 space-x-4">
          <Image
            src={avatars[0]}
            width={50}
            height={50}
            alt="avatar"
            className="h-fit"
          />
          <NotificationChanger onSelectedDecision={onSelectedDecision} />
        </div>
          ) : (
            <div className="w-full p-5 text-center">
              You dont have any notification yet!
            </div>
          )
        }
      </Box>
    </CustomDialog>
  );
};

export default Notification;
