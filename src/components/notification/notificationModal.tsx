import React, { useState } from "react";
import Image from "next/image";
import { Dialog, DialogTitle, Box } from "@mui/material";
import { styled } from "@mui/system";
import { avatars } from "@/dummy/avatars";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import NotificationChanger from "./notificationChanger";

const Notification: React.FC<{
  handleClose: () => void;
  open: boolean;
}> = ({ open, handleClose }) => {

  const onSelectedDecision = (approval: string) => {
    console.log(approval);
  };

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
      </Box>
    </CustomDialog>
  );
};

export default Notification;
