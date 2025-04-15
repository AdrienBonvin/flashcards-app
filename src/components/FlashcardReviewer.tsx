import { useState } from "react";
import { Flashcard } from "../types";
import { Button } from "./Button";
import { RoundButton } from "./RoundButton";
import ThumbUp from "@mui/icons-material/ThumbUp";
import ThumbDown from "@mui/icons-material/ThumbDown";
import ChevronLeft from "@mui/icons-material/ChevronLeft";

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
    <div className="flex flex-col items-center align-middle justify-center h-screen w-5/6 p-2 bg-grey-600">
      <div
        className={`text-center font-extrabold text-3xl my-10 ${
          isAnswerVisible ? "opacity-50" : "opacity-100"
        }`}
      >
        {flashcard.question}
      </div>
      <div
        className="w-[95vw] h-[50vh] text-2xl font-bold"
        onClick={() => setIsAnswerVisible(true)}
      >
        {isAnswerVisible && (
          <div className="flex flex-col items-center justify-between h-full">
            <p className="text-center">______________________________</p>
            <div className="text-center font-extrabold text-3xl">
              {flashcard.answer}
            </div>
            <div className="flex flex-row justify-evenly w-full">
              <Button
                onClick={() => {
                  markAsFailed(flashcard.id);
                }}
                additionnalClassName="w-36"
                variant={"contrast"}
                outlineStyle
              >
                <ThumbDown
                  style={{ fill: "currentcolor", fontSize: "4rem" }}
                  className="text-contrast"
                />
              </Button>
              <Button
                onClick={() => {
                  markAsReviewed(flashcard);
                }}
                additionnalClassName="w-36 h-28"
                variant={"primary"}
                outlineStyle
              >
                <ThumbUp
                  style={{ fill: "currentcolor", fontSize: "4rem" }}
                  className="text-primary"
                />
              </Button>
            </div>
            <RoundButton
              position="left"
              onClick={() => setIsFlashcardReviewOpened(false)}
            >
              <ChevronLeft />
            </RoundButton>
          </div>
        )}
      </div>
    </div>
  );
};
