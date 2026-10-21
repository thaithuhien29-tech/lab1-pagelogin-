"use client";

import { useFavorites } from "@/contexts/FavoritesContext";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FavoriteButton({ productId }: { productId: number }) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();

  const active = isFavorite(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      router.push("/login");
      return;
    }

    toggleFavorite(productId);
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-testid="btn-favorite"
      aria-pressed={active ? "true" : "false"}
      onClick={handleClick}
      className={`rounded-full p-2 transition-colors ${
        active ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Heart className={`h-5 w-5 ${active ? "fill-red-500" : ""}`} />
    </Button>
  );
}
