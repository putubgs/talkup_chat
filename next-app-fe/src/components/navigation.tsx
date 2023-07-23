"use client";
import React, { useEffect, useState } from "react";
import "../app/globals.css";
import Image from "next/image";
import HomeIcon from "@/components/icons/HomeIcon";
import MsgIcon from "@/components/icons/MsgIcon";
import ProfileIcon from "@/components/icons/ProfileIcon";
import AddingIcon from "@/components/icons/AddingIcon";
import SettingsIcon from "./icons/SettingsIcon";
import LoginIcon from "./icons/LoginIcon";
import LogoutIcon from "./icons/LogoutIcon";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Session } from "next-auth";
import { ChatDataContext } from "@/context/chatDataContext";

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

const Navigation: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  let { data: session } = useSession({
    required: true,
  }) as { data: CustomUser | null };
  const pathname = usePathname();
  const isProfilePage = pathname ? pathname.startsWith("/profile") : false;
  const isAddingStoryPage = pathname === "/adding_story";
  const isMessage = pathname === "/message";
  const [chatData, setChatData] = useState<any[] | null>(null);
  const [userAvailability, setUserAvailability] = useState<boolean>(
    false
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/getData/getAndUpdateChat");
        const data = await res.json();
        let isUserInMembers = data.data.some(
          (chat: any) =>
            chat.members &&
            chat.members.some(
              (member: any) =>
                member.id === session?.user.id
            )
        );
        
        let isUserActivated = false;
        if (isUserInMembers) {
          const userChat = data.data.find(
            (chat: any) =>
              chat.members &&
              chat.members.some(
                (member: any) =>
                  member.id === session?.user.id
              )
          );
          
          const userMember = userChat?.members?.find(
            (member: any) =>
              member.id === session?.user.id
          );
          
          isUserActivated = userMember?.activation;
        }
        
        console.log(isUserActivated);    
        setChatData(data.data);
        console.log(data.data)
        console.log(isUserInMembers)
        setUserAvailability(isUserActivated);
      } catch (error) {
        console.error("Failed to fetch stories", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ChatDataContext.Provider value={{ chatData, userAvailability }}>
      <section className="flex min-w-0">
        <div className="bg-[#F6FAFF] w-[350px] h-screen flex flex-col sticky top-0 flex-shrink-0">
          <div className="flex p-8 pt-[70px] items-center">
            <Image src="/logo.webp" alt="logo" width={40} height={40} />
            <h5 className="font-extrabold text-[25px] ml-2">TalkUp.</h5>
          </div>
          <div className="flex flex-col p-8 space-y-4 flex-grow">
            {session && (
              <>
                <div
                  className={`flex w-full p-3 rounded-xl items-center cursor-pointer ${
                    isProfilePage || isAddingStoryPage || isMessage
                      ? "text-[#85878A]"
                      : "bg-[#DFEFFF] text-[#0D90FF]"
                  }`}
                  onClick={() => router.push("/")}
                >
                  <HomeIcon
                    size={12}
                    color={
                      isProfilePage || isAddingStoryPage || isMessage
                        ? "#85878A"
                        : "#0D90FF"
                    }
                  />
                  <p className="text-[20px] ml-3">Dashboard</p>
                </div>
                <div
                  className={`flex w-full p-3 rounded-xl items-center cursor-pointer ${
                    isMessage ? "bg-[#DFEFFF] text-[#0D90FF]" : "text-[#85878A]"
                  }`}
                  onClick={() => router.push("/message")}
                >
                  <MsgIcon
                    size={12}
                    color={isMessage ? "#0D90FF" : "#85878A"}
                  />
                  <p className="text-[20px] ml-3">Message</p>
                </div>
                <div
                  className={`flex w-full p-3 rounded-xl items-center cursor-pointer ${
                    isProfilePage
                      ? "bg-[#DFEFFF] text-[#0D90FF]"
                      : "text-[#85878A]"
                  }`}
                  onClick={() => router.push("/profile")}
                >
                  <ProfileIcon
                    size={12}
                    color={isProfilePage ? "#0D90FF" : "#85878A"}
                  />
                  <p className="text-[20px] ml-3">Profile</p>
                </div>
                <div className="flex w-full p-3 rounded-xl text-[#85878A] items-center cursor-pointer">
                  <SettingsIcon size={12} color={"#85878A"} />
                  <p className="text-[20px] ml-3">Settings</p>
                </div>
                <div
                  className={`flex w-full p-3 rounded-xl items-center cursor-pointer ${
                    isAddingStoryPage
                      ? "bg-[#DFEFFF] text-[#0D90FF]"
                      : "text-[#85878A]"
                  }`}
                  onClick={() => router.push("/adding_story")}
                >
                  <AddingIcon
                    size={12}
                    color={isAddingStoryPage ? "#0D90FF" : "#85878A"}
                  />
                  <p className="text-[20px] ml-3">Add Story</p>
                </div>
              </>
            )}
            {!session && (
              <>
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
                    color={
                      isProfilePage || isAddingStoryPage ? "#85878A" : "#0D90FF"
                    }
                  />
                  <p className="text-[20px] ml-3">Dashboard</p>
                </div>
              </>
            )}
          </div>
          {!session && (
            <div className="p-8 cursor-pointer">
              <div
                className="flex bg-[#DFEFFF] w-full p-3 rounded-xl text-[#0D90FF] items-center"
                onClick={() => router.push("/login")}
              >
                <LoginIcon size={12} color={"#0D90FF"} />
                <p className="text-[20px] ml-3">Login</p>
              </div>
            </div>
          )}
          {session && (
            <div className="p-8 cursor-pointer">
              <div
                className="flex bg-[#DFEFFF] w-full p-3 rounded-xl text-[#0D90FF] items-center"
                onClick={() =>
                  signOut({ callbackUrl: `${window.location.origin}/` })
                }
              >
                <LogoutIcon size={12} color={"#0D90FF"} />
                <p className="text-[20px] ml-3">Logout</p>
              </div>
            </div>
          )}
        </div>
        <div className=" overflow-auto flex-grow min-w-0">{children}</div>
      </section>
    </ChatDataContext.Provider>
  );
};

export default Navigation;