"use client";
import React, { useState } from "react";
import { avatars } from "@/dummy/avatars";
import Image from "next/image";
import CircleIcon from "@/components/icons/CircleIcon";
import SendIcon from "@mui/icons-material/Send";
import StarIcon from "@mui/icons-material/Star";
import { forbiddenWords } from "@/dummy/forbiddenWords";

const Message: React.FC = () => {
  const [feedbackForm, setFeedbackForm] = useState(false);
  const [msgValue, setMsgValue] = useState("");
  const [feedbackValue, setFeedbackValue] = useState("");
  const [rating, setRating] = useState(0);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;

    let sanitizedValue = inputValue;
    forbiddenWords.forEach((word) => {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escapedWord}\\b`, "gi");
      sanitizedValue = sanitizedValue.replace(regex, "*".repeat(word.length));
    });

    setMsgValue(sanitizedValue);
  };

  const handleStarClick = (starIndex: number) => {
    setRating(starIndex);
    console.log(starIndex);
  };

  const handleInputChange2 = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const inputValue = event.target.value;

    let sanitizedValue = inputValue;
    forbiddenWords.forEach((word) => {
      const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\b${escapedWord}\\b`, "gi");
      sanitizedValue = sanitizedValue.replace(regex, "*".repeat(word.length));
    });

    setFeedbackValue(sanitizedValue);
  };

  const stars = Array(5)
    .fill(0)
    .map((_, index) => (
      <StarIcon
        key={index}
        onClick={() => handleStarClick(index + 1)}
        style={{
          cursor: "pointer",
          color: index < rating ? "gold" : "#D9D9D9",
        }}
        fontSize="large"
      />
    ));

  const handleFeedback = () => {
    if (feedbackForm) {
      setFeedbackForm(false);
    } else {
      setFeedbackForm(true);
    }
  };

  const sendFeeback = () => {
    let feedback = {
        comments: feedbackValue,
        rate: rating,
    }

    console.log(feedback)
  }

  return (
    <div className="flex py-2 h-screen">
      <section className="flex flex-col w-full p-4">
        <div className="flex flex-col h-full bg-[#F6FAFF] rounded-xl p-6 space-y-10">
          <div className="flex justify-between">
            <div className="flex items-center space-x-3">
              <Image src={avatars[0]} width={55} height={55} alt="avatar" />
              <div className="flex flex-col">
                <div className="text-lg">Anonymous#12345 (Listener)</div>
                <div className="flex space-x-1">
                  <CircleIcon size={8} color="green" />
                  <div className="text-xs">Connected</div>
                </div>
              </div>
            </div>
            <div
              className="flex h-fit bg-[#0D90FF] py-2 text-white px-4 rounded-xl cursor-pointer"
              onClick={handleFeedback}
            >
              End Chat
            </div>
          </div>

          <div className="w-full h-full flex flex-col space-y-10 overflow-y-scroll pb-[80px]">
            <div className="flex space-x-6">
              <Image
                src={avatars[0]}
                width={65}
                height={65}
                alt="avatar"
                className="h-fit"
              />
              <div className="flex flex-col">
                <div className="flex space-x-4 items-center">
                  <div className="font-bold">Anonymous#12344</div>
                  <div className="text-xs">4:27 PM</div>
                </div>
                <div className="flex flex-col pt-2 space-y-4">
                  <div className="text-[13px]">
                    Gee, its been good news all day. i met someone special
                    today. she is really pretty. ill like to talk more about it
                    but it has to be tomorrow. she should grab a drink later.
                  </div>
                  <div className="text-[13px]">
                    Gee, its been good news all day. i met someone special
                    today. she is  really pretty. ill like to talk more about it
                    but it has to be tomorrow. she should grab a drink later.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-6">
              <Image
                src={avatars[3]}
                width={65}
                height={65}
                alt="avatar"
                className="h-fit"
              />
              <div className="flex flex-col">
                <div className="flex space-x-4 items-center">
                  <div className="font-bold">Anonymous#12344</div>
                  <div className="text-xs">4:27 PM</div>
                </div>
                <div className="flex flex-col pt-2 space-y-4">
                  <div className="text-[13px]">
                    Gee, its been good news all day. i met someone special
                    today. she is  really pretty. ill like to talk more about it
                    but it has to be tomorrow. she should grab a drink later.
                  </div>
                  <div className="text-[13px]">
                    Gee, its been good news all day. i met someone special
                    today. she is  really pretty. ill like to talk more about it
                    but it has to be tomorrow. she should grab a drink later.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-6">
              <Image
                src={avatars[0]}
                width={65}
                height={65}
                alt="avatar"
                className="h-fit"
              />
              <div className="flex flex-col">
                <div className="flex space-x-4 items-center">
                  <div className="font-bold">Anonymous#12344</div>
                  <div className="text-xs">4:27 PM</div>
                </div>
                <div className="flex flex-col pt-2 space-y-4">
                  <div className="text-[13px]">
                    Gee, its been good news all day. i met someone special
                    today. she is  really pretty. ill like to talk more about it
                    but it has to be tomorrow. she should grab a drink later.
                  </div>
                  <div className="text-[13px]">
                    Gee, its been good news all day. i met someone special
                    today. she is  really pretty. ill like to talk more about it
                    but it has to be tomorrow. she should grab a drink later.
                  </div>
                  <div className="text-[13px]">
                    Gee, its been good news all day. i met someone special
                    today. she is  really pretty. ill like to talk more about it
                    but it has to be tomorrow. she should grab a drink later.
                  </div>
                  <div className="text-[13px]">
                    Gee, its been good news all day. i met someone special
                    today. she is  really pretty. ill like to talk more about it
                    but it has to be tomorrow. she should grab a drink later.
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-6">
              <Image
                src={avatars[3]}
                width={65}
                height={65}
                alt="avatar"
                className="h-fit"
              />
              <div className="flex flex-col">
                <div className="flex space-x-4 items-center">
                  <div className="font-bold">Anonymous#12344</div>
                  <div className="text-xs">4:27 PM</div>
                </div>
                <div className="flex flex-col pt-2 space-y-4">
                  <div className="text-[13px]">
                    Gee, its been good news all day. i met someone special
                    today. she is  really pretty. ill like to talk more about it
                    but it has to be tomorrow. she should grab a drink later.
                  </div>
                  <div className="text-[13px]">
                    Gee, its been good news all day. i met someone special
                    today. she is really pretty. ill like to talk more about it
                    but it has to be tomorrow. she should grab a drink later.
                  </div>
                </div>
              </div>
            </div>
            <div className="flex space-x-6">
              <Image
                src={avatars[3]}
                width={65}
                height={65}
                alt="avatar"
                className="h-fit"
              />
              <div className="flex flex-col">
                <div className="flex space-x-4 items-center">
                  <div className="font-bold">Anonymous#12344</div>
                  <div className="text-xs">4:27 PM</div>
                </div>
                <div className="flex flex-col pt-2 space-y-4">
                  <div className="text-[13px]">
                    Gee, its been good news all day. i met someone special
                    today. she is  really pretty. ill like to talk more about it
                    but it has to be tomorrow. she should grab a drink later.
                  </div>
                  <div className="text-[13px]">
                    Gee, its been good news all day. i met someone special
                    today. she is  really pretty. ill like to talk more about it
                    but it has to be tomorrow. she should grab a drink later.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#F6FAFF] h-fit -mt-[70px] px-4 flex">
          <div className="flex w-full bg-[#F5F5F5] p-4 justify-between items-center rounded-xl">
            <input
              className="bg-[#F5F5F5] focus:outline-none w-full"
              placeholder="Type something..."
              value={msgValue}
              onChange={handleInputChange}
            />
            <div className="flex cursor-pointer">
              <SendIcon fontSize="medium" />
            </div>
          </div>
        </div>
      </section>
      {feedbackForm && (
        <section className="flex w-[300px] py-4">
          <div className="flex h-full bg-[#F6FAFF] rounded-xl p-6 space-y-10 justify-center items-center">
            <div className="flex flex-col items-center space-y-5">
              <Image
                src={avatars[3]}
                width={100}
                height={100}
                alt="avatar"
                className="h-fit"
              />
              <div className="text-lg">Anonymous#12345</div>
              <div className="flex cursor-pointer">{stars}</div>
              <textarea
                className="bg-[#D9D9D9] rounded-xl p-3 focus:outline-none"
                rows={6}
                cols={25}
                value={feedbackValue}
                onChange={handleInputChange2}
              />

              <div className="flex items-center text-white space-x-2 bg-[#0D90FF] p-2 px-4 rounded-xl cursor-pointer" onClick={sendFeeback}>
                <div>Send</div>
                <SendIcon fontSize="small" />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Message;
