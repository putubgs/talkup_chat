import React, { FC } from "react";
import ArrowIcon from "@/components/icons/ArrowIcon";
import StoryCard from "@/components/card/StoryCard";
import Link from "next/link";

const CategorySection: React.FC<{
  category: string;
  searchQuery: string;
  cards: any[] | undefined;
  users: any[] | null;
}> = ({ category, searchQuery, cards, users }) => {
  const filteredCards = cards
    ?.filter((card) => card.category === category)
    .filter((card) =>
      card.story.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (filteredCards?.length === 0) {
    return null;
  }

  let link = "";

  switch (category) {
    case "Social Connection":
      link = "/social_connection";
      break;
    case "Personal Growth":
      link = "/personal_growth";
      break;
    case "Family":
      link = "/family";
      break;
    case "Spirituality":
      link = "/spirituality";
      break;
    case "Health":
      link = "/health";
      break;
    case "Finance":
      link = "/finance";
      break;
  }

  const getUserData = (userId: string) => {
    return users?.find((user) => user._id === userId);
  };

  return (
    <div className="flex flex-col relative min-w-0 pt-12">
      <div className="flex items-center pb-6 justify-between">
        <div>
          <p className="text-2xl font-bold">{category}</p>
        </div>
        <Link
          href={link}
          className="flex items-center space-x-2 bg-[#0D90FF] p-2 pl-3 pr-3 rounded-lg"
        >
          <button className="text-white text-[14px]">See More</button>
          <ArrowIcon width={22} height={8} color={"white"} />
        </Link>
      </div>

      <div className="flex space-x-12 hide-scrollbar min-w-0">
        {filteredCards
          ?.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .map((card, index) => {
            const user = getUserData(card.userId);

            return (
              <div key={index}>
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
  );
};

export default CategorySection;
