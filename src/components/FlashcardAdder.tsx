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
    <>
      <p className="font-extrabold text-4xl">Ajouter une carte</p>
      <p>
        Carte ajoutées :
        <b className="text-contrast font-bold pl-2">{newCardCounter}</b>
      </p>
      <TextArea
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        className="min-h-[15vh] min-w-[75vw] sm:min-w-[50vw] lg:min-w-[25vw] py-3 px-6"
        placeholder="Nouvelle question ?"
      />
      <TextArea
        value={newAnswer}
        onChange={(e) => setNewAnswer(e.target.value)}
        className="min-h-[15vh] min-w-[75vw] sm:min-w-[50vw] lg:min-w-[25vw] py-3 px-6"
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
        variant={"primary"}
      >
        Ajouter carte
      </Button>
    </>
  );
};
