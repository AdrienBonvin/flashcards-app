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
    <div className="flex flex-col justify-start items-center h-5/6 w-5/6">
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
                onClick={() => markAsFailed(flashcard)}
                additionnalClassName="w-28 h-20 md:w-32 md:h-24 rounded-2xl"
                variant="contrast"
                outlineStyle={lastCardReview}
              >
                <ThumbDown
                  style={{ fill: "currentcolor", fontSize: "3rem" }}
                  className={`md:text-5xl ${
                    lastCardReview ? "text-amber-200" : "text-orange-950"
                  }`}
                />
              </Button>
              <Button
                ref={reviewButtonRefs.successButton}
                onClick={() => markAsReviewed(flashcard)}
                additionnalClassName={`w-28 h-20 md:w-32 md:h-24 rounded-2xl ${
                  lastCardReview ? "animate-pulse" : ""
                }`}
                variant="primary"
              >
                <ThumbUp
                  style={{ fill: "currentcolor", fontSize: "3rem" }}
                  className={`md:text-5xl ${
                    lastCardReview ? "text-amber-100" : "text-blue-50"
                  }`}
                />
              </Button>
            </div>
          ) : (
            <div className="flex justify-center items-center pt-12">
              <p className="text-muted text-sm font-medium flex items-center">
                Touchez pour voir la réponse <TouchApp className="w-4 h-4" />
              </p>
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
