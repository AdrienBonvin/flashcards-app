import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { DECK_NAME_MAX_LENGTH } from "../types";

interface DeckAdderProps {
  onClick: (newDeckName: string) => void;
}

export const DeckAdder: React.FC<DeckAdderProps> = ({ onClick }) => {
  const [newDeckName, setNewDeckName] = useState<string>("");
  const canSubmit = newDeckName.trim() !== "";
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onClick(newDeckName.trim());
      }}
      className="flex flex-col items-center gap-4 w-full max-w-sm"
    >
      <Input
        maxLength={DECK_NAME_MAX_LENGTH}
        value={newDeckName}
        onChange={(e) => setNewDeckName(e.target.value)}
        placeholder="Nom du deck"
        aria-label="Nom du deck"
        className="w-full"
        autoFocus
        required
      />
      <Button
        type="submit"
        disabled={!canSubmit}
        variant="primary"
        additionnalClassName="w-full"
      >
        Ajouter le deck
      </Button>
    </form>
  );
};
