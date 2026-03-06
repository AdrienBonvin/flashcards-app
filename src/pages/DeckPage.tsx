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
    <div className="relative flex flex-col items-center justify-center w-screen h-screen gap-[5vh]">
      {isInfosOpened && (
        <Popin onClose={() => setIsInfosOpened(false)} title="Aide">
          <div className="space-y-6 text-sm text-gray-300">
            <div>
              <h3 className="font-semibold text-primary mb-1">Golden Cards</h3>
              <p>
                Après plusieurs bonnes réponses, une carte devient dorée. Une Golden Card réussie = info acquise, elle disparaît des révisions.
              </p>
              <div className="w-full flex justify-center">
              <img
                src="/src/assets/goldenCardTransformation.png"
                alt="Golden Card"
                className="mt-2 w-64 rounded-lg"
              /></div>
            </div>
            <div>
              <h3 className="font-semibold text-primary mb-2">Les 3 piliers</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded bg-primary/20 text-secondary text-xs">Répétition espacée (Fibonacci)</span>
                <span className="px-2 py-1 rounded bg-primary/20 text-secondary text-xs">Active Recall</span>
                <span className="px-2 py-1 rounded bg-primary/20 text-secondary text-xs">Interface minimaliste</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-contrast mb-2">Conseils flashcard</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-400">
                <li>Concis : minimum de texte</li>
                <li>Une seule idée par carte</li>
                <li>Réponse en quelques mots</li>
              </ul>
            </div>
          </div>
        </Popin>
      )}
      <img src="/icons/logo.png" alt="Logo" className="w-40" />
      <h1 className="text-6xl">Decks</h1>
      {!isAddDeckViewVisible && (
        <div className=" w-8/12">
          <p className="font-bold pb-4 text-center">
            {decks?.length === 0
              ? "Cliquez sur le bouton pour créer votre premier deck"
              : "Commencez à apprendre"}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-center overflow-y-auto max-h-[40vh]">
            {decks
              ?.sort(
                (deckA: Deck, deckB: Deck) =>
                  flashcardUtils.getReviewableCards(deckB.flashcards).length -
                  flashcardUtils.getReviewableCards(deckA.flashcards).length
              )
              .map((deck: Deck) => (
                <li
                  key={deck.id}
                  className="flex flex-row justify-between w-full items-center"
                >
                  <LinkButton
                    to={`/deck/${deck.id}`}
                    variant="primary"
                    additionnalClassName={`w-full text-center font-bold max-w-[300px]`}
                    outlineStyle={
                      flashcardUtils.getReviewableCards(deck.flashcards)
                        .length === 0
                    }
                  >
                    <div className="flex flex-row items-center justify-between w-full h-8 text-lg">
                      {deck.name}
                      {flashcardUtils.getReviewableCards(deck.flashcards)
                        .length === 0 ? (
                        <TaskAlt className="text-primary" />
                      ) : (
                        <p className="flex flex-row gap-2 justify-center items-center">
                          {
                            flashcardUtils.getReviewableCards(deck.flashcards)
                              .length
                          }
                          <ChevronRight className="mr-[-3px]" />
                        </p>
                      )}
                    </div>
                  </LinkButton>
                </li>
              ))}
          </ul>
        </div>
      )}
      {isAddDeckViewVisible && <DeckAdder onClick={onClickAddDeck} />}
      <RoundButton
        onClick={() => setIsAddDeckViewVisible(!isAddDeckViewVisible)}
        position="right"
        className={`${
          decks?.length === 0 &&
          !isAddDeckViewVisible &&
          "border-2 shadow-lg shadow-contrast animate-bounce"
        }`}
      >
        {isAddDeckViewVisible ? <Clear /> : <Add />}
      </RoundButton>
      <RoundButton onClick={logout} position="top-left" className=" top-12">
        <Logout />
      </RoundButton>
      <RoundButton
        onClick={() => setIsInfosOpened(!isInfosOpened)}
        position="top-right"
        className=" top-12"
      >
        <Lightbulb />
      </RoundButton>
    </div>
  );
};

export default DeckPage;
