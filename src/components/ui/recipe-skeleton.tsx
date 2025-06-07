
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export const RecipeSkeleton = () => {
  return (
    <Card className="anong-card overflow-hidden">
      <div className="h-64 p-6">
        <Skeleton className="w-full h-full rounded-lg" />
      </div>
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between items-center mt-6">
          <div className="flex space-x-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      </div>
    </Card>
  );
};
