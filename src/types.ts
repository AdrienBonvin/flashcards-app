export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  reviewDate: Date;
  reviewCount: number;
}

export interface Deck {
  id: string;
  name: string;
  flashcards: Flashcard[];
}

export const flashcardUtils = {
  getReviewableCards: (flashcards: Flashcard[]) =>
    flashcards.filter(
      (flashcard) =>
        flashcard.reviewDate.getTime() < new Date().setHours(23, 59, 59, 0)
    ) ?? [],
};
