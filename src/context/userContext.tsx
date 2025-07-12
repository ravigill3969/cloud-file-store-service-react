import type { GETUserData } from "@/api/APItypes";
import { refreshToken, useGetUserInfo } from "@/api/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
type Data = {
  loading: boolean;
  apiData: GETUserData | undefined;
  isLoggedIn: boolean;
};

const UserContext = createContext<Data | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<GETUserData | undefined>();
  const [loggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [tokenRefreshed, setTokenRefreshed] = useState(false);
  const navigate = useNavigate();

  const { data, isLoading, isError, isSuccess, refetch } = useGetUserInfo();

  useEffect(() => {
    const tryFetchUserInfo = async () => {
      if (data && data.data.length === 1 && isSuccess) {
        setUserData(data.data[0]);
        setIsLoggedIn(true);
      } else if (isError && !tokenRefreshed) {
        await refreshToken();
        setTokenRefreshed(true);
        refetch();
      } else {
        navigate("/login");
        setUserData(undefined);
        setIsLoggedIn(false);
      }
    };

    tryFetchUserInfo();
  }, [data, isError, navigate, isSuccess, tokenRefreshed, refetch]);

  return (
    <UserContext.Provider
      value={{ apiData: userData, loading: isLoading, isLoggedIn: loggedIn }}
    >
      {children}
    </UserContext.Provider>
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
