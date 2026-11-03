import { useEffect, useState } from "react";
import { MapItem } from "../../../components/Layouts/MapItem/MapItem";
import { NavbarIntermediate } from "../../../components/Modules/NavbarIntermediate";
import { Button } from "../../../components/ui/Button/Button";
import { useNavigate, useParams } from "react-router-dom";
import arrowBack from "../../../assets/16/arrowBack.svg";
import Route from "../../../assets/Map/route3.png";
import Route390 from "../../../assets/Map/Route390.png";
import mapItem from "../../../assets/Map/mapitem.svg";
import { CircleProgressBar } from "../../../components/Layouts/CircleProgressBar/CircleProgressBar";
import { coursesService } from "../../../services/courses.service";
import { ICourses } from "../../../types/courses.types";
import {
  positionsMD,
  positionsSM,
  PositionProCourses,
} from "../../../constants/data.constants";
import { Loading } from "@geist-ui/react";

import buildings from "../../../assets/Map/buildings.svg";
import buildings2 from "../../../assets/Map/buildings2.svg";
import city from "../../../assets/Map/city.svg";
import forward from "../../../assets/Map/forward.svg";
import fuel from "../../../assets/Map/fuel.svg";
import giveWay from "../../../assets/Map/giveWay.svg";
import { useQuery } from "@tanstack/react-query";
import { MEDIA_URL } from "../../../config";

export const Lessons = () => {
  const navigate = useNavigate();
  const { course } = useParams<{ course: string }>();
  const [courses, setCourses] = useState<ICourses | null>(null);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [positions, setPositions] = useState(positionsMD);
  const subscription = JSON.parse(
    localStorage.getItem("subscription") || "false"
  );

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width === 390) {
        setPositions(PositionProCourses);
      } else if (width >= 375 && width < 390) {
        setPositions(positionsSM);
      } else if (width >= 425) {
        setPositions(positionsMD);
      } else {
        setPositions(positionsMD);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (course) {
          const response = await coursesService.getCourse(course);
          setCourses(response);
          setTimeout(() => {
            const lastElement = document.getElementById("lastElement");
            if (lastElement) {
              lastElement.scrollIntoView({ behavior: "smooth" });
            }
          }, 1200);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, [course]);

  const handleToggle = (id: string) => {
    setOpenItemId(openItemId === id ? null : id);
  };

  const openLesson = async (lessonId: string) => {
    if (subscription === false) {
      navigate("/landing");
    } else {
      navigate(`/education/${course}/${lessonId}`);
      await coursesService.markChecked(course!, lessonId);
    }
  };

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-screen">
          <Loading type="secondary" />
        </div>
      ) : (
        <div className="bg-gray-100 flex items-center justify-center flex-col min-h-screen relative overflow-hidden">
          {window.innerWidth === 390 ? (
            <img
              src={Route390}
              alt="Дорожный маршрут"
              className="w-1/2 relative z-0"
            />
          ) : (
            <img
              src={Route}
              alt="Дорожный маршрут"
              className="w-1/2 relative z-0"
            />
          )}
          <img
            src={buildings}
            className="top-7 -right-25 absolute buildingL"
            alt=""
          />
          <img
            src={buildings2}
            className="-top-30 -left-42 absolute buildingL2"
            alt=""
          />
          <img
            src={city}
            className="top-7 right-0 left-32.5 absolute z-0"
            alt=""
          />
          <img
            src={forward}
            className="top-86 right-0 left-64 absolute z-0"
            alt=""
          />
          <img
            src={fuel}
            className="top-176 right-0 left-32.5 absolute z-0"
            alt=""
          />
          <img
            src={giveWay}
            className="top-255 right-0 left-64 absolute z-0"
            alt=""
          />

          <br />
          <br />
          <br />
          <br />
          {courses && courses.lessons && courses.lessons.length > 0 ? (
            courses.lessons
              .slice()
              .reverse()
              .map((lesson, index) => {
                const position = positions[index] || {
                  top: "top-0",
                  left: "left-0",
                };

                const thumbnailUrl = lesson.thumbnail
                  ? `${MEDIA_URL}${lesson.thumbnail}`
                  : mapItem;

                return (
                  <div
                    key={lesson._id}
                    className={`absolute ${position.top} ${position.left}`}
                  >
                    <MapItem
                      image={thumbnailUrl}
                      isOpen={openItemId === lesson._id}
                      variant="Courses"
                      className="mapItemCourses"
                      onToggle={() => handleToggle(lesson._id)}
                    >
                      <div className="flex flex-col items-start gap-2">
                        <div className="flex flex-col gap-1">
                          <p className="font-[500]">{lesson.title}</p>
                          <p>
                            {lesson.isWatched === true
                              ? "Просмотрено"
                              : "Не просмотрено"}
                          </p>
                        </div>
                        <Button
                          className="bg-[#4B46A4] w-full rounded-3xl text-white py-3"
                          onClick={() => openLesson(lesson._id)}
                        >
                          Приступить
                        </Button>
                      </div>
                    </MapItem>
                  </div>
                );
              })
          ) : (
            <div>Нет доступных уроков</div>
          )}

          <NavbarIntermediate
            topContent={
              <CircleProgressBar
                bg
                percentage={(courses && courses.progress.percentage) || 0}
              />
            }
            className={"bottom-0 bg-[#333C59]"}
          >
            <Button
              className="bg-gray-600 rounded-full px-3 h-[34px]"
              onClick={() => navigate(-1)}
              variant={"Icon"}
            >
              <img src={arrowBack} alt="Назад" className="w-fit h-fit" />
            </Button>
            <p className="text-lg text-center">Онлайн курс по ПДД</p>
            <div className="pr-10"></div>
          </NavbarIntermediate>
        </div>
      )}
      <div id="lastElement"></div>
    </>
  );
};
