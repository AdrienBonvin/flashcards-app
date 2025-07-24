import React, { useState, useEffect, useRef } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { Deck, Flashcard, flashcardUtils } from "../types";
import {
  getDaysTillNextReview,
  getNextReviewDate,
} from "../utils/spacedRepetition";
import { useNavigate, useParams } from "react-router-dom";
import { FlashcardReviewer } from "../components/FlashcardReviewer";
import { FlashcardAdder } from "../components/FlashcardAdder";
import { RoundButton } from "../components/RoundButton";
import { FlashcardHomepage } from "../components/FlashcardHomepage";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { useUserDataContext } from "../contexts/UserDataContext";
import { ProgressBar } from "../components/ProgressBar";
import FlashcardEditor from "../components/FlashcardEditor";
import { EditDeckName } from "../components/EditDeckName";

const FlashcardPage: React.FC = () => {
  const navigate = useNavigate();
  const { deckId } = useParams<{ deckId: string }>();
  const { decks, removeDeck } = useUserDataContext();

  const [flashcardsToReview, setFlashcardsToReview] = useState<Flashcard[]>([]);
  const [deck, setDeck] = useState<Deck>({} as Deck);
  const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard | null>(
    null
  );
  const [flashcardInitialCount, setFlashcardInitialCount] = useState<number>(0);
  const [isFlashcardReviewOpened, setIsFlashcardReviewOpened] =
    useState<boolean>(false);
  const [isFlashcardAdderOpened, setIsFlashcardAdderOpened] =
    useState<boolean>(false);
  const [isFlashcardRemoverOpened, setIsFlashcardRemoverOpened] =
    useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isEditDeckNameOpen, setIsEditDeckNameOpen] = useState(false);
  const [triggerProgressBarAnimations, setTriggerProgressBarAnimations] =
    useState(false);
  const [fadeProgressBarToBlackAnimation, setFadeProgressBarToBlackAnimation] =
    useState(false);
  const [triggerFloatingNumberAnimation, setTriggerFloatingNumberAnimation] =
    useState<{
      success: "SUCCESS" | "FAILED" | "LEARNED";
      start: { x: number; y: number };
      end: { x: number; y: number };
      daysLeft?: number;
    } | null>(null);

  const successButton = useRef<HTMLButtonElement>(null);
  const failedButton = useRef<HTMLButtonElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFlashcardReviewOpened) return;
    if (flashcardsToReview.length === 0) {
      setIsFinished(true);
      setTimeout(() => {
        setIsFinished(false);
        navigate(-1);
      }, 3500);
      setIsFlashcardReviewOpened(false);
    } else {
      setCurrentFlashcard(flashcardsToReview[0]);
    }
  }, [flashcardsToReview, isFlashcardReviewOpened, navigate]);

  useEffect(() => {
    setDeck(decks?.find((deck) => deck.id === deckId) ?? ({} as Deck));
  }, [decks, deckId]);

  useEffect(() => {
    if (deck.id) {
      setIsDataLoaded(true);
      setFlashcardsToReview(flashcardUtils.getReviewableCards(deck.flashcards));
      setIsDataLoaded(true);
    }
  }, [deck]);

  useEffect(() => {
    if (flashcardsToReview.length) {
      setFlashcardInitialCount(flashcardsToReview.length);
    }
  }, [flashcardsToReview]);

  const addFlashcard = async (newQuestion: string, newAnswer: string) => {
    if (newQuestion && newAnswer) {
      const docRef = await addDoc(
        collection(db, `decks/${deckId}/flashcards`),
        {
          question: newQuestion.trim(),
          answer: newAnswer.trim(),
          reviewDate: new Date(),
          reviewCount: 0,
        }
      );
      setDeck((prevDeck) => ({
        ...prevDeck,
        flashcards: [
          ...prevDeck.flashcards,
          {
            id: docRef.id,
            question: newQuestion,
            answer: newAnswer,
            reviewDate: new Date(),
            reviewCount: 0,
            archived: false,
          },
        ],
      }));
    }
  };

  const updateFlashcard = async (editedFlashcard: Flashcard) => {
    await updateDoc(doc(db, `decks/${deckId}/flashcards`, editedFlashcard.id), {
      question: editedFlashcard.question.trim(),
      answer: editedFlashcard.answer.trim(),
    });
    setFlashcardsToReview((prevFlashcards) =>
      prevFlashcards.map((flashcard) =>
        flashcard.id === editedFlashcard.id ? editedFlashcard : flashcard
      )
    );
  };

  const removeFlashcard = async (flashcardId: string) => {
    await deleteDoc(doc(db, `decks/${deckId}/flashcards`, flashcardId));
    setDeck((prevDeck) => {
      return {
        ...prevDeck,
        flashcards: prevDeck.flashcards.filter(
          (flashcard) => flashcard.id !== flashcardId
        ),
      };
    });
    setFlashcardsToReview((prevFlashcards) =>
      prevFlashcards.filter((flashcard) => flashcard.id !== flashcardId)
    );
  };

  const triggerAnimations = (
    animationType: "SUCCESS" | "FAILED" | "LEARNED",
    reviewCount: number
  ) => {
    const triggeringButton =
      animationType !== "FAILED" ? successButton.current : failedButton.current;

    const reviewCountIncrement =
      animationType !== "FAILED" ? reviewCount + 1 : reviewCount - 1;
    if (triggeringButton && progressBarRef.current) {
      setTriggerFloatingNumberAnimation({
        start: {
          x:
            triggeringButton.getBoundingClientRect().left +
            triggeringButton.getBoundingClientRect().width / 2,
          y:
            triggeringButton.getBoundingClientRect().top +
            triggeringButton.getBoundingClientRect().height / 2,
        },
        end: {
          x:
            progressBarRef.current.getBoundingClientRect().left +
            progressBarRef.current.getBoundingClientRect().width,
          y:
            progressBarRef.current.getBoundingClientRect().top +
            progressBarRef.current.getBoundingClientRect().height / 2,
        },
        daysLeft: getDaysTillNextReview(
          getNextReviewDate(reviewCountIncrement).getTime()
        ),
        success: animationType,
      });
    }
  };

  const markAsReviewed = async (reviewedFlashcard: Flashcard) => {
    let updatedFlashcard = {};

    if (reviewedFlashcard.reviewCount > 6) {
      triggerAnimations("LEARNED", reviewedFlashcard.reviewCount);
      updatedFlashcard = {
        archived: true,
      };
    } else {
      triggerAnimations("SUCCESS", reviewedFlashcard.reviewCount);
      updatedFlashcard = {
        reviewDate: getNextReviewDate(reviewedFlashcard.reviewCount + 1),
        reviewCount: reviewedFlashcard.reviewCount + 1,
      };
    }
    await updateDoc(
      doc(db, `decks/${deckId}/flashcards`, reviewedFlashcard.id),
      updatedFlashcard
    );
    setFlashcardsToReview((prevFlashcards) => {
      return prevFlashcards.filter(
        (flashcard) => flashcard.id !== reviewedFlashcard.id
      );
    });
  };
  const markAsFailed = async (failedFlashcard: Flashcard) => {
    triggerAnimations("FAILED", failedFlashcard.reviewCount);
    await updateDoc(doc(db, `decks/${deckId}/flashcards`, failedFlashcard.id), {
      reviewDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      reviewCount: failedFlashcard.reviewCount - 1,
    });
    setFlashcardsToReview((prevFlashcards) =>
      prevFlashcards.filter((flashcard) => flashcard.id !== failedFlashcard.id)
    );
  };

  const goBack = () => {
    switch (true) {
      case isFlashcardReviewOpened:
        setIsFlashcardReviewOpened(false);
        break;
      case isFlashcardAdderOpened:
        setIsFlashcardAdderOpened(false);
        break;
      case isFlashcardRemoverOpened:
        setIsFlashcardRemoverOpened(false);
        break;
      default:
        navigate(-1);
        break;
    }
  };

  return (
    <>
      {isDataLoaded ? (
        <div className="flex flex-col w-screen h-screen items-center justify-center gap-y-12">
          {(isFinished || isFlashcardReviewOpened) && (
            <>
              <ProgressBar
                ref={progressBarRef}
                initialCount={flashcardInitialCount}
                counter={flashcardsToReview.length}
                className={`w-5/6 fixed top-8 ${
                  fadeProgressBarToBlackAnimation
                    ? "fade-to-black opacity-0"
                    : ""
                }`}
                triggerAnimations={triggerProgressBarAnimations}
              />
              {triggerFloatingNumberAnimation && (
                <span
                  className={`fixed text-6xl font-bold z-50 translate-y-44 ${
                    triggerFloatingNumberAnimation.success
                      ? "text-yellow-500"
                      : "text-contrast"
                  }`}
                  style={
                    {
                      left: triggerFloatingNumberAnimation.start.x,
                      top: triggerFloatingNumberAnimation.start.y,
                      transform: "translate(-50%, -50%)",
                      animation: `float-to-bar 0.7s cubic-bezier(0,0,.2,1) forwards`,
                      "--float-x": `${
                        triggerFloatingNumberAnimation.end.x -
                        triggerFloatingNumberAnimation.start.x
                      }px`,
                      "--float-y": `${
                        triggerFloatingNumberAnimation.end.y -
                        triggerFloatingNumberAnimation.start.y
                      }px`,
                    } as React.CSSProperties
                  }
                  onAnimationEnd={() => {
                    setTriggerProgressBarAnimations(true);
                    setTriggerFloatingNumberAnimation(null);
                    setTimeout(
                      () => setTriggerProgressBarAnimations(false),
                      200
                    );
                    if (isFinished) {
                      setFadeProgressBarToBlackAnimation(true);
                    }
                  }}
                >
                  {triggerFloatingNumberAnimation.success === "LEARNED"
                    ? "🧠"
                    : `${
                        triggerFloatingNumberAnimation.success === "SUCCESS"
                          ? "+"
                          : "-"
                      }
                  ${triggerFloatingNumberAnimation.daysLeft} j`}
                </span>
              )}
            </>
          )}
          {isFinished && (
            <div className="flex flex-col items-center justify-center">
              <img src="/icons/logo.png" className="w-24 h-24 animate-bounce" />
              <p className="text-xl font-bold text-center text-transparent bg-gradient-to-r from-contrast  to-primary  bg-clip-text mt-4">
                <p>Brain</p>
                <p>LEVEL UP !</p>
              </p>
            </div>
          )}
          {!isFinished &&
            !(
              isFlashcardReviewOpened ||
              isFlashcardAdderOpened ||
              isFlashcardRemoverOpened
            ) && (
              <FlashcardHomepage
                numberOfCards={flashcardsToReview.length}
                totalCards={deck.flashcards.length}
                deckName={deck.name}
                setIsFlashcardReviewOpened={setIsFlashcardReviewOpened}
                setIsFlashcardAdderOpened={setIsFlashcardAdderOpened}
                setIsFlashcardRemoverOpened={setIsFlashcardRemoverOpened}
                removeDeck={() => {
                  removeDeck(deckId ?? "");
                  navigate(-1);
                }}
                editDeckName={() => setIsEditDeckNameOpen(true)}
              />
            )}

          {isFlashcardReviewOpened && currentFlashcard && (
            <>
              <FlashcardReviewer
                key={currentFlashcard.id}
                flashcard={currentFlashcard}
                markAsReviewed={markAsReviewed}
                markAsFailed={markAsFailed}
                updateFalshcard={updateFlashcard}
                reviewButtonRefs={{ failedButton, successButton }}
              />
            </>
          )}

          {isFlashcardAdderOpened && (
            <FlashcardAdder addFlashcard={addFlashcard} />
          )}

          {isFlashcardRemoverOpened && (
            <FlashcardEditor
              flashcards={deck.flashcards}
              removeFlashcard={removeFlashcard}
              updateFlashcard={updateFlashcard}
            />
          )}

          <RoundButton onClick={goBack} position="left">
            <ChevronLeft />
          </RoundButton>
        </div>
      ) : null}
      {isEditDeckNameOpen && (
        <EditDeckName
          initialDeckName={deck.name}
          onEdit={(newName: string | null) => {
            if (newName) {
              updateDoc(doc(db, "decks", deck.id), { name: newName });
              setDeck((prevDeck) => ({ ...prevDeck, name: newName }));
            }
            setIsEditDeckNameOpen(false);
          }}
        />
      )}
    </>
  );
};

export default FlashcardPage;
