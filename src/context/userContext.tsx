import type { GETUserData } from "@/api/APItypes";
import { useGetUserInfo } from "@/api/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext<GETUserData | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<GETUserData | undefined>();

  const { data } = useGetUserInfo();

  console.log(data)

  useEffect(() => {
    if (data && data.data.length === 1) {
      setUserData(data.data[0]);
    } else {
      setUserData(undefined);
    }
  }, [data]);

  return (
    <UserContext.Provider value={userData}>{children}</UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
