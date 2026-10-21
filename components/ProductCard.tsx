import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/data/products";
import FavoriteButton from "@/components/FavoriteButton";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card data-testid="product-card" className="overflow-hidden flex flex-col justify-between">
      <div>
        <div className="relative">
          <Link href={`/products/${product.id}`} data-testid="link-detail">
            <img
              src={product.image}
              alt={product.name}
              data-testid="product-image"
              className="aspect-[4/3] w-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
            />
          </Link>
          <div className="absolute top-2 right-2 z-10 bg-white/80 dark:bg-black/80 backdrop-blur rounded-full">
            <FavoriteButton productId={product.id} />
          </div>
        </div>

        <CardHeader className="pb-2">
          <Link href={`/products/${product.id}`} data-testid="link-detail">
            <CardTitle data-testid="product-name" className="hover:underline cursor-pointer">
              {product.name}
            </CardTitle>
          </Link>
        </CardHeader>
        <CardContent className="space-y-2">
          <p data-testid="product-description" className="text-sm text-muted-foreground">
            {product.description}
          </p>
          <p data-testid="product-price" className="text-lg font-semibold">
            ${product.price.toFixed(2)}
          </p>
        </CardContent>
      </div>

      <div className="p-4 pt-0">
        <Link href={`/products/${product.id}`} data-testid="link-detail" className="text-sm text-primary hover:underline font-medium">
          View Details &rarr;
        </Link>
      </div>
    </Card>
  );
}