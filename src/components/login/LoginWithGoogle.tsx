import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { Button } from "../Button";

export const LoginWithGoogle: React.FC = () => {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Logged in as:", user.displayName);
    } catch (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  return (
    <Button
      variant="primary"
      additionnalClassName="flex items-center justify-center gap-2 mb-8"
      onClick={handleGoogleLogin}
      outlineStyle
    >
      <img
        src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
        alt="Google Logo"
        className="w-5 h-5"
      />
      Connexion
    </Button>
  );
};
