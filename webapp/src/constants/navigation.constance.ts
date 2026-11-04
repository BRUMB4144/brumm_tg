import tickets from "../assets/navigation/tickets.png";
import driving from "../assets/navigation/driving.png";
import courses from "../assets/navigation/courses.png";
import routes from "../assets/navigation/routes.png";
import teacher from "../assets/navigation/teacher.png";
import streams from "../assets/navigation/streams.png";
import lawyer from "../assets/navigation/lawyer.png";
import psychology from "../assets/navigation/psychology.png";
import decideG from "../assets/navigation/decideG.png";
import chat from "../assets/navigation/chat.png";

export const freeBlocks = [
  { id: 1, name: "Билеты ПДД", image: tickets, link: "/tickets/decide" },
  { id: 2, name: "Тренажер вождения", image: driving, link: "/driving/game" },
];
export const proBlocksF = [
  { id: 1, name: "Курсы", image: courses, link: "/education" },
  {
    id: 2,
    name: "Экзаменационные маршруты",
    image: routes,
    link: "/driving/city",
  },
];

export const proBlocksS = [
  { id: 1, name: "Преподаватель ПДД 24/7", image: teacher },
  { id: 2, name: "Эфиры с экспертами", image: streams },
];

export const proBlocksT = [
  { id: 1, name: "Автоюрист", image: lawyer },
  { id: 2, name: "Автопсихолог", image: psychology },
];
export const proBlocksFourth = [
  { id: 1, name: "Разборы с Гусевым", image: decideG },
  { id: 2, name: "Чат взаимопомощи на дорогах", image: chat },
];
