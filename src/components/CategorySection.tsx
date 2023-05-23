import React, { FC } from "react"
import { cardData } from "@/dummy/stories";
import ArrowIcon from "@/components/icons/ArrowIcon";
import StoryCard from "@/components/StoryCard";

const CategorySection: React.FC<{ category: string, searchQuery: string }> = ({ category, searchQuery }) => {
    const filteredCards = cardData
      .filter(card => card.category === category)
      .filter(
        card =>
          card.story.toLowerCase().includes(searchQuery.toLowerCase()) ||
          card.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
    if (filteredCards.length === 0) {
      return null;
    }
  
    return (
      <div className="flex flex-col relative min-w-0 pt-12">
        <div className="flex items-center pb-6 justify-between">
          <div>
            <p className="text-2xl font-bold">{category}</p>
          </div>
          <div className="flex items-center space-x-2 bg-[#0D90FF] p-2 pl-3 pr-3 rounded-lg">
            <button className="text-white text-[14px]">See More</button>
            <ArrowIcon width={22} height={8} color={"white"} />
          </div>
        </div>
  
        <div className="flex space-x-12 hide-scrollbar scrollbar-hide overflow-y-hidden overflow-x-scroll min-w-0">
          {filteredCards.map((card) => (
            <StoryCard
              key={card.id}
              id={card.id}
              story={card.story}
              category={card.category}
            />
          ))}
        </div>
      </div>
    );
  };

  export default CategorySection
  