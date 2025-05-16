import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

interface DeckAdderProps {
  onClick: (newDeckName: string) => void;
}

export const DeckAdder: React.FC<DeckAdderProps> = ({ onClick }) => {
  const [newDeckName, setNewDeckName] = useState<string>("");
  return (
    <>
      <Input
        maxLength={11}
        value={newDeckName}
        onChange={(e) => setNewDeckName(e.target.value)}
        placeholder="Nom du deck"
        className="w-72"
      />
      <Button
        onClick={() => onClick(newDeckName)}
        variant="primary"
        onTouchStart={(e) => e.preventDefault()}
      >
        Ajouter le Deck
      </Button>
    </>
  );
};
