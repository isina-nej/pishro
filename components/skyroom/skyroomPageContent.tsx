"use client";

import { motion } from "motion/react";
import { HiUsers, HiArrowLeft } from "react-icons/hi";
import Link from "next/link";
import { useVisibility } from "@/components/site/VisibilityProvider";

interface SkyRoomPageContentProps {
  meetingLink: string | null;
}

const SkyRoomPageContent: React.FC<SkyRoomPageContentProps> = ({
  meetingLink,
}) => {
  const { show } = useVisibility();
  if (!show("skyroom:landing")) {
    return null;
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[url('/images/home/c/main.webp')] bg-cover bg-center">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/home/c/main.webp"
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/aboutUs.webm" type="video/webm" />
        </video>
      </div>
      <div className="absolute inset-0 bg-background/40 pointer-events-none z-0"></div>
      {/* Dark Shadow Overlay */}
      <div className="absolute inset-0 bg-background/50 shadow-2xl pointer-events-none z-1" style={{
        boxShadow: "inset 0 80px rgba(0, 0, 0.8), 120px 0.6)"
      }}></div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-destructive/20 pointer-events-none z-0">
        {/* Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
            animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl"
            animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-destructive/10 rounded-full blur-3xl"
            animate={{ x: [0, 50, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
            className="inline-flex items-center justify-center size-24 mb-6 rounded-full border border-border/20 bg-card/10 text-primary-foreground backdrop-blur-md"
          >
            <HiUsers className="text-5xl" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-4 drop-shadow-2xl">
            همایش آنلاین
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-foreground/90 max-w-2xl mx-auto"
          >
            به همایش ما خوش آمدید
          </motion.p>
        </motion.div>

        {/* Button Section */}
        {meetingLink ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative group"
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-destructive rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse" />

            <Link
              href={meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden rounded-2xl border border-border/20 bg-card/10 px-12 py-6 text-primary-foreground shadow-2xl backdrop-blur-xl group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-card/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="relative flex items-center gap-4">
                  <span className="text-2xl md:text-3xl font-bold drop-shadow-lg">
                    ورود به همایش
                  </span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <HiArrowLeft className="text-3xl text-foreground" />
                  </motion.div>
                </div>
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative rounded-2xl border border-border/20 bg-card/10 px-12 py-6 text-primary-foreground shadow-2xl backdrop-blur-xl"
          >
            <p className="text-xl md:text-2xl text-foreground/80">
              در حال حاضر همایشی برگزار نمی‌شود
            </p>
          </motion.div>
        )}

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 text-foreground/60 text-sm"
        >
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            پیشرو - پلتفرم آموزش آنلاین
          </motion.div>
        </motion.div>
      </div>

      {/* Grain Overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
    </div>
  );
};

export default SkyRoomPageContent;
