import React, { useState } from "react";
import { Delete } from "@mui/icons-material";

const NotificationChanger: React.FC<{
  onSelectedDecision: (approval: string) => void;
}> = ({ onSelectedDecision }) => {
  const [approve, setApprove] = useState("");
  return (
    <>
      <div className="flex flex-col space-y-2">
        {approve == "" && (
          <div>
            Anonymous#12345 is requesting to be a listener in your current
            story!
          </div>
        )}
        {approve == "approve" && (
          <div>
            You were accepting the request from Anonymous#12345 to be your
            listener. See you in the chatroom!
          </div>
        )}

        {approve == "reject" && (
          <div>
            You were rejecting the request from Anonymous#12345 to be your
            listener.
          </div>
        )}
        <div className="text-xs">4:27 PM</div>
      </div>

      {approve == "" ? (
        <div className="flex items-center justify-center space-x-3">
          <div
            className="bg-red-500 h-fit py-2 px-3 rounded-xl text-white cursor-pointer"
            onClick={() => {
              const newState = "reject";
              setApprove(newState);
              onSelectedDecision(newState);
            }}
          >
            Reject
          </div>
          <div
            className="bg-[#0D90FF] h-fit py-2 px-3 rounded-xl text-white cursor-pointer"
            onClick={() => {
              const newState = "approve";
              setApprove(newState);
              onSelectedDecision(newState);
            }}
          >
            Approve
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <div className="bg-red-500 h-fit p-2 rounded-xl text-white cursor-pointer">
            <Delete />
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationChanger;
