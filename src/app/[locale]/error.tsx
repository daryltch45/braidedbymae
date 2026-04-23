"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[BraidedByMae Error]", error);
  }, [error]);

  return (
    <section className="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 bg-background">
      <div className="text-center max-w-md">
        <h1 className="font-display text-6xl font-bold text-foreground mb-4">
          Oops
        </h1>
        <p className="text-muted text-lg mb-8">
          Something went wrong. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-block px-8 py-3 rounded-full bg-primary text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      </div>
    </section>
  );
}
