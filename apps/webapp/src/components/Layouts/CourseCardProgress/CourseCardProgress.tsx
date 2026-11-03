import { Progress } from "@radix-ui/themes";

import { FC } from "react";
import { SelectCard } from "../SelectCard/SelectCard";
import arrowBack from "../../../assets/24/arrowBack.svg";
import { useNavigate } from "react-router-dom";

interface CourseCardProgressProps {
  percentage: number;
  lessonNumber: number;
  lessonTitle: string;
  description: string;
  fileName?: string;
  size?: string;
  onClick?: () => void;
  courseTitle: string;
}

export const CourseCardProgress: FC<CourseCardProgressProps> = ({
  percentage,
  lessonNumber,
  lessonTitle,
  description,
  fileName,
  size,
  onClick,
  courseTitle,
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-4 bg-[var(--blueLight)] rounded-3xl px-4 py-3">
      <div className="flex items-center gap-2 text-[var(--blueAccent)]">
        <img
          src={arrowBack}
          alt=""
          width={24}
          height={12}
          onClick={() => navigate("/education")}
        />
        <p>{courseTitle}</p>
      </div>
      <Progress value={percentage} size="2" color="green" />
      <div className="flex items-center text-xl gap-3">
        <p className="text-[var(--blueSecondary)] flex items-center gap-2">
          <p className="">{lessonNumber}</p>
          <p>/</p>
        </p>
        <p className="w-[100%] text-lg" style={{ lineHeight: "20px" }}>
          {lessonTitle}
        </p>
      </div>
      <SelectCard
        description={description}
        fileName={fileName}
        size={size}
        onCLick={onClick}
      />
    </div>
  );
};
