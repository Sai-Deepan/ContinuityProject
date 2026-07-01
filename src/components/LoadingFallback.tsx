import { Loader2 } from "lucide-react";

export function LoadingFallback() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading application...</p>
    </div>
  );
}
