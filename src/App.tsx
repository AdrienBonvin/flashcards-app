import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import DeckPage from './pages/DeckPage';
import FlashcardPage from './pages/FlashcardPage';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DeckPage />} />
        <Route path="/deck/:deckId" element={<FlashcardPage />} />
      </Routes>
    </Router>
  );
};

export default App;