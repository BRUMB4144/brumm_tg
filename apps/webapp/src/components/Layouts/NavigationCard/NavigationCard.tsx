import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavigationCardProps {
  id: number;
  name: string;
  image: string;
  link: string;
}

interface NavigationCardProProps {
  id: number;
  name: string;
  image: string;
  subscription: boolean;
  link: string;
}

export const NavigationCard: FC<NavigationCardProps> = ({
  id,
  name,
  image,
  link,
}) => {
  return (
    <Link
      to={link}
      className="text-start relative bg-[#E0EEFF] rounded-3xl p-[8px] h-40 overflow-hidden w-full"
      key={id}
    >
      <p className="text-xl z-50">{name}</p>
      <img
        src={image}
        alt=""
        className="flex shrink-0 h-auto absolute right-0 bottom-0 top-7 z-0"
      />
    </Link>
  );
};

export const NavigationCardPro: FC<NavigationCardProProps> = ({
  id,
  name,
  image,
  subscription,
  link,
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // Предотвращаем стандартное поведение Link
    if (subscription) {
      // Если есть подписка, переходим по link
      if (link.startsWith("http")) {
        // Для внешних ссылок
        window.Telegram.WebApp.openTelegramLink(link);
      } else {
        // Для внутренних маршрутов
        navigate(link);
      }
    } else {
      // Если нет подписки, редиректим на /landing
      navigate("/landing");
    }
  };

  return (
    <a
      href={link} // Используем <a> вместо Link для поддержки внешних ссылок
      onClick={handleClick}
      className="text-start relative bg-[#E0EEFF] rounded-3xl p-[8px] h-40 overflow-hidden w-full block"
      key={id}
    >
      <p className="text-xl z-50 leading-5">{name}</p>
      <img
        src={image}
        alt=""
        className="flex shrink-0 h-auto absolute right-0 bottom-0 top-15 z-0"
        width={128}
      />
    </a>
  );
};
