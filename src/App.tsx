import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DeckPage from './pages/DeckPage';
import FlashcardPage from './pages/FlashcardPage';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DeckPage />} />
        <Route path="/deck/:deckId" element={<FlashcardPage />} />
        {<Route path="*" element={<Navigate to="/" />} />}
      </Routes>
    </Router>
  );
};

export default App;