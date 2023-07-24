    import React from "react";

    export const FetchDataContext = React.createContext<{chatData: any, userAvailability: boolean, usersData: any, cardsData:any, notifsData:any} | null>(null);
