import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogTitle, Box } from "@mui/material";
import { styled } from "@mui/system";
import { avatars } from "@/dummy/avatars";
import { Delete } from "@mui/icons-material";
import axios from "axios";
import NotificationChanger from "./notificationChanger";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import NotificationList from "./notificationList";

// interface CustomUser extends Session {
//   user: {
//     id?: string;
//     name?: string | null;
//     email?: string | null;
//     username?: string;
//     points?: number;
//     rating?: number;
//     tier?: number;
//     avatar?: number;
//   };
// }

const Notification: React.FC<{
  handleClose: () => void;
  open: boolean;
  users: any[] | null;
}> = ({ open, handleClose, users }) => {
  // let { data: session } = useSession() as {
  //   data: CustomUser | null;
  //   update: any;
  // };
  // const [cardData, setCardData] = useState<any[] | null>(null);
  // const [render, setRender] = useState(false);
  // const [notifData, setNotifData] = useState<any[] | null>(null);
  // const [requesterData, setRequesterData] = useState<any[] | null>(null);
  // const [requestAvailability, setRequestAvailability] = useState<
  //   boolean | undefined
  // >(false);
  // const [mergedData, setMergedData] = useState<any[] | undefined>();

  // const fetchNotification = async () => {
  //   try {
  //     const res = await fetch("/api/getData/getUpdateDeleteNotif");
  //     const data = await res.json();
  //     setNotifData(data.data);
  //   } catch (error) {
  //     console.error("Failed to fetch notifications", error);
  //   }
  // };

  // useEffect(() => {
  //   const activeCardData = cardData?.filter((card) => card.activation === true);

  //   const matchingCards = activeCardData?.filter(
  //     (card) => card.userId == session?.user?.id
  //   );
  //   const requestCheck = matchingCards?.some((card) =>
  //     notifData?.some((notif) => notif.cardId == card._id)
  //   );

  //   const matchingUsers =
  //     users?.filter((user) =>
  //       notifData?.some((notification) => notification.requesterId === user._id)
  //     ) || [];
  //   setRequesterData(matchingUsers);
  //   console.log(requestCheck);
  //   setRequestAvailability(requestCheck);
  // }, [cardData, users]);

  // const fetchStory = async () => {
  //   try {
  //     const res = await fetch("/api/getData/getAndDeleteStory");
  //     const data = await res.json();
  //     setCardData(data.data);
  //   } catch (error) {
  //     console.error("Failed to fetch notifications", error);
  //   }
  // };

  // useEffect(() => {
  //   const mergedArray = requesterData?.map((requester) => {
  //     const matchingNotif = notifData?.find(
  //       (notif) => notif.requesterId === requester._id
  //     );

  //     // If there is a matching notification, combine the requester object with the notification object
  //     if (matchingNotif) {
  //       return {
  //         ...requester,
  //         ...matchingNotif,
  //       };
  //     }

  //     // If there is no matching notification, just return the original requester object
  //     return requester;
  //   });

  //   setMergedData(mergedArray);
  //   console.log(mergedArray);
  // }, [requesterData, notifData]);

  // useEffect(() => {
  //   fetchNotification();
  //   fetchStory();
  // }, [render]);

  // const deleteNotification = async (id: string) => {
  //   return new Promise((resolve, reject) => {
  //     axios
  //       .delete(`/api/getData/getUpdateDeleteNotif?id=${id}`)
  //       .then((response) => {
  //         console.log(response);
  //         resolve(response);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //         reject(error);
  //       });
  //   });
  // };
  const CustomDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      width: "100%",
      maxWidth: 700,
      padding: "20px",
    },
  }));
  return (
    <CustomDialog
      open={open}
      onClose={handleClose}
      aria-labelledby="notification"
    >
      <DialogTitle id="avatar-changer">
        <div className="text-xl font-bold">Your Notification</div>
        <hr />
      </DialogTitle>
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 2,
        }}
      >
        {/* <div className="flex flex-col space-y-4">
          {requestAvailability ? (
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
                    if (approve == "approve") {
                      setRender((prev) => !prev);
                    }
                  };

                  const onSelectedDeletion = async (id: string) => {
                    try {
                      await deleteNotification(id);
                      setMergedData(prevData => prevData?.filter(item => item._id !== id));
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
                        approve={requester.approval}
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
        </div> */}
        <NotificationList users={users} />
      </Box>
    </CustomDialog>
  );
};

export default Notification;
