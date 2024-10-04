import clsx from "clsx";

export default function NoteItem({ note, setSelectedNote, className, active }) {
  const handleClick = () => {
    setSelectedNote(note);
  };

  return (
    <>
      <div className={className} onClick={handleClick}>
        <div
          className={clsx(
            "p-1 rounded-[8px] cursor-pointer",
            active ? "bg-primary-200 text-primary-900" : "text-primary-200"
          )}
        >
          {note.title}
        </div>
      </div>
    </>
  );
}
