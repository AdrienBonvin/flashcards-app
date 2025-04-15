import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import { Deck, Flashcard } from "../types";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";

interface UserDataContextProps {
  decks: Deck[];
  setDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
  selectedDeck: Deck | null;
  setSelectedDeck: React.Dispatch<React.SetStateAction<Deck | null>>;
  addDeck: (newDeckName: string) => Promise<void>;
  removeDeck: (deckId: string) => Promise<void>;
  loadData: () => void;
}

const UserDataContext = createContext<UserDataContextProps | undefined>(
  undefined
);

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);

  const loadData = useCallback(() => {
    const fetchDecks = async () => {
      const querySnapshot = await getDocs(collection(db, "decks"));
      const decksData = (await Promise.all(
        querySnapshot.docs.map(async (deck) => {
          const flashcardsSnapshot = await getDocs(
            collection(db, `decks/${deck.id}/flashcards`)
          );
          const flashcards = flashcardsSnapshot.docs.map((flashcard) => ({
            id: flashcard.id,
            question: flashcard.data().question,
            answer: flashcard.data().answer,
            reviewDate: flashcard.data().reviewDate.toDate(),
            reviewCount: flashcard.data().reviewCount,
          })) as Flashcard[];
          return {
            id: deck.id,
            ...deck.data(),
            flashcards,
          };
        })
      )) as Deck[];
      setDecks(decksData);
    };

    fetchDecks();
  }, []);

  const addDeck = async (newDeckName: string) => {
    if (newDeckName) {
      const docRef = await addDoc(collection(db, "decks"), {
        name: newDeckName,
        flashcards: [],
      });
      setDecks([
        ...decks,
        { id: docRef.id, name: newDeckName, flashcards: [] },
      ]);
    }
  };

  const removeDeck = async (deckId: string) => {
    try {
      await deleteDoc(doc(collection(db, "decks"), deckId));
      setDecks(decks.filter((deck) => deck.id !== deckId));
    } catch (error) {
      console.error("Error removing deck: ", error);
    }
  };

  return (
    <UserDataContext.Provider
      value={{
        decks,
        setDecks,
        selectedDeck,
        setSelectedDeck,
        addDeck,
        removeDeck,
        loadData,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserDataContext = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error(
      "Le context doit être utilisé à l'intérieur d'un UserDataProvider"
    );
  }
  return context;
};
