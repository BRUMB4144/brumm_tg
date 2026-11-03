import { FC, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

interface TelegramNavbarProps {
  variant: "Standard" | "Share" | "Back" | "BackResults";
}

export const TelegramNavbar: FC<TelegramNavbarProps> = ({ variant }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;

      // Полноэкранный режим есть с Bot API 8.0. В старых клиентах скрипт Telegram
      // всё равно определяет метод, но он бросает WebAppMethodUnsupported, а ошибка
      // в эффекте размонтирует всё приложение (белый экран) — поэтому и версия, и try/catch.
      try {
        if (tg.isVersionAtLeast?.("8.0") && typeof tg.requestFullscreen === "function") {
          tg.requestFullscreen();
        } else {
          console.warn("Полноэкранный режим недоступен в этой версии Telegram WebApp.");
        }
      } catch (error) {
        console.warn("Не удалось включить полноэкранный режим:", error);
      }

      // Handle BackButton
      if (tg.BackButton) {
        if (variant === "Back") {
          tg.BackButton.onClick(() => {
            console.log("BackButton: Переход на предыдущую страницу");
            navigate(-1);
          });
          tg.BackButton.show();
        } else if (variant === "BackResults") {
          tg.BackButton.onClick(() => {
            console.log("BackButton: Переход на /tickets");
            navigate("/#/tickets");
          });
          tg.BackButton.show();
        } else {
          tg.BackButton.hide();
        }

        // Cleanup
        return () => {
          console.log("Cleaning up BackButton handlers");
          tg.BackButton.offClick();
          tg.BackButton.hide();
        };
      } else {
        console.warn("BackButton недоступен в этой версии Telegram WebApp.");
      }
    }
  }, [variant, navigate]);

  let className;
  switch (variant) {
    case "Standard":
    case "Share":
    case "Back":
    case "BackResults":
      className = "mb-5";
      break;
    default:
      className = "bg-transparent mb-5";
  }

  return (
    <div className={className}>
      <Outlet />
    </div>
  );
};
