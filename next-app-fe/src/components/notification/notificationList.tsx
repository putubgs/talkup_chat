import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogTitle, Box } from "@mui/material";
import { styled } from "@mui/system";
import { avatars } from "@/dummy/avatars";
// import { Delete } from "@mui/icons-material";
import axios from "axios";
import NotificationChanger from "./notificationChanger";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";

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

const NotificationList: React.FC<{
  users: any[] | null;
}> = ({ users }) => {
  let { data: session } = useSession() as {
    data: CustomUser | null;
  };
  const [cardData, setCardData] = useState<any[] | null>(null);
  const [notifData, setNotifData] = useState<any[] | null>(null);
  const [requesterData, setRequesterData] = useState<any[] | null>(null);
  const [requestAvailability, setRequestAvailability] = useState<
    boolean | undefined
  >(false);
  const [mergedData, setMergedData] = useState<any[] | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [requesterRealId, setRequesterRealId] = useState("")

  const fetchNotification = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/getData/getUpdateDeleteNotif");
      const data = await res.json();
      setNotifData(data.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const activeCardData = cardData?.filter((card) => card.activation === true);

    const matchingCards = activeCardData?.filter(
      (card) => card.userId == session?.user?.id
    );
    const requestCheck = matchingCards?.some((card) =>
      notifData?.some((notif) => notif.cardId == card._id)
    );

    const matchingUsers =
      users?.filter((user) =>
        notifData?.some((notification) => notification.requesterId === user._id)
      ) || [];
    setRequesterData(matchingUsers);
    console.log(requestCheck);
    setRequestAvailability(requestCheck);
  }, [cardData, users]);

  const fetchStory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/getData/getAndDeleteStory");
      const data = await res.json();
      setCardData(data.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const mergedArray = requesterData?.map((requester) => {
      const matchingNotif = notifData?.find(
        (notif) => notif.requesterId === requester._id
      );

      if (matchingNotif) {
        return {
          ...requester,
          ...matchingNotif,
        };
      }

      return requester;
    });

    setMergedData(mergedArray);
    console.log(mergedArray);
  }, [requesterData, notifData]);

  useEffect(() => {
    fetchNotification();
    fetchStory();
  }, []);

  const deleteNotification = async (id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`/api/getData/getUpdateDeleteNotif?id=${id}`)
        .then((response) => {
          console.log(response);
          resolve(response);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  };
  return (
    <div className="flex flex-col space-y-4">
      {isLoading ? (
        <div className="w-full p-5 text-center">Loading...</div> // You can replace this with your own custom loading component or spinner.
      ) : requestAvailability ? (
        <>
          {mergedData
            ?.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((requester, index) => {
              const onSelectedDecision = async (
                id: string,
                approve: string
              ) => {
                setIsLoading(true);
                if (approve === "approve") {
                  mergedData.forEach((request) => {
                    console.log(request)
                    if (request._id !== id) {
                      request.approval = "reject";
                      try {
                        axios.put("/api/getData/getUpdateDeleteNotif", {
                          _id: request._id,
                          approval: "reject",
                        });
                      } catch (error) {
                        console.error(error);
                      }
                    }
                  });
                }
                const selectedRequest = mergedData.find(
                  (request) => request._id === id
                );
                if (selectedRequest) {
                  selectedRequest.approval = approve;
                }
                try {
                  await axios.put("/api/getData/getUpdateDeleteNotif", {
                    _id: id,
                    approval: approve,
                  });
                } catch (error) {
                  console.error(error);
                }
                setIsLoading(false);
              };

              const onSelectedDeletion = async (id: string) => {
                try {
                  await deleteNotification(id);
                  setMergedData((prevData) =>
                    prevData?.filter((item) => item._id !== id)
                  );
                } catch (error) {
                  console.error(error);
                }
              };

              return (
                <div
                  key={index}
                  className="flex bg-[#EEEEEE] w-full rounded-xl p-4 px-5 space-x-4"
                >
                  <Image
                    src={avatars[requester.avatar]}
                    width={50}
                    height={50}
                    alt="avatar"
                    className="h-fit"
                  />
                  <NotificationChanger
                    onSelectedDecision={onSelectedDecision}
                    deleteNotification={onSelectedDeletion}
                    username={requester.username}
                    createdAt={requester.createdAt}
                    schedule={requester.schedule}
                    id={requester._id}
                    requesterId={requester.requesterId}
                    approve={requester.approval}
                    ownId={session?.user.id}
                  />
                </div>
              );
            })}
        </>
      ) : (
        <div className="w-full p-5 text-center">
          You dont have any notification yet!
        </div>
      )}
    </div>
  );
};

export default NotificationList;
