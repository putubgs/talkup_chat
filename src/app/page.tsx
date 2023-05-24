"use client";
import React, { useState, useEffect, useRef } from "react";
// import Navigation from "@/components/navigation";
import FilterIcon from "@/components/icons/FilterIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import ArrowIcon from "@/components/icons/ArrowIcon";
import CircleIcon from "@/components/icons/CircleIcon";
import StoryCard from "@/components/StoryCard";
import CategorySection from "@/components/CategorySection";
import { cardData } from "@/dummy/stories";

const Home: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

      // return a cleanup function to remove the event listener
      return () => {
        currentRef.removeEventListener("scroll", handleScroll);
      };
    }
  }, []); // empty dependency array because useEffect runs only once after initial render

  const handleClickIndicator = (index: number) => {
    setActiveIndex(index);
  };

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
            <div>
              <FilterIcon size={35} color="black" />
            </div>
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
            className="flex space-x-12 hide-scrollbar scrollbar-hide overflow-x-scroll min-w-0"
          >
            {cardData.slice(0, 6).map((card, index) => (
              <div
                className={
                  index === activeIndex ? "active-card" : "inactive-card"
                }
                key={card.id}
              >
                <StoryCard
                  id={card.id}
                  story={card.story}
                  category={card.category}
                  searchQuery={""}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-3 pt-12">
            {cardData.slice(0, 6).map((card, index) => (
              <div key={card.id} onClick={() => handleClickIndicator(index)}>
                <CircleIcon
                  size={10}
                  color={index === activeIndex ? "black" : "gray"}
                />
              </div>
            ))}
          </div>
        </div>
        <CategorySection
          category="Social Connection"
          searchQuery={searchQuery}
        />
        <CategorySection category="Personal Growth" searchQuery={searchQuery} />
        <CategorySection category="Family" searchQuery={searchQuery} />
        <CategorySection category="Health" searchQuery={searchQuery} />
        <CategorySection category="Spirituality" searchQuery={searchQuery} />
        <CategorySection category="Finance" searchQuery={searchQuery} />
      </div>
    </section>
  );
};

export default Home;
