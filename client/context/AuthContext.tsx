import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext<any>(null);

const AuthContextProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setIsLoading(true);
    AsyncStorage.getItem("Loginuser").then((user) => {
      if (user) {
        setUser(JSON.parse(user));
        setIsLoading(false);
      }
    });
  }, []);

  const setLoggedInUser = (user: any) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setLoggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export default AuthContextProvider;
