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
        <div className="flex flex-col items-center justify-center gap-6 md:gap-8 w-full">
          <h1 className="text-3xl md:text-5xl font-extrabold text-center truncate max-w-full px-4">
            {deckName}
          </h1>
          <TextCounter
            text="Cartes aujourd'hui :"
            classNameText="text-muted font-semibold"
            counter={numberOfCards}
          />
          <RoundButton
            className="w-32 h-32 md:w-40 md:h-40 border-2 border-primary/50 bg-primary/5 hover:bg-primary/10 hover:shadow-glow transition-all duration-300"
            onClick={() => setIsFlashcardReviewOpened(true)}
          >
            <Icon
              iconName="deck"
              className="text-primary w-24 md:w-32 stroke-highlight stroke-2"
            />
          </RoundButton>
          <p className="text-muted text-sm font-medium flex items-center gap-2">
            Cliquez sur le deck <TouchApp className="w-4 h-4" />
          </p>
        </div>
      ) : totalCards === 0 ? (
        <div className="text-center px-4">
          <p className="font-extrabold text-lg md:text-xl text-text-primary mb-2">
            Ajoutez votre première carte !
          </p>
          <p className="text-muted text-sm">
            Commencez à construire votre deck de révision
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 text-center px-4">
          <p className="font-bold text-text-secondary">
            Il ne reste aucune carte à réviser aujourd'hui.
          </p>
          <p className="text-muted text-sm">Reviens demain pour continuer !</p>
          <div className="flex flex-col items-center gap-3 pt-4">
            <Favorite className="text-contrast w-12 h-12" />
            <img src="/icons/logo.png" alt="Spira" className="w-16 md:w-20" />
          </div>
        </div>
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
