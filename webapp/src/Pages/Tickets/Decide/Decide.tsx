import { reportRequestError } from '../../../lib/requestError';
// import { useEffect, useState } from "react";
// import { MapItem } from "../../../components/Layouts/MapItem/MapItem";
// import { NavbarIntermediate } from "../../../components/Modules/NavbarIntermediate";
// import { Button } from "../../../components/ui/Button/Button";
// import { useNavigate } from "react-router-dom";
// import { Drawer, Loading } from "@geist-ui/react";
// import arrowBack from "../../../assets/16/arrowBack.svg";
// import MapItemSvg from "../../../assets/Map/mapitem.svg";
// import Route from "../../../assets/Map/map1.png";
// import Route2 from "../../../assets/Map/map2.png";
// import questions from "../../../assets/Tickets/Exam/question.svg";
// import time from "../../../assets/Tickets/Exam/time.svg";
// import vector from "../../../assets/Tickets/Exam/vector.svg";
// import { ticketsService } from "../../../services/tickets.service";
// import { TicketItem } from "../../../types/courses.types";
// import {
//   positionsMD,
//   positionsSM,
//   positionsPRO,
//   positions390,
//   positions395,
//   positions400,
//   positions405,
//   positions410,
//   positions415,
//   positions420,
//   positions425,
//   positions430,
//   positions440,
//   positions360,
//   positions370,
//   positions380,
// } from "../../../constants/data.constants";
// import first from "../../../assets/Map/Numbers/Frame3947.svg";
// import second from "../../../assets/Map/Numbers/Frame3948.svg";
// import third from "../../../assets/Map/Numbers/Frame3949.svg";
// import fourth from "../../../assets/Map/Numbers/Frame3953.svg";
// import five from "../../../assets/Map/Numbers/Frame3967.svg";
// import six from "../../../assets/Map/Numbers/Frame3961.svg";
// import seven from "../../../assets/Map/Numbers/Frame3965.svg";
// import eight from "../../../assets/Map/Numbers/Frame3954.svg";
// import nine from "../../../assets/Map/Numbers/Frame3968.svg";
// import ten from "../../../assets/Map/Numbers/Frame3962.svg";

// import eleven from "../../../assets/Map/Numbers/Frame3966.svg";
// import twelve from "../../../assets/Map/Numbers/Frame3955.svg";
// import thirteen from "../../../assets/Map/Numbers/Frame3969.svg";
// import fourteen from "../../../assets/Map/Numbers/Frame3963.svg";
// import fifteen from "../../../assets/Map/Numbers/Frame3956.svg";
// import sixteen from "../../../assets/Map/Numbers/Frame3970.svg";
// import seventeen from "../../../assets/Map/Numbers/Frame3964.svg";
// import eighteen from "../../../assets/Map/Numbers/Frame3971.svg";
// import nineteen from "../../../assets/Map/Numbers/Frame3976.svg";

// import twenty from "../../../assets/Map/Numbers/Frame3957.svg";
// import twOne from "../../../assets/Map/Numbers/Frame3960.svg";
// import twTwo from "../../../assets/Map/Numbers/Frame3958.svg";
// import twThree from "../../../assets/Map/Numbers/Frame3959.svg";
// import twFourth from "../../../assets/Map/Numbers/Frame3972.svg";
// import twFive from "../../../assets/Map/Numbers/Frame3975.svg";
// import twSix from "../../../assets/Map/Numbers/Frame3973.svg";
// import twSeven from "../../../assets/Map/Numbers/Frame3974.svg";
// import twEight from "../../../assets/Map/Numbers/Frame3950.svg";
// import twNine from "../../../assets/Map/Numbers/Frame3951.svg";

// import thirty from "../../../assets/Map/Numbers/Frame3952.svg";
// import thirtyone from "../../../assets/Map/Numbers/Frame3979.svg";
// import thirtytwo from "../../../assets/Map/Numbers/Frame3982.svg";
// import thirtythree from "../../../assets/Map/Numbers/Frame3983.svg";
// import thirtyfourth from "../../../assets/Map/Numbers/Frame3985.svg";
// import thirtyfive from "../../../assets/Map/Numbers/Frame3978.svg";
// import thirtysix from "../../../assets/Map/Numbers/Frame3981.svg";
// import thirtyseven from "../../../assets/Map/Numbers/Frame3987.svg";
// import thirtyeight from "../../../assets/Map/Numbers/Frame3984.svg";
// import thirtynine from "../../../assets/Map/Numbers/Frame3977.svg";
// import fourty from "../../../assets/Map/Numbers/Frame3980.svg";
// import buildings from "../../../assets/Map/buildings.svg";
// import buildings2 from "../../../assets/Map/buildings2.svg";

// import forward from "../../../assets/Map/forward.svg";
// import fuel from "../../../assets/Map/fuel.svg";
// import giveWay from "../../../assets/Map/giveWay.svg";
// import pedestrianCrossing from "../../../assets/Map/pedestrianCrossing.svg";

// export const Decide = () => {
//   const navigate = useNavigate();
//   const [tickets, setTickets] = useState<TicketItem[]>([]);
//   const [progress, setProgress] = useState();
//   const [isLoading, setIsLoading] = useState(true);
//   const [openItemId, setOpenItemId] = useState<string | null>(null);
//   const [positions, setPositions] = useState(positionsMD);
//   const [showContent, setShowContent] = useState<boolean>(false);
//   const [videoId, setVideoId] = useState("");
//   const [currentTicket, setCurrentTicket] = useState<number | null>(null);
//   const handleClick = () => {
//     setShowContent(false);
//   };

//   const handleOpenVideo = async (videoUrl: string, number: number) => {
//     setCurrentTicket(number);
//     const review = await ticketsService.getTicketReview();
//     if (review.status === false) {
//       navigate("/landing");
//     } else {
//       try {
//         const url = new URL(videoUrl);
//         const pathParts = url.pathname.split("/").filter((part) => part);
//         const videoId = pathParts[pathParts.length - 1];
//         const query = url.search;

//         const embedUrl = `https://rutube.ru/play/embed/${videoId}${query}`;
//         setVideoId(embedUrl);
//         setShowContent(true);
//       } catch (error) {
//         console.error("Invalid video URL:", error);
//       }
//     }
//   };
//   const handleStartTicket = async (ticket: number) => {
//     await ticketsService.startTickets(ticket);
//     navigate(`../../tickets/decide/${ticket}`);
//   };
//   const handleRandomTicket = async () => {
//     const response = await ticketsService.getRandomTicket();
//     navigate(`/tickets/decide/random/${response.number}`);
//   };
//   const handleToggle = (id: string) => {
//     setOpenItemId(openItemId === id ? null : id);
//   };

//   const getTicketImage = (number: number) => {
//     switch (number) {
//       case 1:
//         return first;
//       case 2:
//         return second;
//       case 3:
//         return third;
//       case 4:
//         return fourth;
//       case 5:
//         return five;
//       case 6:
//         return six;
//       case 7:
//         return seven;
//       case 8:
//         return eight;
//       case 9:
//         return nine;
//       case 10:
//         return ten;
//       case 11:
//         return eleven;
//       case 12:
//         return twelve;
//       case 13:
//         return thirteen;
//       case 14:
//         return fourteen;
//       case 15:
//         return fifteen;
//       case 16:
//         return sixteen;
//       case 17:
//         return seventeen;
//       case 18:
//         return eighteen;
//       case 19:
//         return nineteen;
//       case 20:
//         return twenty;
//       case 21:
//         return twOne;
//       case 22:
//         return twTwo;
//       case 23:
//         return twThree;
//       case 24:
//         return twFourth;
//       case 25:
//         return twFive;
//       case 26:
//         return twSix;
//       case 27:
//         return twSeven;
//       case 28:
//         return twEight;
//       case 29:
//         return twNine;
//       case 30:
//         return thirty;
//       case 31:
//         return thirtyone;
//       case 32:
//         return thirtytwo;
//       case 33:
//         return thirtythree;
//       case 34:
//         return thirtyfourth;
//       case 35:
//         return thirtyfive;
//       case 36:
//         return thirtysix;
//       case 37:
//         return thirtyseven;
//       case 38:
//         return thirtyeight;
//       case 39:
//         return thirtynine;
//       case 40:
//         return fourty;
//       default:
//         return MapItemSvg;
//     }
//   };

//   // useEffect(() => {
//   //   const handleResize = () => {
//   //     const width = window.innerWidth;

//   //     if (width === 390) {
//   //       setPositions(positions390);
//   //     } else if (width >= 375 && width < 400) {
//   //       setPositions(positionsSM);
//   //     } else if (width >= 425) {
//   //       setPositions(positionsMD);
//   //     } else {
//   //       setPositions(positionsMD);
//   //     }
//   //   };

//   //   handleResize();

//   //   window.addEventListener("resize", handleResize);

//   //   return () => window.removeEventListener("resize", handleResize);
//   // }, []);

//   useEffect(() => {
//     const positionRanges = [
//       { minWidth: 360, maxWidth: 370, positions: positions360 },
//       { minWidth: 370, maxWidth: 380, positions: positions370 },
//       { minWidth: 380, maxWidth: 390, positions: positions380 },
//       { minWidth: 390, maxWidth: 395, positions: positions390 },
//       { minWidth: 390, maxWidth: 395, positions: positions390 },
//       { minWidth: 390, maxWidth: 395, positions: positions390 },
//       { minWidth: 395, maxWidth: 400, positions: positions395 },
//       { minWidth: 400, maxWidth: 405, positions: positions400 },
//       { minWidth: 405, maxWidth: 410, positions: positions405 },
//       { minWidth: 410, maxWidth: 415, positions: positions410 },
//       { minWidth: 415, maxWidth: 420, positions: positions415 },
//       { minWidth: 420, maxWidth: 425, positions: positions420 },
//       { minWidth: 425, maxWidth: 430, positions: positions425 },
//       { minWidth: 430, maxWidth: 435, positions: positions430 },
//       { minWidth: 440, maxWidth: Infinity, positions: positions440 },
//     ];

//     const handleResize = () => {
//       const width = window.innerWidth;
//       const matchedRange = positionRanges.find(
//         (range) => width >= range.minWidth && width < range.maxWidth
//       );
//       const newPositions = matchedRange ? matchedRange.positions : positionsMD;
//       setPositions(newPositions);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);

//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {}, [positions]);

//   useEffect(() => {
//     const fetchCourses = async () => {
//       try {
//         setIsLoading(true);
//         const response = await ticketsService.fetchTickets();
//         const sortedTickets = [...response].sort((a, b) => b.number - a.number);
//         setTickets(sortedTickets);

//         setTimeout(() => {
//           const lastElement = document.getElementById("lastElement");
//           if (lastElement) {
//             lastElement.scrollIntoView({ behavior: "smooth" });
//           }
//         }, 1200);
//       } catch {
//         setIsLoading(true);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     const fetchProgress = async () => {
//       const response = await ticketsService.progress();
//       setProgress(response);
//     };
//     fetchCourses();
//     fetchProgress();
//   }, []);

//   return (
//     <>
//       {isLoading ? (
//         <div className="flex justify-center items-center min-h-screen">
//           <Loading type="secondary" />
//         </div>
//       ) : (
//         <div className="bg-gray-100 flex items-center justify-center flex-col min-h-screen relative overflow-hidden">
//           <img
//             src={Route}
//             alt="Дорожный маршрут"
//             className="w-1/2 relative z-0"
//           />
//           <img src={Route2} alt="Дорожный маршрут" className="route" />
//           <img
//             src={buildings}
//             className="top-117 -right-36 absolute buildingD"
//             alt=""
//           />
//           <img
//             src={buildings2}
//             className="-top-30 -left-42 absolute building2D"
//             alt=""
//           />
//           <img
//             src={pedestrianCrossing}
//             className="top-7 right-0 left-32.5 absolute z-0"
//             alt=""
//           />
//           <img
//             src={forward}
//             className="top-148 right-0 left-64 absolute z-0"
//             alt=""
//           />
//           <img
//             src={fuel}
//             className="top-347 right-0 left-32.5 absolute z-0"
//             alt=""
//           />
//           <img
//             src={giveWay}
//             className="top-430 right-0 left-64 absolute z-0"
//             alt=""
//           />

//           <Button
//             className="bg-gray-200 rounded-full border-1 relative bottom-[190px] w-[65%] border-black py-4 btn"
//             onClick={handleRandomTicket}
//           >
//             Случайный билет
//           </Button>
//           <br />
//           <br />

//           <br />

//           {tickets.map((ticket, index) => {
//             const position = positions[index] || {
//               top: "top-0",
//               left: "left-0",
//             };
//             const thumbnailUrl = ticket.thumbnail
//               ? `${MEDIA_URL}${ticket.thumbnail}`
//               : getTicketImage(ticket.number);

//             return (
//               <div
//                 key={ticket._id}
//                 className={`absolute ${position.top} ${position.left}`}
//               >
//                 <MapItem
//                   image={thumbnailUrl}
//                   isOpen={openItemId === ticket._id}
//                   variant="Tickets"
//                   onToggle={() => handleToggle(ticket._id)}
//                 >
//                   <div className="flex flex-col items-start gap-2">
//                     <p className="font-semibold">Билет {ticket.number}</p>
//                     <div className="flex justify-between w-full">
//                       <p>20 вопросов</p>
//                     </div>
//                     <Button
//                       className="bg-[#4B46A4] w-full rounded-3xl text-white"
//                       onClick={() =>
//                         handleOpenVideo(ticket.videoUrl, ticket.number)
//                       }
//                     >
//                       Смотреть видео разбор
//                     </Button>
//                     <Button
//                       className="bg-[#4B46A4] w-full rounded-3xl text-white"
//                       onClick={() => handleStartTicket(ticket.number)}
//                     >
//                       Начать
//                     </Button>
//                   </div>
//                 </MapItem>
//               </div>
//             );
//           })}
//           <Drawer
//             visible={showContent}
//             onClose={handleClick}
//             placement="bottom"
//             className="geist-ui-drawer"
//             color="purple"
//           >
//             <Drawer.Title className="geist-ui-drawer-title">
//               Разбор билета №{currentTicket}
//             </Drawer.Title>

//             <Drawer.Content>
//               <div className="flex flex-col items-start h-[300px]">
//                 <iframe
//                   width="720"
//                   height="405"
//                   src={videoId}
//                   allow="clipboard-write; autoplay"
//                   allowFullScreen
//                   className={` w-full h-full rounded-lg`}
//                 />
//               </div>
//             </Drawer.Content>
//           </Drawer>

//           <NavbarIntermediate className="bg-[#4B46A4] bottom-0 w-full flex flex-col items-baseline py-3 px-0 gap-5 h-[30%]">
//             <div className="flex items-center justify-between w-full">
//               <Button
//                 className="bg-gray-600 rounded-full py-2 px-3"
//                 onClick={() => navigate("/tickets")}
//                 variant="Icon"
//               >
//                 <img src={arrowBack} alt="Back" width={10} height={12} />
//               </Button>
//               <div className="flex flex-col">
//                 <p className="text-2xl text-center">Решение билетов</p>
//               </div>
//               <div></div>
//             </div>
//             <div className="flex w-full justify-between items-baseline pl-3 gap-4 text-sm">
//               <div className="flex flex-col items-start w-full gap-y-2 text-gray-300">
//                 <img src={questions} alt="Questions" />
//                 <p>Есть подсказки и разборы</p>
//               </div>
//               <div className="flex flex-col items-start w-full gap-y-2 text-gray-300">
//                 <img src={vector} alt="Time" />
//                 <p>
//                   Можно <br /> ошибаться
//                 </p>
//               </div>
//               <div className="flex flex-col items-start w-full gap-y-2 text-gray-300">
//                 <img src={time} alt="Vector" />
//                 <p>Время не ограничено</p>
//               </div>
//             </div>
//             <p className="text-[#5C8EC6] text-center">
//               Подходит для обучения и подготовки к экзамену
//             </p>
//           </NavbarIntermediate>
//         </div>
//       )}
//       <div id="lastElement"></div>
//     </>
//   );
// };
import { MEDIA_URL } from "../../../config";
import { useQuery } from "@tanstack/react-query";
import { MapItem } from "../../../components/Layouts/MapItem/MapItem";
import { NavbarIntermediate } from "../../../components/Modules/NavbarIntermediate";
import { Button } from "../../../components/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { Drawer } from "@geist-ui/react";
import arrowBack from "../../../assets/16/arrowBack.svg";
import MapItemSvg from "../../../assets/Map/mapitem.svg";
import Route from "../../../assets/Map/map1.png";
import Route2 from "../../../assets/Map/map2.png";
import questions from "../../../assets/Tickets/Exam/question.svg";
import time from "../../../assets/Tickets/Exam/time.svg";
import vector from "../../../assets/Tickets/Exam/vector.svg";
import { ticketsService } from "../../../services/tickets.service";

import {
  positionsMD,
  positions390,
  positions395,
  positions400,
  positions405,
  positions410,
  positions415,
  positions420,
  positions425,
  positions430,
  positions440,
  positions360,
  positions380,
} from "../../../constants/data.constants";
import first from "../../../assets/Map/Numbers/Frame3947.svg";
import second from "../../../assets/Map/Numbers/Frame3948.svg";
import third from "../../../assets/Map/Numbers/Frame3949.svg";
import fourth from "../../../assets/Map/Numbers/Frame3953.svg";
import five from "../../../assets/Map/Numbers/Frame3967.svg";
import six from "../../../assets/Map/Numbers/Frame3961.svg";
import seven from "../../../assets/Map/Numbers/Frame3965.svg";
import eight from "../../../assets/Map/Numbers/Frame3954.svg";
import nine from "../../../assets/Map/Numbers/Frame3968.svg";
import ten from "../../../assets/Map/Numbers/Frame3962.svg";
import eleven from "../../../assets/Map/Numbers/Frame3966.svg";
import twelve from "../../../assets/Map/Numbers/Frame3955.svg";
import thirteen from "../../../assets/Map/Numbers/Frame3969.svg";
import fourteen from "../../../assets/Map/Numbers/Frame3963.svg";
import fifteen from "../../../assets/Map/Numbers/Frame3956.svg";
import sixteen from "../../../assets/Map/Numbers/Frame3970.svg";
import seventeen from "../../../assets/Map/Numbers/Frame3964.svg";
import eighteen from "../../../assets/Map/Numbers/Frame3971.svg";
import nineteen from "../../../assets/Map/Numbers/Frame3976.svg";
import twenty from "../../../assets/Map/Numbers/Frame3957.svg";
import twOne from "../../../assets/Map/Numbers/Frame3960.svg";
import twTwo from "../../../assets/Map/Numbers/Frame3958.svg";
import twThree from "../../../assets/Map/Numbers/Frame3959.svg";
import twFourth from "../../../assets/Map/Numbers/Frame3972.svg";
import twFive from "../../../assets/Map/Numbers/Frame3975.svg";
import twSix from "../../../assets/Map/Numbers/Frame3973.svg";
import twSeven from "../../../assets/Map/Numbers/Frame3974.svg";
import twEight from "../../../assets/Map/Numbers/Frame3950.svg";
import twNine from "../../../assets/Map/Numbers/Frame3951.svg";
import thirty from "../../../assets/Map/Numbers/Frame3952.svg";
import thirtyone from "../../../assets/Map/Numbers/Frame3979.svg";
import thirtytwo from "../../../assets/Map/Numbers/Frame3982.svg";
import thirtythree from "../../../assets/Map/Numbers/Frame3983.svg";
import thirtyfourth from "../../../assets/Map/Numbers/Frame3985.svg";
import thirtyfive from "../../../assets/Map/Numbers/Frame3978.svg";
import thirtysix from "../../../assets/Map/Numbers/Frame3981.svg";
import thirtyseven from "../../../assets/Map/Numbers/Frame3987.svg";
import thirtyeight from "../../../assets/Map/Numbers/Frame3984.svg";
import thirtynine from "../../../assets/Map/Numbers/Frame3977.svg";
import fourty from "../../../assets/Map/Numbers/Frame3980.svg";
import buildings from "../../../assets/Map/buildings.svg";
import buildings2 from "../../../assets/Map/buildings2.svg";
import forward from "../../../assets/Map/forward.svg";
import fuel from "../../../assets/Map/fuel.svg";
import giveWay from "../../../assets/Map/giveWay.svg";
import pedestrianCrossing from "../../../assets/Map/pedestrianCrossing.svg";
import { useEffect, useState } from "react";
import { VideoPlayer } from "../../../components/Layouts/VideoPlayer/VideoPlayer";

export const Decide = () => {
  const navigate = useNavigate();
  const [positions, setPositions] = useState(positionsMD);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [videoId, setVideoId] = useState("");
  const [currentTicket, setCurrentTicket] = useState<number | null>(null);
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  // Запрос для получения билетов с кэшированием на 10 минут
  const { data: tickets } = useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const response = await ticketsService.fetchTickets();
      return [...response].sort((a, b) => b.number - a.number);
    },
    staleTime: 10 * 60 * 1000, // 10 минут
  });

  useEffect(() => {
    if (tickets) {
      setTimeout(() => {
        const lastElement = document.getElementById("lastElement");
        if (lastElement) {
          lastElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 1200);
    }
  }, [tickets]);

  useEffect(() => {
    const positionRanges = [
      { minWidth: 360, maxWidth: 380, positions: positions360 },
      { minWidth: 380, maxWidth: 390, positions: positions380 },
      { minWidth: 390, maxWidth: 395, positions: positions390 },
      { minWidth: 395, maxWidth: 400, positions: positions395 },
      { minWidth: 400, maxWidth: 405, positions: positions400 },
      { minWidth: 405, maxWidth: 410, positions: positions405 },
      { minWidth: 410, maxWidth: 415, positions: positions410 },
      { minWidth: 415, maxWidth: 420, positions: positions415 },
      { minWidth: 420, maxWidth: 425, positions: positions420 },
      { minWidth: 425, maxWidth: 430, positions: positions425 },
      { minWidth: 430, maxWidth: 435, positions: positions430 },
      { minWidth: 440, maxWidth: Infinity, positions: positions440 },
    ];

    const handleResize = () => {
      const width = window.innerWidth;
      const matchedRange = positionRanges.find(
        (range) => width >= range.minWidth && width < range.maxWidth,
      );
      const newPositions = matchedRange ? matchedRange.positions : positionsMD;
      setPositions(newPositions);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Предотвращение горизонтального скролла для видео контейнера
  useEffect(() => {
    const preventHorizontalScroll = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const target = e.target as HTMLElement;

        // Проверяем, что событие происходит в контейнере видео
        if (target.closest(".video-container")) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener("touchmove", preventHorizontalScroll, {
      passive: false,
    });

    return () => {
      document.removeEventListener("touchmove", preventHorizontalScroll);
    };
  }, []);

  const handleClick = () => {
    setShowContent(false);
  };

  const handleOpenVideo = async (videoUrl: string, number: number) => {
    try {
      setCurrentTicket(number);
      const review = await ticketsService.getTicketReview();
      if (review.status === false) {
        navigate("/landing");
      } else {
        try {
          let fullVideoUrl: string;

          if (videoUrl.startsWith("http://") || videoUrl.startsWith("https://")) {
            fullVideoUrl = videoUrl;
          } else {
            fullVideoUrl = `${MEDIA_URL}${videoUrl}`;
          }

          setVideoId(fullVideoUrl);
          setShowContent(true);
        } catch (error) {
          console.error("Invalid video URL:", error);

          setVideoId(videoUrl);
          setShowContent(true);
        }
      }
    } catch (error) { reportRequestError(error); }
  };

  const handleStartTicket = async (ticket: number) => {
    try {
      await ticketsService.startTickets(ticket);
      navigate(`../../tickets/decide/${ticket}`);
    } catch (error) { reportRequestError(error); }
  };

  const handleRandomTicket = async () => {
    try {
      const response = await ticketsService.getRandomTicket();
      navigate(`/tickets/decide/random/${response.number}`);
    } catch (error) { reportRequestError(error); }
  };

  const handleToggle = (id: string) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  const getTicketImage = (number: number) => {
    switch (number) {
      case 1:
        return first;
      case 2:
        return second;
      case 3:
        return third;
      case 4:
        return fourth;
      case 5:
        return five;
      case 6:
        return six;
      case 7:
        return seven;
      case 8:
        return eight;
      case 9:
        return nine;
      case 10:
        return ten;
      case 11:
        return eleven;
      case 12:
        return twelve;
      case 13:
        return thirteen;
      case 14:
        return fourteen;
      case 15:
        return fifteen;
      case 16:
        return sixteen;
      case 17:
        return seventeen;
      case 18:
        return eighteen;
      case 19:
        return nineteen;
      case 20:
        return twenty;
      case 21:
        return twOne;
      case 22:
        return twTwo;
      case 23:
        return twThree;
      case 24:
        return twFourth;
      case 25:
        return twFive;
      case 26:
        return twSix;
      case 27:
        return twSeven;
      case 28:
        return twEight;
      case 29:
        return twNine;
      case 30:
        return thirty;
      case 31:
        return thirtyone;
      case 32:
        return thirtytwo;
      case 33:
        return thirtythree;
      case 34:
        return thirtyfourth;
      case 35:
        return thirtyfive;
      case 36:
        return thirtysix;
      case 37:
        return thirtyseven;
      case 38:
        return thirtyeight;
      case 39:
        return thirtynine;
      case 40:
        return fourty;
      default:
        return MapItemSvg;
    }
  };

  return (
    <>
      <div className="bg-gray-100 flex items-center justify-center flex-col min-h-screen relative overflow-hidden">
        <img
          src={Route}
          alt="Дорожный маршрут"
          className="w-1/2 relative z-0"
        />
        <img src={Route2} alt="Дорожный маршрут" className="route" />
        <img
          src={buildings}
          className="top-117 -right-36 absolute buildingD"
          alt=""
        />
        <img
          src={buildings2}
          className="-top-30 -left-42 absolute building2D"
          alt=""
        />
        <img
          src={pedestrianCrossing}
          className="top-7 right-0 left-32.5 absolute z-0"
          alt=""
        />
        <img
          src={forward}
          className="top-148 right-0 left-64 absolute z-0"
          alt=""
        />
        <img
          src={fuel}
          className="top-347 right-0 left-32.5 absolute z-0"
          alt=""
        />
        <img
          src={giveWay}
          className="top-430 right-0 left-64 absolute z-0"
          alt=""
        />

        <Button
          className="bg-gray-200 rounded-full border-1 relative bottom-[190px] w-[65%] border-black py-4 btn"
          onClick={handleRandomTicket}
        >
          Случайный билет
        </Button>
        <br />
        <br />
        <br />

        {tickets?.map((ticket, index) => {
          const position = positions[index] || {
            top: "top-0",
            left: "left-0",
          };
          const thumbnailUrl = ticket.thumbnail
            ? `${MEDIA_URL}${ticket.thumbnail}`
            : getTicketImage(ticket.number);

          return (
            <div
              key={ticket._id}
              className={`absolute ${position.top} ${position.left}`}
            >
              <MapItem
                image={thumbnailUrl}
                isOpen={openItemId === ticket._id}
                variant="Tickets"
                onToggle={() => handleToggle(ticket._id)}
              >
                <div className="flex flex-col items-start gap-2">
                  <p className="font-semibold">Билет {ticket.number}</p>
                  <div className="flex justify-between w-full">
                    <p>20 вопросов</p>
                  </div>
                  <Button
                    className="bg-[#4B46A4] w-full rounded-3xl text-white"
                    onClick={() =>
                      handleOpenVideo(ticket.videoUrl, ticket.number)
                    }
                  >
                    Смотреть видео разбор
                  </Button>
                  <Button
                    className="bg-[#4B46A4] w-full rounded-3xl text-white"
                    onClick={() => handleStartTicket(ticket.number)}
                  >
                    Начать
                  </Button>
                </div>
              </MapItem>
            </div>
          );
        })}
        <Drawer
          visible={showContent}
          onClose={handleClick}
          placement="bottom"
          className="geist-ui-drawer-decide"
          color="purple"
        >
          <Drawer.Title className="geist-ui-drawer-title">
            Разбор билета №{currentTicket}
          </Drawer.Title>

          <Drawer.Content>
            <div className="video-container w-full h-[230px] overflow-hidden">
              <VideoPlayer
                src={videoId}
                className="w-full h-full"
                controls={true}
                onError={(error) => console.error("Video error:", error)}
              />
            </div>
          </Drawer.Content>
        </Drawer>

        <NavbarIntermediate className="bg-[#4B46A4] bottom-0 w-full flex flex-col items-baseline py-3 px-0 gap-5 h-[30%]">
          <div className="flex items-center justify-between w-full">
            <Button
              className="bg-gray-600 rounded-full py-2 px-3"
              onClick={() => navigate("/tickets")}
              variant="Icon"
            >
              <img src={arrowBack} alt="Back" width={10} height={12} />
            </Button>
            <div className="flex flex-col">
              <p className="text-2xl text-center">Решение билетов</p>
            </div>
            <div></div>
          </div>
          <div className="flex w-full justify-between items-baseline pl-3 gap-4 text-sm">
            <div className="flex flex-col items-start w-full gap-y-2 text-gray-300">
              <img src={questions} alt="Questions" />
              <p>Есть подсказки и разборы</p>
            </div>
            <div className="flex flex-col items-start w-full gap-y-2 text-gray-300">
              <img src={vector} alt="Time" />
              <p>
                Можно <br /> ошибаться
              </p>
            </div>
            <div className="flex flex-col items-start w-full gap-y-2 text-gray-300">
              <img src={time} alt="Vector" />
              <p>Время не ограничено</p>
            </div>
          </div>
          <p className="text-[#5C8EC6] text-center">
            Подходит для обучения и подготовки к экзамену
          </p>
        </NavbarIntermediate>
      </div>

      <div id="lastElement"></div>
    </>
  );
};
