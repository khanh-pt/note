import { useState } from "react";
import NoteItem from "./NoteItem";
import CustomEditor from "./CustomEditor";

export default function NoteList({ folder }) {
  const [selectedNote, setSelectedNote] = useState(null);

  const handleClick = () => {
    setOpen(!open);
  };

  const notes = [
    { id: 1, title: "Note 1", content: "<p>1</p>" },
    { id: 2, title: "Note 2", content: "<p>2</p>" },
    { id: 3, title: "Note 3", content: "<p>3</p>" },
  ];

  return (
    <>
      <div className="flex gap-3">
        <div className="w-[200px] p-2 bg-primary-600 rounded-[8px]">
          {!!notes?.length &&
            notes.map((note) => (
              <NoteItem
                key={note.id}
                note={note}
                setSelectedNote={setSelectedNote}
                active={selectedNote?.id === note.id}
              />
            ))}
        </div>
        <div className="grow">
          {/* {selectedNote && <CustomEditor defaultValue={selectedNote.content} />} */}
          {selectedNote && <CustomEditor />}
        </div>
      </div>
    </>
  );
}
