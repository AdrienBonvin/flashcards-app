export const addFibonacci = (n: number): number => {
  if (n <= 1) return n;
  return addFibonacci(n - 1) + addFibonacci(n - 2);
};

export const getNextReviewDate = (reviewCount: number): Date => {
  const daysToAdd = addFibonacci(reviewCount);
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);
  return nextReviewDate;
};

export const getDaysTillNextReview = (nextReview: number) => {
  return Math.max(
    0,
    Math.floor(
      (nextReview - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24)
    )
  );
};
