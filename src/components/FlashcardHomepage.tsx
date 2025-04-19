import PostAdd from "@mui/icons-material/PostAdd";
import { Icon } from "./icons/Icon";
import { RoundButton } from "./RoundButton";
import Celebration from "@mui/icons-material/Celebration";
import Delete from "@mui/icons-material/Delete";
import { TextCounter } from "./TextCounter";

interface FlashcardHomepageProps {
  numberOfCards: number;
  totalCards: number;
  deckName: string;
  setIsFlashcardReviewOpened(isOpened: boolean): void;
  setIsFlashcardAdderOpened(isOpened: boolean): void;
  removeDeck(): void;
}

export const FlashcardHomepage: React.FC<FlashcardHomepageProps> = ({
  numberOfCards,
  totalCards,
  deckName,
  setIsFlashcardReviewOpened,
  setIsFlashcardAdderOpened,
  removeDeck,
}) => {
  return (
    <>
      {numberOfCards > 0 ? (
        <>
          <RoundButton
            position={"inline"}
            className="w-40 h-40 border-none"
            onClick={() => setIsFlashcardReviewOpened(true)}
          >
            <Icon
              iconName="deck"
              className="text-primary w-40 stroke-highlight stroke-2"
            />
          </RoundButton>
          <h1 className="text-7xl w-4/5 text-center">{deckName}</h1>
          <TextCounter
            text="Cartes d'aujourd'hui"
            classNameText="text-gray-500 font-semibold"
            counter={numberOfCards}
          />
        </>
      ) : totalCards === 0 ? (
        <p className="w-3/4 text-center font-extrabold">
          Ajoutez votre première carte !
        </p>
      ) : (
        <>
          <p className="w-3/4 text-center font-extrabold">
            Il ne reste aucune carte à réviser aujourd'hui, tu as mérité un café
            !
          </p>
          <Celebration />
        </>
      )}
      <RoundButton
        onClick={() => setIsFlashcardAdderOpened(true)}
        position="right"
        className={totalCards === 0 ? "shadow-lg shadow-contrast" : ""}
      >
        <PostAdd />
      </RoundButton>
      <RoundButton onClick={removeDeck} position="top">
        <Delete />
      </RoundButton>
    </>
  );
};
