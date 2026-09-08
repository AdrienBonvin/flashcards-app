import React, { useState } from "react";
import { Deck, flashcardUtils } from "../types";
import { Link } from "react-router-dom";
import { RoundButton } from "../components/RoundButton";
import { DeckAdder } from "../components/DeckAdder";
import Add from "@mui/icons-material/Add";
import Clear from "@mui/icons-material/Clear";
import { useUserDataContext } from "../contexts/UserDataContext";
import ChevronRight from "@mui/icons-material/ChevronRight";
import Check from "@mui/icons-material/Check";
import EmojiEvents from "@mui/icons-material/EmojiEvents";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import Logout from "@mui/icons-material/Logout";
import Lightbulb from "@mui/icons-material/Lightbulb";
import Popin from "../components/Popin";
import goldenCardTransformation from "../assets/goldenCardTransformation-512.png";

const isSameCalendarDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const DeckPage: React.FC = () => {
  const { decks, addDeck } = useUserDataContext();

  const [isAddDeckViewVisible, setIsAddDeckViewVisible] =
    useState<boolean>(false);

  const [isInfosOpened, setIsInfosOpened] = useState<boolean>(false);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const onClickAddDeck = (newDeckName: string) => {
    if (newDeckName.trim()) {
      addDeck(newDeckName);
      setIsAddDeckViewVisible(false);
    }
  };

  // Copie avant tri : .sort() en place muterait l'état du contexte pendant le rendu
  const sortedDecks = decks
    ? [...decks].sort(
        (deckA: Deck, deckB: Deck) =>
          flashcardUtils.getReviewableCards(deckB.flashcards).length -
          flashcardUtils.getReviewableCards(deckA.flashcards).length
      )
    : [];

  return (
    <div className="relative flex flex-col items-center justify-center min-h-dvh w-full px-6 py-16 md:py-24">
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
                  src={goldenCardTransformation}
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

      <header className="shrink-0 flex flex-col items-center mb-8 md:mb-12">
        <img
          src="/icons/logo-512.png"
          alt="Spira"
          width={144}
          height={144}
          className="w-28 md:w-36 h-auto mb-6"
        />
        <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight">
          Decks
        </h1>
      </header>

      <main className="w-full max-w-2xl min-h-0 flex flex-col">
        <p className="shrink-0 font-medium pb-6 text-center text-muted text-sm md:text-base">
          {decks?.length === 0
            ? "Cliquez sur le bouton pour créer votre premier deck"
            : "Vos révisions du jour :"}
        </p>
        {/* min-h-0 : autorise la liste à rétrécir et scroller au lieu d'être coupée sur petit écran */}
        <div className="relative w-full isolate pt-4 min-h-0 flex flex-col">
          <ul className="deck-list-scroll relative z-0 min-h-0 space-y-3 max-h-[50vh] overflow-y-auto overflow-x-hidden pt-2 pb-7 px-2 sm:px-3">
            {sortedDecks.map((deck: Deck) => {
                const reviewCount = flashcardUtils.getReviewableCards(
                  deck.flashcards
                ).length;
                const totalCards = deck.flashcards.length;
                const isEmpty = totalCards === 0;
                const isUpToDate = reviewCount === 0;
                const isCompletedToday =
                  isUpToDate &&
                  totalCards > 0 &&
                  deck.lastCompletedReviewAt &&
                  isSameCalendarDay(deck.lastCompletedReviewAt, new Date());

                return (
                  <li key={deck.id} className="">
                    <Link
                      to={`/deck/${deck.id}`}
                      className={`group relative flex items-center gap-4 w-full p-4 md:p-5 rounded-2xl
                        transition-all duration-300 ease-smooth active:scale-[0.99]
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
                        ${isUpToDate
                          ? "overflow-hidden bg-gradient-to-br from-primary/12 via-primary/6 to-primary/3 border-2 border-primary/30 hover:border-primary/50 shadow-card hover:shadow-[0_0_24px_-4px_rgba(0,156,202,0.35)]"
                          : "overflow-visible deck-card-border-glow bg-gradient-to-r from-primary/20 via-surface to-contrast/15 border-2 border-primary/50 hover:border-primary hover:scale-[1.03]"
                        }`}
                    >
                      {!isUpToDate && (
                        <span
                          className="absolute left-0 top-2 bottom-2 w-2 rounded-r-full bg-gradient-to-b from-primary to-contrast shadow-[0_0_12px_rgba(0,156,202,0.5)] group-hover:shadow-[0_0_16px_rgba(0,156,202,0.6)] transition-all"
                          aria-hidden
                        />
                      )}
                      <div className="flex-1 min-w-0 pl-1">
                        <span className="block truncate font-semibold text-text-primary text-base md:text-lg">
                          {deck.name}
                        </span>
                        <span className="block text-sm text-muted mt-0.5">
                          {totalCards} carte{totalCards !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {isUpToDate ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary/10 text-primary/90 text-xs font-medium">
                            {isEmpty ? (
                              "C'est vide ici !"
                            ) : (
                              <>
                                {isCompletedToday ? (
                                  <EmojiEvents className="w-3.5 h-3.5" />
                                ) : (
                                  <Check className="w-3.5 h-3.5" />
                                )}
                                {isCompletedToday
                                  ? "Terminé !"
                                  : "Aucune révision aujourd'hui"}
                              </>
                            )}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-3">
                            <span className="px-4 py-2 rounded-xl bg-contrast text-background text-lg font-extrabold tabular-nums shadow-[0_0_24px_-4px_rgba(240,151,45,0.6)] ring-2 ring-contrast/50">
                              {reviewCount}
                            </span>
                            <span className="text-contrast text-sm font-semibold hidden sm:inline">
                              à réviser
                            </span>
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-primary/25 text-primary/70 group-hover:border-primary/50 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-200">
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
          </ul>
          {/* Above the list in paint order so the fade is visible; pointer-events-none keeps scrolling usable */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 z-10 h-7 bg-gradient-to-b from-background via-background/80 to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-7 bg-gradient-to-t from-background via-background/80 to-transparent"
            aria-hidden
          />
        </div>
      </main>

      {isAddDeckViewVisible && <DeckAdder onClick={onClickAddDeck} />}

      <RoundButton
        onClick={() => setIsAddDeckViewVisible(!isAddDeckViewVisible)}
        position="right"
        aria-label={isAddDeckViewVisible ? "Annuler" : "Créer un deck"}
        aria-expanded={isAddDeckViewVisible}
        className={
          decks?.length === 0 && !isAddDeckViewVisible
            ? "border-2 border-primary shadow-glow animate-bounce"
            : ""
        }
      >
        {isAddDeckViewVisible ? <Clear /> : <Add />}
      </RoundButton>
      <RoundButton onClick={logout} position="top-left" aria-label="Se déconnecter">
        <Logout />
      </RoundButton>
      <RoundButton
        onClick={() => setIsInfosOpened(!isInfosOpened)}
        position="top-right"
        aria-label="Aide"
      >
        <Lightbulb />
      </RoundButton>
    </div>
  );
};

export default DeckPage;
