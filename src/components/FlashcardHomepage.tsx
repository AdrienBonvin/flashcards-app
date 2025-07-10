import PostAdd from "@mui/icons-material/PostAdd";
import { Icon } from "./icons/Icon";
import { RoundButton } from "./RoundButton";
import { TextCounter } from "./TextCounter";
import DeleteForever from "@mui/icons-material/DeleteForever";
import Menu from "@mui/icons-material/Menu";
import TouchApp from "@mui/icons-material/TouchApp";
import ViewCarousel from "@mui/icons-material/ViewCarousel";

import Favorite from "@mui/icons-material/Favorite";
import { RoundButtonMenu } from "./RoundButtonMenu";
import DriveFileRenameOutline from "@mui/icons-material/DriveFileRenameOutline";
import WebStories from "@mui/icons-material/WebStories";

interface FlashcardHomepageProps {
  numberOfCards: number;
  totalCards: number;
  deckName: string;
  setIsFlashcardReviewOpened(isOpened: boolean): void;
  setIsFlashcardAdderOpened(isOpened: boolean): void;
  setIsFlashcardRemoverOpened(isOpened: boolean): void;
  removeDeck(): void;
  editDeckName(): void;
}

export const FlashcardHomepage: React.FC<FlashcardHomepageProps> = ({
  numberOfCards,
  totalCards,
  deckName,
  setIsFlashcardReviewOpened,
  setIsFlashcardAdderOpened,
  setIsFlashcardRemoverOpened,
  removeDeck,
  editDeckName,
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
          <p className="w-3/4 text-center font-bold text-gray-400">
            Il ne reste aucune carte à réviser aujourd'hui, reviens demain !
          </p>
          <div className="flex flex-col items-center gap-2">
            <Favorite className="text-contrast" />
            <img src="/icons/logo.png" className="w-20" />
          </div>
        </>
      )}
      <RoundButtonMenu
        mainIcon={<WebStories />}
        position="right"
        classNameClosed={
          totalCards === 0 ? "shadow-md shadow-contrast animate-bounce" : ""
        }
      >
        <>
          <RoundButton
            onClick={() => setIsFlashcardAdderOpened(true)}
            className={
              totalCards === 0 ? "shadow-md shadow-contrast animate-bounce" : ""
            }
          >
            <PostAdd />
          </RoundButton>
          <RoundButton onClick={() => setIsFlashcardRemoverOpened(true)}>
            <ViewCarousel />
          </RoundButton>
        </>
      </RoundButtonMenu>
      <RoundButtonMenu mainIcon={<Menu />} position="top-right">
        <>
          <RoundButton onClick={editDeckName}>
            <DriveFileRenameOutline />
          </RoundButton>
          <RoundButton onClick={removeDeck}>
            <DeleteForever />
          </RoundButton>
        </>
      </RoundButtonMenu>
    </>
  );
};
