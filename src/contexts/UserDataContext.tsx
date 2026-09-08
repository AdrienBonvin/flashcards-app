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
  doc,
  query,
  where,
  updateDoc,
  deleteDoc,
  writeBatch,
  Timestamp,
  DocumentData,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { User, onAuthStateChanged, getRedirectResult } from "firebase/auth";

export type FlashcardPatch = Partial<
  Pick<Flashcard, "question" | "answer" | "reviewDate" | "reviewCount" | "archived">
>;

interface UserDataContextProps {
  user: User | null;
  /** Firebase a fini de restaurer (ou non) la session : on peut afficher login ou app */
  isAuthReady: boolean;
  /** null tant que les decks n'ont pas été chargés pour l'utilisateur courant */
  decks: Deck[] | null;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  /** Message d'erreur à afficher à l'utilisateur (toast), null sinon */
  notice: string | null;
  setNotice: (notice: string | null) => void;
  reloadDecks: () => Promise<void>;
  addDeck: (newDeckName: string) => Promise<void>;
  removeDeck: (deckId: string) => Promise<void>;
  editDeckName: (deckId: string, newName: string) => Promise<void>;
  setDeckLastCompletedReviewAt: (deckId: string) => Promise<void>;
  addFlashcard: (deckId: string, question: string, answer: string) => Promise<void>;
  updateFlashcard: (
    deckId: string,
    flashcardId: string,
    patch: FlashcardPatch
  ) => Promise<void>;
  removeFlashcard: (deckId: string, flashcardId: string) => Promise<void>;
}

const UserDataContext = createContext<UserDataContextProps | undefined>(
  undefined
);

const SAVE_ERROR = "Impossible d'enregistrer la modification. Réessayez.";
const LOAD_ERROR = "Impossible de charger vos decks. Vérifiez votre connexion.";

// Firestore limite un batch à 500 opérations
const BATCH_LIMIT = 500;

const toFlashcard = (id: string, data: DocumentData): Flashcard => ({
  id,
  question: data.question ?? "",
  answer: data.answer ?? "",
  reviewDate: data.reviewDate?.toDate?.() ?? new Date(),
  reviewCount: data.reviewCount ?? 0,
  archived: data.archived ?? false,
});

const fetchDecksForUser = async (userId: string): Promise<Deck[]> => {
  const q = query(collection(db, "decks"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  return Promise.all(
    querySnapshot.docs.map(async (deckDoc) => {
      const flashcardsSnapshot = await getDocs(
        collection(db, `decks/${deckDoc.id}/flashcards`)
      );
      const data = deckDoc.data();
      const lastCompletedReviewAt = data.lastCompletedReviewAt?.toDate?.();
      return {
        id: deckDoc.id,
        name: data.name,
        userId: data.userId,
        flashcards: flashcardsSnapshot.docs.map((f) => toFlashcard(f.id, f.data())),
        ...(lastCompletedReviewAt && { lastCompletedReviewAt }),
      };
    })
  );
};

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [decks, setDecks] = useState<Deck[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    // Retour d'un sign-in Google par redirection : l'état auth suivra via onAuthStateChanged
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect sign-in error:", error);
      setNotice("La connexion Google a échoué. Réessayez.");
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      // Session terminée : on ne garde pas les données de l'utilisateur précédent
      if (!currentUser) setDecks(null);
    });
    return () => unsubscribe();
  }, []);

  const reloadDecks = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      setDecks(await fetchDecksForUser(user.uid));
    } catch (error) {
      console.error("Error loading decks:", error);
      setDecks([]);
      setNotice(LOAD_ERROR);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Chargement unique à la connexion : les mutations tiennent ensuite l'état à jour
  useEffect(() => {
    if (user) reloadDecks();
  }, [user, reloadDecks]);

  const patchDeck = useCallback(
    (deckId: string, update: (deck: Deck) => Deck) =>
      setDecks((prev) =>
        prev ? prev.map((d) => (d.id === deckId ? update(d) : d)) : prev
      ),
    []
  );

  const addDeck = async (newDeckName: string) => {
    const name = newDeckName.trim();
    if (!user || !name) return;
    try {
      const docRef = await addDoc(collection(db, "decks"), {
        name,
        userId: user.uid,
      });
      setDecks((prev) => [
        ...(prev ?? []),
        { userId: user.uid, id: docRef.id, name, flashcards: [] },
      ]);
    } catch (error) {
      console.error("Error adding deck:", error);
      setNotice(SAVE_ERROR);
    }
  };

  const removeDeck = async (deckId: string) => {
    try {
      // Supprime la sous-collection flashcards, sinon les docs restent orphelins dans Firestore
      const flashcardsSnapshot = await getDocs(
        collection(db, `decks/${deckId}/flashcards`)
      );
      const refs = [
        ...flashcardsSnapshot.docs.map((f) => f.ref),
        doc(db, "decks", deckId),
      ];
      for (let i = 0; i < refs.length; i += BATCH_LIMIT) {
        const batch = writeBatch(db);
        refs.slice(i, i + BATCH_LIMIT).forEach((ref) => batch.delete(ref));
        await batch.commit();
      }
      setDecks((prev) => prev?.filter((deck) => deck.id !== deckId) ?? prev);
    } catch (error) {
      console.error("Error removing deck:", error);
      setNotice("Impossible de supprimer le deck. Réessayez.");
    }
  };

  const editDeckName = async (deckId: string, newName: string) => {
    const name = newName.trim();
    if (!user || !name) return;
    try {
      await updateDoc(doc(db, "decks", deckId), { name });
      patchDeck(deckId, (deck) => ({ ...deck, name }));
    } catch (error) {
      console.error("Error renaming deck:", error);
      setNotice(SAVE_ERROR);
    }
  };

  const setDeckLastCompletedReviewAt = async (deckId: string) => {
    const now = Timestamp.now();
    try {
      await updateDoc(doc(db, "decks", deckId), { lastCompletedReviewAt: now });
      patchDeck(deckId, (deck) => ({
        ...deck,
        lastCompletedReviewAt: now.toDate(),
      }));
    } catch (error) {
      console.error("Error saving review completion:", error);
    }
  };

  const addFlashcard = async (
    deckId: string,
    question: string,
    answer: string
  ) => {
    const q = question.trim();
    const a = answer.trim();
    if (!q || !a) return;
    const reviewDate = new Date();
    try {
      const docRef = await addDoc(
        collection(db, `decks/${deckId}/flashcards`),
        { question: q, answer: a, reviewDate, reviewCount: 0, archived: false }
      );
      patchDeck(deckId, (deck) => ({
        ...deck,
        flashcards: [
          ...deck.flashcards,
          { id: docRef.id, question: q, answer: a, reviewDate, reviewCount: 0, archived: false },
        ],
      }));
    } catch (error) {
      console.error("Erreur durant l'ajout d'une carte:", error);
      setNotice(SAVE_ERROR);
      throw error;
    }
  };

  const updateFlashcard = async (
    deckId: string,
    flashcardId: string,
    patch: FlashcardPatch
  ) => {
    try {
      await updateDoc(doc(db, `decks/${deckId}/flashcards`, flashcardId), patch);
      patchDeck(deckId, (deck) => ({
        ...deck,
        flashcards: deck.flashcards.map((f) =>
          f.id === flashcardId ? { ...f, ...patch } : f
        ),
      }));
    } catch (error) {
      console.error("Erreur durant la mise à jour d'une carte:", error);
      setNotice(SAVE_ERROR);
    }
  };

  const removeFlashcard = async (deckId: string, flashcardId: string) => {
    try {
      await deleteDoc(doc(db, `decks/${deckId}/flashcards`, flashcardId));
      patchDeck(deckId, (deck) => ({
        ...deck,
        flashcards: deck.flashcards.filter((f) => f.id !== flashcardId),
      }));
    } catch (error) {
      console.error("Erreur durant la suppression d'une carte:", error);
      setNotice("Impossible de supprimer la carte. Réessayez.");
    }
  };

  return (
    <UserDataContext.Provider
      value={{
        user,
        isAuthReady,
        decks,
        isLoading,
        setIsLoading,
        notice,
        setNotice,
        reloadDecks,
        addDeck,
        removeDeck,
        editDeckName,
        setDeckLastCompletedReviewAt,
        addFlashcard,
        updateFlashcard,
        removeFlashcard,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUserDataContext = () => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error(
      "Le context doit être utilisé à l'intérieur d'un UserDataProvider"
    );
  }
  return context;
};
