import PostAdd from "@mui/icons-material/PostAdd";
import { RoundButton } from "./RoundButton";
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
        <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold text-center text-text-primary tracking-tight max-w-full px-4 mb-2">
            {deckName}
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-elevated/80 border border-surface-elevated mb-8 md:mb-10">
            <span className="text-muted text-sm font-medium">Cartes à réviser</span>
            <span className="text-contrast font-bold text-lg tabular-nums">{numberOfCards}</span>
          </div>
          <button
            onClick={() => setIsFlashcardReviewOpened(true)}
            className="group p-3 flex items-center justify-center relative
              hover:scale-110 active:scale-95
              focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:rounded-full
              transition-transform duration-300 ease-smooth cursor-pointer"
            aria-label="Démarrer la révision"
          >
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 md:w-28 h-24 md:h-28 -z-10 blur-xl opacity-70 group-hover:opacity-90 transition-opacity duration-300 rounded-full"
              style={{
                background: "linear-gradient(to right, rgba(0,156,202,0.8), rgba(240,151,45,0.8))",
              }}
            />
            <img
              src="/icons/logo.png"
              alt="Démarrer la révision"
              className="w-28 md:w-36 relative z-0"
            />
          </button>
          <p className="mt-6 text-muted text-sm font-medium flex items-center gap-2">
            Cliquez pour démarrer <TouchApp className="w-4 h-4 opacity-70" />
          </p>
        </div>
      ) : totalCards === 0 ? (
        <div className="flex flex-col items-center text-center px-6 py-12 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-surface-elevated border border-surface-elevated flex items-center justify-center mb-6">
            <PostAdd className="text-primary w-10 h-10" />
          </div>
          <h2 className="font-bold text-xl md:text-2xl text-text-primary mb-2">
            Créez votre première carte
          </h2>
          <p className="text-muted text-sm leading-relaxed">
            Commencez à construire votre deck de révision en ajoutant des cartes.
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center px-6 py-12 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-surface-elevated/80 border border-primary/20 flex items-center justify-center mb-6">
            <Favorite className="text-contrast w-10 h-10" />
          </div>
          <h2 className="font-bold text-xl md:text-2xl text-text-primary mb-2">
            Tout est à jour !
          </h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Il ne reste aucune carte à réviser aujourd'hui. Revenez demain pour continuer.
          </p>
          <img src="/icons/logo.png" alt="Spira" className="w-14 opacity-80" />
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
