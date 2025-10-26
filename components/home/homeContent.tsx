"use client";

import LandingOverlay from "./landingOverlay";
import MobileScrollSection from "./mobileScrollSection";
import CalculatorSection from "./calculatorSection";
import BikeSection from "./bikeSection";
import Courses from "@/components/utils/Courses";
import CommentsSlider from "@/components/utils/CommentsSlider";
import NewsClub from "./newsClub";

const HomePageContent = () => {
  return (
    <div className="w-full">
      <LandingOverlay />
      <MobileScrollSection />
      <CalculatorSection />
      <BikeSection />
      <Courses />
      <CommentsSlider />
      <NewsClub />
    </div>
  );
};

export default HomePageContent;
