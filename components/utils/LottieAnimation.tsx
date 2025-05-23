"use client";

import { useEffect, useRef } from "react";
import lottie from "lottie-web";

interface Props {
  path: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

const LottieRemote = ({
  path,
  loop = true,
  autoplay = true,
  className,
}: Props) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let anim: ReturnType<typeof lottie.loadAnimation>;

    fetch(path)
      .then((res) => res.json())
      .then((data) => {
        if (container.current) {
          anim = lottie.loadAnimation({
            container: container.current,
            renderer: "svg",
            loop,
            autoplay,
            animationData: data,
          });
        }
      });

    return () => {
      anim?.destroy();
    };
  }, [path, loop, autoplay]);

  return <div ref={container} className={className} />;
};

export default LottieRemote;
