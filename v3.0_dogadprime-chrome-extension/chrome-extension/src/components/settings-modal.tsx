import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Settings } from "lucide-react";
import { Label } from "./ui/label";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export function SettingsModal() {
  const [storageData, setStorageData] = useState({
    twitchNotification: null, // Mettre à null pour signaler le chargement
    youtubeNotification: null, // Mettre à null pour signaler le chargement
  });

  const { isSuccess } = useQuery({
    queryKey: ["storageNotificationData"],
    queryFn: async () => {
      return new Promise((resolve, reject) => {
        try {
          chrome.runtime.sendMessage({ type: "GET_STORAGE" }, (response) => {
            console.log(response);
            setStorageData(response);
            resolve(response); // Résoudre la promesse
          });
        } catch (error) {
          console.error(error);
          reject(error); // Rejeter en cas d'erreur
        }
      });
    },
    refetchOnWindowFocus: false, // Désactiver le refetch à chaque focus de fenêtre
  });

  // Cette fonction est appelée pour modifier la notification Twitch
  const changeTwitchNotification = () => {
    // Envoi au background.js pour inverser la valeur de twitchNotification
    chrome.runtime.sendMessage(
      { type: "SET_STORAGE", data: { key: "twitchNotification" } },
      (response) => {
        if (response.success) {
          console.log("Twitch notification mise à jour :", response.newValue);

          // Mettre à jour l'état local avec la nouvelle valeur
          console.log("trigger");
          setStorageData((prevData) => ({
            ...prevData,
            twitchNotification: response.newValue,
          }));
        }
      }
    );
  };

  // Fonction pour changer la notification YouTube via le background.js
  const changeYoutubeNotification = () => {
    console.log("trigger");
    // Envoi au background.js pour inverser la valeur de youtubeNotification
    chrome.runtime.sendMessage(
      { type: "SET_STORAGE", data: { key: "youtubeNotification" } },
      (response) => {
        console.log(response);
        if (response.success) {
          console.log("YouTube notification mise à jour :", response.newValue);

          // Mettre à jour l'état local avec la nouvelle valeur
          setStorageData((prevData) => ({
            ...prevData,
            youtubeNotification: response.newValue,
          }));
        }
      }
    );
  };

  // Si les données ne sont pas encore chargées, on ne montre pas la modal
  if (
    !isSuccess ||
    storageData.twitchNotification === null ||
    storageData.youtubeNotification === null
  ) {
    return (
      <button
        type="button"
        disabled
        className="hover:rotate-180 transition-transform duration-500 absolute right-2 top-2 text-white"
      >
        <Settings />
      </button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="hover:rotate-180 transition-transform duration-500 absolute right-2 top-2 text-white"
        >
          <Settings />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Configuration de l'extension
          </DialogTitle>
          <DialogDescription className="text-sm italic">
            Sélectionnez quelle notification vous souhaitez recevoir.
          </DialogDescription>
        </DialogHeader>
        <div className="grid items-center justify-center gap-4 py-4 text-foreground font-montserrat">
          <div className="flex flex-row items-center justify-start gap-4">
            <Switch
              defaultChecked={storageData.twitchNotification} // Utiliser 'checked' au lieu de 'defaultChecked'
              onClick={changeTwitchNotification}
            />
            <Label htmlFor="theme">Twitch Notification</Label>
          </div>
          <div className="flex flex-row items-center justify-start gap-4">
            <Switch
              defaultChecked={storageData.youtubeNotification} // Utiliser 'checked' au lieu de 'defaultChecked'
              onClick={changeYoutubeNotification}
            />
            <Label htmlFor="theme">Youtube Notification</Label>
          </div>
        </div>
        <DialogFooter className="text-foreground flex flex-col text-xs text-center">
          <span>
            Copyright © {new Date().getFullYear()} DogadPrime All Rights
            Reserved.
          </span>
          <span>Created by ThomasWebDev</span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
