const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * n-ième nombre de Fibonacci (0, 1, 1, 2, 3, 5, 8, 13…), itératif.
 * Sert d'intervalle en jours entre deux révisions selon le nombre de réussites.
 */
export const addFibonacci = (n: number): number => {
  if (n <= 1) return Math.max(0, n);
  let previous = 0;
  let current = 1;
  for (let i = 2; i <= n; i++) {
    [previous, current] = [current, previous + current];
  }
  return current;
};

/** Date de prochaine révision : aujourd'hui + fib(reviewCount) jours */
export const getNextReviewDate = (reviewCount: number, from: Date = new Date()): Date => {
  const nextReviewDate = new Date(from);
  nextReviewDate.setDate(nextReviewDate.getDate() + addFibonacci(reviewCount));
  return nextReviewDate;
};

/** Nombre de jours calendaires avant la prochaine révision (0 si due ou en retard) */
export const getDaysTillNextReview = (nextReview: number, now: Date = new Date()) => {
  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((nextReview - startOfToday) / MS_PER_DAY));
};
