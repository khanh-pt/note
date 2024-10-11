import { useState } from "react";
import NoteList from "./NoteList";
import FolderItem from "./FolderItem";

export default function FolderList() {
  const [selectedFolder, setSelectedFolder] = useState(null);

  const handleClick = () => {
    setOpen(!open);
  };

  const folders = [
    { id: 1, title: "Folder 1" },
    { id: 2, title: "Folder 2" },
    { id: 3, title: "Folder 3" },
  ];

  return (
    <>
      <div className="flex gap-3">
        <div className="w-[200px] p-2 bg-primary-600 rounded-[8px]">
          <div className="font-bold p-1 border-b mb-2">Folder</div>
          {!!folders?.length &&
            folders.map((folder) => (
              <FolderItem
                key={folder.id}
                folder={folder}
                setSelectedFolder={setSelectedFolder}
                active={selectedFolder?.id === folder.id}
              />
            ))}
        </div>
        <div className="grow">
          {selectedFolder && <NoteList folder={selectedFolder} />}
        </div>
      </div>
    </>
  );
}
