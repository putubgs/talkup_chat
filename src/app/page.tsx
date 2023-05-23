import React from "react";
import Navigation from "@/components/navigation";
import FilterIcon from "@/components/icons/FilterIcon";
import SearchIcon from "@/components/icons/SearchIcon";
import ArrowIcon from "@/components/icons/ArrowIcon";
import CircleIcon from "@/components/icons/CircleIcon";
import StoryCard from "@/components/StoryCard";
import { cardData } from "@/dummy/stories";

const Home: React.FC = () => {
  return (
    <Navigation>
      <section className="flex flex-col min-w-0">
        <div className="flex h-[120px] bg-[#FFFFFF] p-7 justify-between min-w-0">
          <div className="flex flex-col">
            <div className="text-[#0D90FF] ">
              <p className="font-bold text-3xl">Discover Inspiring Stories</p>
            </div>
            <div className="text-[#151515] pt-3">
              <p>
                Explore Our Community&apos;s Most Powerful Personal Journeys
              </p>
            </div>
          </div>
          <div className="relative flex items-center h-[40px] self-end">
            <input
              className="bg-[#F4F4F4] rounded-md w-[600px] pl-5 pr-8 text-xs h-full"
              placeholder="Search"
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

            <div className="flex space-x-12 hide-scrollbar scrollbar-hide overflow-y-hidden overflow-x-scroll min-w-0">
              {cardData.map((card) => (
                <StoryCard
                  key={card.id}
                  id={card.id}
                  story={card.story}
                  category={card.category}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col relative min-w-0 pt-12">
            <div className="flex items-center pb-6">
              <p className="text-2xl font-bold">Social Connection</p>
            </div>

            <div className="flex space-x-12 hide-scrollbar scrollbar-hide overflow-y-hidden overflow-x-scroll min-w-0">
              {cardData
                .filter((card) => card.category === "Social Connection")
                .map((card) => (
                  <StoryCard
                    key={card.id}
                    id={card.id}
                    story={card.story}
                    category={card.category}
                  />
                ))}
            </div>
          </div>

          <div className="flex flex-col relative min-w-0 pt-12">
            <div className="flex items-center pb-6">
              <p className="text-2xl font-bold">Personal Growth</p>
            </div>

            <div className="flex space-x-12 hide-scrollbar scrollbar-hide overflow-y-hidden overflow-x-scroll min-w-0">
              {cardData
                .filter((card) => card.category === "Personal Growth")
                .map((card) => (
                  <StoryCard
                    key={card.id}
                    id={card.id}
                    story={card.story}
                    category={card.category}
                  />
                ))}
            </div>
          </div>

          <div className="flex flex-col relative min-w-0 pt-12">
            <div className="flex items-center pb-6">
              <p className="text-2xl font-bold">Family</p>
            </div>

            <div className="flex space-x-12 hide-scrollbar scrollbar-hide overflow-y-hidden overflow-x-scroll min-w-0">
              {cardData
                .filter((card) => card.category === "Family")
                .map((card) => (
                  <StoryCard
                    key={card.id}
                    id={card.id}
                    story={card.story}
                    category={card.category}
                  />
                ))}
            </div>
          </div>

          <div className="flex flex-col relative min-w-0 pt-12">
            <div className="flex items-center pb-6">
              <p className="text-2xl font-bold">Health</p>
            </div>

            <div className="flex space-x-12 hide-scrollbar scrollbar-hide overflow-y-hidden overflow-x-scroll min-w-0">
              {cardData
                .filter((card) => card.category === "Health")
                .map((card) => (
                  <StoryCard
                    key={card.id}
                    id={card.id}
                    story={card.story}
                    category={card.category}
                  />
                ))}
            </div>
          </div>

          <div className="flex flex-col relative min-w-0 pt-12">
            <div className="flex items-center pb-6">
              <p className="text-2xl font-bold">Spirituality</p>
            </div>

            <div className="flex space-x-12 hide-scrollbar scrollbar-hide overflow-y-hidden overflow-x-scroll min-w-0">
              {cardData
                .filter((card) => card.category === "Spirituality")
                .map((card) => (
                  <StoryCard
                    key={card.id}
                    id={card.id}
                    story={card.story}
                    category={card.category}
                  />
                ))}
            </div>
          </div>

          <div className="flex flex-col relative min-w-0 pt-12">
            <div className="flex items-center pb-6">
              <p className="text-2xl font-bold">Finance</p>
            </div>

            <div className="flex space-x-12 hide-scrollbar scrollbar-hide overflow-y-hidden overflow-x-scroll min-w-0">
              {cardData
                .filter((card) => card.category === "Finance")
                .map((card) => (
                  <StoryCard
                    key={card.id}
                    id={card.id}
                    story={card.story}
                    category={card.category}
                  />
                ))}
            </div>
          </div>
        </div>
      </section>
    </Navigation>
  );
};

export default Home;
