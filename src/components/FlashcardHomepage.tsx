import PostAdd from "@mui/icons-material/PostAdd";
import { Icon } from "./icons/Icon";
import { RoundButton } from "./RoundButton";
import Celebration from "@mui/icons-material/Celebration";
import { TextCounter } from "./TextCounter";
import { DeleteForever, TouchApp, ViewCarousel } from "@mui/icons-material";

interface FlashcardHomepageProps {
  numberOfCards: number;
  totalCards: number;
  deckName: string;
  setIsFlashcardReviewOpened(isOpened: boolean): void;
  setIsFlashcardAdderOpened(isOpened: boolean): void;
  setIsFlashcardRemoverOpened(isOpened: boolean): void;
  removeDeck(): void;
}

export const FlashcardHomepage: React.FC<FlashcardHomepageProps> = ({
  numberOfCards,
  totalCards,
  deckName,
  setIsFlashcardReviewOpened,
  setIsFlashcardAdderOpened,
  setIsFlashcardRemoverOpened,
  removeDeck,
}) => {
  return (
    <>
      {numberOfCards > 0 ? (
        <div className="flex flex-col items-center justify-center gap-8 w-full">
          <h1 className="text-5xl w-10/12 h-fit text-center overflow-hidden text-nowrap">
            {deckName}
          </h1>
          <TextCounter
            text="Cartes aujourd'hui :"
            classNameText="text-gray-500 font-semibold"
            counter={numberOfCards}
          />
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
          <p className="text-gray-600 mt-[-1rem]">
            Cliquez sur le deck <TouchApp />
          </p>
        </div>
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
      <RoundButton
        onClick={() => setIsFlashcardRemoverOpened(true)}
        position="top-right"
      >
        <ViewCarousel />
      </RoundButton>
      <RoundButton onClick={removeDeck} position="top-left">
        <DeleteForever />
      </RoundButton>
    </>
  );
};
