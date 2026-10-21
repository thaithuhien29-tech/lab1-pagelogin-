"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { products } from "@/data/products";
import FavoriteButton from "@/components/FavoriteButton";

export default function FavoritesPage() {
  const { user, loading } = useAuth();
  const { favorites } = useFavorites();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return null;
  }

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-10 px-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My Favorites
        </h1>

        {favoriteProducts.length === 0 ? (
          <div
            data-testid="favorites-empty"
            className="text-center py-16 bg-white dark:bg-zinc-900 rounded-xl border p-8 space-y-4"
          >
            <p className="text-lg font-medium text-muted-foreground">
              You haven&apos;t added any favorites yet.
            </p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 rounded-lg bg-black text-white dark:bg-white dark:text-black font-medium text-sm hover:opacity-90 transition-opacity"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div
            data-testid="favorites-page"
            className="bg-white dark:bg-zinc-900 rounded-xl border divide-y overflow-hidden shadow-sm"
          >
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                data-testid="favorite-item"
                className="flex items-center justify-between p-4 sm:p-6 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 rounded-md object-cover border"
                  />
                  <div>
                    <Link
                      href={`/products/${product.id}`}
                      className="font-semibold text-foreground hover:underline"
                    >
                      {product.name}
                    </Link>
                    <p className="text-sm font-medium text-muted-foreground">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    View
                  </Link>
                  <FavoriteButton productId={product.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
