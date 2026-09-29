import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-4 py-3 sm:px-8">
        <h1 className="text-xl font-bold">My Shop</h1>
        <div className="flex gap-2">
          <Link
            href="/login"
            data-testid="btn-login"
            className={buttonVariants({ variant: "outline" })}
          >
            Login
          </Link>
          <Link
            href="/register"
            data-testid="btn-register"
            className={buttonVariants({})}
          >
            Register
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl p-4 sm:p-8">
        <div
          data-testid="product-list"
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </main>
  );
}