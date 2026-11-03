import React, { useMemo, useRef } from "react";
import Plyr, { APITypes, PlyrProps } from "plyr-react";
import "plyr-react/plyr.css";

interface VideoPlayerProps {
  src: string;
  className?: string;
  onPlay?: () => void; // kept for API compatibility
  onPause?: () => void; // kept for API compatibility
  onEnded?: () => void; // kept for API compatibility
  onError?: (error: string) => void; // kept for API compatibility
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  showSearch?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  className = "",
  autoPlay = false,
  controls = true,
  muted = false,
  loop = false,
}) => {
  const playerRef = useRef<APITypes>(null);

  const source = useMemo<PlyrProps["source"]>(
    () => ({
      type: "video" as const,
      title: "video",
      sources: [
        {
          src,
          type: "video/mp4",
        },
      ],
      poster: undefined, // Explicitly no poster
    }),
    [src]
  );

  const options = useMemo<PlyrProps["options"]>(
    () => ({
      autoplay: autoPlay,
      muted,
      loop: { active: loop },
      controls: controls
        ? [
            "play-large",
            "play",
            "progress",
            "current-time",
            "mute",
            "volume",
            "settings",
            "pip",
            "airplay",
            "fullscreen",
          ]
        : [],

      poster: false,
    }),
    [autoPlay, controls, loop, muted]
  );

  return (
    <div className={`${className}`}>
      <Plyr ref={playerRef} source={source} options={options} />
    </div>
  );
};
