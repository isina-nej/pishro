"use client";
import { ReactNode } from "react";

const SnapSection = ({
  id,
  children,
}: {
  id?: string;
  children: ReactNode;
}) => {
  return (
    <div id={id} className="min-h-screen w-full">
      {children}
    </div>
  );
};

export default SnapSection;
