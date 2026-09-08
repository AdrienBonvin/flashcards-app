import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Flashcard, flashcardUtils, GOLDEN_CARD_THRESHOLD } from "../types";
import {
  getDaysTillNextReview,
  getNextReviewDate,
} from "../utils/spacedRepetition";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { FlashcardReviewer } from "../components/FlashcardReviewer";
import { FlashcardAdder } from "../components/FlashcardAdder";
import { RoundButton } from "../components/RoundButton";
import { FlashcardHomepage } from "../components/FlashcardHomepage";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { useUserDataContext } from "../contexts/UserDataContext";
import { ProgressBar } from "../components/ProgressBar";
import FlashcardEditor from "../components/FlashcardEditor";
import { EditDeckName } from "../components/EditDeckName";
import Popin from "../components/Popin";
import { Button } from "../components/Button";

type AnimationType = "SUCCESS" | "FAILED" | "LEARNED";

interface FloatingNumberAnimation {
  success: AnimationType;
  start: { x: number; y: number };
  end: { x: number; y: number };
  daysLeft?: number;
}

// Durée d'affichage de l'écran de fin avant retour à la liste des decks
const FINISHED_SCREEN_MS = 3500;

const FlashcardPage: React.FC = () => {
  const navigate = useNavigate();
  const { deckId = "" } = useParams<{ deckId: string }>();
  const {
    decks,
    removeDeck,
    editDeckName,
    setDeckLastCompletedReviewAt,
    addFlashcard,
    updateFlashcard,
    removeFlashcard,
  } = useUserDataContext();

  const deck = useMemo(
    () => decks?.find((d) => d.id === deckId) ?? null,
    [decks, deckId]
  );
  // File de révision dérivée du deck : une carte révisée/ratée/acquise en sort d'elle-même
  const flashcardsToReview = useMemo(
    () => (deck ? flashcardUtils.getReviewableCards(deck.flashcards) : []),
    [deck]
  );
  const currentFlashcard: Flashcard | null = flashcardsToReview[0] ?? null;

  const [isFlashcardReviewOpened, setIsFlashcardReviewOpened] = useState(false);
  const [isFlashcardAdderOpened, setIsFlashcardAdderOpened] = useState(false);
  const [isFlashcardRemoverOpened, setIsFlashcardRemoverOpened] = useState(false);
  const [flashcardInitialCount, setFlashcardInitialCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isEditDeckNameOpen, setIsEditDeckNameOpen] = useState(false);
  const [isConfirmingDeckDelete, setIsConfirmingDeckDelete] = useState(false);
  // Désactivé par défaut à chaque ouverture, volontairement non persisté
  const [isReaderEnabled, setIsReaderEnabled] = useState(false);
  const [triggerProgressBarAnimations, setTriggerProgressBarAnimations] =
    useState(false);
  const [fadeProgressBarToBlackAnimation, setFadeProgressBarToBlackAnimation] =
    useState(false);
  const [floatingNumberAnimation, setFloatingNumberAnimation] =
    useState<FloatingNumberAnimation | null>(null);

  const successButton = useRef<HTMLButtonElement>(null);
  const failedButton = useRef<HTMLButtonElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Fin de session : plus aucune carte dans la file pendant une révision
  useEffect(() => {
    if (!isFlashcardReviewOpened || flashcardsToReview.length > 0) return;
    setIsFlashcardReviewOpened(false);
    setIsFinished(true);
    if (flashcardInitialCount > 0) setDeckLastCompletedReviewAt(deckId);
  }, [
    flashcardsToReview.length,
    isFlashcardReviewOpened,
    flashcardInitialCount,
    deckId,
    setDeckLastCompletedReviewAt,
  ]);

  // Écran de fin affiché quelques secondes, puis retour à la liste des decks
  useEffect(() => {
    if (!isFinished) return;
    const timeout = setTimeout(() => {
      setIsFinished(false);
      setFadeProgressBarToBlackAnimation(false);
      navigate("/");
    }, FINISHED_SCREEN_MS);
    return () => clearTimeout(timeout);
  }, [isFinished, navigate]);

  const startReview = () => {
    if (flashcardsToReview.length === 0) return;
    setFlashcardInitialCount(flashcardsToReview.length);
    setIsFlashcardReviewOpened(true);
  };

  const triggerAnimations = (
    animationType: AnimationType,
    reviewCount: number
  ) => {
    const triggeringButton =
      animationType === "FAILED" ? failedButton.current : successButton.current;
    if (!triggeringButton || !progressBarRef.current) return;

    const buttonRect = triggeringButton.getBoundingClientRect();
    const barRect = progressBarRef.current.getBoundingClientRect();
    setFloatingNumberAnimation({
      start: {
        x: buttonRect.left + buttonRect.width / 2,
        y: buttonRect.top + buttonRect.height / 2,
      },
      end: { x: barRect.left + barRect.width, y: barRect.top + barRect.height / 2 },
      daysLeft: getDaysTillNextReview(getNextReviewDate(reviewCount).getTime()),
      success: animationType,
    });
  };

  const reviewFlashcard = (reviewedFlashcard: Flashcard) => {
    const newReviewCount = reviewedFlashcard.reviewCount + 1;
    if (reviewedFlashcard.reviewCount >= GOLDEN_CARD_THRESHOLD) {
      triggerAnimations("LEARNED", newReviewCount);
      return updateFlashcard(deckId, reviewedFlashcard.id, { archived: true });
    }
    triggerAnimations("SUCCESS", newReviewCount);
    return updateFlashcard(deckId, reviewedFlashcard.id, {
      reviewDate: getNextReviewDate(newReviewCount),
      reviewCount: newReviewCount,
    });
  };

  const failFlashcard = (failedFlashcard: Flashcard) => {
    const newReviewCount = Math.max(0, failedFlashcard.reviewCount - 1);
    triggerAnimations("FAILED", newReviewCount);
    // Une carte ratée revient dès demain, quel que soit son palier
    return updateFlashcard(deckId, failedFlashcard.id, {
      reviewDate: getNextReviewDate(1),
      reviewCount: newReviewCount,
    });
  };

  const editFlashcard = (edited: Flashcard) =>
    updateFlashcard(deckId, edited.id, {
      question: edited.question.trim(),
      answer: edited.answer.trim(),
    });

  const toggleReader = useCallback(
    () => setIsReaderEnabled((prev) => !prev),
    []
  );

  const goBack = () => {
    if (isFlashcardReviewOpened) setIsFlashcardReviewOpened(false);
    else if (isFlashcardAdderOpened) setIsFlashcardAdderOpened(false);
    else if (isFlashcardRemoverOpened) setIsFlashcardRemoverOpened(false);
    else navigate("/");
  };

  // Decks chargés mais deck introuvable (supprimé, URL erronée) : retour à la liste
  if (decks && !deck) return <Navigate to="/" replace />;
  // Decks pas encore chargés : le Loader global est affiché par ProtectedRoute
  if (!deck) return null;

  const isSubViewOpened =
    isFlashcardReviewOpened || isFlashcardAdderOpened || isFlashcardRemoverOpened;

  return (
    <>
      <div className="flex flex-col min-h-dvh w-full items-center justify-center gap-y-10 px-6 py-16 md:py-24">
        {(isFinished || isFlashcardReviewOpened) && (
          <>
            <ProgressBar
              ref={progressBarRef}
              initialCount={flashcardInitialCount}
              counter={flashcardsToReview.length}
              className={`w-5/6 fixed top-8 ${
                fadeProgressBarToBlackAnimation ? "fade-to-black opacity-0" : ""
              }`}
              triggerAnimations={triggerProgressBarAnimations}
            />
            {floatingNumberAnimation && (
              <span
                aria-hidden
                className={`fixed text-6xl font-bold z-50 translate-y-44 ${
                  floatingNumberAnimation.success === "FAILED"
                    ? "text-contrast"
                    : "text-yellow-500"
                }`}
                style={
                  {
                    left: floatingNumberAnimation.start.x,
                    top: floatingNumberAnimation.start.y,
                    transform: "translate(-50%, -50%)",
                    animation: "float-to-bar 0.7s cubic-bezier(0,0,.2,1) forwards",
                    "--float-x": `${
                      floatingNumberAnimation.end.x - floatingNumberAnimation.start.x
                    }px`,
                    "--float-y": `${
                      floatingNumberAnimation.end.y - floatingNumberAnimation.start.y
                    }px`,
                  } as React.CSSProperties
                }
                onAnimationEnd={() => {
                  setTriggerProgressBarAnimations(true);
                  setFloatingNumberAnimation(null);
                  setTimeout(() => setTriggerProgressBarAnimations(false), 200);
                  if (isFinished) setFadeProgressBarToBlackAnimation(true);
                }}
              >
                {floatingNumberAnimation.success === "LEARNED"
                  ? "🧠"
                  : `${floatingNumberAnimation.success === "SUCCESS" ? "+" : "-"}${
                      floatingNumberAnimation.daysLeft
                    } j`}
              </span>
            )}
          </>
        )}

        {isFinished && (
          <div
            className="flex flex-col items-center justify-center gap-4 animate-modal-in"
            role="status"
          >
            <img
              src="/icons/logo-512.png"
              alt=""
              width={96}
              height={96}
              className="w-24 h-24 animate-bounce"
            />
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-extrabold text-transparent bg-gradient-to-r from-contrast to-primary bg-clip-text">
                Brain LEVEL UP !
              </p>
              <p className="text-muted text-sm mt-2">
                Toutes les cartes sont révisées
              </p>
            </div>
          </div>
        )}

        {!isFinished && !isSubViewOpened && (
          <FlashcardHomepage
            numberOfCards={flashcardsToReview.length}
            totalCards={deck.flashcards.length}
            deckName={deck.name}
            startReview={startReview}
            setIsFlashcardAdderOpened={setIsFlashcardAdderOpened}
            setIsFlashcardRemoverOpened={setIsFlashcardRemoverOpened}
            removeDeck={() => setIsConfirmingDeckDelete(true)}
            editDeckName={() => setIsEditDeckNameOpen(true)}
            isReaderEnabled={isReaderEnabled}
            toggleReader={toggleReader}
          />
        )}

        {isFlashcardReviewOpened && currentFlashcard && (
          <FlashcardReviewer
            key={currentFlashcard.id}
            flashcard={currentFlashcard}
            markAsReviewed={reviewFlashcard}
            markAsFailed={failFlashcard}
            updateFlashcard={editFlashcard}
            reviewButtonRefs={{ failedButton, successButton }}
            readerEnabled={isReaderEnabled}
            toggleReader={toggleReader}
          />
        )}

        {isFlashcardAdderOpened && (
          <FlashcardAdder
            addFlashcard={(question, answer) =>
              addFlashcard(deckId, question, answer)
            }
          />
        )}

        {isFlashcardRemoverOpened && (
          <FlashcardEditor
            flashcards={deck.flashcards}
            removeFlashcard={(flashcardId) => removeFlashcard(deckId, flashcardId)}
            updateFlashcard={editFlashcard}
          />
        )}

        <RoundButton
          onClick={goBack}
          position="left"
          aria-label={isSubViewOpened ? "Retour au deck" : "Retour aux decks"}
        >
          <ChevronLeft />
        </RoundButton>
      </div>

      {isConfirmingDeckDelete && (
        <Popin
          onClose={() => setIsConfirmingDeckDelete(false)}
          title="Supprimer le deck ?"
        >
          <div className="flex flex-col gap-6">
            <p className="text-sm text-muted">
              « {deck.name} » et ses {deck.flashcards.length} carte
              {deck.flashcards.length !== 1 ? "s" : ""} seront supprimés
              définitivement.
            </p>
            <div className="flex gap-3">
              <Button
                variant="primary"
                outlineStyle
                additionnalClassName="flex-1"
                onClick={() => setIsConfirmingDeckDelete(false)}
              >
                Annuler
              </Button>
              <Button
                variant="contrast"
                additionnalClassName="flex-1"
                onClick={async () => {
                  setIsConfirmingDeckDelete(false);
                  await removeDeck(deckId);
                  navigate("/");
                }}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </Popin>
      )}

      {isEditDeckNameOpen && (
        <EditDeckName
          initialDeckName={deck.name}
          onEdit={(newName: string | null) => {
            if (newName) editDeckName(deckId, newName);
            setIsEditDeckNameOpen(false);
          }}
        />
      )}
    </>
  );
};

export default FlashcardPage;
