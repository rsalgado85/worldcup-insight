interface SkeletonProps {
  className?: string;
  count?: number;
}

/** Pure-CSS skeleton — no Framer Motion overhead. 
 *  The `.skeleton` CSS class handles the shimmer animation via GPU-accelerated background-position. */
export function Skeleton({ className = '', count = 1 }: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${className}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
}
