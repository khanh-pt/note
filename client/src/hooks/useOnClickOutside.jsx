import { useEffect } from "react";

export default function useOnClickOutside({ ref, handler }) {
  useEffect(() => {
    const handleClickOutside = (e) => {
      const element = ref?.current;
      if (!element || element.contains(e.target)) {
        console.log({ element });
        return;
      }
      handler(e);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [ref, handler]);
}
