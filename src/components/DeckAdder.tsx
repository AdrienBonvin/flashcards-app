import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

interface DeckAdderProps {
    onClick: (newDeckName: string) => void;
}

export const DeckAdder : React.FC<DeckAdderProps> = ({onClick}) => {
    const [newDeckName, setNewDeckName] = useState<string>('')
    return(<>
          <Input
            value={newDeckName}
            onChange={(e) => setNewDeckName(e.target.value)}
            placeholder="New Deck Name"
          />
          <Button onClick={() => onClick(newDeckName)} variant="primary">Ajouter Deck</Button>
          </>)
}