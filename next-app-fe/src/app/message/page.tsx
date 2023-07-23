"use client";
import React, { useEffect, useState, useContext } from "react";
import dotenv from "dotenv";
import { useRouter } from "next/router";
import { avatars } from "@/dummy/avatars";
import Image from "next/image";
import CircleIcon from "@/components/icons/CircleIcon";
import SendIcon from "@mui/icons-material/Send";
import StarIcon from "@mui/icons-material/Star";
import { forbiddenWords } from "@/dummy/forbiddenWords";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Session } from "next-auth";
import { ChatDataContext } from "@/context/chatDataContext";
// dotenv.config();

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

const Message: React.FC = () => {
  let { data: session } = useSession({
    required: true,
  }) as { data: CustomUser | null };
  const [feedbackForm, setFeedbackForm] = useState(false);
  const [msgValue, setMsgValue] = useState("");
  const [feedbackValue, setFeedbackValue] = useState("");
  const [rating, setRating] = useState(0);
  const [chatActive, setChatActive] = useState(true);
  const { NEXT_PUBLIC_BASE_URL } = process.env;
  const socket = io(NEXT_PUBLIC_BASE_URL || "http://localhost:4000/");
  const context = useContext(ChatDataContext);
  if (!context) {
    throw new Error("Context is null");
  }
  const { chatData, userAvailability } = context;
  const [hasJoined, setHasJoined] = useState(false);

  useEffect(() => {
    if (!hasJoined && userAvailability) {
      socket.emit("join-room", session?.user.id);
      setHasJoined(true);
    }
  
    socket.on("receive-message", (data) => {
      console.log("data", data);
    });
  
    // return () => {
    //   socket.off("receive-message");
    // };
  }, [userAvailability, session, socket, chatData, hasJoined]);


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

  const sendMessage = () => {
    if (msgValue !== "") {
      let recipientId;

      if (chatData) {
        chatData.forEach((chat: any) => {
          let recipient = chat.members.filter(
            (member: any) => member.userId !== session?.user.id
          )[0];
          if (recipient) {
            recipientId = recipient.userId;
          }
        });
      }

      socket.emit("send-message", {
        text: msgValue,
        sender: session?.user.id,
        recipient: recipientId,
      });

      // Clear the input field after message has been sent
      setMsgValue("");
    }
  };

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
    };

    console.log(feedback);
  };

  return (
    <>
      {!userAvailability ? (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center w-[800px]">
            <div className="p-10 bg-[#0D90FF] text-white w-[500px] rounded-xl px-12 text-center font-bold text-lg">
              You does not have any active chat, please pick one or wait till a
              listener approach your story ^_^
            </div>
            <div className="flex flex-col self-start pt-1">
              <div className="w-12 h-12 bg-[#0D90FF] rounded-full ml-24"></div>
              <div className="w-8 h-8 bg-[#0D90FF] rounded-full ml-16"></div>
              <div className="w-4 h-4 bg-[#0D90FF] rounded-full ml-12"></div>
            </div>
          </div>
        </div>
      ) : (
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
                  onClick={() => {
                    handleFeedback();
                    setChatActive(false);
                  }}
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
                        today. she is really pretty. ill like to talk more about
                        it but it has to be tomorrow. she should grab a drink
                        later.
                      </div>
                      <div className="text-[13px]">
                        Gee, its been good news all day. i met someone special
                        today. she is really pretty. ill like to talk more about
                        it but it has to be tomorrow. she should grab a drink
                        later.
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
                        today. she is really pretty. ill like to talk more about
                        it but it has to be tomorrow. she should grab a drink
                        later.
                      </div>
                      <div className="text-[13px]">
                        Gee, its been good news all day. i met someone special
                        today. she is really pretty. ill like to talk more about
                        it but it has to be tomorrow. she should grab a drink
                        later.
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
                        today. she is really pretty. ill like to talk more about
                        it but it has to be tomorrow. she should grab a drink
                        later.
                      </div>
                      <div className="text-[13px]">
                        Gee, its been good news all day. i met someone special
                        today. she is really pretty. ill like to talk more about
                        it but it has to be tomorrow. she should grab a drink
                        later.
                      </div>
                      <div className="text-[13px]">
                        Gee, its been good news all day. i met someone special
                        today. she is really pretty. ill like to talk more about
                        it but it has to be tomorrow. she should grab a drink
                        later.
                      </div>
                      <div className="text-[13px]">
                        Gee, its been good news all day. i met someone special
                        today. she is really pretty. ill like to talk more about
                        it but it has to be tomorrow. she should grab a drink
                        later.
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
                        today. she is really pretty. ill like to talk more about
                        it but it has to be tomorrow. she should grab a drink
                        later.
                      </div>
                      <div className="text-[13px]">
                        Gee, its been good news all day. i met someone special
                        today. she is really pretty. ill like to talk more about
                        it but it has to be tomorrow. she should grab a drink
                        later.
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
                        today. she is really pretty. ill like to talk more about
                        it but it has to be tomorrow. she should grab a drink
                        later.
                      </div>
                      <div className="text-[13px]">
                        Gee, its been good news all day. i met someone special
                        today. she is really pretty. ill like to talk more about
                        it but it has to be tomorrow. she should grab a drink
                        later.
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
                <div className="flex cursor-pointer" onClick={sendMessage}>
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

                  <div
                    className="flex items-center text-white space-x-2 bg-[#0D90FF] p-2 px-4 rounded-xl cursor-pointer"
                    onClick={sendFeeback}
                  >
                    <div>Send</div>
                    <SendIcon fontSize="small" />
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
};

export default Message;
