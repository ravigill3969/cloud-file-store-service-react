import type { GETUserData } from "@/api/APITypesUser";
import { refreshToken, useGetUserInfo } from "@/api/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

type Data = {
  loading: boolean;
  apiData: GETUserData | undefined;
  isLoggedIn: boolean;
  setIsLoggedIn: (arg: boolean) => void;
  setUserData: (arg: GETUserData | undefined) => void;
};

const UserContext = createContext<Data | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<GETUserData | undefined>();
  const [loggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [tokenRefreshed, setTokenRefreshed] = useState(false);
  const navigate = useNavigate();

  const { data, isError, isSuccess, refetch } = useGetUserInfo();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const tryFetchUserInfo = async () => {
      try {
        if (data && data.data.length === 1 && isSuccess) {
          setUserData(data.data[0]);
          setIsLoggedIn(true);
          setLoading(false);
        } else if (isError && !tokenRefreshed) {
          setLoading(true);
          await refreshToken();
          setTokenRefreshed(true);
          refetch();
          return;
        } else if (isError && tokenRefreshed) {
          navigate("/login");
          setUserData(undefined);
          setIsLoggedIn(false);
          setLoading(false);
        }
      } catch (err) {
        const errorMessage = (err as { message: string }).message;
        toast.error(errorMessage);
        navigate("/login");
        setUserData(undefined);
        setIsLoggedIn(false);
        setLoading(false);
      }
    };

    tryFetchUserInfo();
  }, [data, isError, navigate, isSuccess, tokenRefreshed, refetch]);
  return (
    <UserContext.Provider
      value={{
        apiData: userData,
        loading,
        isLoggedIn: loggedIn,
        setIsLoggedIn,
        setUserData,
      }}
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
