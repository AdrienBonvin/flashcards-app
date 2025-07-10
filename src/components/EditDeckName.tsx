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
    <div className="absolute top-0 left-0 flex flex-col items-center align-center justify-center gap-12 w-screen h-screen bg-background bg-opacity-90">
      <Input
        type="text"
        placeholder={initialDeckName}
        value={newDeckName}
        onChange={(e) => setNewDeckName(e.target.value)}
        className="w-72"
        maxLength={11}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={handleEdit}
          className="btn btn-primary"
          variant={"primary"}
        >
          Enregistrer
        </Button>
        <Button
          onClick={() => onEdit(null)}
          className="btn btn-primary"
          variant={"primary"}
          outlineStyle
        >
          Annuler
        </Button>
      </div>
    </div>
  );
};
