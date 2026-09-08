import { describe, expect, it } from "vitest";
import { Flashcard, flashcardUtils } from "../../types";

const card = (overrides: Partial<Flashcard>): Flashcard => ({
  id: "id",
  question: "q",
  answer: "a",
  reviewDate: new Date(),
  reviewCount: 0,
  archived: false,
  ...overrides,
});

describe("flashcardUtils.getReviewableCards", () => {
  const now = new Date(2026, 2, 10, 14, 0);

  it("garde les cartes dues aujourd'hui (même plus tard dans la journée) ou en retard", () => {
    const cards = [
      card({ id: "late", reviewDate: new Date(2026, 2, 1) }),
      card({ id: "today-later", reviewDate: new Date(2026, 2, 10, 23, 0) }),
      card({ id: "tomorrow", reviewDate: new Date(2026, 2, 11, 0, 0, 1) }),
    ];
    expect(flashcardUtils.getReviewableCards(cards, now).map((c) => c.id)).toEqual([
      "late",
      "today-later",
    ]);
  });

  it("exclut les cartes acquises même si elles sont dues", () => {
    const cards = [card({ id: "archived", archived: true, reviewDate: new Date(2026, 1, 1) })];
    expect(flashcardUtils.getReviewableCards(cards, now)).toEqual([]);
  });

  it("renvoie un tableau vide sans carte", () => {
    expect(flashcardUtils.getReviewableCards([], now)).toEqual([]);
  });
});
