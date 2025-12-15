"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { HiUsers, HiArrowLeft } from "react-icons/hi";
import Link from "next/link";

interface SkyRoomPageContentProps {
  meetingLink: string | null;
}

const SkyRoomPageContent: React.FC<SkyRoomPageContentProps> = ({
  meetingLink,
}) => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image Layer with Next.js Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/skyroom/landing.jpg"
          alt="Skyroom Background"
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/70 pointer-events-none z-0"></div>

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-purple-950/20 to-pink-950/20 pointer-events-none z-0">
        {/* Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            animate={{ x: [0, -100, 0], y: [0, 100, 0], scale: [1, 1.3, 1] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
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
            className="inline-flex items-center justify-center size-24 mb-6 bg-white/10 backdrop-blur-md rounded-full border border-white/20"
          >
            <HiUsers className="text-5xl text-white" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 drop-shadow-2xl">
            همایش آنلاین
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto"
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
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse" />

            <Link
              href={meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative px-12 py-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                <div className="relative flex items-center gap-4">
                  <span className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                    ورود به همایش
                  </span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <HiArrowLeft className="text-3xl text-white" />
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
            className="relative px-12 py-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl"
          >
            <p className="text-xl md:text-2xl text-white/80">
              در حال حاضر همایشی برگزار نمی‌شود
            </p>
          </motion.div>
        )}

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-8 text-white/60 text-sm"
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
