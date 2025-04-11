import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { Flashcard } from "../types";
import { getNextReviewDate } from "../utils/spacedRepetition";
import { useNavigate, useParams } from "react-router-dom";
import { FlashcardReviewer } from "../components/FlashcardReviewer";
import { FlashcardAdder } from "../components/FlashcardAdder";
import { RoundButton } from "../components/RoundButton";
import { FlashcardHomepage } from "../components/FlashcardHomepage";

const FlashcardPage: React.FC = () => {
  const navigate = useNavigate();
  const { deckId } = useParams<{ deckId: string }>();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
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

    if (!flashcards.length) {
      setIsFlashcardReviewOpened(false);
    } else {
      setCurrentFlashcard(flashcards[0]);
    }
  }, [flashcards, isFlashcardReviewOpened]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const querySnapshot = await getDocs(
        collection(db, `decks/${deckId}/flashcards`)
      );
      const flashcardsData: Flashcard[] = querySnapshot.docs.map<Flashcard>(
        (doc) => ({
          id: doc.id,
          question: doc.data().question,
          answer: doc.data().answer,
          reviewDate: doc.data().reviewDate.toDate(),
          reviewCount: doc.data().reviewCount,
        })
      );
      const filteredData: Flashcard[] = flashcardsData.filter(
        (flashcard) =>
          flashcard.reviewDate.getTime() < new Date().setHours(23, 59, 59, 0)
      );
      setFlashcards(filteredData);
      setFlashcardInitialCount(filteredData.length);
      setIsDataLoaded(true);
    };

    fetchFlashcards();
  }, [deckId]);

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
      setFlashcards([
        ...flashcards,
        {
          id: docRef.id,
          question: newQuestion,
          answer: newAnswer,
          reviewDate: new Date(),
          reviewCount: 0,
        },
      ]);
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
    setFlashcards((prevFlashcards) => {
      return prevFlashcards.filter(
        (flashcard) => flashcard.id !== reviewedFlashcard.id
      );
    });
  };

  const markAsFailed = async (failedFlashcardId: string) => {
    await updateDoc(doc(db, `decks/${deckId}/flashcards`, failedFlashcardId), {
      reviewDate: new Date(),
      reviewCount: 0,
    });
    setFlashcards((prevFlashcards) =>
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
          <h1>Cartes</h1>
          {!(isFlashcardReviewOpened || isFlashcardAdderOpened) && (
            <FlashcardHomepage
              numberOfCards={flashcards.length}
              setIsFlashcardReviewOpened={setIsFlashcardReviewOpened}
              setIsFlashcardAdderOpened={setIsFlashcardAdderOpened}
            />
          )}

          {isFlashcardReviewOpened && currentFlashcard && (
            <FlashcardReviewer
              key={currentFlashcard.id}
              flashcard={currentFlashcard}
              flashcardsCounter={flashcards.length}
              flashcardInitialCount={flashcardInitialCount}
              markAsReviewed={markAsReviewed}
              markAsFailed={markAsFailed}
              setIsFlashcardReviewOpened={setIsFlashcardReviewOpened}
            />
          )}

          {isFlashcardAdderOpened && (
            <FlashcardAdder
              addFlashcard={addFlashcard}
              setIsFlashcardAdderOpened={setIsFlashcardAdderOpened}
            />
          )}

          <RoundButton onClick={goBack} position="left">
            {"<"}
          </RoundButton>
        </div>
      ) : (
        <div>CHARGEMENT DES DONNEES...</div>
      )}
    </>
  );
};

export default FlashcardPage;
