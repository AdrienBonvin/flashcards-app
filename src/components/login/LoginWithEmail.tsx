import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Input } from "../Input";
import { Button } from "../Button";
import Email from "@mui/icons-material/Email";

export const LoginWithEmail: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false); // Toggle between login and register

  const handleLogin = async () => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
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
          Register
        </Button>
      ) : (
        <Button variant="primary" outlineStyle onClick={handleLogin}>
          <Email className="pr-2" />
          Connexion
        </Button>
      )}
      <p
        className="text-blue-500 text-center"
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering ? "J'ai déjà un compte." : "Créer un compte."}
      </p>
    </div>
  );
};
