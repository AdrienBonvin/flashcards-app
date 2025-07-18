import { Ref, useMemo, useRef } from "react";

interface ProgressBarProps {
  initialCount: number;
  counter: number;
  className: string;
  triggerAnimations: boolean;
  ref: Ref<HTMLDivElement>;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  initialCount,
  counter,
  className,
  triggerAnimations,
  ref,
}) => {
  const maxCount = useRef(initialCount);

  const progressPercentage = useMemo(
    () => ((maxCount.current - counter) / maxCount.current) * 100,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [triggerAnimations]
  );

  return (
    <div
      className={`h-2 bg-gray-300 rounded-full overflow-hidden ${className}  ${
        triggerAnimations ? "ping-progress" : ""
      }`}
    >
      <div
        ref={ref}
        className={`h-full bg-gradient-to-r from-contrast to-primary ${
          triggerAnimations ? "progress-bar-filling" : ""
        } `}
        style={{
          width: `${progressPercentage}%`,
        }}
      ></div>
    </div>
  );
};
