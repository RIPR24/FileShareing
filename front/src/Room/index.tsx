import React, { useEffect } from "react";
import { wind } from "../App";
import Conn from "./Conn";
import { useSocket } from "../context/SocketProvider";

type props = {
  setWin: React.Dispatch<React.SetStateAction<wind>>;
  win: wind;
};

const Room = (props: props) => {
  const socket = useSocket();

  const userJoied = () => {
    props.setWin({ ...props.win, users: 2 });
  };

  useEffect(() => {
    if (socket) {
      socket.on("user-joined", userJoied);
      return () => {
        socket.off("user-joined", userJoied);
      };
    }
  }, [socket]);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {props.win.users > 1 ? (
        <Conn win={props.win} />
      ) : (
        <div>
          <h1>{"Room ID :  " + props.win.room}</h1>
          <h2>WAITING FOR PERSON TO JOIN</h2>
        </div>
      )}
    </div>
  );
};

export default Room;
