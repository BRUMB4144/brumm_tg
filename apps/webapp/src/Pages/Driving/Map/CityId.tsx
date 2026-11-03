import { useParams } from "react-router-dom";
import Container from "../../../components/Layouts/Container/Container";
import { useEffect, useState } from "react";
import { PathWay } from "../../../services/pathWay.service";
import { Skeleton } from "@radix-ui/themes";

export const CityId = () => {
  const { id } = useParams<{ id: string }>();
  const [videoSources, setVideoSources] = useState<string[]>([]);
  const [town, setTown] = useState<{
    _id: string;
    town: string;
    videoUrl: string | string[];
    __v: number;
  } | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await PathWay.getPathWays();
        const foundTown = response.find(
          (item: { _id: string; town: string }) => item._id === id
        );
        setTown(foundTown || null);
      } catch (error) {
        console.error("Error loading data:", error);
        setTown(null);
      }
    };

    fetchRoute();
  }, [id]);

  useEffect(() => {
    const fetchVideoSources = async () => {
      if (!town?.videoUrl) return;

      const urls = Array.isArray(town.videoUrl)
        ? town.videoUrl
        : [town.videoUrl];

      const sources = await Promise.all(
        urls.map(async (url) => {
          try {
            const videoUrl = new URL(url);

            if (videoUrl.hostname.includes("rutube.ru")) {
              const pathParts = videoUrl.pathname
                .split("/")
                .filter((part) => part);
              const videoId = pathParts[pathParts.length - 1];
              const query = videoUrl.search;
              return `https://rutube.ru/play/embed/${videoId}${query}`;
            }
            return url;
          } catch (error) {
            console.error("Error processing video URL:", error);
            return null;
          }
        })
      );

      setVideoSources(
        sources.filter((source): source is string => source !== null)
      );
    };

    fetchVideoSources();
  }, [town]);

  return (
    <Container>
      <div className="flex flex-col gap-2">
        <p className="text-[var(--blueAccent)] text-md">
          Экзаменационные маршруты
        </p>
        {town ? (
          <p className="text-2xl">{town.town}</p>
        ) : (
          <div className="overflow-x-hidden rounded-3xl">
            <Skeleton loading={true} width="402px" height="39px" />
          </div>
        )}

        <div className="flex flex-col gap-2 w-full">
          {videoSources.length > 0 ? (
            <div>
              {videoSources.map((src, index) => (
                <div key={index} className="flex-shrink-0 w-full h-[200px]">
                  <iframe
                    src={src}
                    allow="clipboard-write; autoplay"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-hidden rounded-3xl">
              <Skeleton loading={true} width="402px" height="200px" />
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};
