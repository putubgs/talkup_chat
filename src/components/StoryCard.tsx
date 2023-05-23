import React, { FC } from "react";
import ArrowIcon from "@/components/icons/ArrowIcon";

interface StoryCardProps {
  id: number;
  story: string;
  category: string;
}

const categoryColors = {
  "Social Connection": "#EA6E9A",
  "Personal Growth": "#1DCF5C",
  "Family": "#3817E2",
  "Health": "#5449AB",
  "Spirituality": "#C1EB5E",
  "Finance": "#0D90FF"
} as const; // Ensure these values are treated as constants

const StoryCard: FC<StoryCardProps> = ({ id, story, category }) => {
  const cardColor = categoryColors[category as keyof typeof categoryColors]; // Explicitly tell TypeScript that category is a key of categoryColors

  // Change text color to black only for "Spirituality" category
  const textColor = category === "Spirituality" ? "black" : "white";
  
  // Change circle icons color to #1C1C1C only for "Finance" category
  const circleColor = category === "Finance" ? "rgba(28,28,28,0.2)" : "rgba(59,130,246,0.2)";

  return (
    <div
      key={id}
      className="relative rounded-lg shadow-lg overflow-hidden w-80 h-60 p-4 flex-shrink-0"
      style={{ backgroundColor: cardColor }}
    >
      <div className="absolute bottom-0 right-0 flex justify-end items-end">
        <div 
          className="rounded-full w-24 h-24 -mr-[140px] mb-4"
          style={{ backgroundColor: circleColor }}
        ></div>
        <div 
          className="rounded-full w-24 h-24 -mr-1 -mb-8"
          style={{ backgroundColor: circleColor }}
        ></div>
      </div>
      <div className="flex flex-col">
        <div className="flex text-xs h-6 bg-white self-end rounded items-center pl-2 pr-2">
          <p className="text-black">{category}</p>
        </div>
        <div className="h-[157px] w-60 p-3">
          <p className="text-xl font-bold" style={{ color: textColor }}>{story}</p>
        </div>
        <button className="flex items-center space-x-2 bg-white text-black rounded hover:bg-pink-200 transition-colors duration-300 absolute bottom-2 right-2 text-[14px] p-1 pl-2 pr-2">
          <div className="text-black">Listen to full story</div>
          <ArrowIcon width={22} height={8} color={"black"} />
        </button>
      </div>
    </div>
  );
};

export default StoryCard;
