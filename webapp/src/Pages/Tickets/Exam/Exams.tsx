import { reportRequestError } from '../../../lib/requestError';
import tickets from "../../../assets/Tickets/Exam/Tickets.svg";
import { NavbarIntermediate } from "../../../components/Modules/NavbarIntermediate";
import { Button } from "../../../components/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import arrowBack from "../../../assets/16/arrowBack.svg";
import questions from "../../../assets/Tickets/Exam/question.svg";
import time from "../../../assets/Tickets/Exam/time.svg";
import vector from "../../../assets/Tickets/Exam/vector.svg";

import { useEffect, useState } from "react";

import { examService } from "../../../services/exam.service";

export const Exams = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<{ _id: string } | null>(null);

  const handleStartExam = async () => {
    try {
      const response = await examService.startExam();
      setData(response);
    } catch (error) { reportRequestError(error); }
  };
  useEffect(() => {
    if (data) {
      navigate(`/tickets/exams/${data._id}`);
    }
  }, [data, navigate]);
  return (
    <div className="h-[60vh]">
      <div className="w-full h-full flex justify-center items-center px-4">
        <div className="border border-[#CCE3FF] w-full flex h-70 items-center justify-center flex-col text-[#CCE3FF]">
          <img src={tickets} alt="Tickets" />
          <p className="text-xl">Экзамен</p>
        </div>
      </div>

      <NavbarIntermediate className="bg-[#4B46A4] bottom-0 w-full flex flex-col items-baseline py-3 px-0 gap-5 h-[46%]">
        <div className="flex items-center justify-between w-full">
          <Button
            className="bg-gray-600 rounded-full py-2 px-3"
            onClick={() => navigate("/tickets")}
            variant="Icon"
          >
            <img src={arrowBack} alt="Back" width={10} height={12} />
          </Button>
          <div className="flex flex-col">
            <p className="text-2xl text-center">Режим экзамена</p>
            <p className="text-sm text-[#5C8EC6]">
              Повторяет условия реального экзамена
            </p>
          </div>
          <div></div>
        </div>
        <div className="flex w-full justify-between items-baseline px-6 gap-4 text-sm">
          <div className="flex flex-col items-start w-full">
            <img src={questions} alt="Questions" />
            <p>20 вопросов</p>
          </div>
          <div className="flex flex-col items-start w-full">
            <img src={time} alt="Time" />
            <p>20 минут</p>
          </div>
          <div className="flex flex-col items-start w-full">
            <img src={vector} alt="Vector" />
            <p>до 3-х ошибок + 5 вопросов за каждую ошибку</p>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="px-[20px] py-[15px] bg-[#d3d3d3] text-[#4B46A4] rounded-md w-full shadow-md shadow-[#868FBB]"
            onClick={handleStartExam}
          >
            Начать экзамен
          </Button>
        </div>
      </NavbarIntermediate>
    </div>
  );
};
