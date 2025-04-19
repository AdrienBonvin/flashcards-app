import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { Deck, Flashcard, flashcardUtils } from "../types";
import { getNextReviewDate } from "../utils/spacedRepetition";
import { useNavigate, useParams } from "react-router-dom";
import { FlashcardReviewer } from "../components/FlashcardReviewer";
import { FlashcardAdder } from "../components/FlashcardAdder";
import { RoundButton } from "../components/RoundButton";
import { FlashcardHomepage } from "../components/FlashcardHomepage";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import { useUserDataContext } from "../contexts/UserDataContext";
import { ProgressBar } from "../components/ProgressBar";

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
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    if (!isFlashcardReviewOpened) return;

    if (!flashcardsToReview.length) {
      setIsFlashcardReviewOpened(false);
    } else {
      setCurrentFlashcard(flashcardsToReview[0]);
    }
  }, [flashcardsToReview, isFlashcardReviewOpened]);

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
          question: newQuestion,
          answer: newAnswer,
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
          },
        ],
      }));
    }
  };

  const markAsReviewed = async (reviewedFlashcard: Flashcard) => {
    const nextReviewDate = getNextReviewDate(
      reviewedFlashcard.reviewDate,
      reviewedFlashcard.reviewCount + 1
    );
    await updateDoc(
      doc(db, `decks/${deckId}/flashcards`, reviewedFlashcard.id),
      {
        reviewDate: nextReviewDate,
        reviewCount: reviewedFlashcard.reviewCount + 1,
      }
    );
    setFlashcardsToReview((prevFlashcards) => {
      return prevFlashcards.filter(
        (flashcard) => flashcard.id !== reviewedFlashcard.id
      );
    });
  };

  const markAsFailed = async (failedFlashcardId: string) => {
    await updateDoc(doc(db, `decks/${deckId}/flashcards`, failedFlashcardId), {
      reviewDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      reviewCount: 0,
    });
    setFlashcardsToReview((prevFlashcards) =>
      prevFlashcards.filter((flashcard) => flashcard.id !== failedFlashcardId)
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
      default:
        navigate(-1);
        break;
    }
  };

  return (
    <>
      {isDataLoaded ? (
        <div className="relative flex flex-col w-screen h-screen items-center justify-center space-y-12">
          {!(isFlashcardReviewOpened || isFlashcardAdderOpened) && (
            <FlashcardHomepage
              numberOfCards={flashcardsToReview.length}
              totalCards={deck.flashcards.length}
              deckName={deck.name}
              setIsFlashcardReviewOpened={setIsFlashcardReviewOpened}
              setIsFlashcardAdderOpened={setIsFlashcardAdderOpened}
              removeDeck={() => {
                removeDeck(deckId ?? "");
                navigate(-1);
              }}
            />
          )}

          {isFlashcardReviewOpened && currentFlashcard && (
            <>
              <ProgressBar
                initialCount={flashcardInitialCount}
                counter={flashcardsToReview.length}
                className="mt-10 w-5/6"
              />
              <FlashcardReviewer
                key={currentFlashcard.id}
                flashcard={currentFlashcard}
                markAsReviewed={markAsReviewed}
                markAsFailed={markAsFailed}
                setIsFlashcardReviewOpened={setIsFlashcardReviewOpened}
              />
            </>
          )}

          {isFlashcardAdderOpened && (
            <FlashcardAdder
              addFlashcard={addFlashcard}
              setIsFlashcardAdderOpened={setIsFlashcardAdderOpened}
            />
          )}

          <RoundButton onClick={goBack} position="left">
            <ChevronLeft />
          </RoundButton>
        </div>
      ) : null}
    </>
  );
};

export default FlashcardPage;
