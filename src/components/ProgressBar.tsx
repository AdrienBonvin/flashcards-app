import { forwardRef, useMemo, useRef } from "react";

interface ProgressBarProps {
  initialCount: number;
  counter: number;
  className: string;
  triggerAnimations: boolean;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ initialCount, counter, className, triggerAnimations }, ref) => {
  const maxCount = useRef(initialCount);

  const progressPercentage = useMemo(
    () => ((maxCount.current - counter) / maxCount.current) * 100,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [triggerAnimations]
  );

  return (
    <div
      className={`h-2.5 bg-surface-elevated rounded-full overflow-hidden ${className} ${
        triggerAnimations ? "ping-progress" : ""
      }`}
    >
      <div
        ref={ref}
        className={`h-full bg-gradient-to-r from-contrast to-primary rounded-full ${
          triggerAnimations ? "progress-bar-filling" : ""
        }`}
        style={{
          width: `${progressPercentage}%`,
        }}
      />
    </div>
  );
  }
);
