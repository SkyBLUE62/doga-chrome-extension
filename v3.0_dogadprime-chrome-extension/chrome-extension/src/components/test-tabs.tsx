import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { YoutubeContainer } from "./youtube-container";
// const TwitchEmbed = lazy(() => import("./twitch-embed"));
import { Patreon } from "./patreon";
// import { Loader } from "lucide-react";

interface NavItem {
  name: string;
  href: string;
}

const navs: NavItem[] = [
  { name: "youtube", href: "#home" },
  // { name: "twitch", href: "#about" },
  { name: "patreon", href: "#about" },
];

export function TestTabs() {
  const [activeTab, setActiveTab] = useState<string>("youtube");

  return (
    <>
      <div className="w-full h-[7vh]  font-montserrat">
        <div
          className={cn("mx-auto flex w-full items-center justify-center px-2")}
        >
          <div className=" w-full relative grid grid-cols-2 items-center justify-around p-1.5">
            {navs.map((option) => (
              <button
                key={option.name}
                onClick={() => setActiveTab(option.name)}
                className={cn(
                  "relative z-[1] px-4 py-2 first-letter:uppercase",
                  {
                    "z-0": activeTab === option.name,
                  }
                )}
              >
                {activeTab === option.name && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0  rounded-full w-full bg-[#37ecba]"
                    transition={{
                      duration: 0.2,
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      velocity: 2,
                    }}
                  />
                )}
                <span
                  className={cn(
                    "relative block text-sm font-medium transition-colors duration-200 hover:text-primary tracking-tight",
                    activeTab === option.name
                      ? "text-background"
                      : "text-primary/60"
                  )}
                >
                  {option.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="z-[1]">
          {activeTab == "youtube" && <YoutubeContainer />}
          {/* {activeTab == "twitch" && (
            <Suspense
              fallback={
                <div className="flex items-center justify-center h-full w-full">
                  <Loader className="w-8 h-8 animate-spin text-[#37ecba]" />
                </div>
              }
            >
              <TwitchEmbed channel="dogadprime" />
            </Suspense>
          )} */}
          {activeTab == "patreon" && <Patreon />}
        </div>
      </div>
    </>
  );
}
