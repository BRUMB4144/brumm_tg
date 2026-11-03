import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTelegram } from "./hooks/useTelegram";
import { Spinner } from "@geist-ui/react";
import { API_URL } from "./config";
import {
  buildTelegramLoginPayload,
  persistTelegramSession,
  TelegramLoginResponse,
} from "./lib/telegramAuth";

export default function App() {
  const navigate = useNavigate();
  const { tg, user } = useTelegram();
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const authenticateUser = useCallback(async () => {
      if (!tg?.initData || !user) {
        setError("Откройте приложение через Telegram-бота.");
        return;
      }
      setError(null);
      try {
        const response = await axios.post<TelegramLoginResponse>(
          `${API_URL}/users/login`,
          buildTelegramLoginPayload(tg, user),
        );

        if (response.data?.userId) {
          persistTelegramSession(response.data);
          navigate("/navigation");
        } else {
          throw new Error("Сервер не вернул userId");
        }
      } catch (error) {
        console.error("Ошибка при аутентификации:", error);
        setError("Не удалось авторизоваться. Проверьте соединение и повторите попытку.");
      }
  }, [navigate, tg, user]);

  useEffect(() => {
    void authenticateUser();
  }, [authenticateUser, attempt]);

  return (
    <div className="w-full h-[100vh] flex justify-center items-center bg-[#E0EEFF]">
      {error ? (
        <div className="max-w-sm px-6 text-center">
          <p>{error}</p>
          <button
            type="button"
            className="mt-4 rounded-full bg-[#3942CF] px-5 py-2 text-white"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Повторить
          </button>
        </div>
      ) : (
        <Spinner height={2} width={2} />
      )}
    </div>
  );
}
