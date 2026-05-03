"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { LuLinkedin, LuMail, LuGraduationCap, LuTwitter } from "react-icons/lu";
import { FaTelegramPlane, FaWhatsapp } from "react-icons/fa";
import type { TeamMember } from "@/types/about-us";

interface TeamSectionProps {
  teamMembers: TeamMember[];
}

const TeamSection = ({ teamMembers }: TeamSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (teamMembers.length === 0) {
    return null;
  }

  return (
    <div ref={ref} className="container-md py-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          تیم <span className="text-myPrimary">پیشرو</span>
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          بنیانگذاران و رهبران آکادمی مالی پیشرو سرمایه
        </p>
      </motion.div>

      {/* Team Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            {/* Image Section */}
            {member.image && (
              <div className="relative h-80 overflow-hidden">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                {/* Name on Image */}
                <div className="absolute bottom-6 right-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                  <p className="text-white/90 font-medium">{member.role}</p>
                </div>
              </div>
            )}

            {/* Content Section */}
            <div className="p-8">
              {/* Name (if no image) */}
              {!member.image && (
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-1 text-gray-800">
                    {member.name}
                  </h3>
                  <p className="text-myPrimary font-medium">{member.role}</p>
                </div>
              )}

              {/* Education */}
              {member.education && (
                <div className="flex items-start gap-3 mb-6 bg-myPrimary/5 rounded-xl p-4">
                  <LuGraduationCap className="text-2xl text-myPrimary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800">
                      {member.education}
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              {member.description && (
                <p className="text-gray-600 leading-relaxed mb-6">
                  {member.description}
                </p>
              )}

              {/* Specialties */}
              {member.specialties.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-gray-800 mb-3 text-sm">
                    تخصص‌های کلیدی:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="bg-mySecondary/10 text-mySecondary px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {(member.linkedinUrl || member.emailUrl || member.twitterUrl || member.whatsappUrl || member.telegramUrl) && (
                <div className="flex flex-wrap gap-3 pt-6 border-t">
                  {member.linkedinUrl && (
                    <a
                      href={member.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[120px] bg-myPrimary/10 hover:bg-myPrimary text-myPrimary hover:text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                    >
                      <LuLinkedin />
                      <span>لینکدین</span>
                    </a>
                  )}
                  {member.emailUrl && (
                    <a
                      href={member.emailUrl}
                      className="flex-1 min-w-[120px] bg-mySecondary/10 hover:bg-mySecondary text-mySecondary hover:text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                    >
                      <LuMail />
                      <span>ایمیل</span>
                    </a>
                  )}
                  {member.twitterUrl && (
                    <a
                      href={member.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[120px] bg-blue-100 hover:bg-blue-500 text-blue-500 hover:text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                    >
                      <LuTwitter />
                      <span>توییتر</span>
                    </a>
                  )}
                  {member.whatsappUrl && (
                    <a
                      href={member.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[120px] bg-green-100 hover:bg-green-500 text-green-600 hover:text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                    >
                      <FaWhatsapp />
                      <span>واتساپ</span>
                    </a>
                  )}
                  {member.telegramUrl && (
                    <a
                      href={member.telegramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[120px] bg-sky-100 hover:bg-sky-500 text-sky-600 hover:text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 font-medium"
                    >
                      <FaTelegramPlane />
                      <span>تلگرام</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TeamSection;
