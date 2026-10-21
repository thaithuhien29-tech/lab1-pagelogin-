import Link from "next/link";

export default function NotFound() {
  return (
    <div
      data-testid="not-found"
      className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center"
    >
      <h1 className="text-6xl font-extrabold text-foreground mb-4">404</h1>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page or product you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-5 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium text-sm hover:opacity-90 transition-opacity"
      >
        Return to Home
      </Link>
    </div>
  );
}
