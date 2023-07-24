"use client";
import React, { useEffect, useState } from "react";
import { FeedbackData } from "@/dummy/feedback";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import Link from "next/link";

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

const ProfilePage: React.FC = () => {
  let { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login?callbackUrl=/profile");
    },
  }) as { data: CustomUser | null; update: any };
  const [cardCount, setCardCount] = useState(0);
  const [feedback, setFeedback] = useState<any[] | null>(null);

  useEffect(() => {
    const fetchUserCards = async () => {
      try {
        const res = await fetch(
          `/api/getData/getTotalStory?userId=${session?.user?.id}`
        );
        const data = await res.json();
        setCardCount(data.cardCount);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchFeedback = async () => {
      try {
        const res = await fetch("/api/getData/getFeedback");
        const data = await res.json();
        console.log(data.feedbacks)
        const userId = session?.user.id;
        const filteredFeedbacks = data.feedbacks.filter((feedback:any) => feedback.userId === userId);
        console.log(filteredFeedbacks);
        setFeedback(filteredFeedbacks);
        // setFeedback(data.feedbacks)
      } catch (error) {
        console.error("Failed to fetch feedbacks", error);
      }
    };

    if (session?.user?.id) {
      fetchUserCards();
      fetchFeedback();
    }
  }, [session]);
  return (
    <div className="flex flex-col p-7 min-w-0">
      <div className="flex flex-col relative justify-center items-center min-w-0">
        <div className="flex flex-col bg-[#F6FAFF] h-[270px] rounded-xl w-[950px] yourShadowClass">
          <div className="flex flex-col p-7">
            <div className="flex text-xl font-bold pb-3">
              Your Listening and Story
            </div>
            <div className="flex justify-between">
              <div className="flex pt-2">
                <svg
                  width="399"
                  height="157"
                  viewBox="0 0 399 157"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_130_241)">
                    <rect
                      width="399.451"
                      height="157.322"
                      rx="20"
                      fill="#3817E2"
                    />
                    <circle
                      opacity="0.5"
                      cx="318.778"
                      cy="154.855"
                      r="68.0721"
                      fill="#0D90FF"
                    />
                    <circle
                      opacity="0.5"
                      cx="389.867"
                      cy="118.052"
                      r="47.3912"
                      fill="#0D90FF"
                    />
                    <text
                      x="20"
                      y="95"
                      fill="white"
                      fontSize="20"
                      fontFamily="Verdana"
                    >
                      Listening
                    </text>
                    <text
                      x="20"
                      y="130"
                      fill="white"
                      fontSize="20"
                      fontFamily="Verdana"
                    >
                      23 Story
                    </text>
                  </g>
                  <defs>
                    <clipPath id="clip0_130_241">
                      <rect width="399" height="157" rx="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <Link href="/profile/stories">
                <div className="flex pt-2">
                  <svg
                    width="399"
                    height="157"
                    viewBox="0 0 399 157"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_130_241)">
                      <rect
                        width="399.451"
                        height="157.322"
                        rx="20"
                        fill="#0D90FF"
                      />
                      <circle
                        opacity="0.5"
                        cx="318.778"
                        cy="154.855"
                        r="68.0721"
                        fill="#3817E2"
                      />
                      <circle
                        opacity="0.5"
                        cx="389.867"
                        cy="118.052"
                        r="47.3912"
                        fill="#3817E2"
                      />
                      <text
                        x="20"
                        y="95"
                        fill="white"
                        fontSize="20"
                        fontFamily="Verdana"
                      >
                        Your Story
                      </text>
                      <text
                        x="20"
                        y="130"
                        fill="white"
                        fontSize="20"
                        fontFamily="Verdana"
                      >
                        {cardCount} Story
                      </text>
                    </g>
                    <defs>
                      <clipPath id="clip0_130_241">
                        <rect width="399" height="157" rx="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col bg-[#F6FAFF] w-[950px] mt-10 rounded-xl yourShadowClass">
          <div className="flex flex-col p-7">
            <div className="flex text-xl font-bold pb-2">All Feedback</div>
            <table className="table-auto bg-transparent w-full">
              <thead className="text-left text-[#B5B7C0]">
                <tr>
                  <th className="border-b px-4 py-6">Name</th>
                  <th className="border-b px-4 py-6">Date</th>
                  <th className="border-b px-4 py-6">Feedback</th>
                  <th className="border-b px-4 py-6 pr-8 text-right">Rating</th>
                </tr>
              </thead>

              <tbody>
                {feedback && feedback.map((data, index) => (
                  <tr key={index}>
                    <td className="border-b px-4 py-6">{data.giverUsername}</td>
                    <td className="border-b px-4 py-6">{new Date(data.createdAt).toLocaleDateString()}</td>
                    <td className="border-b px-4 py-6 text-[13px]">
                      {data.content}
                    </td>
                    <td className="border-b px-4 py-6 text-right">
                      <div className="bg-[#A1E4D8] border border-[#008767] text-[#008767] px-7 inline-block rounded">
                        {data.rating}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
