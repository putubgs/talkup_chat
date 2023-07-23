import React, { useEffect, useState } from "react";
import Delete from "@mui/icons-material/Delete";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";

type Schedule = {
  date: string;
  time: string;
};

const NotificationChanger: React.FC<{
  onSelectedDecision: (id: string, approval: string) => void;
  deleteNotification: (id: string) => void;
  username: string;
  createdAt: Date;
  schedule: Schedule | null;
  id: string;
  approve: string;
  ownId: string | undefined;
  requesterId: string | undefined;
}> = ({
  onSelectedDecision,
  deleteNotification,
  username,
  createdAt,
  schedule,
  id,
  approve,
  ownId,
  requesterId
}) => {
  const [newApprove, setApprove] = useState("");
  const date = new Date(createdAt);
  const timeAgo = formatDistanceToNow(new Date(date), {
    includeSeconds: true,
  });

  useEffect(() => {
    setApprove(approve);
  }, []);

  const uploadChat = async () => {
    const chatData = {
      members: [
        { userId: ownId, activation: true },
        { userId: requesterId, activation: true },
      ],
      schedule: schedule,
      lastMessage: null,
    };
    try {
      await axios.post(
        "http://localhost:3000/api/dataUpload/addChat",
        chatData
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data.error);
      }
    }
  };

  let notificationText = "";
  let notificationApprove = "";
  let notificationReject = "";
  console.log(schedule);

  if (schedule != null) {
    notificationText = `${username} is requesting to be a listener in your current story at ${schedule.date}, ${schedule.time}!`;
    notificationApprove = `You were accepting the request from ${username} to be your listener at ${schedule.date}, ${schedule.time}. See you in the chatroom!`;
    notificationReject = `You were rejecting the request from ${username} to be your listener at ${schedule.date}, ${schedule.time}.`;
  } else {
    notificationText = `${username} is requesting to be a listener in your current story!`;
    notificationApprove = `You were accepting the request from ${username} to be your listener. See you in the chatroom!`;
    notificationReject = `You were rejecting the request from ${username} to be your listener.`;
  }

  return (
    <>
      <div className="flex flex-col space-y-2">
        {newApprove == "" && <div>{notificationText}</div>}
        {newApprove == "approve" && <div>{notificationApprove}</div>}

        {newApprove == "reject" && <div>{notificationReject}</div>}
        <div className="text-xs">{timeAgo} ago</div>
      </div>

      {newApprove == "" ? (
        <div className="flex items-center justify-center space-x-3">
          <div
            className="bg-red-500 h-fit py-2 px-3 rounded-xl text-white cursor-pointer"
            onClick={() => {
              const approval = "reject";
              onSelectedDecision(id, approval);
              setApprove(approval);
              uploadChat();
            }}
          >
            Reject
          </div>
          <div
            className="bg-[#0D90FF] h-fit py-2 px-3 rounded-xl text-white cursor-pointer"
            onClick={() => {
              const approval = "approve";
              onSelectedDecision(id, approval);
              setApprove(approval);
              uploadChat();
            }}
          >
            Approve
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div
            className="bg-red-500 h-fit p-2 rounded-xl text-white cursor-pointer"
            onClick={() => {
              deleteNotification(id);
            }}
          >
            <Delete />
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationChanger;
