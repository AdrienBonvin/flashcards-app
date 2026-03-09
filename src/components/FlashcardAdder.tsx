import { useState } from "react";
import { Button } from "./Button";
import { TextArea } from "./TextArea";

interface FlashcardAdderProps {
  addFlashcard: (question: string, answer: string) => void;
}

export const FlashcardAdder: React.FC<FlashcardAdderProps> = ({
  addFlashcard,
}) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCardCounter, setNewCardCounter] = useState<number>(0);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-lg">
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
      />
      <TextArea
        value={newAnswer}
        onChange={(e) => setNewAnswer(e.target.value)}
        className="min-h-[12vh] min-w-full py-4 px-5"
        placeholder="Réponse..."
      />
      <Button
        onClick={() => {
          addFlashcard(newQuestion, newAnswer);
          setNewCardCounter((prev) => prev + 1);
          setNewQuestion("");
          setNewAnswer("");
        }}
        onTouchStart={(e) => e.preventDefault()}
        variant="primary"
        additionnalClassName="w-full"
      >
        Ajouter la carte
      </Button>
    </div>
  );
};
