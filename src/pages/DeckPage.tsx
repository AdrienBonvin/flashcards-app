import React, { useEffect, useState } from "react";
import { flashcardUtils } from "../types";
import { LinkButton } from "../components/LinkButton";
import { RoundButton } from "../components/RoundButton";
import { DeckAdder } from "../components/DeckAdder";
import { Icon } from "../components/icons/Icon";
import Add from "@mui/icons-material/Add";
import Clear from "@mui/icons-material/Clear";
import { useUserDataContext } from "../contexts/UserDataContext";
import ChevronRight from "@mui/icons-material/ChevronRight";
import TaskAlt from "@mui/icons-material/TaskAlt";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";

const DeckPage: React.FC = () => {
  const { decks, addDeck, loadData } = useUserDataContext();

  const [isAddDeckViewVisible, setIsAddDeckViewVisible] =
    useState<boolean>(false);

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
    <div className="relative flex flex-col items-center justify-center w-screen h-screen gap-20">
      <div className="flex flex-col items-center gap-8">
        <Icon iconName="cards" className="text-white w-28" />
        <h1 className="text-7xl">Decks</h1>
      </div>
      {!isAddDeckViewVisible && (
        <ul className="flex flex-col gap-4 items-center justify-center w-3/4">
          <p className="font-bold pb-3 text-center">
            {decks.length === 0
              ? "Cliquez sur le bouton pour créer votre premier deck"
              : "Commencez à apprendre"}
          </p>
          {decks
            .sort(
              (deckA, deckB) =>
                flashcardUtils.getReviewableCards(deckB.flashcards).length -
                flashcardUtils.getReviewableCards(deckA.flashcards).length
            )
            .map((deck) => (
              <li
                key={deck.id}
                className="flex flex-row justify-between w-[60vw]"
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
      )}
      {isAddDeckViewVisible && <DeckAdder onClick={onClickAddDeck} />}
      <RoundButton
        onClick={() => setIsAddDeckViewVisible(!isAddDeckViewVisible)}
        position="right"
        className={`${
          decks.length === 0 &&
          !isAddDeckViewVisible &&
          "border-2 shadow-lg shadow-contrast"
        }`}
      >
        {isAddDeckViewVisible ? <Clear /> : <Add />}
      </RoundButton>
      <RoundButton onClick={logout} position="top" className=" top-12">
        <Clear />
      </RoundButton>
    </div>
  );
};

export default DeckPage;
