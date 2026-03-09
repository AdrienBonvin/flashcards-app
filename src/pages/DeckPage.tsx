import React, { useEffect, useState } from "react";
import { Deck, flashcardUtils } from "../types";
import { LinkButton } from "../components/LinkButton";
import { RoundButton } from "../components/RoundButton";
import { DeckAdder } from "../components/DeckAdder";
import Add from "@mui/icons-material/Add";
import Clear from "@mui/icons-material/Clear";
import { useUserDataContext } from "../contexts/UserDataContext";
import ChevronRight from "@mui/icons-material/ChevronRight";
import TaskAlt from "@mui/icons-material/TaskAlt";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Logout from "@mui/icons-material/Logout";
import Lightbulb from "@mui/icons-material/Lightbulb";
import Popin from "../components/Popin";

const DeckPage: React.FC = () => {
  const { decks, addDeck, loadData } = useUserDataContext();

  const [isAddDeckViewVisible, setIsAddDeckViewVisible] =
    useState<boolean>(false);

  const [isInfosOpened, setIsInfosOpened] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const onClickAddDeck = (newDeckName: string) => {
    if (newDeckName) {
      addDeck(newDeckName);
      setIsAddDeckViewVisible(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full px-6 py-16 md:py-24">
      {isInfosOpened && (
        <Popin onClose={() => setIsInfosOpened(false)} title="Aide">
          <div className="space-y-6 text-sm text-text-secondary">
            <div>
              <h3 className="font-semibold text-primary mb-1">Golden Cards</h3>
              <p>
                Après plusieurs bonnes réponses, une carte devient dorée. Une
                Golden Card réussie = info acquise, elle disparaît des révisions.
              </p>
              <div className="w-full flex justify-center">
                <img
                  src="/src/assets/goldenCardTransformation.png"
                  alt="Golden Card"
                  className="mt-2 w-64 rounded-xl"
                />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Les 3 piliers</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-primary/20 text-secondary text-xs font-medium">
                  Répétition espacée (Fibonacci)
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-primary/20 text-secondary text-xs font-medium">
                  Active Recall
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-primary/20 text-secondary text-xs font-medium">
                  Interface minimaliste
                </span>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-contrast mb-2">
                Conseils flashcard
              </h3>
              <ul className="list-disc list-inside space-y-1 text-muted">
                <li>Concis : minimum de texte</li>
                <li>Une seule idée par carte</li>
                <li>Réponse en quelques mots</li>
              </ul>
            </div>
          </div>
        </Popin>
      )}

      <header className="flex flex-col items-center mb-8 md:mb-12">
        <img
          src="/icons/logo.png"
          alt="Spira"
          className="w-28 md:w-36 h-auto mb-6"
        />
        <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight">
          Decks
        </h1>
      </header>

      {!isAddDeckViewVisible && (
        <main className="w-full max-w-3xl">
          <p className="font-semibold pb-6 text-center text-muted text-base md:text-lg">
            {decks?.length === 0
              ? "Cliquez sur le bouton pour créer votre premier deck"
              : "Commencez à apprendre"}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 max-h-[45vh] overflow-y-auto pr-1 scrollbar-thin">
            {decks
              ?.sort(
                (deckA: Deck, deckB: Deck) =>
                  flashcardUtils.getReviewableCards(deckB.flashcards).length -
                  flashcardUtils.getReviewableCards(deckA.flashcards).length
              )
              .map((deck: Deck) => {
                const reviewCount = flashcardUtils.getReviewableCards(
                  deck.flashcards
                ).length;
                const isComplete = reviewCount === 0;

                return (
                  <li key={deck.id}>
                    <LinkButton
                      to={`/deck/${deck.id}`}
                      variant="primary"
                      additionnalClassName={`w-full text-center font-bold py-4 px-5 rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-200 ${
                        isComplete ? "border-2 border-primary/50" : ""
                      }`}
                      outlineStyle={isComplete}
                    >
                      <div className="flex flex-row items-center justify-between w-full gap-3">
                        <span className="truncate text-left flex-1">
                          {deck.name}
                        </span>
                        {isComplete ? (
                          <TaskAlt className="text-primary shrink-0 w-6 h-6" />
                        ) : (
                          <span className="flex items-center gap-1 shrink-0 text-sm font-semibold">
                            {reviewCount}
                            <ChevronRight className="w-5 h-5" />
                          </span>
                        )}
                      </div>
                    </LinkButton>
                  </li>
                );
              })}
          </ul>
        </main>
      )}

      {isAddDeckViewVisible && <DeckAdder onClick={onClickAddDeck} />}

      <RoundButton
        onClick={() => setIsAddDeckViewVisible(!isAddDeckViewVisible)}
        position="right"
        className={
          decks?.length === 0 && !isAddDeckViewVisible
            ? "border-2 border-primary shadow-glow animate-bounce"
            : ""
        }
      >
        {isAddDeckViewVisible ? <Clear /> : <Add />}
      </RoundButton>
      <RoundButton onClick={logout} position="top-left">
        <Logout />
      </RoundButton>
      <RoundButton onClick={() => setIsInfosOpened(!isInfosOpened)} position="top-right">
        <Lightbulb />
      </RoundButton>
    </div>
  );
};

export default DeckPage;
