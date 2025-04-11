import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Deck } from "../types";
import { LinkButton } from "../components/LinkButton";
import { RoundButton } from "../components/RoundButton";
import { DeckAdder } from "../components/DeckAdder";

const DeckPage: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [isAddDeckViewVisible, setIsAddDeckViewVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchDecks = async () => {
      const querySnapshot = await getDocs(collection(db, "decks"));
      const decksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Deck[];
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
      setIsAddDeckViewVisible(false);
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
    <div className="relative flex flex-col items-center justify-center w-screen h-screen gap-20">
      <h1>Decks</h1>
      <ul className="flex flex-col gap-4">
        {decks.map((deck) => (
          <li key={deck.id} className="flex flex-row justify-between w-[60vw]">
            <LinkButton to={`/deck/${deck.id}`} variant="contrast" outlineStyle>
              {deck.name}
            </LinkButton>
            <RoundButton
              onClick={() => removeDeck(deck.id)}
              position="inline"
              className="border-highlight"
            >
              🗑️
            </RoundButton>
          </li>
        ))}
      </ul>
      {isAddDeckViewVisible && <DeckAdder onClick={addDeck}></DeckAdder>}
      <RoundButton
        onClick={() => setIsAddDeckViewVisible(!isAddDeckViewVisible)}
        position="right"
      >
        {isAddDeckViewVisible ? "X" : "+"}
      </RoundButton>
    </div>
  );
};

export default DeckPage;
