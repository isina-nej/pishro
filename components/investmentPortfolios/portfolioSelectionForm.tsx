"use client";

import dynamic from "next/dynamic";

const CalculatorSection = dynamic(
  () => import("@/components/home/calculatorSection"),
  { ssr: false }
);

const PortfolioSelectionForm = () => {
  return <CalculatorSection />;
};

export default PortfolioSelectionForm;
