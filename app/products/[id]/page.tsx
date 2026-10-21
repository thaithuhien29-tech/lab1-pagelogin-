import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import FavoriteButton from "@/components/FavoriteButton";

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const numericId = parseInt(id, 10);
  const product = products.find((p) => p.id === numericId);

  if (!product) {
    return {
      title: "Product Not Found | My Shop",
    };
  }

  return {
    title: `${product.name} | My Shop`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    notFound();
  }

  const product = products.find((p) => p.id === numericId);

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-10 px-4">
      <div className="mx-auto max-w-4xl space-y-6">
        <Link
          href="/"
          data-testid="link-back"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Products
        </Link>

        <div
          data-testid="product-detail"
          className="bg-white dark:bg-zinc-900 rounded-xl border p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="aspect-square w-full rounded-lg object-cover border"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <span
                  data-testid="detail-category"
                  className="inline-block px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary/10 text-primary"
                >
                  {product.category}
                </span>

                <FavoriteButton productId={product.id} />
              </div>

              <h1
                data-testid="detail-name"
                className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
              >
                {product.name}
              </h1>

              <p
                data-testid="detail-price"
                className="text-2xl font-bold text-foreground"
              >
                ${product.price.toFixed(2)}
              </p>

              <p
                data-testid="detail-description"
                className="text-base text-muted-foreground leading-relaxed"
              >
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
