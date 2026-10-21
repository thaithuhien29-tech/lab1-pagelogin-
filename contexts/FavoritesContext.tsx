"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabaseClient";

type FavoritesState = number[];

type FavoritesAction =
  | { type: "SET"; payload: number[] }
  | { type: "ADD"; payload: number }
  | { type: "REMOVE"; payload: number };

function favoritesReducer(
  state: FavoritesState,
  action: FavoritesAction
): FavoritesState {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD":
      if (state.includes(action.payload)) return state;
      return [...state, action.payload];
    case "REMOVE":
      return state.filter((id) => id !== action.payload);
    default:
      return state;
  }
}

interface FavoritesContextType {
  favorites: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, dispatch] = useReducer(favoritesReducer, []);

  // When user changes (logs in / logs out)
  useEffect(() => {
    if (!user) {
      dispatch({ type: "SET", payload: [] });
      return;
    }

    let isCancelled = false;

    async function loadFavorites() {
      const { data, error } = await supabase
        .from("favorites")
        .select("product_id");

      if (!error && data && !isCancelled) {
        const ids = data.map((row: { product_id: number }) => row.product_id);
        dispatch({ type: "SET", payload: ids });
      }
    }

    loadFavorites();

    return () => {
      isCancelled = true;
    };
  }, [user]);

  const isFavorite = (id: number) => favorites.includes(id);

  const toggleFavorite = async (id: number) => {
    if (!user) return;

    const alreadyFavorited = favorites.includes(id);

    if (alreadyFavorited) {
      // Optimistic remove
      dispatch({ type: "REMOVE", payload: id });
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("product_id", id);

      if (error) {
        // Rollback
        dispatch({ type: "ADD", payload: id });
      }
    } else {
      // Optimistic add
      dispatch({ type: "ADD", payload: id });
      const { error } = await supabase
        .from("favorites")
        .insert({ product_id: id });

      if (error) {
        // Rollback
        dispatch({ type: "REMOVE", payload: id });
      }
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
