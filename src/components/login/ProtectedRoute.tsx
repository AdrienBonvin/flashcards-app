import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { LoginWithEmail } from "./LoginWithEmail";
import { LoginWithGoogle } from "./LoginWithGoogle";
import { Loader } from "../Loader";
import { useUserDataContext } from "../../contexts/UserDataContext";

export interface LoginProps {
  isRegistering: boolean;
  setIsRegistering: (isRegistering: boolean) => void;
}

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isLoading } = useUserDataContext();

  const [user, setUser] = useState<User | null>(null);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Loader loading={isLoading} />
      {!user ? (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-16">
          <div className="w-full max-w-sm">
            <img
              src="/icons/logo.png"
              alt="Spira"
              className="w-20 h-20 mx-auto mb-8"
            />
            <h1 className="text-2xl md:text-3xl font-extrabold text-center mb-8 text-text-primary">
              {isRegistering ? "Créer un compte" : "Connexion"}
            </h1>
            <div className="flex flex-col gap-4">
              <LoginWithEmail
                isRegistering={isRegistering}
                setIsRegistering={setIsRegistering}
              />
              <div className="relative flex items-center gap-4 my-2">
                <div className="flex-1 border-t border-surface-elevated" />
                <span className="text-muted text-sm">ou</span>
                <div className="flex-1 border-t border-surface-elevated" />
              </div>
              <LoginWithGoogle
                isRegistering={isRegistering}
                setIsRegistering={setIsRegistering}
              />
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-primary hover:text-primary-hover text-center text-sm font-medium py-2 transition-colors focus:outline-none focus-visible:underline"
              >
                {isRegistering ? "J'ai déjà un compte" : "Créer un compte"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
