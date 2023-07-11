import React, { useState, useEffect } from "react";
import Image from "next/image";
import { avatars } from "@/dummy/avatars";
import axios from "axios";

interface Session {
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

const AvatarChanger: React.FC<{
  session: Session | null;
  update: (data: object) => Promise<void>;
  onClose: () => void;
  setAvatar: (avatar: number) => void;
}> = ({ session, update, onClose, setAvatar }) => {
  const [pendingAvatar, setPendingAvatar] = useState<number | undefined>();

  useEffect(() => {
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
        setAvatar(updatedUser.avatar);

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
    onClose();
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex space-x-6">
        {avatars.map((avatar, index) => (
          <div
            key={index}
            className={`${
              pendingAvatar === index ? "bg-[#0D90FF]" : "bg-white"
            } p-4 rounded-xl border-2 border-500-gray cursor-pointer`}
            onClick={() => clickedAvatar(index)}
          >
            <Image src={avatar} alt="avatar" width={150} height={150} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center">
        <button
          className="p-2 bg-[#3817E2] pl-12 pr-12 text-white rounded-xl border-2 border-[#0D90FF]"
          onClick={agreeAvatarChange}
        >
          Agree!
        </button>
      </div>
    </div>
  );
};

export default AvatarChanger;
