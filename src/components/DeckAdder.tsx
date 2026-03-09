import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

interface DeckAdderProps {
  onClick: (newDeckName: string) => void;
}

export const DeckAdder: React.FC<DeckAdderProps> = ({ onClick }) => {
  const [newDeckName, setNewDeckName] = useState<string>("");
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <Input
        maxLength={11}
        value={newDeckName}
        onChange={(e) => setNewDeckName(e.target.value)}
        placeholder="Nom du deck"
        className="w-full"
      />
      <Button
        onClick={() => onClick(newDeckName)}
        variant="primary"
        onTouchStart={(e) => e.preventDefault()}
        additionnalClassName="w-full"
      >
        Ajouter le deck
      </Button>
    </div>
  );
};
