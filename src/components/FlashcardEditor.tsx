import Delete from "@mui/icons-material/Delete";
import { Flashcard } from "../types";
import { Button } from "./Button";
import FlipCard from "./FlipCard";
import Edit from "@mui/icons-material/Edit";
import { useState } from "react";
import Popin from "./Popin";

interface FlashcarEditorProps {
  flashcards: Flashcard[];
  removeFlashcard: (flashcardId: string) => void;
  updateFlashcard: (flashcard: Flashcard) => void;
}

const FlashcardEditor: React.FC<FlashcarEditorProps> = ({
  flashcards,
  removeFlashcard,
  updateFlashcard,
}) => {
  const [flashcardToEdit, setFlashcardToEdit] = useState<Flashcard | null>(
    null
  );
  return (
    <div className="w-full h-full overflow-y-scroll">
      <h1 className="text-3xl font-extrabold mb-6 text-center pt-10">
        Remove Flashcards
      </h1>
      {flashcards.length === 0 ? (
        <div className="text-gray-500 text-center w-full">
          No flashcards available to delete.
        </div>
      ) : (
        <>
          {flashcardToEdit && (
            <Popin onClose={() => setFlashcardToEdit(null)}>
              <div className="h-full w-full flex flex-col justify-between">
                <p
                  contentEditable
                  suppressContentEditableWarning
                  className="outline-none text-center overflow-y-auto break-words>"
                  onBlur={(e) =>
                    setFlashcardToEdit((prev) =>
                      prev
                        ? { ...prev, question: e.target.textContent || "" }
                        : null
                    )
                  }
                >
                  {flashcardToEdit.question}
                </p>
                <p className="text-center text-gray-500">
                  _____________________________
                </p>
                <p
                  contentEditable
                  suppressContentEditableWarning
                  className="outline-none text-center overflow-y-auto break-words"
                  onBlur={(e) =>
                    setFlashcardToEdit((prev) =>
                      prev
                        ? { ...prev, answer: e.target.textContent || "" }
                        : null
                    )
                  }
                >
                  {flashcardToEdit.answer}
                </p>
                <Button
                  additionnalClassName="mt-4"
                  onClick={() => {
                    if (flashcardToEdit) updateFlashcard(flashcardToEdit);
                    setFlashcardToEdit(null);
                  }}
                  variant={"primary"}
                >
                  Save
                </Button>
              </div>
            </Popin>
          )}
          <p className=" text-center w-full font-bold">
            Total cards :
            <b className="font-extrabold text-contrast">{flashcards.length}</b>
          </p>

          <ul className="w-full h-full flex flex-col gap-4">
            {flashcards.map((flashcard) => (
              <li
                key={flashcard.id}
                className="w-11/12 h-full flex gap-0 justify-center items-center"
              >
                <div className="w-full h-full flex justify-center items-center">
                  <FlipCard
                    question={flashcard.question}
                    answer={flashcard.answer}
                    className={"scale-75 h-[50vh]"}
                  />
                </div>
                <div className="h-full flex flex-col justify-center items-center gap-4">
                  <div>
                    <Button
                      additionnalClassName="w-24 h-20"
                      onClick={() => setFlashcardToEdit(flashcard)}
                      variant={"primary"}
                    >
                      <Edit fontSize="large" />
                    </Button>
                  </div>
                  <div>
                    <Button
                      additionnalClassName="w-24 h-20"
                      onClick={() => removeFlashcard(flashcard.id)}
                      variant={"contrast"}
                    >
                      <Delete fontSize="large" />
                    </Button>
                  </div>
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
