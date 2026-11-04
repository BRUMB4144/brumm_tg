import { reportRequestError } from '../../lib/requestError';
import { useEffect, useState } from "react";
import Avatar from "../../assets/Avatar.png";
import checkMark from "../../assets/checkMark.svg";
import Container from "../../components/Layouts/Container/Container";
import { TariffsCardMini } from "../../components/Layouts/TariffsCard/TariffsCardMini";
import { userService } from "../../services/user.service";
import { useNavigate } from "react-router-dom";
import { IPaymentCreate } from "../../types/payments.types";
import { Drawer } from "@geist-ui/react";
import { Button } from "../../components/ui/Button/Button";
import toast from "react-hot-toast";

export const Landing = () => {
  const [payment, setPayment] = useState<IPaymentCreate | null>(null);
  const [oneMonth, setOneMonth] = useState<number>();
  const [halfYear, setHalfYear] = useState<number>();
  const [year, setYear] = useState<number>();
  const [open, setOpen] = useState<boolean>(false);
  const [promoOpen, setPromoOpen] = useState<boolean>(false);
  const [promoId, setPromoId] = useState<string>("");
  const [selectedTariff, setSelectedTariff] = useState<{
    amount: number;
    description: string;
    paymentType: string;
  } | null>(null);
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const data = [
    { id: 1, img: checkMark, text: "Видео-разбор 40 билетов" },
    { id: 2, img: checkMark, text: "Разборы 800 вопросов" },
    { id: 3, img: checkMark, text: "Доступ к обучающим курсам" },
  ];

  const handlePromoSubmit = async () => {
    try {
      const response = await userService.promoSend(promoId);
      if (response.status === true) {
        toast.success("Промокод активирован");
      } else {
        toast.error(response.message);
      }
    } catch { toast.error("Не удалось активировать промокод. Повторите попытку."); }
  };
  useEffect(() => {
    const getSubscriptionPrice = async () => {
      try {
        const response = await userService.getSubscriptionPrice();

        setOneMonth(response?.monthPrice ?? 990);
        setHalfYear(response?.halfYearPrice ?? 2990);
        setYear(response?.yearPrice ?? 5000);
      } catch (error) { reportRequestError(error); }
    };
    void getSubscriptionPrice();
  }, []);
  const createPayments = async (
    amount: number,
    description: string,
    paymentType: string,
    email: string,
  ) => {
    try {
      const response = await userService.createPayment(
        amount,
        description,
        paymentType,
        email,
      );
      if (response.status === false) { toast.error(response.message); return; }
      setPayment(response);
    } catch (error) { reportRequestError(error); }
  };

  const handleClick = (
    amount: number,
    description: string,
    paymentType: string,
  ) => {
    setSelectedTariff({ amount, description, paymentType });
    setOpen(true);
  };

  const handleFormSubmit = () => {
    if (selectedTariff && email) {
      localStorage.setItem("email", email);
      createPayments(
        selectedTariff.amount,
        selectedTariff.description,
        selectedTariff.paymentType,
        email,
      );
      setOpen(false);
    }
  };

  useEffect(() => {
    if (payment?.paymentUrl) {
      window.location.href = payment.paymentUrl;
    }
  }, [payment]);

  return (
    <>
      <Container>
        <div className="flex flex-col w-full gap-10 bg-white">
          <div className="flex items-end w-full gap-4">
            <img src={Avatar} alt={""} width={120} height={100} />
            <p className="text-[var(--blue3)] text-xl">
              Получите полный доступ к курсам и упражнениям от Александра Гусева
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {data.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <img src={item.img} alt={""} width={12} height={12} />
                <p className="text-[var(--blueSecondary)] text-lg">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <div className="overflow-auto w-full">
            <div className="flex flex-row flex-nowrap gap-1 items-center w-full justify-between">
              <TariffsCardMini
                cost={Number(oneMonth)}
                month="oneMonth"
                onClick={() => {
                  const telegramId = localStorage.getItem("telegramId");
                  if (
                    telegramId === "247720352" ||
                    telegramId === "640174698"
                  ) {
                    handleClick(1, "подписка на 30 дней", "30days");
                  } else {
                    handleClick(
                      Number(oneMonth),
                      "подписка на 30 дней",
                      "30days",
                    );
                  }
                }}
                type={"standard"}
              />
              <TariffsCardMini
                cost={Number(halfYear)}
                month="halfYear"
                onClick={() => {
                  const telegramId = localStorage.getItem("telegramId");
                  if (
                    telegramId === "247720352" ||
                    telegramId === "640174698"
                  ) {
                    handleClick(1, "подписка на 6 месяцев", "180days");
                  } else {
                    handleClick(
                      Number(halfYear),
                      "подписка на 6 месяцев",
                      "180days",
                    );
                  }
                }}
                type={"standard"}
              />
              <TariffsCardMini
                cost={Number(year)}
                discount={77}
                fullPrice="5880 ₽"
                onClick={() => {
                  const userId = localStorage.getItem("id");
                  if (userId === "247720352" || userId === "640174698") {
                    handleClick(1, "подписка на 365 дней", "365days");
                  } else {
                    handleClick(
                      Number(year),
                      "подписка на 365 дней",
                      "365days",
                    );
                  }
                }}
                type={"discount"}
                month={"year"}
              />
            </div>
          </div>
          <button
            className="bg-[var(--blueAccent)] w-full py-4 px-2 rounded-lg text-white"
            onClick={() => setPromoOpen(true)}
          >
            Ввести промокод
          </button>
          <br />
          <br />
          <br />
        </div>
      </Container>
      <Drawer
        visible={open}
        onClose={() => setOpen(false)}
        placement="bottom"
        className="geist-ui-drawer"
        color="purple"
      >
        <Drawer.Title className="geist-ui-drawer-title">
          Обязательные условия
        </Drawer.Title>
        <Drawer.Content className="flex flex-col gap-4">
          <p>Чтобы приобрести подписку, оставьте свою почту ниже:</p>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="example@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-2 px-3 rounded-3xl border border-white w-full outline-none"
            />
            <Button
              variant="outline"
              className="border-white"
              onClick={handleFormSubmit}
            >
              Подтвердить
            </Button>
          </div>
        </Drawer.Content>
      </Drawer>
      <Drawer
        visible={promoOpen}
        onClose={() => setPromoOpen(false)}
        placement="bottom"
        className="geist-ui-drawer"
        color="purple"
      >
        <Drawer.Title className="geist-ui-drawer-title">Промокод</Drawer.Title>
        <Drawer.Content className="flex flex-col gap-4">
          <p className="text-center">
            Введите промокод чтобы получить доступ к разделам
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="ПРОМОКОД"
              value={promoId}
              onChange={(e) => setPromoId(e.target.value)}
              className="py-2 px-3 rounded-3xl border border-white w-full outline-none"
            />
            <Button
              variant="outline"
              className="border-white"
              onClick={handlePromoSubmit}
            >
              Подтвердить
            </Button>
          </div>
        </Drawer.Content>
      </Drawer>

    </>
  );
};
