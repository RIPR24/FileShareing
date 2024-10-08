import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { wind } from "../App";

type props = {
  setWin: React.Dispatch<React.SetStateAction<wind>>;
};

const Joinroom = ({ setWin }: props) => {
  const [room, setRoom] = useState<string>("");
  const [name, setName] = useState<string>("");
  const socket = useSocket();

  const handleClick = () => {
    if (socket) {
      socket.emit("join-room", { name, room });
    }
  };

  const joinRoom = useCallback((obj: wind) => {
    setWin(obj);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("join-success", joinRoom);
      return () => {
        socket.off("join-success", joinRoom);
      };
    }
  }, [socket, joinRoom]);

  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        height: "100%",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 30,
          textAlign: "right",
          placeItems: "center",
        }}
      >
        <label htmlFor="name">NAME :</label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          name="name"
          id="name"
        />

        <label htmlFor="roomid">Room ID :</label>
        <input
          type="text"
          value={room}
          onChange={(e) => {
            setRoom(e.target.value);
          }}
          name="room"
          id="roomid"
        />
        <button
          onClick={handleClick}
          style={{ gridColumn: "span 2", width: 150, height: 50 }}
        >
          JOIN
        </button>
      </div>
    </div>
  );
};

export default Joinroom;
