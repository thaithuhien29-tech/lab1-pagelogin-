import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import FavoriteButton from "@/components/FavoriteButton";
import { getProductReviews } from "@/lib/reviews";
import { ReviewsProvider } from "@/contexts/ReviewsContext";
import ReviewSection from "@/components/ReviewSection";

export const dynamicParams = false;

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

  // Server-rendered reviews fetch using anon key
  const reviewsData = await getProductReviews(numericId);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-10 px-4">
      <div className="mx-auto max-w-4xl space-y-8">
        <Link
          href="/"
          data-testid="link-back"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          &larr; Back to Products
        </Link>

        {/* Product Details Card */}
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

        {/* Reviews Section */}
        <section className="bg-white dark:bg-zinc-900 rounded-xl border p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
            <div>
              <h2 className="text-xl font-bold text-foreground">Customer Reviews</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Based on <span data-testid="review-count">{reviewsData.count}</span> reviews
              </p>
            </div>

            <div className="flex items-center gap-3 bg-muted/40 px-4 py-2 rounded-lg border">
              <span className="text-xs uppercase tracking-wide font-medium text-muted-foreground">
                Average Rating:
              </span>
              <div className="flex items-center gap-1.5">
                <span data-testid="rating-average" className="text-2xl font-bold text-foreground">
                  {reviewsData.average}
                </span>
                <span className="text-amber-500 text-lg">★</span>
              </div>
            </div>
          </div>

          {/* ReviewsProvider only wraps the reviews part as required */}
          <ReviewsProvider productId={product.id} initialReviews={reviewsData.reviews}>
            <ReviewSection productId={product.id} />
          </ReviewsProvider>
        </section>
      </div>
    </main>
  );
}
