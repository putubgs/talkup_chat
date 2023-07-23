import React from "react"
import { Dialog, DialogTitle, Box } from "@mui/material";
import { styled } from "@mui/system";
import NotificationList from "./notificationList";

const Notification: React.FC<{
  handleClose: () => void;
  open: boolean;
  users: any[] | null;
}> = ({ open, handleClose, users }) => {
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
        <NotificationList users={users} />
      </Box>
    </CustomDialog>
  );
};

export default Notification;
