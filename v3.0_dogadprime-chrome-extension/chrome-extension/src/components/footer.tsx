import { motion } from "framer-motion";
import { FaTwitter, FaTwitch, FaInstagram, FaYoutube } from "react-icons/fa";

export const Footer = () => {
  const iconsLinks = [
    {
      icon: <FaTwitter className="size-6" />,
      url: "https://x.com/DogaShinobi",
    },
    {
      icon: <FaTwitch className="size-6" />,
      url: "https://twitch.tv/dogadprime",
    },
    {
      icon: <FaInstagram className="size-6" />,
      url: "https://www.instagram.com/doga_d_doga/",
    },
    {
      icon: <FaYoutube className="size-6" />,
      url: "https://www.youtube.com/@dogaDprime",
    },
  ];

  return (
    <footer className="absolute bottom-0 w-full h-[50px] overflow-hidden grid grid-cols-2 bg-background/80  font-montserrat ">
      <div className="w-full h-full flex items-center justify-center gap-8 text-[#37ecba]">
        {iconsLinks.map((link, index) => (
          <motion.a
            variants={{
              hidden: {
                opacity: 0,
                y: 100,
              },
              visible: {
                opacity: 1,
                y: 0,
              },
            }}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            key={link.url}
            href={link.url}
            target="_blank"
            className="flex items-center justify-center uppercase text-lg font-semibold text-background text-white hover:text-[#37ecba] transition-colors duration-300"
          >
            {link.icon}
          </motion.a>
        ))}
      </div>

      <motion.a
        variants={{
          hidden: {
            width: 0,
            x: "100%",
          },
          visible: {
            width: "100%",
            x: 0,
          },
        }}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.5, delay: 0.5 }}
        href="https://dogadprime.com"
        target="_blank"
        className="w-full h-full flex items-center justify-center uppercase text-lg font-semibold bg-[#37ecba] text-background hover:text-white transition-colors duration-500 relative"
      >
        <motion.span
          variants={{
            hidden: {
              opacity: 0,
              x: 100,
            },
            visible: {
              opacity: 1,
              x: 0,
            },
          }}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          dogadprime.com
        </motion.span>
      </motion.a>
    </footer>
  );
};
