import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { LoginWithEmail } from "./LoginWithEmail";
import { LoginWithGoogle } from "./LoginWithGoogle";

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) {
    return (
      <div className="bg-background p-16 w-screen">
        <h1 className="text-2xl font-extraboldfont-bold text-center mb-12">
          Login
        </h1>
        <div className="flex flex-col gap-4">
          <LoginWithGoogle />
          <LoginWithEmail />
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
