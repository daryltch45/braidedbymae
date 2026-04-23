"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type Review = {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  serviceName: string | null;
  status: string;
  createdAt: Date | string;
};

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  APPROVED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminReviewsClient({ reviews: initial }: { reviews: Review[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initial);
  const [loading, setLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState("ALL");

  const filtered = filter === "ALL" ? reviews : reviews.filter((r) => r.status === filter);

  async function updateStatus(id: string, status: string) {
    setLoading(id + status);
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  }

  async function deleteReview(id: string) {
    if (!confirm("Delete this review permanently?")) return;
    setLoading(id + "delete");
    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
        router.refresh();
      }
    } finally {
      setLoading(null);
    }
  }

  return (
    <>
      <div className="flex gap-2 mb-4">
        {["ALL", "PENDING", "APPROVED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold transition-all border",
              filter === s
                ? "bg-primary text-white border-primary"
                : "border-foreground/15 text-muted hover:text-foreground"
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-surface rounded-xl border border-foreground/10 py-10 text-center text-muted text-sm">
            No reviews found.
          </div>
        )}
        {filtered.map((review) => (
          <div key={review.id} className="bg-surface rounded-xl border border-foreground/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap">
                  <p className="font-semibold text-foreground">{review.clientName}</p>
                  <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", STATUS_STYLES[review.status])}>
                    {review.status}
                  </span>
                  {review.serviceName && (
                    <span className="text-xs text-muted bg-foreground/5 px-2.5 py-1 rounded-full">
                      {review.serviceName}
                    </span>
                  )}
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={cn(
                        "h-3.5 w-3.5",
                        s <= review.rating ? "fill-accent stroke-accent" : "fill-none stroke-muted"
                      )}
                    />
                  ))}
                </div>

                <p className="text-sm text-muted leading-relaxed">{review.comment}</p>
                <p className="text-xs text-muted mt-2">{format(new Date(review.createdAt), "dd MMM yyyy")}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 shrink-0">
                {review.status !== "APPROVED" && (
                  <button
                    onClick={() => updateStatus(review.id, "APPROVED")}
                    disabled={loading === review.id + "APPROVED"}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    ✓ Approve
                  </button>
                )}
                {review.status !== "REJECTED" && (
                  <button
                    onClick={() => updateStatus(review.id, "REJECTED")}
                    disabled={loading === review.id + "REJECTED"}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    ✕ Reject
                  </button>
                )}
                <button
                  onClick={() => deleteReview(review.id)}
                  disabled={loading === review.id + "delete"}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border border-foreground/15 text-muted hover:text-foreground transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
