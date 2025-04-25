import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { Deck, Flashcard } from "../types";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";

interface UserDataContextProps {
  decks: Deck[] | null;
  setDecks: React.Dispatch<React.SetStateAction<Deck[] | null>>;
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
  const [decks, setDecks] = useState<Deck[] | null>(null);
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const loadData = useCallback(() => {
    if (!user) return;
    setDecks(null);
    const fetchDecks = async () => {
      const q = query(collection(db, "decks"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const decksData = (await Promise.all(
        querySnapshot.docs.map(async (deck) => {
          const flashcardsSnapshot = await getDocs(
            collection(db, `decks/${deck.id}/flashcards`)
          );
          const flashcards = flashcardsSnapshot.docs.map((flashcard) => ({
            id: flashcard.id,
            question: flashcard.data().question,
            answer: flashcard.data().answer,
            reviewDate: flashcard.data().reviewDate?.toDate(),
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
  }, [user]);

  const addDeck = async (newDeckName: string) => {
    if (!user || !newDeckName) return;

    const docRef = await addDoc(collection(db, "decks"), {
      name: newDeckName,
      userId: user.uid,
      flashcards: [],
    });

    if (decks) {
      setDecks([
        ...decks,
        { userId: user.uid, id: docRef.id, name: newDeckName, flashcards: [] },
      ]);
    } else {
      setDecks([
        { userId: user.uid, id: docRef.id, name: newDeckName, flashcards: [] },
      ]);
    }
  };

  const removeDeck = async (deckId: string) => {
    if (!decks) return;
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
