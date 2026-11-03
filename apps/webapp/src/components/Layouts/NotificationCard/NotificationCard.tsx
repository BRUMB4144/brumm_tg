import { FC } from "react";
import { Button } from "../../ui/Button/Button";
import Cross from "../../../assets/16/cross.svg";

interface NotificationCardProps {
  createdAt: string;
  title: string;
  description: string;
  button?: string;
  onClick?: () => void;
  onDelete?: () => void;
}

export const NotificationCard: FC<NotificationCardProps> = ({
  createdAt,
  title,
  description,
  button,
  onClick,
  onDelete,
}) => {
  return (
    <div className="flex gap-y-2 flex-col">
      <p>{createdAt}</p>
      <div className="bg-white text-black flex flex-col gap-y-1 w-full relative rounded-2xl px-3 pt-2 pb-4">
        <h2>{title}</h2>
        <p>{description}</p>
        {button && (
          <Button
            variant="outline"
            onClick={onClick}
            className="w-full rounded-md"
          >
            {button}
          </Button>
        )}
        <img
          src={Cross}
          alt=""
          onClick={onDelete}
          className="absolute right-3 top-3.5"
        />
      </div>
    </div>
  );
};
