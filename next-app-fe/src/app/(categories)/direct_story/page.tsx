"use client";
import React, { useState, useEffect } from "react";
import SearchIcon from "@/components/icons/SearchIcon";
import StoryCard from "@/components/card/StoryCard";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Notifications from "@mui/icons-material/Notifications";
import Notification from "@/components/notification/notificationModal";

interface CustomUser extends Session {
  user: {
    id?: string;
    name?: string | null;
    username?: string;
    points?: number;
    rating?: number;
    tier?: number;
    avatar?: number;
  };
}

const Direct: React.FC = () => {
  let { data: session } = useSession() as { data: CustomUser | null };
  const [searchQuery, setSearchQuery] = useState("");
  const [cardData, setCardData] = useState<any[] | null>(null);
  const [userData, setUserData] = useState<any[] | null>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/getData/getUserProfile");
      const data = await res.json();
      setUserData(data.users);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const fetchCard = async () => {
    try {
      const res = await fetch("/api/getData/getProfileStory");
      const data = await res.json();
      setCardData(data.stories);
    } catch (error) {
      console.error("Failed to fetch stories", error);
    }
  };

  useEffect(() => {
    fetchCard();
    fetchUser();
  }, []);

  const getUserData = (userId: string) => {
    return userData?.find((user) => user._id === userId);
  };

  const filteredCards = cardData?.filter(
    (card) =>
      card.storyType === "Direct" &&
      card.story.toLowerCase().includes(searchQuery.toLowerCase()) &&
      card.activation === true
  );

  const handleOpen = () => {
    if (!session) {
      router.push("/login");
      return;
    }
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <section className="flex flex-col min-w-0">
      <div className="flex h-[120px] bg-[#FFFFFF] p-7 justify-between min-w-0">
        <div className="flex flex-col">
          <div className="text-[#0D90FF] ">
            <p className="font-bold text-3xl">Discover Inspiring Stories</p>
          </div>
          <div className="text-[#151515] pt-3">
            <p>Explore Our Community&apos;s Most Powerful Personal Journeys</p>
          </div>
        </div>
        <div className="relative flex items-center h-[40px] self-end">
          <input
            className="bg-[#F4F4F4] rounded-md w-[600px] pl-5 pr-8 text-xs h-full"
            placeholder="Search"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="space-x-6">
            <div className="absolute right-20 top-1/2 transform -translate-y-1/2">
              <SearchIcon size={20} color="black" />
            </div>
            <div className="bg-[#F4F4F4] rounded-md p-2 cursor-pointer" onClick={handleOpen}>
              <Notifications fontSize="medium" style={{color: "black"}} />
            </div>
            <Notification open={open} handleClose={handleClose} users={userData}/>
          </div>
        </div>
      </div>
      <hr className="ml-3 mr-3 border border-[1px]" />
      <div className="flex flex-col p-7 pl-12 min-w-0">
        <div className="flex flex-col relative min-w-0">
          <div className="flex justify-between items-center">
            <Link
              href={"/"}
              className="flex items-center space-x-2 bg-[#0D90FF] p-2 pl-3 pr-3 rounded-lg"
            >
              <ArrowLeftIcon width={22} height={8} color={"white"} />
              <button className="text-white text-[14px]">Back</button>
            </Link>
            <div className="flex items-center pb-6">
              <p className="text-2xl font-bold pr-[80px]">Direct Story</p>
            </div>
          </div>

          <div className="flex flex-wrap min-w-0">
            {filteredCards
              ?.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((card, index) => {
                const user = getUserData(card.userId);

                return (
                  <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-4">
                    <StoryCard
                      id={card._id}
                      story={card.story}
                      category={card.category}
                      searchQuery={searchQuery}
                      storyType={card.storyType}
                      schedules={card.schedules}
                      userId={card.userId}
                      activation={card.activation}
                      username={user?.username}
                      avatar={user?.avatar}
                      listenerId={card.listenerId || null}
                      createdAt={card.createdAt}
                      refetch={() => new Promise<void>(() => {})}
                      setToastMessage={() => {}}
                      setToastVisible={() => {}}
                      setError={() => {}}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Direct;
