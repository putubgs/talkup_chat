import React from "react";
import Image from "next/image";
import { avatars } from "@/dummy/avatars";

const AvatarChanger: React.FC<{
  onSelect: (num: number) => void;
  pendingAvatar: number | undefined;
}> = ({ onSelect, pendingAvatar }) => {

  const clickedAvatar = (num: number) => {
    onSelect(num);
  };

  return (
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
  );
};

export default AvatarChanger;
