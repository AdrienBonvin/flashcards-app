import React, { useEffect, useRef } from "react";
import { Flashcard } from "../types";
import { Button } from "./Button";
import { TextArea } from "./TextArea";

interface EditCardProps {
  flashcardToEdit: Flashcard;
  setFlashcardToEdit: React.Dispatch<React.SetStateAction<Flashcard | null>>;
  updateFlashcard: (flashcard: Flashcard) => void;
}

const autoResize = (textarea: HTMLTextAreaElement | null) => {
  if (!textarea) return;
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
};

const EditCard: React.FC<EditCardProps> = ({
  flashcardToEdit,
  setFlashcardToEdit,
  updateFlashcard,
}) => {
  const questionRef = useRef<HTMLTextAreaElement>(null);
  const answerRef = useRef<HTMLTextAreaElement>(null);

  // Ajuste la hauteur au contenu dès l'ouverture, pas seulement à la frappe
  useEffect(() => {
    autoResize(questionRef.current);
    autoResize(answerRef.current);
  }, []);

  const canSubmit =
    flashcardToEdit.question.trim() !== "" && flashcardToEdit.answer.trim() !== "";

  return (
    <form
      className="h-full w-full flex flex-col justify-between"
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        updateFlashcard(flashcardToEdit);
        setFlashcardToEdit(null);
      }}
    >
      <div className="w-full items-center flex flex-col gap-6">
        <label className="w-full flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Question
          </span>
          <TextArea
            className="text-center w-full break-words min-h-[80px]"
            ref={questionRef}
            value={flashcardToEdit.question}
            autoFocus
            required
            onInput={(e) => autoResize(e.currentTarget)}
            onChange={(e) =>
              setFlashcardToEdit((prev) =>
                prev ? { ...prev, question: e.target.value } : null
              )
            }
          />
        </label>
        <div className="w-full h-px bg-surface-elevated" />
        <label className="w-full flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted">
            Réponse
          </span>
          <TextArea
            className="text-center w-full break-words min-h-[80px]"
            ref={answerRef}
            value={flashcardToEdit.answer}
            required
            onInput={(e) => autoResize(e.currentTarget)}
            onChange={(e) =>
              setFlashcardToEdit((prev) =>
                prev ? { ...prev, answer: e.target.value } : null
              )
            }
          />
        </label>
      </div>
      <Button
        type="submit"
        disabled={!canSubmit}
        additionnalClassName="mt-6"
        variant="primary"
      >
        Enregistrer
      </Button>
    </form>
  );
};

export default EditCard;
