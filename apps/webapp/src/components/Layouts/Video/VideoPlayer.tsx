interface VideoProps {
  link: string | undefined;
}

import { useRef, useState, useEffect, FC } from "react";

interface VideoProps {
  link: string | undefined;
  variant: "iframe" | "video";
}

const VideoPlayer: FC<VideoProps> = ({ link, variant }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [lastPlayedTime, setLastPlayedTime] = useState<number>(0);
  const videoKey = "lastVideoTime";

  useEffect(() => {
    const savedTime = localStorage.getItem(videoKey);
    if (savedTime) {
      setLastPlayedTime(parseFloat(savedTime));
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = lastPlayedTime;
    }
  }, [lastPlayedTime]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      localStorage.setItem(videoKey, videoRef.current.currentTime.toString());
    }
  };

  return (
    <div className="flex flex-col items-center">
      {variant === "video" ? (
        <video
          ref={videoRef}
          width="640"
          controls
          onTimeUpdate={handleTimeUpdate}
          className="rounded-3xl"
        >
          <source src={link} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <iframe
          src={link}
          width="640"
          height="360"
          allow="autoplay; encrypted-media"
          allowFullScreen
          className="rounded-3xl"
        ></iframe>
      )}
    </div>
  );
};

export default VideoPlayer;
