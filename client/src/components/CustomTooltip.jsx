import { useState } from "react";

export default function CustomTooltip({ children, title }) {
  const [isHover, setIsHover] = useState(false);

  const handleMouseEnter = () => {
    setIsHover(true);
  };
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  return (
    <>
      <div
        className="relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}

        {isHover && (
          <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 -translate-y-full w-max max-w-[300px] bg-primary-700 text-white p-2 rounded-[8px]">
            {title}
            <div className="absolute left-1/2 bottom-0 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-primary-700 transform -translate-x-1/2 translate-y-full"></div>
          </div>
        )}
      </div>
    </>
  );
}
