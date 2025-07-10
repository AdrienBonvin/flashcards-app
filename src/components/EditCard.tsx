import React from "react";
import { Flashcard } from "../types";
import { Button } from "./Button";

interface EditCardProps {
  flashcardToEdit: Flashcard;
  setFlashcardToEdit: React.Dispatch<React.SetStateAction<Flashcard | null>>;
  updateFlashcard: (flashcard: Flashcard) => void;
}

const EditCard: React.FC<EditCardProps> = ({
  flashcardToEdit,
  setFlashcardToEdit,
  updateFlashcard,
}) => {
  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div className=" h-full w-full items-center flex flex-col gap-12">
        <p
          contentEditable
          suppressContentEditableWarning
          className="outline-none text-center overflow-y-auto break-words text-xl w-full whitespace-pre-line"
          onBlur={(e) =>
            setFlashcardToEdit((prev: Flashcard | null) =>
              prev
                ? {
                    ...prev,
                    question: e.target.textContent || "",
                  }
                : null
            )
          }
        >
          {flashcardToEdit.question}
        </p>
        <p className="text-center text-gray-500">
          _____________________________
        </p>
        <p
          contentEditable
          suppressContentEditableWarning
          className="outline-none text-center overflow-y-auto break-words text-xl w-full whitespace-pre-line"
          onBlur={(e) =>
            setFlashcardToEdit((prev: Flashcard | null) =>
              prev ? { ...prev, answer: e.target.textContent || "" } : null
            )
          }
        >
          {flashcardToEdit.answer}
        </p>
      </div>
      <Button
        additionnalClassName="mt-4"
        onClick={() => {
          if (flashcardToEdit) updateFlashcard(flashcardToEdit);
          setFlashcardToEdit(null);
        }}
        variant={"primary"}
      >
        Save
      </Button>
    </div>
  );
};

export default EditCard;
