import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CourseCardProgress } from "../../../components/Layouts/CourseCardProgress/CourseCardProgress";
import { VideoCard } from "../../../components/Layouts/VideoCard/VideoCard";
import { VideoPlayer } from "../../../components/Layouts/VideoPlayer/VideoPlayer";
import Container from "../../../components/Layouts/Container/Container";
import { coursesService } from "../../../services/courses.service";
import { ILesson } from "../../../types/courses.types";
import { Spinner } from "@geist-ui/react";
import MockVideo from "../../../assets/vdieoMock.png";
import videoMockChecked from "../../../assets/videoMockChecked.png";
import videomockNext from "../../../assets/videomockNext.png";
import { MEDIA_URL } from "../../../config";

export const LessonId = () => {
  const { course, id } = useParams<{ course: string; id: string }>();
  const [data, setData] = useState<ILesson | null>(null);
  const [nextLessons, setNextLessons] = useState<ILesson | null>(null);
  const [prevLessons, setPrevLessons] = useState<ILesson | null>(null);
  const [videoSources, setVideoSources] = useState<string[]>([]);
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setData(null);
    setError(false);
    const fetchData = async () => {
      if (!course || !id) return;

      try {
        const [lessonResponse, nextLessonsResponse, prevLessonsResponse] =
          await Promise.all([
            coursesService.getLesson(course, id),
            coursesService.getLessonNext(course, id),
            coursesService.getLessonPrev(course, id),
          ]);
        if (!active) return;
        setData(lessonResponse || null);
        setNextLessons(nextLessonsResponse || null);
        setPrevLessons(prevLessonsResponse || null);
      } catch {
        if (active) setError(true);
      }
    };

    void fetchData();
    return () => { active = false; };
  }, [course, id, attempt]);

  useEffect(() => {
    const fetchVideoSources = async () => {
      if (!data?.videoUrl || !Array.isArray(data.videoUrl)) return;

      try {
        setVideoSources(data.videoUrl);
      } catch (error) {
        console.error("Ошибка обработки URL видео:", error);
        setVideoSources(data.videoUrl);
      }
    };

    fetchVideoSources();
  }, [data]);

  if (error) return <Container><p role="alert">Не удалось загрузить урок. <button onClick={() => setAttempt(value => value + 1)}>Повторить</button></p></Container>;
  if (!data) {
    return (
      <div className="w-full h-[80vh] flex justify-center items-center">
        <Spinner height={2} width={2} />
      </div>
    );
  }

  return (
    <Container>
      <div
        key={data._id}
        className="flex flex-col gap-5 py-4 mb-[90px] mt-[80px]"
      >
        {videoSources.length > 0 && (
          <div className="flex w-full gap-4 overflow-x-auto overflow-y-hidden ">
            {videoSources.map((src, index) => {
              return (
                <div key={index} className="w-full">
                  <VideoPlayer
                    src={`${MEDIA_URL}${src}`}
                    className={`${
                      videoSources.length > 1 ? "w-[350px]" : "w-full"
                    }`}
                    controls={true}
                    onError={(error) => console.error("Video error:", error)}
                  />
                </div>
              );
            })}
          </div>
        )}

        <CourseCardProgress
          percentage={24}
          lessonNumber={data.order}
          lessonTitle={data.title}
          description={data.description}
          courseTitle={data.courseTitle}
        />
        <div className="flex flex-col w-full mb-10">
          <p>{data.courseTitle}</p>
          <div className="flex gap-4 w-full overflow-auto">
            {prevLessons && (
              <VideoCard
                key={prevLessons._id}
                onClick={() =>
                  navigate(`/education/${course}/${prevLessons._id}`)
                }
                lessonNumber={prevLessons.order}
                lessonTitle={prevLessons.title}
                video={videoMockChecked}
              />
            )}
            {data && (
              <VideoCard
                key={data._id}
                onClick={() => console.log(`Вы на ${data.order}`)}
                lessonNumber={data.order}
                lessonTitle={data.title}
                video={MockVideo}
              />
            )}
            {nextLessons && (
              <VideoCard
                key={nextLessons._id}
                onClick={() =>
                  navigate(`/education/${course}/${nextLessons._id}`)
                }
                lessonNumber={nextLessons.order}
                lessonTitle={nextLessons.title}
                video={videomockNext}
              />
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};
