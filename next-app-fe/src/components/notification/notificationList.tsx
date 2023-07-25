import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import { Dialog, DialogTitle, Box } from "@mui/material";
import { styled } from "@mui/system";
import { avatars } from "@/dummy/avatars";
// import { Delete } from "@mui/icons-material";
import axios from "axios";
import NotificationChanger from "./notificationChanger";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { FetchDataContext } from "@/context/chatDataContext";

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
  const context = useContext(FetchDataContext);
  if (!context) {
    throw new Error("Context is null");
  }
  const { notifsData, cardsData } = context;
  const [requesterData, setRequesterData] = useState<any[] | null>(null);
  const [requestAvailability, setRequestAvailability] = useState<
    boolean | undefined
  >(false);
  const [mergedData, setMergedData] = useState<any[] | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [requesterRealId, setRequesterRealId] = useState("");

  useEffect(() => {


    const matchingCards = cardsData?.filter(
      (card: any) => card.userId == session?.user?.id
    );
    const requestCheck = matchingCards?.some((card: any) =>
      notifsData?.some((notif: any) => notif.cardId == card._id)
    );

    const filteredCardId = cardsData?.filter(
      (card: any) =>
        card.userId === session?.user.id
    );

    const matchingUsers =
      notifsData?.reduce((acc: any[], notification: any) => {
        const relatedUser = users?.find(
          (user) => user._id === notification.requesterId
        );

        // Check if notification.cardId is present in filteredCardId
        const isCardIdMatch = filteredCardId?.some(
          (card: any) => card._id === notification.cardId
        );

        if (relatedUser && isCardIdMatch) {
          acc.push(relatedUser);
        }
        return acc;
      }, []) || [];

    setRequesterData(matchingUsers);
    setRequestAvailability(requestCheck);
  }, [cardsData, users, notifsData]);

  useEffect(() => {
    const filteredCardId = cardsData?.filter(
      (card: any) =>
        card.userId === session?.user.id
    );

    let mergedArray = requesterData?.flatMap((requester) => {
      const matchingNotifs = notifsData?.filter((notif: any) => {
        return notif.requesterId === requester._id && filteredCardId.some((card:any) => card._id === notif.cardId);
      });


      if (matchingNotifs && matchingNotifs.length > 0) {
        return matchingNotifs.map((notif: any) => ({
          ...requester,
          ...notif,
        }));
      }

      return []; // return an empty array if no matching notifications
    });

    // Removing duplicates based on _id property
    const uniqueArray = Array.from(new Set(mergedArray?.map((a) => a._id))).map(
      (_id) => {
        return mergedArray?.find((a) => a._id === _id);
      }
    );

    setMergedData(uniqueArray);
  }, [cardsData, requesterData, notifsData]);

  const deleteNotification = async (id: string) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`/api/getData/getUpdateDeleteNotif?id=${id}`)
        .then((response) => {
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
                    cardId={requester.cardId}
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
