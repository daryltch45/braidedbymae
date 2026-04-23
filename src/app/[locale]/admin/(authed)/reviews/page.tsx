import { db } from "@/lib/db";
import AdminReviewsClient from "@/components/admin/AdminReviewsClient";

export default async function AdminReviewsPage() {
  const reviews = await db.review.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
      <AdminReviewsClient reviews={reviews} />
    </div>
  );
}
