import { FC } from "react";

interface VideoCardProps {
  onClick: () => void;
  video: string;
  lessonNumber: number;
  lessonTitle: string;
}

export const VideoCard: FC<VideoCardProps> = ({
  lessonNumber,
  lessonTitle,
  onClick,
  video,
}) => {
  return (
    <div className="flex flex-col items-start min-w-[150px]" onClick={onClick}>
      <img
        src={video}
        alt=""
        className="rounded-2xl w-full max-h-[80px] max-w-[130px] mt-1"
      />
      <div className="flex gap-1">
        <p className="text-[var(--blueAccent)] flex gap-1">
          <p>{lessonNumber} </p>
          <p>/</p>
        </p>
        <p className="text-sm">{lessonTitle}</p>
      </div>
    </div>
  );
};
