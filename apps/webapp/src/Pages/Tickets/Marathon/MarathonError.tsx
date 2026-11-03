import { useState, useEffect } from "react";
import Container from "../../../components/Layouts/Container/Container";
import { ErrorCard } from "../../../components/Layouts/ErrorCard/ErrorCard";
import { examService } from "../../../services/exam.service";
import { useParams } from "react-router-dom";

export const MarathonError = () => {
  const [data, setData] = useState(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const progress = async () => {
      try {
        const result = await examService.marathonResult(id);
        setData(result);
        console.log("Marathon result:", result);
      } catch (error) {
        console.error("Failed to fetch marathon result:", error);
      }
    };
    progress();
  }, [id]);
  const getImageUrl = (imageUrl: string): string => {
    return imageUrl.startsWith("https://storage.watbot.ru") ? "" : imageUrl;
  };
  return (
    <Container>
      <div className="flex flex-col mt-4 gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-[#3942CF]">Марафон</p>
          <h1 className="leading-9 text-4xl">
            Допущенные <br /> ошибки
          </h1>
        </div>
        {data?.questionsProgress?.mistakesDetails?.length > 0 ? (
          data.questionsProgress.mistakesDetails.map((item) => (
            <ErrorCard
              key={item._id}
              img={getImageUrl(item?.imageUrl || "")}
              title={item.questionText}
              error={item.selectedOption}
              right={item.correctOption}
              analysis={item?.hint || ""}
            />
          ))
        ) : (
          <p>Нет данных об ошибках.</p>
        )}
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </Container>
  );
};
