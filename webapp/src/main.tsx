import { Toaster } from 'react-hot-toast';
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Profile } from "./Pages/Profile/Profile.tsx";
import { Landing } from "./Pages/Landing/Landing.tsx";
import { Driving } from "./Pages/Driving/Driving.tsx";
import { City } from "./Pages/Driving/Map/City.tsx";
import { CityId } from "./Pages/Driving/Map/CityId.tsx";

import { Education } from "./Pages/Education/Education.tsx";
import { Lessons } from "./Pages/Education/Lessons/Lessons.tsx";
import { LessonId } from "./Pages/Education/Lessons/LessonId.tsx";
import { Navbar } from "./components/Modules/Navbar.tsx";
import { TopBar } from "./components/Modules/TopBar.tsx";
import { Tickets } from "./Pages/Tickets/Tickets.tsx";
import { Exams } from "./Pages/Tickets/Exam/Exams.tsx";
import { Exam } from "./Pages/Tickets/Exam/Exam.tsx";
import { Marathons } from "./Pages/Tickets/Marathon/Marathons.tsx";

import { MarathonNew } from "./Pages/Tickets/Marathon/MarathonNew.tsx";

import { Decide } from "./Pages/Tickets/Decide/Decide.tsx";
import { DecideId } from "./Pages/Tickets/Decide/DecideId.tsx";
import { DecideResults } from "./Pages/Tickets/Decide/DecideResults.tsx";
import { DecideError } from "./Pages/Tickets/Decide/Errors.tsx";
import { DecideRandom } from "./Pages/Tickets/Decide/DecideRandom.tsx";
import { Themes } from "./Pages/Tickets/Themes/Themes.tsx";
import { ThemesId } from "./Pages/Tickets/Themes/ThemesId.tsx";
import { ThemesResults } from "./Pages/Tickets/Themes/ThemesResult.tsx";
import { ExamResults } from "./Pages/Tickets/Exam/ExamResults.tsx";
import { ExamErrors } from "./Pages/Tickets/Exam/ExamErrors.tsx";
import { MarathonFull } from "./Pages/Tickets/Marathon/MarathonFull.tsx";
import { DecideVideo } from "./Pages/Tickets/Decide/DecideVideo.tsx";
import { MarathonResults } from "./Pages/Tickets/Marathon/MarathonResults.tsx";
import { ThemesError } from "./Pages/Tickets/Themes/ThemesError.tsx";
import { TelegramNavbar } from "./components/Modules/TelegramNavbar.tsx";
import { Game } from "./Pages/Driving/Game/Game.tsx";
import { MarathonError } from "./Pages/Tickets/Marathon/MarathonError.tsx";
import { DecideShare } from "./Pages/Tickets/Decide/DecideShare.tsx";
import { ExamShare } from "./Pages/Tickets/Exam/ExamShare.tsx";
import { ThemesShare } from "./Pages/Tickets/Themes/ThemesShare.tsx";
import { MarathonShare } from "./Pages/Tickets/Marathon/MarathonShare.tsx";
import { Navigation } from "./Pages/Navigation/Navigation.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
    },
  },
});
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <Toaster position="bottom-center" />
    <HashRouter>
      {/* <BrowserRouter> */}
      <Routes>
        <Route element={<TelegramNavbar variant={"Standard"} />}>
          <Route index element={<App />} />
          <Route element={<Navbar />}>
            <Route path="/navigation" element={<Navigation />} />
            <Route element={<TopBar variant={"standard"} />}>
              <Route path="/driving" element={<Driving />} />
              <Route path="/education" element={<Education />} />
              <Route path="/tickets" element={<Tickets />} />
            </Route>
          </Route>
        </Route>
        <Route element={<TelegramNavbar variant={"Back"} />}>
          <Route element={<Navbar />}>
            <Route path="/education/:course/:id" element={<LessonId />} />
            <Route element={<TopBar variant={"standard"} />}>
              <Route path="/landing" element={<Landing />} />
              <Route path="/driving/city/:id" element={<CityId />} />
              <Route path="/tickets/decide/errors" element={<DecideError />} />
              <Route
                path="/tickets/marathons/marathonFull/:id/results/error"
                element={<MarathonError />}
              />
              <Route
                path="/tickets/exams/:id/results/error"
                element={<ExamErrors />}
              />
              <Route
                path="/tickets/themes/:id/results/errors"
                element={<ThemesError />}
              />
              <Route path="/tickets/decide/video" element={<DecideVideo />} />

              <Route path="/tickets/exams/:id" element={<Exam />} />
              <Route
                path="/tickets/marathons/marathonFull"
                element={<MarathonFull />}
              />
              <Route
                path="/tickets/marathons/marathonNew"
                element={<MarathonNew />}
              />
              <Route path="/tickets/decide/:id" element={<DecideId />} />
              <Route
                path="/tickets/decide/random/:id"
                element={<DecideRandom />}
              />
              <Route path="/tickets/themes/:id" element={<ThemesId />} />
            </Route>

            <Route element={<TopBar variant={"profile"} />}>
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          <Route path="/driving/city" element={<City />} />
          <Route path="/education/:course" element={<Lessons />} />
          <Route path="/tickets/exams" element={<Exams />} />
          <Route path="/tickets/decide" element={<Decide />} />
          <Route path="/tickets/themes" element={<Themes />} />
          <Route path="/tickets/marathons" element={<Marathons />} />
          <Route path="/driving/game" element={<Game />} />

          <Route path="/tickets/decide/share" element={<DecideShare />} />
          <Route
            path="/tickets/exam/:id/results/share"
            element={<ExamShare />}
          />
          <Route
            path="/tickets/marathons/:id/results/share"
            element={<MarathonShare />}
          />
          <Route
            path="/tickets/themes/:id/results/share"
            element={<ThemesShare />}
          />
        </Route>
        <Route element={<TelegramNavbar variant="BackResults" />}>
          <Route element={<TopBar variant="standard" />}>
            <Route element={<Navbar />}>
              <Route
                path="/tickets/decide/:id/results"
                element={<DecideResults />}
              />
              <Route
                path="/tickets/exams/:id/results"
                element={<ExamResults />}
              />
              <Route
                path="/tickets/marathons/marathonFull/:id/results"
                element={<MarathonResults />}
              />
              <Route
                path="/tickets/themes/:id/results"
                element={<ThemesResults />}
              />
            </Route>
          </Route>
        </Route>
        {/* Telegram открывает Mini App с #tgWebAppData=... — HashRouter считает это путём.
            Неизвестные пути ведём на главную, иначе белый экран. */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* </BrowserRouter> */}
    </HashRouter>
  </QueryClientProvider>,
);
