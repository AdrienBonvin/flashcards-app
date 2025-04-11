import { useState } from "react";
import { Button } from "./Button";
import { TextArea } from "./TextArea";
import { RoundButton } from "./RoundButton";

interface FlashcardAdderProps {
  addFlashcard: (question: string, answer: string) => void;
  setIsFlashcardAdderOpened: (isOpened: boolean) => void;
}

export const FlashcardAdder: React.FC<FlashcardAdderProps> = ({
  addFlashcard,
  setIsFlashcardAdderOpened,
}) => {
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  return (
    <>
      <TextArea
        value={newQuestion}
        onChange={(e) => setNewQuestion(e.target.value)}
        className="min-h-[10vh] min-w-[75vw] p-5"
        placeholder="Nouvelle question..."
      />
      <TextArea
        value={newAnswer}
        onChange={(e) => setNewAnswer(e.target.value)}
        className="min-h-[15vh] min-w-[75vw] p-5"
        placeholder="Réponse..."
      />
      <Button
        onClick={() => {
          addFlashcard(newQuestion, newAnswer);
          setNewQuestion("");
          setNewAnswer("");
        }}
        variant={"primary"}
      >
        Ajouter carte
      </Button>
      <RoundButton
        onClick={() => setIsFlashcardAdderOpened(false)}
        position="right"
      >
        X
      </RoundButton>
    </>
  );
};
