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
import { Loader } from "../components/Loader";
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
    <Loader loading={decks === null}>
      <div className="relative flex flex-col items-center justify-center w-screen h-screen gap-[5vh]">
        {isInfosOpened && (
          <Popin onClose={() => setIsInfosOpened(false)}>
            <h1 className="text-xl font-bold text-center py-2">
              Bienvenue sur Spira 🎓
            </h1>
            <p className="text-md font-bold">
              <span className="text-primary">Spira</span> est une application de
              flashcards conçue pour optimiser votre apprentissage grâce à des
              techniques éprouvées et un design simple et épuré. Voici ce qui
              rend <span className="text-primary">Spira</span> aussi efficace :
            </p>
            <ul className="list-disc pl-6 text-md">
              <li>
                🚀 <b>Apprentissage Efficace avec la Répétition Espacée</b> :
                <span className="text-highlight">Spira</span> utilise
                l'algorithme de la{" "}
                <span className="text-contrast">suite de Fibonacci</span> pour
                planifier vos révisions. Cette méthode maximise la rétention des
                informations en espaçant les révisions de manière optimale.
              </li>
              <li>
                🧠 <b>Active Recall : Stimulez votre Mémoire</b> : L'application
                utilise l'
                <span className="text-highlight">active recall</span>, une
                technique qui consiste à se souvenir activement des réponses
                plutôt que de simplement relire les informations. Cela renforce
                vos connexions neuronales et améliore votre mémoire à long
                terme.
              </li>
              <li>
                🎯 <b>Un Design Simple et Intuitif</b> : Pas de distractions
                inutiles : <span className="text-primary">Spira</span> se
                concentre sur l'essentiel pour vous offrir une expérience fluide
                et agréable. Une interface claire et minimaliste pour vous aider
                à rester concentré sur vos objectifs et réviser rapidement et
                efficacement.
              </li>
            </ul>
            <p className="text-md font-bold">
              🌟 <b>Pourquoi Choisir Spira ?</b> Contrairement aux applications
              classiques,
              <span className="text-primary">Spira</span> combine des techniques
              modernes d'apprentissage avec une approche scientifique pour
              garantir des résultats, le tout derrière une interface travaillée
              et ergonomique. Que vous prépariez un examen, appreniez une
              nouvelle langue ou consolidiez vos connaissances,
              <span className="text-primary">Spira</span> est votre compagnon
              idéal.
            </p>
            <p className="text-md font-bold">
              <b>Astuce :</b> Cliquez sur un deck pour commencer à réviser ou
              créez votre premier deck pour démarrer votre apprentissage !
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
            <ul className="flex flex-col gap-3 items-center overflow-y-auto max-h-[40vh]">
              {decks
                ?.sort(
                  (deckA: Deck, deckB: Deck) =>
                    flashcardUtils.getReviewableCards(deckB.flashcards).length -
                    flashcardUtils.getReviewableCards(deckA.flashcards).length
                )
                .map((deck: Deck) => (
                  <li
                    key={deck.id}
                    className="flex flex-row justify-between w-full"
                  >
                    <LinkButton
                      to={`/deck/${deck.id}`}
                      variant="primary"
                      additionnalClassName={`w-full text-center font-bold`}
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
            "border-2 shadow-lg shadow-contrast"
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
    </Loader>
  );
};

export default DeckPage;
