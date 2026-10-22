"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabaseClient";
import type { Review } from "@/lib/reviews";

type ReviewsState = Review[];

type ReviewsAction =
  | { type: "SET"; payload: Review[] }
  | { type: "ADD"; payload: Review }
  | { type: "UPDATE"; payload: Review }
  | { type: "REMOVE"; payload: number };

function reviewsReducer(state: ReviewsState, action: ReviewsAction): ReviewsState {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD":
      return [action.payload, ...state.filter((r) => r.id !== action.payload.id)];
    case "UPDATE":
      return state.map((r) => (r.id === action.payload.id ? action.payload : r));
    case "REMOVE":
      return state.filter((r) => r.id !== action.payload);
    default:
      return state;
  }
}

interface ReviewsContextType {
  reviews: Review[];
  myReview: Review | undefined;
  submitReview: (rating: number, comment: string) => Promise<{ error: string | null }>;
  updateReview: (rating: number, comment: string) => Promise<{ error: string | null }>;
  deleteReview: () => Promise<{ error: string | null }>;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export function ReviewsProvider({
  productId,
  initialReviews,
  children,
}: {
  productId: number;
  initialReviews: Review[];
  children: ReactNode;
}) {
  const router = useRouter();
  const { user, session } = useAuth();
  const [reviews, dispatch] = useReducer(reviewsReducer, initialReviews);

  const userEmailPrefix = user?.email ? user.email.split("@")[0] : null;

  // Find user's own review either by user_id or by author (matching email prefix)
  const myReview = reviews.find(
    (r) => (user && r.user_id === user.id) || (userEmailPrefix && r.author === userEmailPrefix)
  );

  const submitReview = async (rating: number, comment: string) => {
    try {
      const currentSession = session ?? (await supabase.auth.getSession()).data.session;
      const token = currentSession?.access_token;

      if (!token) {
        return { error: "You must be logged in to review" };
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: productId,
          rating,
          comment,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { error: data.error || "Failed to submit review" };
      }

      const newReview: Review = {
        ...data,
        user_id: user?.id,
      };

      dispatch({ type: "ADD", payload: newReview });
      router.refresh();
      return { error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      return { error: message };
    }
  };

  const updateReview = async (rating: number, comment: string) => {
    if (!myReview || !user) {
      return { error: "No review to update or not logged in" };
    }

    const previousReview = { ...myReview };

    const { data, error } = await supabase
      .from("reviews")
      .update({ rating, comment })
      .eq("id", myReview.id)
      .select()
      .single();

    if (error) {
      return { error: error.message };
    }

    dispatch({
      type: "UPDATE",
      payload: (data as Review) || { ...previousReview, rating, comment },
    });
    router.refresh();
    return { error: null };
  };

  const deleteReview = async () => {
    if (!myReview || !user) {
      return { error: "No review to delete or not logged in" };
    }

    const reviewToDelete = myReview;

    // Optimistic delete
    dispatch({ type: "REMOVE", payload: reviewToDelete.id });

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", reviewToDelete.id);

    if (error) {
      // Rollback on error
      dispatch({ type: "ADD", payload: reviewToDelete });
      return { error: error.message };
    }

    router.refresh();
    return { error: null };
  };

  return (
    <ReviewsContext.Provider
      value={{
        reviews,
        myReview,
        submitReview,
        updateReview,
        deleteReview,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider");
  }
  return context;
}
