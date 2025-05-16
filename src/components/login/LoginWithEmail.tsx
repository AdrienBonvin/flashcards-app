import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Input } from "../Input";
import { Button } from "../Button";
import Email from "@mui/icons-material/Email";
import PersonAdd from "@mui/icons-material/PersonAdd";
import { LoginProps } from "./ProtectedRoute";
import { useUserDataContext } from "../../contexts/UserDataContext";

export const LoginWithEmail: React.FC<LoginProps> = ({ isRegistering }) => {
  const { setIsLoading } = useUserDataContext();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      setIsLoading(false);

      if (error instanceof Error) {
        console.error("Error logging in:", error);
        setError(error.message);
      } else {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred.");
      }
    }
  };

  const handleRegister = async () => {
    try {
      setError(null);
      createUserWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error registering user:", error);
        setError(error.message);
      } else {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full"
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {isRegistering ? (
        <Button variant="primary" outlineStyle onClick={handleRegister}>
          <PersonAdd className="pr-2" />
          Créer mon compte
        </Button>
      ) : (
        <Button variant="primary" outlineStyle onClick={handleLogin}>
          <Email className="pr-2" />
          Connexion
        </Button>
      )}
    </div>
  );
};
