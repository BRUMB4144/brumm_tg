// import { useNavigate } from "react-router-dom";
// import Container from "../../components/Layouts/Container/Container";

// import car from "../../assets/Reopen/car.png";
// import play from "../../assets/Reopen/play.png";
// import { useEffect, useState } from "react";
// import { ICourses } from "../../types/courses.types";
// import { coursesService } from "../../services/courses.service";
// import { Skeleton } from "@radix-ui/themes";
// import { Notify } from "../../components/Layouts/Notyify/Notify";
// import { userService } from "../../services/user.service";
// import { useQuery } from "@tanstack/react-query";

// export const Education = () => {
//   const navigate = useNavigate();
//   const [courses, setCourses] = useState<ICourses[]>([]);
//   const [subscripton, setSubscription] = useState<boolean>();
//   const [user, setUser] = useState();

//   useEffect(() => {
//     const fetchCourses = async () => {
//       const response = await coursesService.fetchCourses();
//       setCourses(response);

//       const subscription = response?.[1]?.subscription;
//       localStorage.setItem("subscription", JSON.stringify(!!subscription));
//       setSubscription(!!subscription);
//     };

//     const fetchProfile = async () => {
//       const response = await userService.getProfile();
//       setUser(response);
//     };
//     fetchCourses();
//     fetchProfile();
//   }, []);

//   return (
//     <Container>
//       {/* <Notify /> */}
//       <div className="flex flex-col gap-4">
//         <h1 className="text-2xl text-[#172942]">Обучение</h1>
//         <p className="text-md text-[#172942] max-w-[300px]">
//           Видеокурсы, которые помогут вам изучить правила дорожного движения и
//           подготовиться к экзаменам.
//         </p>
//       </div>
//       <br />
//       {subscripton === false || !courses[0]?.lastOpen?.name ? null : (
//         <button
//           className="flex items-center w-full gap-3 py-3 px-4 border border-black rounded-full"
//           onClick={() =>
//             navigate(
//               `/education/${courses[0]?.lastOpen?.courseId}/${courses[0]?.lastOpen?.lessonId}`
//             )
//           }
//         >
//           <img src={play} alt="" width={52} height={20} />
//           <img src={car} alt="" width={52} height={20} />
//           <div className="flex flex-col items-start">
//             <p className="text-[var(--blueAccent)] text-start text-[12px]">
//               Продолжить с последнего места
//             </p>
//             <p className="text-md">{courses[0]?.lastOpen?.name}</p>
//           </div>
//         </button>
//       )}

//       {Array.isArray(courses) && courses.length > 0 ? (
//         courses
//           .filter((course) => course?.title === "Онлайн курс")
//           .map((course) => {
//             const lessonsCount = Array.isArray(course.lessons)
//               ? course.lessons.length
//               : 0;
//             return (
//               <button
//                 className="flex items-center mt-3 gap-3 bg-[var(--blueLight)] w-full rounded-full py-3 px-4"
//                 onClick={() =>
//                   user?.subscription.canView.includes("onlineCourse")
//                     ? navigate(`/education/${courses[1]._id}`)
//                     : navigate("landing")
//                 }
//               >
//                 <img src={car} alt="" width={52} height={20} />
//                 <div className="flex flex-col items-start">
//                   <p className="text-md text-[#172942]">Онлайн курс по ПДД</p>{" "}
//                   <p>{lessonsCount} уроков</p>
//                 </div>
//               </button>
//             );
//           })
//       ) : (
//         <div className="overflow-x-hidden rounded-3xl mt-3">
//           <Skeleton loading={true} width="500px" height="67px" />
//         </div>
//       )}
//       <br />
//       <div className="flex flex-col gap-2">
//         <p className="text-xl">Тема уроков</p>
//         <div className="flex flex-wrap flex-row w-full gap-4 justify-between">
//           <div className="flex items-center w-full gap-2">
//             {Array.isArray(courses) && courses.length > 0 ? (
//               courses
//                 .filter((course) => course?.title === "Курс по парковке")
//                 .map((course) => {
//                   const lessonsCount = Array.isArray(course.lessons)
//                     ? course.lessons.length
//                     : 0;

//                   return (
//                     <button
//                       key={course._id}
//                       className="flex items-center mt-3 bg-[var(--blueLight)] w-full gap-3 rounded-full py-3 px-4"
//                       onClick={() =>
//                         user?.subscription.canView.includes("parkingCourse")
//                           ? navigate(
//                               `../../education/${courses[2]._id}/${courses[2].lessons[0]._id}`
//                             )
//                           : navigate("/landing")
//                       }
//                     >
//                       <img src={car} alt="" width={52} height={20} />
//                       <div className="flex flex-col items-start text-start">
//                         <p className="text-md text-[#172942]">{course.title}</p>
//                         <p>{lessonsCount} занятий</p>
//                       </div>
//                     </button>
//                   );
//                 })
//             ) : (
//               <div className="overflow-x-hidden rounded-3xl">
//                 <Skeleton loading={true} width="500px" height="80px" />
//               </div>
//             )}
//           </div>
//           <br />
//           <br />
//         </div>
//       </div>
//       <br />
//       <br />
//     </Container>
//   );
// };
import { useNavigate } from "react-router-dom";
import Container from "../../components/Layouts/Container/Container";
import car from "../../assets/Reopen/car.png";
import play from "../../assets/Reopen/play.png";
import { coursesService } from "../../services/courses.service";
import { userService } from "../../services/user.service";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@radix-ui/themes";
import { ICourses } from "../../types/courses.types";

export const Education = () => {
  const navigate = useNavigate();

  // Запрос для получения курсов
  const { data: courses, isLoading: isCoursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await coursesService.fetchCourses();
      const subscription = response?.[1]?.subscription;
      localStorage.setItem("subscription", JSON.stringify(!!subscription));
      return response;
    },
    staleTime: 10 * 60 * 1000, // Кэшируем на 10 минут
  });

  // Запрос для получения профиля пользователя
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["user"],
    queryFn: userService.getProfile,
    staleTime: 10 * 60 * 1000, // Кэшируем на 10 минут
  });

  const subscription = courses?.[1]?.subscription;

  return (
    <Container>
      {/* <Notify /> */}
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl text-[#172942]">Обучение</h1>
        <p className="text-md text-[#172942] max-w-[300px]">
          Видеокурсы, которые помогут вам изучить правила дорожного движения и
          подготовиться к экзаменам.
        </p>
      </div>
      <br />
      {isCoursesLoading || isUserLoading ? (
        <div className="overflow-x-hidden rounded-3xl">
          <Skeleton loading={true} width="500px" height="67px" />
        </div>
      ) : (
        <>
          {subscription === false || !courses?.[0]?.lastOpen?.name ? null : (
            <button
              className="flex items-center w-full gap-3 py-3 px-4 border border-black rounded-full"
              onClick={() =>
                navigate(
                  `/education/${courses[0]?.lastOpen?.courseId}/${courses[0]?.lastOpen?.lessonId}`
                )
              }
            >
              <img src={play} alt="" width={52} height={20} />
              <img src={car} alt="" width={52} height={20} />
              <div className="flex flex-col items-start">
                <p className="text-[var(--blueAccent)] text-start text-[12px]">
                  Продолжить с последнего места
                </p>
                <p className="text-md">{courses[0]?.lastOpen?.name}</p>
              </div>
            </button>
          )}

          {Array.isArray(courses) && courses.length > 0 ? (
            courses
              .filter((course: ICourses) => course?.title === "Онлайн курс")
              .map((course: ICourses) => {
                const lessonsCount = Array.isArray(course.lessons)
                  ? course.lessons.length
                  : 0;
                return (
                  <button
                    key={course._id}
                    className="flex items-center mt-3 gap-3 bg-[var(--blueLight)] w-full rounded-full py-3 px-4"
                    onClick={() =>
                      user?.subscription.canView.includes("onlineCourse")
                        ? navigate(`/education/${courses[1]._id}`)
                        : navigate("/landing")
                    }
                  >
                    <img src={car} alt="" width={52} height={20} />
                    <div className="flex flex-col items-start">
                      <p className="text-md text-[#172942]">
                        Онлайн курс по ПДД
                      </p>
                      <p>{lessonsCount} уроков</p>
                    </div>
                  </button>
                );
              })
          ) : (
            <div className="overflow-x-hidden rounded-3xl mt-3">
              <Skeleton loading={true} width="500px" height="67px" />
            </div>
          )}
          <br />
          <div className="flex flex-col gap-2">
            <p className="text-xl">Тема уроков</p>
            <div className="flex flex-wrap flex-row w-full gap-4 justify-between">
              <div className="flex items-center w-full gap-2">
                {Array.isArray(courses) && courses.length > 0 ? (
                  courses
                    .filter(
                      (course: ICourses) => course?.title === "Курс по парковке"
                    )
                    .map((course: ICourses) => {
                      const lessonsCount = Array.isArray(course.lessons)
                        ? course.lessons.length
                        : 0;
                      return (
                        <button
                          key={course._id}
                          className="flex items-center mt-3 bg-[var(--blueLight)] w-full gap-3 rounded-full py-3 px-4"
                          onClick={() =>
                            user?.subscription.canView.includes("parkingCourse")
                              ? navigate(
                                  `../../education/${courses[2]._id}/${courses[2].lessons[0]._id}`
                                )
                              : navigate("/landing")
                          }
                        >
                          <img src={car} alt="" width={52} height={20} />
                          <div className="flex flex-col items-start text-start">
                            <p className="text-md text-[#172942]">
                              {course.title}
                            </p>
                            <p>{lessonsCount} занятий</p>
                          </div>
                        </button>
                      );
                    })
                ) : (
                  <div className="overflow-x-hidden rounded-3xl">
                    <Skeleton loading={true} width="500px" height="80px" />
                  </div>
                )}
              </div>
              <br />
              <br />
            </div>
          </div>
        </>
      )}
      <br />
      <br />
    </Container>
  );
};
