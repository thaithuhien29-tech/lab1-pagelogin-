export default function Loading() {
  return (
    <div
      data-testid="loading"
      className="min-h-[50vh] flex flex-col items-center justify-center space-y-4"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-foreground" />
      <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
}
