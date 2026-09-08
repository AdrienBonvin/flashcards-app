// Lecture vocale des cartes via l'API native du navigateur (aucune dépendance)

let cachedVoice: SpeechSynthesisVoice | null = null;

if ("speechSynthesis" in window) {
  // La liste des voix se charge en asynchrone : on invalide le cache quand elle arrive
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
  };
}

// Voix fantaisie Apple (déguisées, robotiques) à écarter absolument
const NOVELTY_VOICES =
  /eddy|flo|grandma|grandpa|rocko|sandy|shelley|reed|jester|whisper|bells|boing|bubbles|organ|trinoids|zarvox|bad news|good news|cellos|wobble|albert|bahh|superstar/;
// Vraies voix système de qualité connue (macOS/iOS)
const KNOWN_GOOD_VOICES = /thomas|am[ée]lie|audrey|aude|marie|chantal|nicolas|virginie|daniel/;

// Classe les voix françaises du device par qualité : voix "premium/enhanced" (Apple),
// voix serveur Google (Chrome, plus naturelles que les voix système de base), puis fr-FR
const pickBestFrenchVoice = (): SpeechSynthesisVoice | null => {
  const frenchVoices = window.speechSynthesis
    .getVoices()
    .filter((voice) => voice.lang.toLowerCase().startsWith("fr"));
  if (frenchVoices.length === 0) return null;

  const score = (voice: SpeechSynthesisVoice) => {
    const name = voice.name.toLowerCase();
    let points = 0;
    if (NOVELTY_VOICES.test(name)) points -= 10;
    if (/premium|enhanced|neural|amélioré/.test(name)) points += 8;
    if (!voice.localService) points += 6;
    if (name.includes("google")) points += 4;
    if (KNOWN_GOOD_VOICES.test(name)) points += 3;
    if (voice.lang.toLowerCase() === "fr-fr") points += 1;
    return points;
  };

  return [...frenchVoices].sort((a, b) => score(b) - score(a))[0];
};

export const speak = (text: string) => {
  if (!("speechSynthesis" in window) || !text.trim()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  cachedVoice ??= pickBestFrenchVoice();
  if (cachedVoice) utterance.voice = cachedVoice;
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = () => {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
};
