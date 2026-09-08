import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Input } from "../Input";
import { Button } from "../Button";
import Email from "@mui/icons-material/Email";
import PersonAdd from "@mui/icons-material/PersonAdd";
import { LoginProps } from "./ProtectedRoute";
import { useUserDataContext } from "../../contexts/UserDataContext";
import { getAuthErrorMessage } from "../../utils/authErrors";

export const LoginWithEmail: React.FC<LoginProps> = ({ isRegistering }) => {
  const { setIsLoading } = useUserDataContext();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setIsLoading(true);
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Succès : onAuthStateChanged prend le relais, le contexte gère isLoading
    } catch (err: unknown) {
      setIsLoading(false);
      console.error(isRegistering ? "Error registering:" : "Error logging in:", err);
      setError(getAuthErrorMessage(err));
    }
  };

  const resetPassword = async () => {
    setError(null);
    setInfo(null);
    if (!email.trim()) {
      setError("Saisissez votre email pour recevoir le lien de réinitialisation.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setInfo("Email envoyé. Vérifiez votre boîte de réception.");
    } catch (err: unknown) {
      console.error("Error sending reset email:", err);
      setError(getAuthErrorMessage(err));
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <Input
        type="email"
        name="email"
        autoComplete="email"
        placeholder="Email"
        aria-label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full"
        required
      />
      <Input
        type="password"
        name="password"
        autoComplete={isRegistering ? "new-password" : "current-password"}
        placeholder="Mot de passe"
        aria-label="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full"
        required
        minLength={6}
      />
      {error && (
        <p role="alert" className="text-red-400 text-sm">
          {error}
        </p>
      )}
      {info && (
        <p role="status" className="text-secondary text-sm">
          {info}
        </p>
      )}
      <Button type="submit" variant="primary" outlineStyle>
        {isRegistering ? (
          <>
            <PersonAdd className="pr-2" />
            Créer mon compte
          </>
        ) : (
          <>
            <Email className="pr-2" />
            Connexion
          </>
        )}
      </Button>
      {!isRegistering && (
        <button
          type="button"
          onClick={resetPassword}
          className="self-center text-muted hover:text-text-primary text-xs font-medium transition-colors focus:outline-none focus-visible:underline"
        >
          Mot de passe oublié ?
        </button>
      )}
    </form>
  );
};
