import { Ref, useEffect, useState } from "react";
import { Button } from "./Button";
import { RoundButton } from "./RoundButton";
import ThumbUp from "@mui/icons-material/ThumbUp";
import ThumbDown from "@mui/icons-material/ThumbDown";
import TouchApp from "@mui/icons-material/TouchApp";
import { Flashcard } from "../types";
import FlipCard from "./FlipCard";
import EditCard from "./EditCard";
import Edit from "@mui/icons-material/Edit";
import Popin from "./Popin";

interface FlashcardReviewerProps {
  flashcard: Flashcard;
  markAsReviewed: (flashcard: Flashcard) => void;
  markAsFailed: (flashcard: Flashcard) => void;
  updateFalshcard: (editedFlashcard: Flashcard) => Promise<void>;
  reviewButtonRefs: {
    successButton: Ref<HTMLButtonElement>;
    failedButton: Ref<HTMLButtonElement>;
  };
}

export const FlashcardReviewer: React.FC<FlashcardReviewerProps> = ({
  flashcard,
  markAsReviewed,
  markAsFailed,
  updateFalshcard,
  reviewButtonRefs,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [flashcardToEdit, setFlashcardToEdit] = useState<Flashcard | null>(
    null
  );
  const lastCardReview = flashcard.reviewCount > 6;

  useEffect(() => {
    if (!showButtons && showAnswer) setShowButtons(true);
  }, [showAnswer, showButtons]);

  return (
    <div className=" flex flex-col justify-start items-center h-5/6 w-5/6">
      {!flashcardToEdit && (
        <>
          <FlipCard
            question={flashcard.question}
            answer={flashcard.answer}
            onCardFlip={setShowAnswer}
            goldenCard={lastCardReview}
            className="md:w-1/3 lg:w-1/3"
          />
          {showButtons ? (
            <div className="flex flex-row justify-center align-middle items-center gap-3 w-full pt-6">
              <Button
                ref={reviewButtonRefs.failedButton}
                onClick={() => {
                  markAsFailed(flashcard);
                }}
                additionnalClassName={`w-32 h-24 ${
                  lastCardReview ? "opacity-30  " : ""
                }`}
                variant={"contrast"}
              >
                <ThumbDown
                  style={{ fill: "currentcolor", fontSize: "4rem" }}
                  className="text-orange-950"
                />
              </Button>
              <Button
                ref={reviewButtonRefs.successButton}
                onClick={() => {
                  markAsReviewed(flashcard);
                }}
                additionnalClassName={`w-32 h-24 ${
                  lastCardReview ? "bg-yellow-600 animate-bounce" : ""
                }`}
                variant={"primary"}
              >
                <ThumbUp
                  style={{ fill: "currentcolor", fontSize: "4rem" }}
                  className={`${
                    lastCardReview ? "text-yellow-200" : "text-blue-100"
                  }`}
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
        </>
      )}
      <RoundButton
        position="right"
        onClick={() => setFlashcardToEdit(flashcard)}
      >
        <Edit />
      </RoundButton>

      {flashcardToEdit && (
        <Popin onClose={() => setFlashcardToEdit(null)}>
          <EditCard
            flashcardToEdit={flashcardToEdit}
            setFlashcardToEdit={setFlashcardToEdit}
            updateFlashcard={updateFalshcard}
          />
        </Popin>
      )}
    </div>
  );
};
