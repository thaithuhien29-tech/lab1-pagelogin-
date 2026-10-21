import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = "", category = "" } = await searchParams;

  const searchLower = q.toLowerCase().trim();
  const categoryLower = category.toLowerCase().trim();

  // Extract unique categories
  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filteredProducts = products.filter((p) => {
    const matchesCategory = categoryLower
      ? p.category.toLowerCase() === categoryLower
      : true;
    const matchesQuery = searchLower
      ? p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      : true;
    return matchesCategory && matchesQuery;
  });

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <section className="mx-auto max-w-7xl p-4 sm:p-8 space-y-6">
        {/* Search & Filter Form (Plain GET form driven by URL) */}
        <form
          method="get"
          action="/"
          className="flex flex-col sm:flex-row gap-3 items-center bg-white dark:bg-zinc-900 p-4 rounded-lg shadow-sm border"
        >
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Search products..."
            data-testid="search-input"
            className="w-full sm:flex-1 px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-800"
          />

          <select
            name="category"
            defaultValue={category}
            data-testid="category-select"
            className="w-full sm:w-48 px-3 py-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-800"
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <button
            type="submit"
            data-testid="btn-search"
            className="w-full sm:w-auto px-5 py-2 bg-black text-white dark:bg-white dark:text-black font-medium text-sm rounded-md hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </form>

        {/* Product List or No Results */}
        {filteredProducts.length === 0 ? (
          <div
            data-testid="no-results"
            className="text-center py-16 bg-white dark:bg-zinc-900 rounded-lg border text-muted-foreground"
          >
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm mt-1">Try adjusting your search or category filters.</p>
            <Link
              href="/"
              className="mt-4 inline-block text-sm text-primary underline"
            >
              Reset filters
            </Link>
          </div>
        ) : (
          <div
            data-testid="product-list"
            className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}