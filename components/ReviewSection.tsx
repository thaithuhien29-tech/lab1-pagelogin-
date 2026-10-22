"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { reviewSchema, type ReviewInput } from "@/lib/reviewSchema";
import { useAuth } from "@/contexts/AuthContext";
import { useReviews } from "@/contexts/ReviewsContext";

export default function ReviewSection({ productId }: { productId: number }) {
  const { user } = useAuth();
  const { reviews, myReview, submitReview, updateReview, deleteReview } = useReviews();

  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [editError, setEditError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      product_id: productId,
      rating: 5,
      comment: "",
    },
  });

  const onSubmit = async (values: ReviewInput) => {
    setServerError(null);
    setSuccessMessage(null);

    const res = await submitReview(values.rating, values.comment);
    if (res.error) {
      setServerError(res.error);
    } else {
      setSuccessMessage("Review submitted successfully!");
      reset({ product_id: productId, rating: 5, comment: "" });
    }
  };

  const startEdit = () => {
    if (myReview) {
      setEditRating(myReview.rating);
      setEditComment(myReview.comment);
      setIsEditing(true);
      setEditError(null);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditError(null);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    const parsed = reviewSchema.safeParse({
      product_id: productId,
      rating: Number(editRating),
      comment: editComment,
    });
    if (!parsed.success) {
      setEditError(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }

    const res = await updateReview(parsed.data.rating, parsed.data.comment);
    if (res.error) {
      setEditError(res.error);
    } else {
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Review Form / Logged-out prompt */}
      {!user ? (
        <div className="rounded-lg border border-dashed p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Want to share your thoughts?{" "}
            <Link
              href="/login"
              data-testid="link-login-to-review"
              className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
            >
              Sign in to write a review
            </Link>
          </p>
        </div>
      ) : !myReview ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          data-testid="review-form"
          className="rounded-xl border bg-card p-6 shadow-sm space-y-4"
        >
          <h3 className="text-lg font-semibold text-foreground">Write a Review</h3>

          {serverError && (
            <div
              data-testid="error-review"
              className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 rounded-md border border-red-200 dark:border-red-900"
            >
              {serverError}
            </div>
          )}

          {successMessage && (
            <div
              data-testid="review-success"
              className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-950/50 rounded-md border border-green-200 dark:border-green-900"
            >
              {successMessage}
            </div>
          )}

          <input type="hidden" {...register("product_id", { valueAsNumber: true })} />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Rating</label>
            <select
              data-testid="input-rating"
              {...register("rating", { valueAsNumber: true })}
              className="w-full sm:w-48 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={5}>5 Stars - Excellent</option>
              <option value={4}>4 Stars - Good</option>
              <option value={3}>3 Stars - Average</option>
              <option value={2}>2 Stars - Poor</option>
              <option value={1}>1 Star - Terrible</option>
            </select>
            {errors.rating && (
              <p data-testid="error-rating" className="text-xs text-red-500 font-medium">
                {errors.rating.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Your Comment</label>
            <textarea
              data-testid="input-comment"
              rows={4}
              placeholder="What did you think of this product?"
              {...register("comment")}
              className="w-full rounded-md border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.comment && (
              <p data-testid="error-comment" className="text-xs text-red-500 font-medium">
                {errors.comment.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            data-testid="btn-submit-review"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : null}

      {/* 2. Review List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div data-testid="reviews-empty" className="py-8 text-center text-muted-foreground">
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => {
              const isOwn = myReview && rev.id === myReview.id;

              return (
                <div
                  key={rev.id}
                  data-testid="review-item"
                  className="rounded-lg border bg-card p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        data-testid="review-author"
                        className="font-medium text-foreground"
                      >
                        {rev.author}
                      </span>
                      {isOwn && (
                        <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                      <span data-testid="review-rating">{rev.rating}</span>
                      <span>★</span>
                    </div>
                  </div>

                  {isOwn && isEditing ? (
                    <form onSubmit={handleUpdate} className="space-y-3 pt-2">
                      {editError && (
                        <p className="text-xs text-red-500 font-medium">{editError}</p>
                      )}
                      <div>
                        <select
                          value={editRating}
                          onChange={(e) => setEditRating(Number(e.target.value))}
                          className="rounded-md border bg-background px-3 py-1.5 text-sm"
                        >
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={2}>2 Stars</option>
                          <option value={1}>1 Star</option>
                        </select>
                      </div>
                      <textarea
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                        rows={3}
                        className="w-full rounded-md border bg-background p-2.5 text-sm"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="submit"
                          className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-md border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p
                      data-testid="review-comment"
                      className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed"
                    >
                      {rev.comment}
                    </p>
                  )}

                  {isOwn && !isEditing && (
                    <div className="flex items-center gap-3 pt-2 border-t">
                      <button
                        type="button"
                        data-testid="btn-edit-review"
                        onClick={startEdit}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        data-testid="btn-delete-review"
                        onClick={() => deleteReview()}
                        className="text-xs font-medium text-red-600 hover:text-red-800 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
