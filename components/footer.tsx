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
      <div className="flex justify-between items-start w-full border-y py-8">
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
              <p className="text-xs text-[#495157] mb-4">از پیشرو بروز باشید</p>
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
        <div className="flex-1 flex justify-start items-start gap-8">
          <div>
            <h6 className="text-sm mb-6">دسته بندی ها</h6>
            <ul className="flex flex-col gap-2 text-sm text-[#80878C]">
              <li>
                <Link href={"#"}>کریپتوکارنسی</Link>
              </li>
              <li>
                <Link href={"#"}>بورس</Link>
              </li>
              <li>
                <Link href={"#"}>متاورس</Link>
              </li>
              <li>
                <Link href={"#"}>NFT</Link>
              </li>
              <li>
                <Link href={"#"}>ایردراپ</Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="text-sm mb-6">خدمات مشتریان</h6>
            <ul className="flex flex-col gap-2 text-sm text-[#80878C]">
              <li>
                <Link href={"#"}>سوال دارید؟</Link>
              </li>
              <li>
                <Link href={"#"}>باشگاه مشتریان</Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="text-sm mb-6">راهنمای خرید</h6>
            <ul className="flex flex-col gap-2 text-sm text-[#80878C]">
              <li>
                <Link href={"#"}>شیوه ثبت سفارش</Link>
              </li>
              <li>
                <Link href={"#"}>شیوه های پرداخت</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-start items-end gap-8 h-full">
          <div className="max-w-[340px]">
            <h5 className="text-sm text-[#214254] mb-6">درباره پیشرو</h5>
            <p className="text-xs text-[#80878C]">
              لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با
              استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در
              ستون و سطرآنچنان که لازم است تا نمایشگرها آماده شوند. لورم ایپسوم
              متن ساختگی با تولید سادگی نامفهوم از صنعت است.
            </p>
          </div>
          <div className="flex justify-between w-full max-w-[340px] gap-1">
            <div className="flex justify-center items-center rounded-sm border border-[#BAC9CF] px-3 py-1.5">
              <Image
                src={"/images/e-namad.png"}
                alt="e-namad"
                width={60}
                height={60}
              />
            </div>
            <div className="flex justify-center items-center rounded-sm border border-[#BAC9CF] px-3 py-1.5">
              <Image
                src={"/images/united.png"}
                alt="united"
                width={60}
                height={60}
              />
            </div>
            <div className="flex justify-center items-center rounded-sm border border-[#BAC9CF] px-3 py-1.5">
              <Image
                src={"/images/samandehi.png"}
                alt="samandehi"
                width={60}
                height={60}
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
