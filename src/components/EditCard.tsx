import React, { useRef } from "react";
import { Flashcard } from "../types";
import { Button } from "./Button";
import { TextArea } from "./TextArea";

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
  const questionRef = useRef<HTMLTextAreaElement>(null);
  const answerRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = (ref: React.RefObject<HTMLTextAreaElement | null>) => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  };

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div className="h-[95%] w-full items-center flex flex-col gap-12">
        <TextArea
          className="text-center w-full break-words min-h-[80px]"
          ref={questionRef}
          value={flashcardToEdit.question}
          onInput={() => {
            if (questionRef) autoResize(questionRef);
          }}
          onChange={(e) =>
            setFlashcardToEdit((prev) =>
              prev ? { ...prev, question: e.target.value || "" } : null
            )
          }
        />
        <div className="w-full h-px bg-surface-elevated" />
        <TextArea
          className="text-center w-full break-words min-h-[80px]"
          ref={answerRef}
          value={flashcardToEdit.answer}
          onInput={() => autoResize(answerRef)}
          onChange={(e) =>
            setFlashcardToEdit((prev) =>
              prev ? { ...prev, answer: e.target.value || "" } : null
            )
          }
        />
      </div>
      <Button
        additionnalClassName="mt-4"
        onClick={() => {
          console.log("Saving flashcard:", flashcardToEdit);
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
