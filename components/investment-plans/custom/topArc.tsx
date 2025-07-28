// components/ui/TopArc.tsx
const TopArc = () => {
  return (
    <div className="relative z-10">
      <svg
        viewBox="0 0 1440 100"
        className="w-full h-[200px]"
        preserveAspectRatio="none"
      >
        <path
          fill="#00000099"
          d="M0,100 C360,0 1080,0 1440,100 L1440,100 L0,100 Z"
        />
      </svg>
    </div>
  );
};

export default TopArc;
