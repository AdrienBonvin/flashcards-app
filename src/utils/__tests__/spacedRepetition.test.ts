import { describe, expect, it } from "vitest";
import {
  addFibonacci,
  getDaysTillNextReview,
  getNextReviewDate,
} from "../spacedRepetition";

describe("addFibonacci", () => {
  it("suit la suite de Fibonacci", () => {
    expect([0, 1, 2, 3, 4, 5, 6, 7, 8].map(addFibonacci)).toEqual([
      0, 1, 1, 2, 3, 5, 8, 13, 21,
    ]);
  });

  it("ne renvoie jamais de valeur négative", () => {
    expect(addFibonacci(-3)).toBe(0);
  });
});

describe("getNextReviewDate", () => {
  it("ajoute fib(reviewCount) jours à la date de départ", () => {
    const from = new Date(2026, 0, 10, 15, 30);
    expect(getNextReviewDate(1, from)).toEqual(new Date(2026, 0, 11, 15, 30));
    expect(getNextReviewDate(5, from)).toEqual(new Date(2026, 0, 15, 15, 30));
    expect(getNextReviewDate(7, from)).toEqual(new Date(2026, 0, 23, 15, 30));
  });

  it("passe correctement les fins de mois", () => {
    const from = new Date(2026, 0, 30);
    expect(getNextReviewDate(3, from)).toEqual(new Date(2026, 1, 1));
  });
});

describe("getDaysTillNextReview", () => {
  const now = new Date(2026, 5, 15, 18, 0);

  it("compte en jours calendaires, pas en tranches de 24 h", () => {
    const tomorrowMorning = new Date(2026, 5, 16, 8, 0).getTime();
    expect(getDaysTillNextReview(tomorrowMorning, now)).toBe(1);
  });

  it("renvoie 0 pour une carte due aujourd'hui ou en retard", () => {
    expect(getDaysTillNextReview(new Date(2026, 5, 15, 9).getTime(), now)).toBe(0);
    expect(getDaysTillNextReview(new Date(2026, 5, 1).getTime(), now)).toBe(0);
  });
});
