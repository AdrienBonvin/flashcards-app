export const getNextReviewDate = (reviewCount: number): Date => {
  const addFibonacci = (n: number): number => {
    if (n <= 1) return n;
    return addFibonacci(n - 1) + addFibonacci(n - 2);
  };

  const daysToAdd = addFibonacci(reviewCount);
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);
  return nextReviewDate;
};
