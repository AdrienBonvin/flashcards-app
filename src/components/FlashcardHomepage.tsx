import { RoundButton } from "./RoundButton";

import { RoundButtonMenu } from "./RoundButtonMenu";
import { Icon } from "./icons/Icon";

interface FlashcardHomepageProps {
  numberOfCards: number;
  totalCards: number;
  deckName: string;
  startReview(): void;
  setIsFlashcardAdderOpened(isOpened: boolean): void;
  setIsFlashcardRemoverOpened(isOpened: boolean): void;
  removeDeck(): void;
  editDeckName(): void;
  isReaderEnabled: boolean;
  toggleReader(): void;
}

export const FlashcardHomepage: React.FC<FlashcardHomepageProps> = ({
  numberOfCards,
  totalCards,
  deckName,
  startReview,
  setIsFlashcardAdderOpened,
  setIsFlashcardRemoverOpened,
  removeDeck,
  editDeckName,
  isReaderEnabled,
  toggleReader,
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
            onClick={startReview}
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
              src="/icons/logo-512.png"
              alt=""
              width={144}
              height={144}
              className="w-28 md:w-36 relative z-0"
            />
          </button>
          <p className="mt-6 text-muted text-sm font-medium flex items-center gap-2">
            Cliquez pour démarrer <Icon name="touch-app" className="w-4 h-4 opacity-70" />
          </p>
          <button
            onClick={toggleReader}
            aria-pressed={isReaderEnabled}
            className={`mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              isReaderEnabled
                ? "bg-primary/15 border-primary/50 text-primary"
                : "bg-surface-elevated/80 border-surface-elevated text-muted"
            }`}
          >
            {isReaderEnabled ? (
              <Icon name="volume-up" className="w-4 h-4" />
            ) : (
              <Icon name="volume-off" className="w-4 h-4" />
            )}
            Lecture audio {isReaderEnabled ? "activée" : "désactivée"}
          </button>
        </div>
      ) : totalCards === 0 ? (
        <div className="flex flex-col items-center text-center px-6 py-12 max-w-md mx-auto">
          <div className="w-20 h-20 rounded-2xl bg-surface-elevated border border-surface-elevated flex items-center justify-center mb-6">
            <Icon name="post-add" className="text-primary w-10 h-10" />
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
            <Icon name="favorite" className="text-contrast w-10 h-10" />
          </div>
          <h2 className="font-bold text-xl md:text-2xl text-text-primary mb-2">
            Tout est à jour !
          </h2>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Il ne reste aucune carte à réviser aujourd'hui. Revenez demain pour continuer.
          </p>
          <img
            src="/icons/logo-512.png"
            alt=""
            width={56}
            height={56}
            className="w-14 opacity-80"
          />
        </div>
      )}
      <RoundButtonMenu
        mainIcon={<Icon name="web-stories" />}
        label="Gérer les cartes"
        position="right"
        classNameClosed={
          totalCards === 0 ? "shadow-md shadow-contrast animate-bounce" : ""
        }
      >
        <>
          <RoundButton
            onClick={() => setIsFlashcardAdderOpened(true)}
            aria-label="Ajouter des cartes"
            className={
              totalCards === 0 ? "shadow-md shadow-contrast animate-bounce" : ""
            }
          >
            <Icon name="post-add" />
          </RoundButton>
          <RoundButton
            onClick={() => setIsFlashcardRemoverOpened(true)}
            aria-label="Voir et modifier les cartes"
          >
            <Icon name="view-carousel" />
          </RoundButton>
        </>
      </RoundButtonMenu>
      <RoundButtonMenu mainIcon={<Icon name="menu" />} label="Options du deck" position="top-right">
        <>
          <RoundButton onClick={editDeckName} aria-label="Renommer le deck">
            <Icon name="drive-file-rename-outline" />
          </RoundButton>
          <RoundButton onClick={removeDeck} aria-label="Supprimer le deck">
            <Icon name="delete-forever" />
          </RoundButton>
        </>
      </RoundButtonMenu>
    </>
  );
};
