import { Carousel, Card } from "@/components/ui/apple-cards-carousel";
import { useQuery } from "@tanstack/react-query";
import { TextGenerateEffect } from "./ui/text-generate-effect";
import { Skeleton } from "./ui/skeleton";

export function YoutubeContainer() {
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["youtube10videos"],
    queryFn: async () => {
      try {
        const response = await fetch("YOUR_YOUTUBE_API_URL", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log(response);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("10 videos", data);
        if (data) {
          const dataManage: any = [];

          data.map((video: any) => {
            dataManage.push({
              category: video.snippet.channelTitle,
              title: video.snippet.title,
              src: video.snippet.thumbnails.high.url,
              url: "https://www.youtube.com/watch?v=" + video.id.videoId,
            });
          });
          return dataManage;
        } else {
          throw new Error("Data not found");
        }
      } catch (error) {
        console.error(error);
      }
    },
    staleTime: 10 * 60 * 1000,
    refetchInterval: 10 * 60 * 1000,
    refetchIntervalInBackground: true,
    retry: 10,
  });

  let cards: any = [];
  if (isSuccess && !isLoading) {
    cards = data.map((card: any, index: number) => {
      return <Card key={index} card={card} index={index} />;
    });
  }

  {
    isLoading && (
      <div className="grid grid-cols-2 gap-4 items-center justify-center h-[400px]  px-4">
        <Skeleton className="h-[350px] w-full rounded-xl" />
        <Skeleton className="h-[350px] w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-hidden py-2">
      <h2 className="max-w-7xl mx-auto text-xl md:text-2xl font-bold text-neutral-800 dark:text-neutral-200 font-sans text-center underline">
        <TextGenerateEffect words="Mes récentes vidéos Youtube" />
      </h2>
      {isSuccess && <Carousel items={cards} />}
    </div>
  );
}
