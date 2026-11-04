import { useState } from "react";
import Crown from "../../assets/crown.svg";
import { ProgressCard } from "../../components/Layouts/ProgressCard/ProgressCard";
import { TariffsCard } from "../../components/Layouts/TariffsCard/TariffsCard";
import { Drawer } from "@geist-ui/react";
import Container from "../../components/Layouts/Container/Container";
import { Button } from "../../components/ui/Button/Button";
import { userService } from "../../services/user.service";

import { Skeleton } from "@radix-ui/themes";
import { Border } from "../../components/ui/Border/Border";
import { Notify } from "../../components/Layouts/Notyify/Notify";
import { useQuery } from "@tanstack/react-query";

export const Profile = () => {
  const [showContent, setShowContent] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Запрос для получения данных профиля
  const { data: user, isLoading: isUserLoading, isError: isUserError, refetch: reloadUser } = useQuery({
    queryKey: ["profile"],
    queryFn: userService.getProfile,
    staleTime: 10 * 60 * 1000, // Кэшируем на 10 минут
  });

  const { data: referals, isLoading: isReferalsLoading, isError: isReferalsError, refetch: reloadReferals } = useQuery({
    queryKey: ["referals"],
    queryFn: userService.getReferals,
    staleTime: 10 * 60 * 1000, // Кэшируем на 10 минут
  });

  if (isUserError || isReferalsError) return <Container><p role="alert">Не удалось загрузить профиль. <button onClick={() => { void reloadUser(); void reloadReferals(); }}>Повторить</button></p></Container>;
  const type = user?.subscription.type;

  const handleCopy = () => {
    if (referals?.referalLink) {
      navigator.clipboard.writeText(referals.referalLink);
      setCopied(true);
    }
  };

  const handleClick = () => {
    setShowContent(!showContent);
  };

  return (
    <>
      <Container>
        <Notify />
        <div className="flex flex-col gap-4 mb-10">
          <div className="flex items-center gap-2">
            <p className="text-3xl">{user?.username || "Загрузка..."}</p>
            {type === "premium" ? (
              <img src={Crown} alt="Crown" width={18} height={16} />
            ) : null}
          </div>
          {isUserLoading ? (
            <div className="overflow-x-hidden rounded-3xl">
              <Skeleton loading={true} width="500px" height="80px" />
            </div>
          ) : (
            <ProgressCard
              title={"Ваша готовность к экзамену"}
              percentage={user?.progress.percentage ?? 0}
              variant={"circle"}
              onClick={handleClick}
              type="fill"
            />
          )}

          <TariffsCard
            status={`${type === "premium" ? "Pro" : "Base"}`}
            isAutoRenew={user?.subscription.autoRenew}
            endAt={`${user?.subscription.expiresAt}`}
          />
          {isReferalsLoading ? (
            <div className="overflow-x-hidden rounded-3xl">
              <Skeleton loading={true} width="500px" height="80px" />
            </div>
          ) : (
            <div className="flex flex-col bg-gray-100 px-4 py-4 rounded-2xl w-full">
              <p className="text-lg">Реферальная ссылка:</p>
              <div className="flex justify-between items-center w-full mt-2">
                <div
                  onClick={() =>
                    window.open(`https://${referals?.referalLink}`)
                  }
                  className="text-[var(--blueSecondary)] underline w-full"
                >
                  {referals?.referalLink || "t.me/GuseffGoBot?start=ref_..."}
                </div>
                <Button
                  variant="outline"
                  className="active:bg-gray-400 active:border-gray-400 duration-300 active:text-white px-0 w-fit outline-none"
                  onClick={handleCopy}
                >
                  {copied ? "Скопировано" : "Скопировать"}
                </Button>
              </div>
              <Border />
              <div className="flex flex-col gap-2">
                <div className="flex justify-between w-full">
                  <p className="text-gray-400">Переходов:</p>
                  <p>{referals?.referalCount ?? 0}</p>
                </div>
                <div className="flex justify-between w-full">
                  <p className="text-gray-400">Покупок:</p>
                  <p>{referals?.referalPurchases ?? 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        <br />
        <br />
        <br />
      </Container>
      <Drawer
        visible={showContent}
        onClose={handleClick}
        placement="bottom"
        className="geist-ui-drawer"
        color="purple"
      >
        <Drawer.Title className="geist-ui-drawer-title">
          Статистика
        </Drawer.Title>
        <Drawer.Content>
          <div className="flex flex-col items-start">
            <ProgressCard
              title={"Ваша готовность к экзамену"}
              percentage={user?.progress.percentage ?? 0}
              variant={"circle"}
              onClick={handleClick}
              type="transparent"
            />
            <br />
            <div className="flex items-start justify-between w-full">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-0.5">
                  <p>Тестов пройдено</p>
                  <p>{user?.progress.ticketsCompleted ?? 0}</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p>Уроков пройдено</p>
                  <p>{user?.progress.lessonsCompleted ?? 0}</p>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <p>Ошибок</p>
                <b className="text-red-500">{user?.progress.mistakes ?? 0}%</b>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer>
    </>
  );
};
