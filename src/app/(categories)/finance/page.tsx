"use client";
import React, { useState } from "react";
import FilterIcon from "@/components/icons/FilterIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import StoryCard from "@/components/card/StoryCard";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import { cardData } from "@/dummy/stories";
import Link from "next/link";

const Finance: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCards = cardData.filter(
    (card) =>
      card.category === "Finance" &&
      card.story.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="flex justify-between items-center">
            <Link
              href={"/"}
              className="flex items-center space-x-2 bg-[#0D90FF] p-2 pl-3 pr-3 rounded-lg"
            >
              <ArrowLeftIcon width={22} height={8} color={"white"} />
              <button className="text-white text-[14px]">Back</button>
            </Link>
            <div className="flex items-center pb-6">
              <p className="text-2xl font-bold pr-[80px]">Finance</p>
            </div>
          </div>

          <div className="flex flex-wrap min-w-0">
            {filteredCards.map((card) => (
              <div key={card.id} className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <StoryCard
                  id={card.id}
                  story={card.story}
                  category={card.category}
                  searchQuery={searchQuery}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Finance;
