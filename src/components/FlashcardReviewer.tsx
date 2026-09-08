import { Ref, useEffect, useState } from "react";
import { Button } from "./Button";
import { RoundButton } from "./RoundButton";
import ThumbUp from "@mui/icons-material/ThumbUp";
import ThumbDown from "@mui/icons-material/ThumbDown";
import TouchApp from "@mui/icons-material/TouchApp";
import Check from "@mui/icons-material/Check";
import Close from "@mui/icons-material/Close";
import { Flashcard } from "../types";
import FlipCard from "./FlipCard";
import Edit from "@mui/icons-material/Edit";
import VolumeUp from "@mui/icons-material/VolumeUp";
import VolumeOff from "@mui/icons-material/VolumeOff";
import { speak, stopSpeaking } from "../utils/speechReader";

interface FlashcardReviewerProps {
  flashcard: Flashcard;
  markAsReviewed: (flashcard: Flashcard) => void;
  markAsFailed: (flashcard: Flashcard) => void;
  updateFalshcard: (editedFlashcard: Flashcard) => Promise<void>;
  reviewButtonRefs: {
    successButton: Ref<HTMLButtonElement>;
    failedButton: Ref<HTMLButtonElement>;
  };
  readerEnabled?: boolean;
  toggleReader?: () => void;
}

export const FlashcardReviewer: React.FC<FlashcardReviewerProps> = ({
  flashcard,
  markAsReviewed,
  markAsFailed,
  updateFalshcard,
  reviewButtonRefs,
  readerEnabled = false,
  toggleReader,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState("");
  const lastCardReview = flashcard.reviewCount > 6;
  // On n'édite que la face visible : réponse si la carte est retournée, question sinon
  const editedField = showAnswer ? "answer" : "question";

  useEffect(() => {
    if (!showButtons && showAnswer) setShowButtons(true);
  }, [showAnswer, showButtons]);

  // Lit la face visible quand elle apparaît (nouvelle carte, flip ou activation),
  // coupe dès que la lecture est désactivée ou qu'on passe en édition
  useEffect(() => {
    if (!readerEnabled || isEditing) {
      stopSpeaking();
      return;
    }
    speak(showAnswer ? flashcard.answer : flashcard.question);
  }, [readerEnabled, isEditing, showAnswer, flashcard.question, flashcard.answer]);

  useEffect(() => stopSpeaking, []);

  const startEditing = () => {
    setDraftText(flashcard[editedField]);
    setIsEditing(true);
  };

  const saveEdit = async () => {
    const text = draftText.trim();
    if (text) {
      await updateFalshcard({ ...flashcard, [editedField]: text });
    }
    setIsEditing(false);
  };

  const editableCardStyle = lastCardReview
    ? "bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-600 border-2 border-amber-700/50"
    : "bg-gradient-to-br from-slate-50 to-slate-200 border border-slate-300/80";

  const editableTextAreaStyle =
    "flex-1 w-full bg-transparent text-center text-gray-900 text-xl md:text-2xl font-semibold resize-none focus:outline-none placeholder:text-gray-400";

  return (
    <div className="flex flex-col justify-start items-center h-5/6 w-5/6">
      {isEditing ? (
        <>
          {/* Édition en place : même gabarit que la FlipCard, seule la face visible est éditable */}
          <div
            className={`h-[60vh] w-full md:w-1/3 lg:w-1/3 rounded-xl shadow-xl p-4 flex flex-col ${editableCardStyle}`}
          >
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder={showAnswer ? "Réponse" : "Question"}
              className={editableTextAreaStyle}
              autoFocus
            />
          </div>
          <div className="flex flex-row justify-center items-center gap-3 w-full pt-6">
            <Button
              onClick={() => setIsEditing(false)}
              additionnalClassName="w-28 h-20 md:w-32 md:h-24 rounded-2xl"
              variant="contrast"
              outlineStyle
            >
              <Close style={{ fontSize: "2rem" }} />
            </Button>
            <Button
              onClick={saveEdit}
              disabled={!draftText.trim()}
              additionnalClassName="w-28 h-20 md:w-32 md:h-24 rounded-2xl"
              variant="primary"
            >
              <Check style={{ fontSize: "2rem" }} />
            </Button>
          </div>
        </>
      ) : (
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
          <RoundButton position="right" onClick={startEditing}>
            <Edit />
          </RoundButton>
          {toggleReader && (
            <RoundButton
              position="right"
              onClick={toggleReader}
              className="!bottom-24 md:!bottom-28 opacity-60 hover:opacity-100"
              aria-label={
                readerEnabled
                  ? "Désactiver la lecture audio"
                  : "Activer la lecture audio"
              }
            >
              {readerEnabled ? (
                <VolumeUp className="text-primary" />
              ) : (
                <VolumeOff />
              )}
            </RoundButton>
          )}
        </>
      )}
    </div>
  );
};
