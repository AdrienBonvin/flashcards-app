import { Ref, useEffect, useState } from "react";
import { Button } from "./Button";
import { RoundButton } from "./RoundButton";
import Popin from "./Popin";
import { Flashcard, GOLDEN_CARD_THRESHOLD } from "../types";
import FlipCard from "./FlipCard";
import { speak, stopSpeaking } from "../utils/speechReader";
import { Icon } from "./icons/Icon";

interface FlashcardReviewerProps {
  flashcard: Flashcard;
  markAsReviewed: (flashcard: Flashcard) => void;
  markAsFailed: (flashcard: Flashcard) => void;
  updateFlashcard: (editedFlashcard: Flashcard) => Promise<void>;
  removeFlashcard: (flashcardId: string) => void;
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
  updateFlashcard,
  removeFlashcard,
  reviewButtonRefs,
  readerEnabled = false,
  toggleReader,
}) => {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [draftText, setDraftText] = useState("");
  const lastCardReview = flashcard.reviewCount >= GOLDEN_CARD_THRESHOLD;
  // On n'édite que la face visible : réponse si la carte est retournée, question sinon
  const editedField = showAnswer ? "answer" : "question";

  useEffect(() => {
    if (!showButtons && showAnswer) setShowButtons(true);
  }, [showAnswer, showButtons]);

  // Raccourcis clavier (desktop) : Espace/Entrée retourne, ← je ne savais pas,
  // → je savais, E modifie. Inactifs pendant l'édition ou dans un champ de saisie.
  useEffect(() => {
    if (isEditing || isConfirmingDelete) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      // La carte (role=button) et les boutons gèrent déjà Entrée/Espace eux-mêmes
      if (
        target &&
        (["INPUT", "TEXTAREA", "BUTTON"].includes(target.tagName) ||
          target.getAttribute("role") === "button")
      )
        return;
      switch (e.key) {
        case " ":
        case "Enter":
          e.preventDefault();
          setShowAnswer((prev) => !prev);
          break;
        case "ArrowLeft":
          if (showButtons) markAsFailed(flashcard);
          break;
        case "ArrowRight":
          if (showButtons) markAsReviewed(flashcard);
          break;
        case "e":
        case "E":
          setDraftText(flashcard[showAnswer ? "answer" : "question"]);
          setIsEditing(true);
          break;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isEditing, isConfirmingDelete, showButtons, showAnswer, flashcard, markAsFailed, markAsReviewed]);

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
      await updateFlashcard({ ...flashcard, [editedField]: text });
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
              aria-label="Annuler la modification"
            >
              <Icon name="close" size="2rem" />
            </Button>
            <Button
              onClick={saveEdit}
              disabled={!draftText.trim()}
              additionnalClassName="w-28 h-20 md:w-32 md:h-24 rounded-2xl"
              variant="primary"
              aria-label="Enregistrer la modification"
            >
              <Icon name="check" size="2rem" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <FlipCard
            question={flashcard.question}
            answer={flashcard.answer}
            flipped={showAnswer}
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
                aria-label="Je ne savais pas"
              >
                <Icon name="thumb-down"
                  size="3rem"
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
                aria-label="Je savais"
              >
                <Icon name="thumb-up"
                  size="3rem"
                  className={`md:text-5xl ${
                    lastCardReview ? "text-amber-100" : "text-blue-50"
                  }`}
                />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-2 pt-12">
              <p className="text-muted text-sm font-medium flex items-center gap-1">
                Touchez pour voir la réponse <Icon name="touch-app" className="w-4 h-4" />
              </p>
              <p className="hidden md:block text-muted/70 text-xs">
                <kbd className="px-1.5 py-0.5 rounded border border-surface-elevated bg-surface">Espace</kbd>{" "}
                retourner ·{" "}
                <kbd className="px-1.5 py-0.5 rounded border border-surface-elevated bg-surface">←</kbd>{" "}
                <kbd className="px-1.5 py-0.5 rounded border border-surface-elevated bg-surface">→</kbd>{" "}
                répondre ·{" "}
                <kbd className="px-1.5 py-0.5 rounded border border-surface-elevated bg-surface">E</kbd>{" "}
                modifier
              </p>
            </div>
          )}
          <RoundButton
            position="right"
            onClick={startEditing}
            aria-label={showAnswer ? "Modifier la réponse" : "Modifier la question"}
          >
            <Icon name="edit" />
          </RoundButton>
          <RoundButton
            position="right"
            onClick={() => setIsConfirmingDelete(true)}
            className={`opacity-60 hover:opacity-100 hover:!border-contrast/60 ${
              toggleReader ? "!bottom-40 md:!bottom-48" : "!bottom-24 md:!bottom-28"
            }`}
            aria-label="Supprimer cette carte"
          >
            <Icon name="delete" />
          </RoundButton>
          {isConfirmingDelete && (
            <Popin
              onClose={() => setIsConfirmingDelete(false)}
              title="Supprimer la carte ?"
            >
              <div className="flex flex-col gap-6">
                <p className="text-sm text-muted line-clamp-3">
                  « {flashcard.question} » sera supprimée définitivement et retirée
                  de cette révision.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    outlineStyle
                    additionnalClassName="flex-1"
                    onClick={() => setIsConfirmingDelete(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="contrast"
                    additionnalClassName="flex-1"
                    onClick={() => {
                      setIsConfirmingDelete(false);
                      removeFlashcard(flashcard.id);
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </Popin>
          )}
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
                <Icon name="volume-up" className="text-primary" />
              ) : (
                <Icon name="volume-off" />
              )}
            </RoundButton>
          )}
        </>
      )}
    </div>
  );
};
