import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { DECK_NAME_MAX_LENGTH } from "../types";

export const EditDeckName: React.FC<{
  initialDeckName: string;
  onEdit: (newName: string | null) => void;
}> = ({ initialDeckName, onEdit }) => {
  const [newDeckName, setNewDeckName] = useState(initialDeckName);

  const canSubmit = newDeckName.trim() !== "";

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onEdit(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onEdit]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onEdit(newDeckName.trim());
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-deck-name-title"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 px-6 bg-background/95 backdrop-blur-sm"
    >
      <h2 id="edit-deck-name-title" className="text-xl font-bold text-text-primary">
        Modifier le deck
      </h2>
      <Input
        type="text"
        placeholder={initialDeckName}
        value={newDeckName}
        onChange={(e) => setNewDeckName(e.target.value)}
        aria-label="Nom du deck"
        className="w-full max-w-xs"
        maxLength={DECK_NAME_MAX_LENGTH}
        autoFocus
        required
      />
      <div className="flex gap-4">
        <Button type="submit" disabled={!canSubmit} variant="primary">
          Enregistrer
        </Button>
        <Button
          type="button"
          onClick={() => onEdit(null)}
          variant="primary"
          outlineStyle
        >
          Annuler
        </Button>
      </div>
    </form>
  );
};
