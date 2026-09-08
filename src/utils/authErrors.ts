// Firebase renvoie des codes techniques en anglais : on les traduit pour l'utilisateur
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "Adresse email invalide.",
  "auth/user-disabled": "Ce compte a été désactivé.",
  "auth/user-not-found": "Email ou mot de passe incorrect.",
  "auth/wrong-password": "Email ou mot de passe incorrect.",
  "auth/invalid-credential": "Email ou mot de passe incorrect.",
  "auth/email-already-in-use": "Un compte existe déjà avec cet email.",
  "auth/weak-password": "Mot de passe trop court : 6 caractères minimum.",
  "auth/missing-password": "Saisissez un mot de passe.",
  "auth/too-many-requests":
    "Trop de tentatives. Réessayez dans quelques minutes.",
  "auth/network-request-failed": "Pas de connexion. Vérifiez votre réseau.",
};

export const getAuthErrorMessage = (error: unknown): string => {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  return AUTH_ERROR_MESSAGES[code] ?? "Une erreur est survenue. Réessayez.";
};
