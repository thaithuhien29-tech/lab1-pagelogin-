import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card data-testid="product-card" className="overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        data-testid="product-image"
        className="aspect-[4/3] w-full object-cover"
      />
      <CardHeader>
        <CardTitle data-testid="product-name">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p data-testid="product-description" className="text-sm text-muted-foreground">
          {product.description}
        </p>
        <p data-testid="product-price" className="text-lg font-semibold">
          ${product.price.toFixed(2)}
        </p>
      </CardContent>
    </Card>
  );
}