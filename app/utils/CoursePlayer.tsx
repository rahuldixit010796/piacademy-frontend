import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CoursePlayer({ courseId, lectureId, videoId }: { courseId: string; lectureId: string; videoId: string; }) {
  const [otp, setOtp] = useState("");
  const [playbackInfo, setPlaybackInfo] = useState("");

  useEffect(() => {
    axios.post(`${process.env.NEXT_PUBLIC_API_URL}/video/otp`, { courseId, lectureId, videoId }, { withCredentials: true })
      .then(res => {
        setOtp(res.data.otp);
        setPlaybackInfo(res.data.playbackInfo);
      })
      .catch(()=>{ /* show access denied / error */ });
  }, [courseId, lectureId, videoId]);

  if (!otp || !playbackInfo) return <div>Loading…</div>;

  const playerId = process.env.NEXT_PUBLIC_VDOCIPHER_PLAYER_ID || "Ub9OiZXIOeUXH0Nv";
  const src = `https://player.vdocipher.com/v2/?otp=${otp}&playbackInfo=${playbackInfo}&player=${playerId}`;

  return (
    <div style={{position:"relative",paddingTop:"56.25%",overflow:"hidden"}}>
      <iframe src={src} allow="encrypted-media" allowFullScreen style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",border:0}} />
    </div>
  );
}
