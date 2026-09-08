import Delete from "@mui/icons-material/Delete";
import Edit from "@mui/icons-material/Edit";
import SwapVert from "@mui/icons-material/SwapVert";
import Replay from "@mui/icons-material/Replay";
import EmojiEvents from "@mui/icons-material/EmojiEvents";
import { useMemo, useState } from "react";
import { Flashcard } from "../types";
import { Button } from "./Button";
import FlipCard from "./FlipCard";
import Popin from "./Popin";
import EditCard from "./EditCard";
import { addFibonacci, getDaysTillNextReview } from "../utils/spacedRepetition";
import { Input } from "./Input";

interface FlashcardEditorProps {
  flashcards: Flashcard[];
  removeFlashcard: (flashcardId: string) => void;
  updateFlashcard: (flashcard: Flashcard) => void;
  /** Remet une carte acquise (dorée) dans le cycle de révision */
  restoreFlashcard: (flashcardId: string) => void;
}

const FlashcardEditor: React.FC<FlashcardEditorProps> = ({
  flashcards,
  removeFlashcard,
  updateFlashcard,
  restoreFlashcard,
}) => {
  const [flashcardToEdit, setFlashcardToEdit] = useState<Flashcard | null>(null);
  const [flashcardToDelete, setFlashcardToDelete] = useState<Flashcard | null>(null);
  const [searchbarContent, setSearchbarContent] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const visibleFlashcards = useMemo(() => {
    const needle = searchbarContent.trim().toLowerCase();
    return flashcards
      .filter(
        (flashcard) =>
          !needle ||
          flashcard.question.toLowerCase().includes(needle) ||
          flashcard.answer.toLowerCase().includes(needle)
      )
      .sort((a, b) => {
        // Cartes acquises en fin de liste, puis par nombre de répétitions
        if (a.archived !== b.archived) return a.archived ? 1 : -1;
        return sortOrder === "asc"
          ? a.reviewCount - b.reviewCount
          : b.reviewCount - a.reviewCount;
      });
  }, [flashcards, searchbarContent, sortOrder]);

  const archivedCount = flashcards.filter((f) => f.archived).length;

  return (
    <div className="w-full h-full overflow-y-auto">
      <h1 className="text-3xl font-extrabold mb-6 text-center pt-10">
        Gestion des cartes
      </h1>
      {flashcards.length === 0 ? (
        <div className="text-muted text-center w-full">
          Vous n'avez encore aucune carte dans votre deck.
        </div>
      ) : (
        <>
          {flashcardToEdit && (
            <Popin onClose={() => setFlashcardToEdit(null)} title="Modifier la carte">
              <EditCard
                flashcardToEdit={flashcardToEdit}
                setFlashcardToEdit={setFlashcardToEdit}
                updateFlashcard={updateFlashcard}
              />
            </Popin>
          )}
          {flashcardToDelete && (
            <Popin
              onClose={() => setFlashcardToDelete(null)}
              title="Supprimer la carte ?"
            >
              <div className="flex flex-col gap-6">
                <p className="text-sm text-muted line-clamp-3">
                  « {flashcardToDelete.question} » sera supprimée définitivement.
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    outlineStyle
                    additionnalClassName="flex-1"
                    onClick={() => setFlashcardToDelete(null)}
                  >
                    Annuler
                  </Button>
                  <Button
                    variant="contrast"
                    additionnalClassName="flex-1"
                    onClick={() => {
                      removeFlashcard(flashcardToDelete.id);
                      setFlashcardToDelete(null);
                    }}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </Popin>
          )}
          <p className="text-center w-full font-bold">
            Nombre de cartes :{" "}
            <b className="font-extrabold text-contrast">{flashcards.length}</b>
            {archivedCount > 0 && (
              <span className="block text-sm font-medium text-muted mt-1">
                dont {archivedCount} acquise{archivedCount > 1 ? "s" : ""}
              </span>
            )}
          </p>
          <div className="flex justify-center items-center w-full h-12 mt-8 gap-4 px-2">
            <Input
              type="search"
              value={searchbarContent}
              onChange={(e) => setSearchbarContent(e.target.value)}
              placeholder="Rechercher par mot clef..."
              aria-label="Rechercher une carte"
              className="h-12 max-w-md"
            />
            <Button
              additionnalClassName="h-12 w-12 shrink-0 !px-0"
              onClick={() =>
                setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
              }
              variant="contrast"
              aria-label={
                sortOrder === "asc"
                  ? "Trier par répétitions décroissantes"
                  : "Trier par répétitions croissantes"
              }
            >
              <SwapVert fontSize="large" />
            </Button>
          </div>

          {visibleFlashcards.length === 0 && (
            <p className="text-muted text-center mt-10">
              Aucune carte ne correspond à « {searchbarContent} ».
            </p>
          )}

          <ul className="w-full h-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:py-10 lg:px-20 items-center">
            {visibleFlashcards.map((flashcard) => (
              <li key={flashcard.id} className="relative">
                <div className="w-full h-full flex sm:flex-col lg:flex-col justify-center items-center">
                  <div className="relative w-full h-full flex justify-center items-center">
                    <FlipCard
                      question={flashcard.question}
                      answer={flashcard.answer}
                      goldenCard={flashcard.archived}
                      className="scale-75 h-[25rem] w-60"
                    />
                    {flashcard.archived && (
                      <span className="absolute top-14 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-400 text-amber-950 text-xs font-bold shadow-card">
                        <EmojiEvents className="!w-4 !h-4" />
                        Acquise
                      </span>
                    )}
                  </div>

                  <div className="w-7/12 h-full flex flex-col sm:flex-row lg:flex-row sm:pb-0 lg:pb-4 justify-center items-center gap-4">
                    <Button
                      additionnalClassName="w-24 h-20"
                      onClick={() => setFlashcardToEdit(flashcard)}
                      variant="primary"
                      aria-label="Modifier la carte"
                    >
                      <Edit fontSize="large" />
                    </Button>
                    {flashcard.archived && (
                      <Button
                        additionnalClassName="w-24 h-20"
                        onClick={() => restoreFlashcard(flashcard.id)}
                        variant="contrast"
                        outlineStyle
                        aria-label="Remettre la carte en révision"
                      >
                        <Replay fontSize="large" />
                      </Button>
                    )}
                    <Button
                      additionnalClassName="w-24 h-20"
                      onClick={() => setFlashcardToDelete(flashcard)}
                      variant="contrast"
                      aria-label="Supprimer la carte"
                    >
                      <Delete fontSize="large" />
                    </Button>
                  </div>
                </div>
                <div className="w-full items-center text-center text-sm">
                  {flashcard.archived ? (
                    <p className="text-muted">
                      Carte acquise, retirée des révisions
                    </p>
                  ) : (
                    <>
                      {"Répétition actuelle : "}
                      <b className="font-extrabold text-contrast">
                        {addFibonacci(flashcard.reviewCount)}
                      </b>
                      {" jours"}
                      <p>
                        {"Prochaine apparition : "}
                        <b className="font-extrabold text-contrast">
                          {getDaysTillNextReview(flashcard.reviewDate.getTime())}
                        </b>
                        {" jours"}
                      </p>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default FlashcardEditor;
