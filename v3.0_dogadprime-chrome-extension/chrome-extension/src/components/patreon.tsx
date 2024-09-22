"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";

type plan = "prime" | "ultime";

export const toHumanPrice = (price: number, decimals: number = 2) => {
  return Number(price / 100).toFixed(decimals);
};
const demoPrices = [
  {
    id: "price_1",
    name: "Prime",
    description: "A basic plan for startups and individual users",
    features: [
      "One Piece [Wano seulement d'upload]",
      "Tomodachi Game [Complet et upload]",
      "SNK [Saison 1 uniquement] Hunter x Hunter [Incomplet et upload]",
      "Vous aurez aussi accès aux FILMS tel que SPIDERMAN 1 et 2 etc...",
    ],
    monthlyPrice: 300,
    yearlyPrice: 10000,
    isMostPopular: true,
    isUltimate: false,
  },
  {
    id: "price_2",
    name: "Ultime",
    description: "A basic plan for startups and individual users",
    features: [
      "Contient toutes les fonctionnalités du Prime",
      "ONE PIECE [WANO] + REACT DES SCANS",
      "TOUS LES FILMS + FILMS D'ANIMATIONS",
      "SNK [Complet et en cours d'upload]",
      "Toute les séries : Game of Thrones ...",
    ],
    monthlyPrice: 500,
    yearlyPrice: 10000,
    isMostPopular: true,
    isUltimate: true,
  },
];

export function Patreon() {
  const [plan] = useState<plan>("prime");
  const [isLoading] = useState(false);
  const [id] = useState<string | null>(null);

  return (
    <section id="pricing">
      <div className="mx-auto h-full flex max-w-screen-xl flex-col gap-2 py-4 px-4 md:px-8">
        <div className="mx-auto grid w-full justify-center gap-4  grid-cols-2 lg:grid-cols-4">
          {demoPrices.map((price, idx) => (
            <div
              key={price.id}
              className={cn(
                " relative flex h-auto w-full  max-w-[400px] flex-col gap-4 overflow-hidden rounded-2xl border p-4 text-black dark:text-white",
                {
                  "border-2 border-neutral-700 shadow-lg shadow-neutral-500 dark:border-neutral-400 dark:shadow-neutral-600":
                    price.isMostPopular,
                }
              )}
            >
              <div className="flex items-center">
                <div className="flex w-full items-center justify-between gap-2">
                  <h2 className="text-base font-semibold">{price.name}</h2>

                  <Badge key={price.id} className="animate-pulse">
                    {price.id === "price_1" ? "Anime" : "Game of Thrones"}
                  </Badge>
                </div>
              </div>

              <motion.div
                key={`${price.id}-${plan}`}
                initial="initial"
                animate="animate"
                variants={{
                  initial: {
                    opacity: 0,
                    y: 12,
                  },
                  animate: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + idx * 0.05,
                  ease: [0.21, 0.47, 0.32, 0.98],
                }}
                className="flex flex-row gap-1"
              >
                <span className="text-4xl font-bold text-black dark:text-white">
                  {toHumanPrice(price.monthlyPrice, 2)}€
                </span>
              </motion.div>

              <a
                className={cn(
                  buttonVariants({
                    variant: "default",
                  }),
                  "group relative w-full gap-2 p-4 overflow-hidden text-lg font-semibold tracking-tighter",
                  "transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2"
                )}
                target="_blank"
                href="https://www.patreon.com/doga256/membership"
              >
                <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform-gpu bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-96 dark:bg-black" />
                {(!isLoading || (isLoading && id !== price.id)) && (
                  <p>S'abonner</p>
                )}

                {isLoading && id === price.id && <p>Subscribing</p>}
                {isLoading && id === price.id && (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                )}
              </a>

              <hr className="m-0 h-px w-full border-none bg-gradient-to-r from-neutral-200/0 via-neutral-500/30 to-neutral-200/0" />
              {price.features && price.features.length > 0 && (
                <ul className="flex flex-col gap-2 font-normal">
                  {price.features.map((feature: any, idx: any) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-xs font-medium text-black dark:text-white"
                    >
                      <CheckIcon className="h-5 w-5 shrink-0 rounded-full bg-green-400 p-[2px] text-black dark:text-white" />
                      <span className="flex">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
