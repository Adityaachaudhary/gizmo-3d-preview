
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingFallback() {
  return (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <Skeleton className="h-[300px] w-[300px] rounded-xl mx-auto" />
        <p className="mt-4 text-slate-500">Loading 3D model...</p>
      </div>
    </div>
  );
}
