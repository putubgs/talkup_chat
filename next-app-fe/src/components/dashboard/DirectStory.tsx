import React, { FC } from "react";
import ArrowIcon from "@/components/icons/ArrowIcon";
import StoryCard from "@/components/card/StoryCard";
import Link from "next/link";

const DirectStory: React.FC<{
  searchQuery: string;
  cards: any[] | undefined;
  users: any[] | null;
}> = ({ searchQuery, cards, users }) => {
  const filteredCards = cards
    ?.filter((card) => card.storyType === "Direct")
    .filter((card) =>
      card.story.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (filteredCards?.length === 0) {
    return null;
  }

  const getUserData = (userId: string) => {
    return users?.find((user) => user._id === userId);
  };

  return (
    <div className="flex flex-col relative min-w-0 pt-12">
      <div className="flex items-center pb-6 justify-between">
        <div>
          <p className="text-2xl font-bold">Unscheduled Story (Direct)</p>
        </div>
        <Link
          href="/direct_story"
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

export default DirectStory;
