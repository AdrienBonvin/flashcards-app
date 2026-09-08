import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import DeckPage from "./pages/DeckPage";
import FlashcardPage from "./pages/FlashcardPage";
import { ProtectedRoute } from "./components/login/ProtectedRoute";
import { Toast } from "./components/Toast";

const App: React.FC = () => {
  return (
    <>
      <ProtectedRoute>
        <Router>
          <Routes>
            <Route path="/" element={<DeckPage />} />
            <Route path="/deck/:deckId" element={<FlashcardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ProtectedRoute>
      <Toast />
    </>
  );
};

export default App;
