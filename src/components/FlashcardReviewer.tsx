import { useState } from "react";
import { Button } from "./Button";
import { RoundButton } from "./RoundButton";
import ThumbUp from "@mui/icons-material/ThumbUp";
import ThumbDown from "@mui/icons-material/ThumbDown";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import TouchApp from "@mui/icons-material/TouchApp";
import { Flashcard } from "../types";
import FlipCard from "./FlipCard";

interface FlashcardReviewerProps {
  flashcard: Flashcard;
  markAsReviewed: (flashcard: Flashcard) => void;
  markAsFailed: (id: string) => void;
  setIsFlashcardReviewOpened: (isOpened: boolean) => void;
}

export const FlashcardReviewer: React.FC<FlashcardReviewerProps> = ({
  flashcard,
  markAsReviewed,
  markAsFailed,
  setIsFlashcardReviewOpened,
}) => {
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);

  return (
    <div className="flex-col justify-between items-center h-5/6 w-5/6">
      <FlipCard
        question={flashcard.question}
        answer={flashcard.answer}
        onCardFlip={setIsAnswerVisible}
      />
      {isAnswerVisible ? (
        <div className="flex flex-row justify-center align-middle items-center gap-3 w-full pt-6">
          <Button
            onClick={() => {
              markAsFailed(flashcard.id);
            }}
            additionnalClassName="w-32 h-24"
            variant={"contrast"}
          >
            <ThumbDown
              style={{ fill: "currentcolor", fontSize: "4rem" }}
              className="text-orange-950"
            />
          </Button>
          <Button
            onClick={() => {
              markAsReviewed(flashcard);
            }}
            additionnalClassName="w-32 h-24"
            variant={"primary"}
          >
            <ThumbUp
              style={{ fill: "currentcolor", fontSize: "4rem" }}
              className="text-blue-100"
            />
          </Button>
        </div>
      ) : (
        <div className="flex justify-center items-center font-bold pt-12">
          <div className="text-gray-600 text-center text-sm">
            Réponse <TouchApp />
          </div>
        </div>
      )}
      <RoundButton
        position="left"
        onClick={() => setIsFlashcardReviewOpened(false)}
      >
        <ChevronLeft />
      </RoundButton>
    </div>
  );
};
