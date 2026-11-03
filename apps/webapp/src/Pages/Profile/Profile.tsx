// import { Link } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Crown from "../../assets/crown.svg";
// import { ProgressCard } from "../../components/Layouts/ProgressCard/ProgressCard";
// import { TariffsCard } from "../../components/Layouts/TariffsCard/TariffsCard";
// import { Drawer } from "@geist-ui/react";

// import Container from "../../components/Layouts/Container/Container";
// import { Button } from "../../components/ui/Button/Button";
// import { userService } from "../../services/user.service";
// import { IProfile, IReferals } from "../../types/types";

// import { Skeleton } from "@radix-ui/themes";
// import channel from "../../assets/channel.png";
// import { Border } from "../../components/ui/Border/Border";
// import { Notify } from "../../components/Layouts/Notyify/Notify";

// export const Profile = () => {
//   const [user, setUser] = useState<IProfile | undefined>(undefined);
//   const [showContent, setShowContent] = useState<boolean>(false);
//   const [showChannel, setShowChannel] = useState<boolean>(false);

//   const [isSubscribed, setIsSubscribed] = useState<boolean>();
//   const [referals, setReferals] = useState<IReferals>();
//   const [copied, setCopied] = useState<boolean>(false);
//   const [type, setType] = useState("");

//   const handleCopy = () => {
//     if (referals?.referalLink) {
//       navigator.clipboard.writeText(referals.referalLink);
//       setCopied(true);
//     }
//   };

//   const fetchProfile = async () => {
//     try {
//       const data = await userService.getProfile();
//       setUser(data);
//       setType(data?.subscription.type);
//     } catch (error) {
//       console.error("Ошибка при загрузке профиля:", error);
//     }
//     if (user?.subscribedToChannel === true) {
//       setIsSubscribed(false);
//     } else {
//       if (user?.progress.percentage >= 10) {
//         setIsSubscribed(true);
//       }
//     }
//   };
//   const fetchReferals = async () => {
//     const response = await userService.getReferals();
//     setReferals(response);
//   };
//   const handleClick = () => {
//     setShowContent(!showContent);
//   };
//   const handleClickChannel = () => {
//     setShowChannel(!showChannel);
//   };
//   useEffect(() => {
//     fetchProfile();
//     fetchReferals();
//     console.log(user?.subscribedToChannel);
//   }, []);
//   return (
//     <>
//       <Container>
//         <Notify />
//         <div className="flex flex-col gap-4 mb-10">
//           <div className="flex items-center gap-2">
//             <p className="text-3xl">{user?.username}</p>
//             {type === "premium" ? (
//               <img src={Crown} alt="Crown" width={18} height={16} />
//             ) : null}
//           </div>
//           {user === undefined ? (
//             <div className="overflow-x-hidden rounded-3xl">
//               <Skeleton loading={true} width="500px" height="80px" />
//             </div>
//           ) : (
//             <ProgressCard
//               title={"Ваша готовность к экзамену"}
//               percentage={user?.progress.percentage ?? 0}
//               variant={"circle"}
//               onClick={handleClick}
//               type="fill"
//             />
//           )}

//           <TariffsCard
//             status={`${type === "premium" ? "Pro" : "Base"}`}
//             isAutoRenew={user?.subscription.autoRenew}
//             endAt={`${user?.subscription.expiresAt}`}
//           />
//           <div className="flex flex-col bg-gray-100 px-4 py-4 rounded-2xl w-full">
//             <p className="text-lg">Реферальная ссылка:</p>
//             <div className="flex justify-between items-center w-full mt-2">
//               <div
//                 onClick={() => window.open(`https://${referals?.referalLink}`)}
//                 className="text-[var(--blueSecondary)] underline w-full"
//               >
//                 t.me/GuseffGoBot?start=ref_....
//               </div>
//               <Button
//                 variant="outline"
//                 className="active:bg-gray-400 active:border-gray-400 duration-300 active:text-white px-0 w-fit outline-none"
//                 onClick={handleCopy}
//               >
//                 {copied ? "Скопировано" : "Скопировать"}
//               </Button>
//             </div>
//             <Border />
//             <div className="flex flex-col gap-2 ">
//               <div className="flex justify-between w-full">
//                 <p className="text-gray-400">Переходов:</p>
//                 <p>{referals?.referalCount}</p>
//               </div>
//               <div className="flex justify-between w-full">
//                 <p className="text-gray-400">Покупок:</p>
//                 <p>{referals?.referalPurchases}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <br />
//         <br />
//         <br />
//       </Container>
//       <Drawer
//         visible={showContent}
//         onClose={handleClick}
//         placement="bottom"
//         className="geist-ui-drawer"
//         color="purple"
//       >
//         <Drawer.Title className="geist-ui-drawer-title">
//           Статистика
//         </Drawer.Title>

//         <Drawer.Content>
//           <div className="flex flex-col items-start">
//             <ProgressCard
//               title={"Ваша готовность к экзамену"}
//               percentage={user?.progress.percentage ?? 0}
//               variant={"circle"}
//               onClick={handleClick}
//               type="transparent"
//             />
//             <br />
//             <div className="flex items-start justify-between w-full">
//               <div className="flex flex-col gap-6">
//                 <div className="flex flex-col gap-0.5">
//                   <p>Тестов пройдено</p>
//                   <p>{user?.progress.ticketsCompleted ?? 0}</p>
//                 </div>
//                 <div className="flex flex-col gap-0.5">
//                   <p>Уроков пройдено</p>
//                   <p>{user?.progress.lessonsCompleted ?? 0}</p>
//                 </div>
//               </div>
//               <div className="flex flex-col gap-0.5">
//                 <p>Ошибок</p>
//                 <b className="text-red-500">{user?.progress.mistakes}%</b>
//               </div>
//             </div>
//           </div>
//         </Drawer.Content>
//       </Drawer>
//       <Drawer
//         visible={isSubscribed}
//         onClose={handleClickChannel}
//         placement="bottom"
//         className="geist-ui-drawer h-40"
//         color="purple"
//       >
//         <Drawer.Title className="geist-ui-drawer-title">
//           Обязательные условия
//         </Drawer.Title>

//         <Drawer.Content>
//           <div className="flex flex-col items-start gap-y-4.5">
//             <p>
//               Чтобы продолжить пользоваться приложением, необходимо подписаться
//               на канал ниже:
//             </p>
//             <Link to={"https://t.me/proavtovrf"}>
//               <img src={channel} alt="" />
//             </Link>
//             <div className="flex w-full items-center justify-center">
//               <button className="px-2 py-2 items-center border-[0.5px] border-[#8BE984] rounded-full w-full text-[#8BE984]">
//                 Я подписался
//               </button>
//             </div>
//           </div>
//         </Drawer.Content>
//       </Drawer>
//     </>
//   );
// };
import { Link } from "react-router-dom";
import { useState } from "react";
import Crown from "../../assets/crown.svg";
import { ProgressCard } from "../../components/Layouts/ProgressCard/ProgressCard";
import { TariffsCard } from "../../components/Layouts/TariffsCard/TariffsCard";
import { Drawer } from "@geist-ui/react";
import Container from "../../components/Layouts/Container/Container";
import { Button } from "../../components/ui/Button/Button";
import { userService } from "../../services/user.service";

import { Skeleton } from "@radix-ui/themes";
import channel from "../../assets/channel.png";
import { Border } from "../../components/ui/Border/Border";
import { Notify } from "../../components/Layouts/Notyify/Notify";
import { useQuery } from "@tanstack/react-query";

export const Profile = () => {
  const [showContent, setShowContent] = useState<boolean>(false);
  const [showChannel, setShowChannel] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Запрос для получения данных профиля
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: userService.getProfile,
    staleTime: 10 * 60 * 1000, // Кэшируем на 10 минут
  });

  const { data: referals, isLoading: isReferalsLoading } = useQuery({
    queryKey: ["referals"],
    queryFn: userService.getReferals,
    staleTime: 10 * 60 * 1000, // Кэшируем на 10 минут
  });

  const isSubscribed = user?.subscribedToChannel
    ? false
    : user?.progress.percentage >= 10;

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

  const handleClickChannel = () => {
    setShowChannel(!showChannel);
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
      <Drawer
        visible={isSubscribed}
        onClose={handleClickChannel}
        placement="bottom"
        className="geist-ui-drawer h-40"
        color="purple"
      >
        <Drawer.Title className="geist-ui-drawer-title">
          Обязательные условия
        </Drawer.Title>
        <Drawer.Content>
          <div className="flex flex-col items-start gap-y-4.5">
            <p>
              Чтобы продолжить пользоваться приложением, необходимо подписаться
              на канал ниже:
            </p>
            <Link to={"https://t.me/proavtovrf"}>
              <img src={channel} alt="" />
            </Link>
            <div className="flex w-full items-center justify-center">
              <button
                className="px-2 py-2 items-center border-[0.5px] border-[#8BE984] rounded-full w-full text-[#8BE984]"
                onClick={handleClickChannel}
              >
                Я подписался
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer>
    </>
  );
};
