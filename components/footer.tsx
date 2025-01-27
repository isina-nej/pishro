import Link from "next/link";
import React from "react";
import Image from "next/image";

import {
  PiInstagramLogoThin,
  PiYoutubeLogoThin,
  PiWhatsappLogoThin,
} from "react-icons/pi";
import { CiLinkedin } from "react-icons/ci";
import { LiaTelegram } from "react-icons/lia";
import { SlSocialTwitter } from "react-icons/sl";
import { Input } from "./ui/input";

const Footer = () => {
  const socials = [
    {
      icon: <PiInstagramLogoThin />,
      link: "#",
    },
    {
      icon: <CiLinkedin />,
      link: "#",
    },
    {
      icon: <SlSocialTwitter />,
      link: "#",
    },
    {
      icon: <PiWhatsappLogoThin />,
      link: "#",
    },
    {
      icon: <LiaTelegram />,
      link: "#",
    },
    {
      icon: <PiYoutubeLogoThin />,
      link: "#",
    },
  ];
  return (
    <footer className="mt-32 mb-10 w-full container-xl">
      <div className="flex justify-between items-center w-full border-y py-8">
        <div className="flex-1 flex flex-col items-start">
          <div>
            <Image src={"/icons/Logo.png"} alt="logo" width={100} height={40} />
            <p className="mt-6 text-xs text-[#495157]">
              تلفن پشتیبانی: 021-23456789
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map((social, index) => (
                <Link
                  href={social.link}
                  key={index}
                  className="size-8 flex justify-center items-center rounded-[2px] border border-[#D7D7D7] hover:bg-myPrimary hover:border-myPrimary group"
                >
                  {React.cloneElement(social.icon, {
                    className: "size-5 text-[#80878C] group-hover:text-white",
                  })}
                </Link>
              ))}
            </div>
            <div className="mt-8">
              <p className="text-xs text-[#495157] mb-4">از مونت بروز باشید</p>
              <div className="mt-2 relative w-80 h-9">
                <Input
                  type="text"
                  placeholder="ایمیل خود را وارد کنید"
                  className="w-full h-9 rounded-[2px] border border-[#D7D7D7] text-xs px-2 pl-20"
                />
                <button className="absolute left-0 top-0 h-full px-4 bg-myPrimary text-white text-xs rounded-l-[2px]">
                  عضویت
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-1"></div>
        <div className="flex-1"></div>
      </div>
    </footer>
  );
};

export default Footer;
