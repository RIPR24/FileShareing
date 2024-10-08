import { useEffect, useState } from "react";

export default function useGetMedia() {
  const [call, setCall] = useState<MediaStream | null>();
  let cam: MediaStream | null;
  let scr: MediaStream | null;
  let aud: MediaStream | null;
  let [isCam, setIscam] = useState(true);

  const strtCall = async () => {
    const calob = new MediaStream();
    try {
      aud = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      calob.addTrack(aud.getTracks()[0]);
    } catch (error) {
      console.log(error);
    }

    try {
      cam = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      calob.addTrack(cam.getTracks()[0]);
    } catch (error) {
      setIscam(false);
      scr = await navigator.mediaDevices.getDisplayMedia();
      calob.addTrack(scr.getTracks()[0]);
    }

    setCall(calob);
  };

  const toggleStr = async () => {
    const calob = new MediaStream();
    if (aud) {
      calob.addTrack(aud.getTracks()[0]);
    }

    if (isCam) {
      if (scr) {
        calob.addTrack(scr.getTracks()[0]);
      } else {
        scr = await navigator.mediaDevices.getDisplayMedia();
        calob.addTrack(scr.getTracks()[0]);
      }
      setIscam(false);
      setCall(calob);
    } else {
      if (cam) {
        calob.addTrack(cam.getTracks()[0]);
        setIscam(false);
        setCall(calob);
      }
    }
  };

  useEffect(() => {
    if (!call) {
      strtCall();
    }
  }, []);
  return { call, toggleStr };
}
