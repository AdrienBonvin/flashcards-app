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
        <div className="bg-background p-16 w-screen flex flex-col items-center justify-center">
          <h1 className="text-2xl font-extraboldfont-bold text-center mb-12">
            {isRegistering ? "Nouveau compte" : "Connexion"}
          </h1>
          <div className="flex flex-col justify-center gap-4 sm:w-1/3 lg:w-1/3">
            <LoginWithEmail
              isRegistering={isRegistering}
              setIsRegistering={setIsRegistering}
            />
            <LoginWithGoogle
              isRegistering={isRegistering}
              setIsRegistering={setIsRegistering}
            />
            <p
              className="text-blue-500 text-center"
              onClick={() => setIsRegistering(!isRegistering)}
            >
              {isRegistering ? "J'ai déjà un compte." : "Créer un compte."}
            </p>
          </div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
};
