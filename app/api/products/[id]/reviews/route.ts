import { NextResponse } from "next/server";
import { products } from "@/data/products";
import { getProductReviews } from "@/lib/reviews";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numericId = parseInt(id, 10);

  if (isNaN(numericId)) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const productExists = products.some((p) => p.id === numericId);
  if (!productExists) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const reviewsData = await getProductReviews(numericId);
  return NextResponse.json(reviewsData);
}
