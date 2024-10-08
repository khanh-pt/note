import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FolderItem({
  folder,
  setSelectedFolder,
  className,
  active,
}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setSelectedFolder(folder);
  };

  return (
    <>
      <div className={clsx(className)}>
        <div
          className={clsx(
            "p-1 rounded-[8px] cursor-pointer",
            active ? "bg-primary-200 text-primary-900" : "text-primary-200"
          )}
          onClick={handleClick}
        >
          {folder.title}
        </div>
      </div>
    </>
  );
}
