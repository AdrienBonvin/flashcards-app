export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  reviewDate: Date;
  reviewCount: number;
  archived: boolean;
}

export interface Deck {
  userId: string;
  id: string;
  name: string;
  flashcards: Flashcard[];
  lastCompletedReviewAt?: Date;
}

/** Longueur max d'un nom de deck (affiché tronqué au-delà de la largeur dispo) */
export const DECK_NAME_MAX_LENGTH = 30;

/** Nombre de bonnes réponses à partir duquel une carte devient dorée (Golden Card) */
export const GOLDEN_CARD_THRESHOLD = 7;

export const flashcardUtils = {
  /** Cartes non acquises dont la date de révision tombe aujourd'hui ou avant */
  getReviewableCards: (flashcards: Flashcard[], now: Date = new Date()) => {
    const endOfToday = new Date(now).setHours(23, 59, 59, 999);
    return flashcards.filter(
      (flashcard) =>
        !flashcard.archived && flashcard.reviewDate.getTime() <= endOfToday
    );
  },
};
