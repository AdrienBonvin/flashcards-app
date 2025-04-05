import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Flashcard } from '../types';
import { getNextReviewDate } from '../utils/spacedRepetition';
import { Link, useParams } from 'react-router-dom';
import { FlashcardViewer } from '../components/FlashcardViewer';
import { FlashcardAdder } from '../components/FlashcardAdder';


const FlashcardPage: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flashcardReviewed, setFlashcardReviewed] = useState<Flashcard | null>(null);
  const [indexCurrentFlashcardReviewed, setIndexCurrentFlashcardReviewed] = useState<number | null>(null);
  const [openFlashcardAdder, setOpenFlashcardAdder] = useState<boolean>(false);


  useEffect(() => {
  if(indexCurrentFlashcardReviewed !== null) return setFlashcardReviewed(flashcards[indexCurrentFlashcardReviewed])  
    setFlashcardReviewed(null)
  }, [indexCurrentFlashcardReviewed, flashcards]);

  useEffect(() => {
    const fetchFlashcards = async () => {
      const querySnapshot = await getDocs(collection(db, `decks/${deckId}/flashcards`));
      const flashcardsData: Flashcard[] = querySnapshot.docs.map<Flashcard>(doc => ({
        id: doc.id,
        question: doc.data().question,
        answer: doc.data().answer,
        reviewDate: doc.data().reviewDate.toDate(),
        reviewCount: doc.data().reviewCount,       
      }));
      console.log("flashcardsData", flashcardsData)
      setFlashcards(flashcardsData.filter(flashcard => flashcard.reviewDate.getTime() < new Date().setHours(23, 59, 59, 0)));
    };

    fetchFlashcards();
  }, [deckId]);

  const addFlashcard = async (newQuestion: string, newAnswer: string) => {
    if (newQuestion && newAnswer) {
      const docRef = await addDoc(collection(db, `decks/${deckId}/flashcards`), {
        question: newQuestion,
        answer: newAnswer,
        reviewDate: new Date(),
        reviewCount: 0
      });
      setFlashcards([...flashcards, { id: docRef.id, question: newQuestion, answer: newAnswer, reviewDate: new Date(), reviewCount: 0 }]);
    }
  };
  const nextFlashcard = () => setIndexCurrentFlashcardReviewed(previous => {
    if(previous !== null && previous +1 >= flashcards.length) {
      setFlashcards([])
      return null};  
    return previous !== null ? previous+1 :  0})

  const markAsReviewed = async (flashcardId: string, reviewCount: number, previousReviewDate: Date) => {
    const nextReviewDate = getNextReviewDate(previousReviewDate, reviewCount + 1);
    await updateDoc(doc(db, `decks/${deckId}/flashcards`, flashcardId), {
      reviewDate: nextReviewDate,
      reviewCount: reviewCount + 1
    });
    setFlashcards(flashcards.map(flashcard =>
      flashcard.id === flashcardId ? { ...flashcard, reviewDate: nextReviewDate, reviewCount: reviewCount + 1 } : flashcard
    ));
    nextFlashcard()
  };

  const markAsFailed = async (flashcardId: string) => {
    await updateDoc(doc(db, `decks/${deckId}/flashcards`, flashcardId), {
      reviewDate: new Date(),
      reviewCount: 0
    });
    setFlashcards(flashcards.map(flashcard =>
      flashcard.id === flashcardId ? { ...flashcard, reviewDate: new Date(), reviewCount: 0 } : flashcard
    ));
  };


  return (
    <div>
      <h2>Flashcards</h2>
      {openFlashcardAdder && <FlashcardAdder addFlashcard={addFlashcard}/>}
      {flashcards.length ? <div> {`Nombre de cartes à réviser aujourd'hui : ${flashcards.length}`}
          </div> : <p>You finished all your flashcards for the day, you deverve a break !</p>}

      {flashcardReviewed && <FlashcardViewer 
        question={flashcardReviewed.question}
        answer={flashcardReviewed.answer}
        id={flashcardReviewed.id}
        reviewCount={flashcardReviewed.reviewCount}
        reviewDate={flashcardReviewed.reviewDate}
        markAsReviewed={markAsReviewed}
        markAsFailed={markAsFailed}
       />}
       <button onClick={() => setOpenFlashcardAdder(!openFlashcardAdder)}>{openFlashcardAdder ? "Close" : "Add Flashcard"}</button>
       {flashcardReviewed ? <button onClick={() => setIndexCurrentFlashcardReviewed(null)}>Stop Learning</button> : <button onClick={nextFlashcard}>Start Learning</button>}

       <Link to={"/"}>Back to Decks</Link>

    </div>
  );
}

export default FlashcardPage;