import React, { ReactNode } from "react";
import Image from "next/image";
import HomeIcon from "./icons/HomeIcon";
import MsgIcon from "./icons/MsgIcon";
import ProfileIcon from "./icons/ProfileIcon";
import SettingsIcon from "./icons/SettingsIcon";
import AddingIcon from "./icons/AddingIcon";
import AlertIcon from "./icons/AlertIcon";

interface NavigationProps {
  children: ReactNode;
}

const Navigation: React.FC<NavigationProps> = ({ children }) => {
  return (
    <section className="flex flex-row ">
      <div className="bg-[#F6FAFF] w-[350px] h-screen flex flex-col fixed overflow-auto z-10">
        <div className="flex p-8 pt-[70px]">
          <Image src="/logo.webp" alt="logo" width={40} height={40} />
          <h5 className="font-extrabold text-[25px] ml-2">TalkUp.</h5>
        </div>
        <div className="flex flex-col p-8 space-y-4 flex-grow">
          <div className="flex bg-[#DFEFFF] w-full p-3 rounded-xl text-[#0D90FF]">
            <HomeIcon size={12} color={"#0D90FF"} />
            <p className="text-[20px] ml-3">Dashboard</p>
          </div>
          <div className="flex w-full p-3 rounded-xl text-[#85878A]">
            <MsgIcon size={12} color={"#85878A"} />
            <p className="text-[20px] ml-3">Message</p>
          </div>
          <div className="flex w-full p-3 rounded-xl text-[#85878A]">
            <ProfileIcon size={12} color={"#85878A"} />
            <p className="text-[20px] ml-3">Profile</p>
          </div>
          <div className="flex w-full p-3 rounded-xl text-[#85878A]">
            <SettingsIcon size={12} color={"#85878A"} />
            <p className="text-[20px] ml-3">Setting</p>
          </div>
          <div className="flex w-full p-3 rounded-xl text-[#85878A]">
            <AddingIcon size={12} color={"#85878A"} />
            <p className="text-[20px] ml-3">Add Story</p>
          </div>
        </div>
        <div className="p-8">
          <div className="flex bg-[#DFEFFF] w-full p-3 rounded-xl text-[#0D90FF]">
            <AlertIcon size={12} color={"#0D90FF"} />
            <p className="text-[17px] ml-3">Term and Services</p>
          </div>
        </div>
      </div>
      <div className="pl-[350px] overflow-auto">
        {children}
      </div>
    </section>
  );
};

export default Navigation;
