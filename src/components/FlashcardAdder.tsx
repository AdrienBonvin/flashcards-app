import { useState } from "react";

interface FlashcardAdderProps {
    addFlashcard: (question: string, answer: string) => void;

}

export const FlashcardAdder: React.FC<FlashcardAdderProps> = ({
    addFlashcard,
}) => {
    
      const [newQuestion, setNewQuestion] = useState('');
      const [newAnswer, setNewAnswer] = useState('');
         return (<><input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="New Question"
          />
          <input
            type="text"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="New Answer"
          />
          <button onClick={() => {
            addFlashcard(newQuestion, newAnswer)
            setNewQuestion('');
            setNewAnswer('');
          }}>Add Flashcard</button></>)}