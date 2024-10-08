import peer from "../service/peer.js";
import { wind } from "../App";
import { useSocket } from "../context/SocketProvider.js";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import useGetMedia from "./getCall.js";

const Conn = ({ win }: { win: wind }) => {
  const { call, toggleStr } = useGetMedia();
  const mfref = useRef<HTMLVideoElement>(null);
  const [rmtstream, setRmtstream] = useState<MediaStream | null>();
  const [con, setCon] = useState(0);
  const [tog, setTog] = useState(false);
  const socket = useSocket();

  const sendStream = async () => {
    setTog(true);
    if (call) {
      call.getTracks().forEach((trk) => {
        peer.peer.addTrack(trk, call);
      });
    }
  };

  const sendoffer = async () => {
    const off = await peer.getOffer();
    socket?.emit("con-req", { off, win });
  };

  const conres = async (res: RTCSessionDescription, sid: string) => {
    if (socket?.id !== sid) {
      const ans = await peer.getAnswer(res);
      if (call) {
        call.getTracks().forEach((trk) => {
          peer.peer.addTrack(trk, call);
        });
      }
      socket?.emit("con-ans", { ans, win });
    }
  };

  const ansres = (res: RTCSessionDescription, sid: string) => {
    if (socket?.id !== sid) {
      peer.setLocal(res);
    }
    setCon(1);
  };

  const recStrm = (ev: any) => {
    const strms = ev.streams;
    if (strms[0]) {
      setRmtstream(ev.streams[0]);
    }
    if (strms[1]) {
      console.log("got 2nd stream");
    }
  };

  useEffect(() => {
    if (call && mfref.current) {
      mfref.current.srcObject = call;
    }
  }, [call]);

  useEffect(() => {
    peer.peer.addEventListener("track", recStrm);
    peer.peer.addEventListener("negotiationneeded", sendoffer);

    return () => {
      peer.peer.removeEventListener("track", recStrm);
      peer.peer.removeEventListener("negotiationneeded", sendoffer);
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("req-res", conres);
      socket.on("ans-res", ansres);
      return () => {
        socket.off("ans-res", ansres);
        socket.off("req-res", conres);
      };
    }
  }, [socket]);

  return (
    <div>
      {con === 0 && <button onClick={sendoffer}>Connect</button>}
      {con === 1 && (
        <button disabled={tog} onClick={sendStream}>
          Join Call
        </button>
      )}
      {tog && <button onClick={toggleStr}>Toggle</button>}

      {rmtstream && (
        <ReactPlayer
          playing={true}
          url={rmtstream}
          height={"80vh"}
          width={"80vw"}
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          bottom: 50,
          right: 50,
          gap: 30,
        }}
      >
        <video ref={mfref} id="myFeed" muted autoPlay playsInline></video>
      </div>
    </div>
  );
};

export default Conn;
