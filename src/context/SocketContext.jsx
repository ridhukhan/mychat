import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { AppData } from "./AppContext";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = AppData();

  useEffect(() => {
    if (user) {
      const socket = io("https://authentication-tz5b.onrender.com/api", {
        query: {
          userId: user._id,
        },
        withCredentials: true,
      });

      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};