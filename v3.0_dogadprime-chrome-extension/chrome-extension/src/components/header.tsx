import { useQuery } from "@tanstack/react-query";
import { SettingsModal } from "./settings-modal";
import { Badge } from "./ui/badge";

export const Header = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["isOnline"],
    queryFn: async () => {
      return new Promise((resolve, reject) => {
        // Envoi du message au background script
        chrome.runtime.sendMessage(
          { type: "IS_ONLINE", data: { key: "isOnline" } },
          (response) => {
            if (chrome.runtime.lastError) {
              // Si une erreur survient dans la communication
              reject(chrome.runtime.lastError);
            } else {
              // Résoudre la promesse avec la valeur true ou false
              resolve(response.isOnline);
            }
          }
        );
      });
    },
    staleTime: 1 * 60 * 1000, // Durée avant que les données ne soient périmées
    refetchInterval: 0.2 * 60 * 1000, // Rafraîchir toutes les 12 secondes
    retry: 5, // Nombre de tentatives en cas d'échec
  });
  console.log(data);

  return (
    <div className="w-full h-auto  relative shadow-xl py-1 flex items-center justify-center ">
      <div className="flex flex-row items-center justify-center text-2xl font-semibold w-full h-full ">
        <div className="relative backdrop-blur-[12px] overflow-hidden border rounded-full p-1  border-[#ffbd7a]">
          <img
            src="/icons/popup_icon.png"
            alt="popup_icon.png"
            className="w-16 h-16 object-cover z-10"
          />
          <img
            src="/icons/popup_icon.png"
            alt="popup_icon.png"
            className="w-24 h-24  absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl object-cover"
          />
        </div>
      </div>

      {!isLoading ? (
        <a href="https://twitch.tv/dogadprime" target="_blank">
          <Badge
            variant={data ? "success" : "destructive"}
            className="animate-pulse absolute top-2 left-2"
          >
            {data ? "Online" : "Offline"}
          </Badge>
        </a>
      ) : null}

      <SettingsModal />
    </div>
  );
};
