import React, { useState, useEffect } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Deck } from '../types';
import { Link } from 'react-router-dom';

const DeckPage: React.FC = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [newDeckName, setNewDeckName] = useState('');

  useEffect(() => {
    const fetchDecks = async () => {
      const querySnapshot = await getDocs(collection(db, 'decks'));
      const decksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Deck[];
      setDecks(decksData);
    };

    fetchDecks();
  }, []);

  const addDeck = async () => {
    if (newDeckName) {
      const docRef = await addDoc(collection(db, 'decks'), {
        name: newDeckName,
        flashcards: []
      });
      setDecks([...decks, { id: docRef.id, name: newDeckName, flashcards: [] }]);
      setNewDeckName('');
    }
  };

  const removeDeck = async (deckId: string) => {
    try {
      await deleteDoc(doc(collection(db, 'decks'), deckId));
      setDecks(decks.filter(deck => deck.id !== deckId));
    } catch (error) {
      console.error("Error removing deck: ", error);
    }
  };

  return (
    <div>
      <h1>My Decks</h1>
      <input
        type="text"
        value={newDeckName}
        onChange={(e) => setNewDeckName(e.target.value)}
        placeholder="New Deck Name"
      />
      <button onClick={addDeck}>Add Deck</button>
      <ul>
        {decks.map(deck => (<>
            <li key={deck.id}><Link to={`/deck/${deck.id}`} >{deck.name}</Link></li>
            <button onClick={() =>removeDeck(deck.id)}>Remove Deck</button>
            </>
        ))}
      </ul>
    </div>
  );
};

export default DeckPage;