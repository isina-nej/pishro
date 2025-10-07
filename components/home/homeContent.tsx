"use client";

import LandingOverlay from "./landingOverlay";
import BikeSection from "./bikeSection";
import MobileScrollSection from "./mobileScrollSection";
import Courses from "./courses";
import CommentsSlider from "@/components/utils/CommentsSlider";
import StepsSection from "./stepsSection";
import { stepsData } from "@/public/data";
import NewsClub from "./newsClub";
import SnapSingleSection from "../utils/SnapSingleSection";

const HomePageContent = () => {
  return (
    <div className="w-full">
      <LandingOverlay />

      <SnapSingleSection>
        <BikeSection />
      </SnapSingleSection>
      <SnapSingleSection>
        <MobileScrollSection />
      </SnapSingleSection>
      <SnapSingleSection>
        <Courses />
      </SnapSingleSection>
      <SnapSingleSection>
        <StepsSection {...stepsData} />
      </SnapSingleSection>
      <SnapSingleSection>
        <CommentsSlider />
      </SnapSingleSection>
      <SnapSingleSection>
        <NewsClub />
      </SnapSingleSection>
    </div>
  );
};

export default HomePageContent;
