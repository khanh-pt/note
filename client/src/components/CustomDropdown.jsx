import { useRef, useState } from "react";
import useOnClickOutside from "../hooks/useOnClickOutside";

export default function CustomDropdown({ children, items }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useOnClickOutside({ ref: dropdownRef, handler: () => setOpen(false) });

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className="relative cursor-pointer" onClick={handleClick}>
        {children}
        {open && (
          <div className="absolute w-full bg-[#eee] mt-3" ref={dropdownRef}>
            <ul>{items}</ul>
          </div>
        )}
      </div>
    </>
  );
}
