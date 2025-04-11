import { useState } from "react";
import { Flashcard } from "../types";
import { Button } from "./Button";
import { RoundButton } from "./RoundButton";

interface FlashcardReviewerProps {
  flashcard: Flashcard;
  flashcardsCounter: number;
  flashcardInitialCount: number;
  markAsReviewed: (flashcard: Flashcard) => void;
  markAsFailed: (id: string) => void;
  setIsFlashcardReviewOpened: (isOpened: boolean) => void;
}

export const FlashcardReviewer: React.FC<FlashcardReviewerProps> = ({
  flashcard,
  flashcardsCounter,
  flashcardInitialCount,
  markAsReviewed,
  markAsFailed,
  setIsFlashcardReviewOpened,
}) => {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const progressPercentage =
    ((flashcardInitialCount - flashcardsCounter) / flashcardInitialCount) * 100;

  return (
    <div className="flex flex-col items-center align-middle justify-center h-[70vh] w-[80vw] p-2 bg-grey-600">
      <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-contrast"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="text-center font-extrabold text-3xl my-10">
        {flashcard.question}
      </div>
      <button
        className="w-[95vw] h-[50vh] text-2xl font-bold"
        onClick={() => setIsAnswerVisible(true)}
      >
        {isAnswerVisible && (
          <div className="flex flex-col items-center justify-between h-full">
            <p className="text-center">______________________________</p>
            <div className="text-center">{flashcard.answer}</div>
            <div className="flex flex-row justify-evenly w-full">
              <Button
                onClick={() => {
                  markAsReviewed(flashcard);
                }}
                variant={"primary"}
              >{`GOOD ${flashcard.reviewCount}`}</Button>
              <Button
                onClick={() => {
                  markAsFailed(flashcard.id);
                }}
                variant={"contrast"}
              >{`BAD ${flashcard.reviewCount}`}</Button>
            </div>
            <RoundButton
              position="left"
              onClick={() => setIsFlashcardReviewOpened(false)}
            >
              X
            </RoundButton>
          </div>
        )}
      </button>
    </div>
  );
};
