
import { memo } from "react";

interface MinimalSkeletonProps {
  className?: string;
}

export const MinimalSkeleton = memo(({ className }: MinimalSkeletonProps) => {
  return (
    <div 
      className={`animate-pulse bg-gray-200 ${className}`}
      style={{ animationDuration: '1.5s' }}
    />
  );
});

MinimalSkeleton.displayName = 'MinimalSkeleton';

export const FastRecipeSkeleton = memo(() => {
  return (
    <div className="anong-card overflow-hidden">
      <MinimalSkeleton className="h-64 w-full" />
      <div className="p-6 space-y-4">
        <MinimalSkeleton className="h-6 w-3/4" />
        <MinimalSkeleton className="h-4 w-full" />
        <MinimalSkeleton className="h-4 w-2/3" />
        <div className="flex justify-between items-center mt-6">
          <div className="flex space-x-4">
            <MinimalSkeleton className="h-4 w-16" />
            <MinimalSkeleton className="h-4 w-16" />
          </div>
          <MinimalSkeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
});

FastRecipeSkeleton.displayName = 'FastRecipeSkeleton';
