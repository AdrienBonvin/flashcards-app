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
        <Popin onClose={() => setIsInfosOpened(false)}>
          <h2 className="text-lg font-bold text-center text-primary mb-2">
            Bienvenue sur Spira 📎
          </h2>
          <p className="text-sm text-white mb-4 text-center">
            L'app de flashcards pour apprendre vite et efficacement en un
            minimum d'effort.
          </p>
          <img
            src="/src/assets/goldenCardTransformation.png"
            alt="Carte exemple"
            className="w-44 shadow-lg"
          />
          <p>
            Au bout d'un certain nombre de répétitions réussies, votre carte se
            transformera en Golden Card. Si une Golden card est répondue avec
            succès, l'information qu'elle contient est considérée acquise et
            n'apparaitras plus.
          </p>
          <ul className="list-none text-sm space-y-3 text-white">
            <li>
              🧬 <b className="text-secondary">Répétition Espacée</b> : révisez
              au bon moment avec l’algorithme{" "}
              <span className="text-contrast font-medium">Fibonacci</span>.
            </li>
            <li>
              🧠 <b className="text-secondary">Active Recall</b> : retenez mieux
              en testant votre mémoire plutôt qu’en relisant.
            </li>
            <li>
              🎯 <b className="text-secondary">Interface Minimaliste</b> : pas
              de distractions. Juste l'essentiel.
            </li>
          </ul>
          <div className="border-t border-gray-600 my-4 w-1/3" />
          <p className="text-sm text-white">
            ✨ <b className="text-secondary">Pourquoi Spira ?</b>
            <br />
            Une approche{" "}
            <span className="text-contrast font-medium">scientifique</span> +
            une interface
            <span className="text-contrast font-medium"> claire</span> = un
            apprentissage{" "}
            <span className="text-contrast font-medium">efficace</span>.
            Examens, apprentissage continu, sans prise de tête :{" "}
            <span className="text-secondary font-semibold">Spira</span> vous
            accompagne.
          </p>
          <div className="border-t border-gray-600 my-4 w-1/3" />
          <p className="text-sm text-white">
            💡 <b className="text-contrast">Créer une bonne flashcard :</b>
            <br />
            <ul className="list-none text-sm space-y-3 text-white pt-4">
              <li>
                🧬 <b className="text-secondary">Concis</b> : Mettre un{" "}
                <span className="text-contrast font-medium">minimum</span> de
                texte.
              </li>
              <li>
                🧠{" "}
                <b className="text-secondary">Pas plus d'une réponse / carte</b>{" "}
                Si votre carte contient plusieurs points importants, créer{" "}
                <span className="text-contrast font-medium">
                  plusieurs cartes
                </span>
                .{" "}
              </li>
              <li>
                🎯 <b className="text-secondary">Droit au but</b> : La réponse
                ne doit pas être un paragraphe bien construit mais la réponse en{" "}
                <span className="text-contrast font-medium">quelques mots</span>
                .
              </li>
            </ul>
          </p>
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
