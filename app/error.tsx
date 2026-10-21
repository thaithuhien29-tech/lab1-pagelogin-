"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div
      data-testid="error-boundary"
      className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center space-y-4"
    >
      <h2 className="text-2xl font-bold tracking-tight text-destructive">
        Something went wrong!
      </h2>
      <p className="text-sm text-muted-foreground max-w-md">
        An unexpected error occurred. Please try again.
      </p>
      <Button
        type="button"
        data-testid="btn-retry"
        onClick={() => reset()}
        variant="default"
      >
        Try again
      </Button>
    </div>
  );
}
