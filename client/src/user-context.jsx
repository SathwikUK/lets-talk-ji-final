import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { StreamVideoClient } from "@stream-io/video-react-sdk";
import Cookies from "universal-cookie";

// Define the User and UserContextProps without TypeScript types
const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [call, setCall] = useState();
    const [client, setClient] = useState();
    const [isLoading, setIsLoading] = useState(true); // Moved this outside of useEffect

    const cookies = new Cookies();

    useEffect(() => {
        const token = cookies.get("token");
        const username = cookies.get("username");
        const name = cookies.get("name");

        if (!token || !username || !name) {
            setIsLoading(false);
            return;
        }

        const user = {
            id: username,
            name,
        };

        const myClient = new StreamVideoClient({
            apiKey: "3nzxjr64zv64",
            user,
            token,
        });

        setClient(myClient);
        setUser({ username, name });
        setIsLoading(false);

        return () => {
            myClient.disconnectUser();
            setClient(undefined);
            setUser(null);
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, isLoading, client, setClient, call, setCall }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
