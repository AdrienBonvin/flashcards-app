import { useState } from "react";
import { Button } from "./Button";
import { Input } from "./Input";

export const EditDeckName: React.FC<{
  initialDeckName: string;
  onEdit: (newName: string | null) => void;
}> = ({ initialDeckName, onEdit }) => {
  const [newDeckName, setNewDeckName] = useState(initialDeckName);

  const handleEdit = () => {
    if (newDeckName.trim() !== "") {
      onEdit(newDeckName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 px-6 bg-background/95 backdrop-blur-sm">
      <h2 className="text-xl font-bold text-text-primary">Modifier le deck</h2>
      <Input
        type="text"
        placeholder={initialDeckName}
        value={newDeckName}
        onChange={(e) => setNewDeckName(e.target.value)}
        className="w-full max-w-xs"
        maxLength={11}
      />
      <div className="flex gap-4">
        <Button onClick={handleEdit} variant="primary">
          Enregistrer
        </Button>
        <Button onClick={() => onEdit(null)} variant="primary" outlineStyle>
          Annuler
        </Button>
      </div>
    </div>
  );
};
