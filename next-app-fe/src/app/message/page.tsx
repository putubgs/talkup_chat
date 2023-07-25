"use client";
import React, { useEffect, useState, useContext } from "react";
import dotenv from "dotenv";
import { avatars } from "@/dummy/avatars";
import Image from "next/image";
import CircleIcon from "@/components/icons/CircleIcon";
import SendIcon from "@mui/icons-material/Send";
import StarIcon from "@mui/icons-material/Star";
import { forbiddenWords } from "@/dummy/forbiddenWords";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { Session } from "next-auth";
import { FetchDataContext } from "@/context/chatDataContext";
import axios from "axios";
import { Schedule } from "@mui/icons-material";
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
    updatePoints?: (newPoints: number) => void;
  };
}

interface CardData {
  activation: boolean;
  algorithm: string;
  category: string;
  createdAt: string;
  duration: string;
  schedules: any[];
  story: string;
  storyType: string;
  updatedAt: string;
  userId: string;
  __v: number;
  _id: string;
}

interface recipientUser {
  id: string;
  name: string | null;
  email: string | null;
  username: string;
  points: number;
  rating: number;
  tier: number;
  avatar: number;
}

type MessageType = {
  sender: string;
  text: string;
  timestamp: string;
};

const Message: React.FC = () => {
  let { data: session, update } = useSession({
    required: true,
  }) as { data: CustomUser | null; update: any };
  const [feedbackForm, setFeedbackForm] = useState(false);
  const [msgValue, setMsgValue] = useState("");
  const [feedbackValue, setFeedbackValue] = useState("");
  const [rating, setRating] = useState(0);
  const [chatActive, setChatActive] = useState(true);
  const { NEXT_PUBLIC_BASE_URL } = process.env;
  const socket = io(NEXT_PUBLIC_BASE_URL || "http://localhost:4000/");
  const context = useContext(FetchDataContext);
  if (!context) {
    throw new Error("Context is null");
  }
  const { chatData, userAvailability, usersData, cardsData, notifsData } =
    context;
  const [hasJoined, setHasJoined] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [recipientData, setRecipientData] = useState<recipientUser | null>(
    null
  );
  const [realRecipientId, setRecipientId] = useState<any | null>();

  const [isListener, setIsListener] = useState<boolean | undefined>(false);
  const [currentNotif, setCurrentNotif] = useState<any | null>();

  useEffect(() => {
    if (
      !hasJoined &&
      userAvailability &&
      new Date() >=
        new Date(
          `${currentNotif?.schedule?.date}T${convertTo24Hour(
            currentNotif?.schedule?.time
          )}`
        )
    ) {
      socket.emit("join-room", session?.user.id);
      setHasJoined(true);
    }

    let recipientId: string | null = null;
    if (chatData) {
      chatData.forEach((chat: any) => {
        let member = chat.members.find(
          (member: any) => member.userId === session?.user.id && member.activation === true
        );
        if (member) {
          let recipient = chat.members.filter(
            (member: any) => member.userId !== session?.user.id
          )[0];
          if (recipient) {
            recipientId = recipient.userId;
            setRecipientId(recipientId);
          }
        }
      });
    }
    

    let listenerCheck;

    if (Array.isArray(chatData) && Array.isArray(notifsData)) {
      const approvedNotif = notifsData.find(
        (notif: any) =>
          notif.approval === "approve" &&
          chatData?.some(
            (chat: any) =>
              chat.cardId === notif.cardId &&
              chat.members.some(
                (member: any) =>
                  member.userId === session?.user.id &&
                  member.activation === true
              )
          )
      );

      setCurrentNotif(approvedNotif);

      if (approvedNotif) {
        const correspondingCard = cardsData?.find(
          (card: any) => card._id === approvedNotif.cardId
        );
        if (correspondingCard) {
          listenerCheck = correspondingCard.userId !== session?.user.id;
        }
      }
    }

    setIsListener(listenerCheck);

    socket.on("receive-message", (data) => {
      setMessages((prevMessages: MessageType[]) => [
        ...prevMessages,
        {
          sender: data.sender,
          text: data.text,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    });

    socket.on("error", (error) => {
      console.error(`Socket error: ${error}`);
    });

    let recipientUser;
    if (usersData) {
      recipientUser = usersData.find((user: any) => user._id === recipientId);
    }
    setRecipientData(recipientUser);
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
    if (msgValue !== "" && session?.user.id) {
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

      // Check if recipientId exists before creating newMessage
      if (recipientId) {
        const newMessage = {
          text: msgValue,
          sender: session.user.id,
          recipient: recipientId,
        };

        socket.emit("send-message", newMessage);

        setMessages((prevMessages: MessageType[]) => [
          ...prevMessages,
          {
            sender: newMessage.sender,
            text: newMessage.text,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);

        // Clear the input field after message has been sent
        setMsgValue("");
      }
    }
  };

  const deactivateUser = async () => {
    try {
      await axios.put("/api/getData/getAndUpdateChat", {
        userId: session?.user?.id,
        newActivation: false,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const updatePoints = async () => {
    try {
      const response = await axios.put("/api/editProfile/update-points", {
        userId: session?.user?.id,
        newPoints: 100,
      });
      const updatedUser = response.data.data;

      await update({
        ...session,
        user: {
          ...session?.user,
          token: "xxx",
          points: updatedUser.points,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const sendFeeback = async () => {
    let feedback = {
      userId: realRecipientId,
      giverUsername: session?.user.username,
      content: feedbackValue,
      rating: rating,
    };

    try {
      await axios.post(
        "http://localhost:3000/api/dataUpload/addFeedback",
        feedback
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log(error.response.data.error);
      }
    }
  };

  function convertTo24Hour(timeStr:any) {
    if (!timeStr) {
      console.error("Invalid time string");
      // return a default time, you can modify this
      return "00:00";
    }

    let [time, modifier] = timeStr?.split(" ");
    let [hours, minutes] = time?.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}`;
  }

  return (
    <>
      {!userAvailability ? (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center w-[800px]">
            <div className="p-10 bg-[#0D90FF] text-white w-[500px] rounded-xl px-12 text-center font-bold text-lg">
              You do not have any active chat, please pick one or wait till a
              listener approach your story ^_^
            </div>
            <div className="flex flex-col self-start pt-1">
              <div className="w-12 h-12 bg-[#0D90FF] rounded-full ml-24"></div>
              <div className="w-8 h-8 bg-[#0D90FF] rounded-full ml-16"></div>
              <div className="w-4 h-4 bg-[#0D90FF] rounded-full ml-12"></div>
            </div>
          </div>
        </div>
      ) : new Date() <=
        new Date(
          `${currentNotif?.schedule?.date}T${convertTo24Hour(
            currentNotif?.schedule?.time
          )}`
        ) ? (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex flex-col items-center justify-center w-[800px]">
            <div className="p-10 bg-[#0D90FF] text-white w-[500px] rounded-xl px-12 text-center font-bold text-lg">
              You have a scheduled chat at {currentNotif?.schedule.date},{" "}
              {currentNotif?.schedule.time}. See you later!
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
                  <Image
                    src={avatars[recipientData?.avatar!]}
                    width={55}
                    height={55}
                    alt="avatar"
                  />
                  <div className="flex flex-col">
                    <div className="text-lg">
                      {" "}
                      {recipientData?.username}{" "}
                      {isListener ? "(Storyteller)" : "(Listener)"}
                    </div>
                  </div>
                </div>
                {isListener ? (
                  <div
                    className="flex h-fit bg-red-500 py-2 text-white px-4 rounded-xl cursor-pointer"
                    onClick={() => {
                      // router.push("/")

                      deactivateUser();
                      updatePoints();
                    }}
                  >
                    End Chat
                  </div>
                ) : (
                  <div
                    className="flex h-fit bg-red-500 py-2 text-white px-4 rounded-xl cursor-pointer"
                    onClick={() => {
                      setFeedbackForm(true);
                    }}
                  >
                    End Chat
                  </div>
                )}
              </div>

              <div className="w-full h-full flex flex-col space-y-4 overflow-y-scroll pb-[80px]">
                {messages.map((message, index) => {
                  const isOwnMessage = message.sender === session?.user.id;

                  return (
                    <div
                      className={`flex flex-col space-y-1 ${
                        !isOwnMessage ? "self-end" : ""
                      }`}
                      key={index}
                    >
                      <div
                        className={`bg-[${
                          !isOwnMessage ? "#3817E2" : "#0D90FF"
                        }] w-fit px-4 py-1 rounded-xl text-white`}
                      >
                        {message.text}
                      </div>
                      <div className="text-xs text-gray-500">
                        {message.timestamp}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-[#F6FAFF] h-fit -mt-[70px] px-4 flex z-10">
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
                    src={avatars[recipientData?.avatar!]}
                    width={100}
                    height={100}
                    alt="avatar"
                    className="h-fit"
                  />
                  <div className="text-lg">{recipientData?.username}</div>
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
                    onClick={() => {
                      sendFeeback();
                      deactivateUser();
                      window.location.reload();
                    }}
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
