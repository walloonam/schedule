"use client";

type DeleteEventButtonProps = {
  title: string;
};

export function DeleteEventButton({ title }: DeleteEventButtonProps) {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const confirmed = window.confirm(`"${title}" 일정을 정말 삭제할까요?`);

    if (!confirmed) {
      event.preventDefault();
    }
  };

  return (
    <button
      type="submit"
      onClick={handleClick}
      className="rounded-full bg-[#2b211a] px-4 py-2 text-sm text-white"
    >
      Delete
    </button>
  );
}
