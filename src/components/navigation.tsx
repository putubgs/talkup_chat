"use client";
import React, { FC } from "react";
import "../app/globals.css";
import Image from "next/image";
import HomeIcon from "@/components/icons/HomeIcon";
import MsgIcon from "@/components/icons/MsgIcon";
import ProfileIcon from "@/components/icons/ProfileIcon";
import AddingIcon from "@/components/icons/AddingIcon";
import AlertIcon from "@/components/icons/AlertIcon";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const Navigation: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const isProfilePage = usePathname() === "/profile";
  const isAddingStoryPage = usePathname() === "/adding_story";
  return (
    <section className="flex min-w-0">
      <div className="bg-[#F6FAFF] w-[350px] h-screen flex flex-col sticky top-0 flex-shrink-0">
        <div className="flex p-8 pt-[70px] items-center">
          <Image src="/logo.webp" alt="logo" width={40} height={40} />
          <h5 className="font-extrabold text-[25px] ml-2">TalkUp.</h5>
        </div>
        <div className="flex flex-col p-8 space-y-4 flex-grow">
          <div
            className={`flex w-full p-3 rounded-xl items-center cursor-pointer ${
              isProfilePage || isAddingStoryPage
                ? "text-[#85878A]"
                : "bg-[#DFEFFF] text-[#0D90FF]"
            }`}
            onClick={() => router.push("/")}
          >
            <HomeIcon
              size={12}
              color={isProfilePage || isAddingStoryPage ? "#85878A" : "#0D90FF"} // Check if user is on /profile or /adding_story
            />
            <p className="text-[20px] ml-3">Dashboard</p>
          </div>
          <div className="flex w-full p-3 rounded-xl text-[#85878A] items-center cursor-pointer">
            <MsgIcon size={12} color={"#85878A"} />
            <p className="text-[20px] ml-3">Message</p>
          </div>
          <div
            className={`flex w-full p-3 rounded-xl items-center cursor-pointer ${
              isProfilePage ? "bg-[#DFEFFF] text-[#0D90FF]" : "text-[#85878A]"
            }`}
            onClick={() => router.push("/profile")} // Add click event to navigate to /profile
          >
            <ProfileIcon
              size={12}
              color={isProfilePage ? "#0D90FF" : "#85878A"}
            />
            <p className="text-[20px] ml-3">Profile</p>
          </div>
          {/* <div className="flex w-full p-3 rounded-xl text-[#85878A] items-center cursor-pointer">
              <SettingsIcon size={12} color={"#85878A"} />
              <p className="text-[20px] ml-3">Setting</p>
            </div> */}
          <div
            className={`flex w-full p-3 rounded-xl items-center cursor-pointer ${
              isAddingStoryPage
                ? "bg-[#DFEFFF] text-[#0D90FF]"
                : "text-[#85878A]"
            }`} // use isAddingStoryPage to determine the colors
            onClick={() => router.push("/adding_story")} // navigate to /adding_story when clicked
          >
            <AddingIcon
              size={12}
              color={isAddingStoryPage ? "#0D90FF" : "#85878A"} // use isAddingStoryPage to determine the color
            />
            <p className="text-[20px] ml-3">Add Story</p>
          </div>
        </div>
        <div className="p-8 cursor-pointer">
          <div className="flex bg-[#DFEFFF] w-full p-3 rounded-xl text-[#0D90FF] items-center">
            <AlertIcon size={12} color={"#0D90FF"} />
            <p className="text-[20px] ml-3">Term and Services</p>
          </div>
        </div>
      </div>
      <div className=" overflow-auto flex-grow min-w-0">{children}</div>
    </section>
  );
};

export default Navigation;
