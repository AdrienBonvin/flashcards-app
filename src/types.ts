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