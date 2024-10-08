import { createContext, useContext, useMemo } from "react";
import { io, Socket } from "socket.io-client";

type props = {
  children: JSX.Element;
};

export interface socketContextInterface {
  socket: Socket | undefined;
}

const SocketContext = createContext<socketContextInterface>({
  socket: undefined,
});

export const useSocket = () => {
  const { socket } = useContext(SocketContext);
  return socket;
};

const SocketProvider = ({ children }: props) => {
  const socket: Socket = useMemo(() => {
    return io("http://localhost:8000/");
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
