import { useState } from "react";
import { Button } from "./Button";
import { TextArea } from "./TextArea";

interface FlashcardAdderProps {
  /** Rejette (throw) si l'enregistrement échoue */
  addFlashcard: (question: string, answer: string) => Promise<void>;
}

export const FlashcardAdder: React.FC<FlashcardAdderProps> = ({
  addFlashcard,
}) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCardCounter, setNewCardCounter] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const canSubmit = newQuestion.trim() !== "" && newAnswer.trim() !== "";

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isSaving) return;
    setIsSaving(true);
    try {
      await addFlashcard(newQuestion, newAnswer);
      setNewCardCounter((prev) => prev + 1);
      setNewQuestion("");
      setNewAnswer("");
    } catch {
      // L'erreur est affichée par le contexte (toast) ; on garde la saisie
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col items-center gap-5 w-full max-w-lg"
    >
      <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary">
        Ajouter une carte
      </h2>
      <p className="text-muted text-sm">
        Cartes ajoutées :{" "}
        <span className="text-contrast font-bold">{newCardCounter}</span>
      </p>
      <TextArea
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        className="min-h-[12vh] min-w-full py-4 px-5"
        placeholder="Nouvelle question ?"
        aria-label="Question"
        required
      />
      <TextArea
        value={newAnswer}
        onChange={(e) => setNewAnswer(e.target.value)}
        className="min-h-[12vh] min-w-full py-4 px-5"
        placeholder="Réponse..."
        aria-label="Réponse"
        required
      />
      <Button
        type="submit"
        disabled={!canSubmit || isSaving}
        variant="primary"
        additionnalClassName="w-full"
      >
        {isSaving ? "Ajout…" : "Ajouter la carte"}
      </Button>
    </form>
  );
};
