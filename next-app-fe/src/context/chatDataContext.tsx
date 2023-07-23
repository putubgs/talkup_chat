import React from "react";

export const ChatDataContext = React.createContext<{chatData: any, userAvailability: boolean} | null>(null);
