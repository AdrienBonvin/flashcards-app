import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
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

  useEffect(() => {
    console.log("FlashcardPage to review:", flashcardsToReview);
  }, [flashcardsToReview]);

  useEffect(() => {
    if (isFlashcardReviewOpened && flashcardsToReview.length === 0) {
      setIsFinished(true);
      setTimeout(() => {
        setIsFinished(false);
        navigate(-1);
      }, 3500);
    }
  }, [flashcardsToReview, isFlashcardReviewOpened, navigate]);

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
      console.log(
        "on remet à jour les flashcards à réviser avec les flashcards totaux"
      );
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

  const markAsReviewed = async (reviewedFlashcard: Flashcard) => {
    const nextReviewDate = getNextReviewDate(reviewedFlashcard.reviewCount + 1);
    console.log(
      "update de la date de la flashcard, et retrait de la liste flashcardToReview"
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
              <ProgressBar
                initialCount={flashcardInitialCount}
                counter={flashcardsToReview.length}
                className="w-5/6"
              />
              <FlashcardReviewer
                key={currentFlashcard.id}
                flashcard={currentFlashcard}
                markAsReviewed={markAsReviewed}
                markAsFailed={markAsFailed}
                updateFalshcard={updateFlashcard}
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
