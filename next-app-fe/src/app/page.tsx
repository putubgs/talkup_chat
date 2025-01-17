"use client";
import React, { useState, useEffect, useRef } from "react";
import FilterIcon from "@/components/icons/FilterIcon";
import { useRouter } from 'next/navigation';
import SearchIcon from "@/components/icons/SearchIcon";
import ArrowIcon from "@/components/icons/ArrowIcon";
import CircleIcon from "@/components/icons/CircleIcon";
import StoryCard from "@/components/card/StoryCard";
import CategorySection from "@/components/dashboard/CategorySection";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import DirectStory from "@/components/dashboard/DirectStory";
import { Toast } from "@/components/Toast";
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

const Home: React.FC = () => {
  let { data: session } = useSession() as { data: CustomUser | null };
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cardData, setCardData] = useState<any[] | null>(null);
  const [userData, setUserData] = useState<any[] | null>(null);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [errorStatus, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const currentRef = cardRef.current;

    const handleScroll = () => {
      if (currentRef) {
        const index = Math.round(currentRef.scrollLeft / 190);
        setActiveIndex(index);
      }
    };

    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      return () => {
        currentRef.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const fetchCard = async () => {
    try {
      const res = await fetch("/api/getData/getProfileStory");
      const data = await res.json();
      setCardData(data.stories);
    } catch (error) {
      console.error("Failed to fetch stories", error);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/getData/getUserProfile");
      const data = await res.json();
      setUserData(data.users);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const getUserData = (userId: string) => {
    return userData?.find((user) => user._id === userId);
  };

  const activeCardData = cardData?.filter((card) => card.activation === true);

  useEffect(() => {
    fetchCard();
    fetchUser();
  }, []);

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
          <div className="flex items-center pb-6">
            <p className="text-2xl font-bold">Newest</p>
          </div>

          <div
            ref={cardRef as React.RefObject<HTMLDivElement>}
            className="flex space-x-12 hide-scrollbar min-w-0"
          >
            {activeCardData
              ?.sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .slice(0, 6)
              .map((card, index) => {
                const user = getUserData(card.userId);

                return (
                  <div
                    key={index}
                    className={
                      index === activeIndex ? "active-card" : "inactive-card"
                    }
                  >
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
                      createdAt={card.createdAt}
                      refetch={fetchCard}
                      listenerId={card.listenerId || null}
                      setToastMessage={setToastMessage}
                      setToastVisible={setToastVisible}
                      setError={setError}
                    />
                  </div>
                );
              })}
          </div>

          <div className="flex justify-center space-x-3 pt-12">
            {activeCardData?.slice(0, 6).map((card, index) => (
              <div key={index}>
                <CircleIcon
                  size={10}
                  color={index === activeIndex ? "black" : "gray"}
                />
              </div>
            ))}
          </div>
        </div>
        <DirectStory
          searchQuery={searchQuery}
          cards={activeCardData}
          users={userData}
        />
        <CategorySection
          category="Social Connection"
          searchQuery={searchQuery}
          cards={activeCardData}
          users={userData}
        />
        <CategorySection
          category="Personal Growth"
          searchQuery={searchQuery}
          cards={activeCardData}
          users={userData}
        />
        <CategorySection
          category="Family"
          searchQuery={searchQuery}
          cards={activeCardData}
          users={userData}
        />
        <CategorySection
          category="Health"
          searchQuery={searchQuery}
          cards={activeCardData}
          users={userData}
        />
        <CategorySection
          category="Spirituality"
          searchQuery={searchQuery}
          cards={activeCardData}
          users={userData}
        />
        <CategorySection
          category="Finance"
          searchQuery={searchQuery}
          cards={activeCardData}
          users={userData}
        />
      </div>
    </section>
  );
};

export default Home;
