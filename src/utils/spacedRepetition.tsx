export const getNextReviewDate = (previousReviewDate: Date, reviewCount: number): Date => {
      const fibonacci = (n: number): number => {
      if (n <= 1) return n;
      return fibonacci(n - 1) + fibonacci(n - 2);
    };
  
    const daysToAdd = fibonacci(reviewCount);
    const nextReviewDate = new Date(previousReviewDate);
    nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd);
    return nextReviewDate;
  };