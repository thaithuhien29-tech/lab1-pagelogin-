import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { reviewSchema } from "@/lib/reviewSchema";
import { products } from "@/data/products";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export async function POST(request: Request) {
  // 1. Authentication check
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.slice(7).trim();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authClient = createClient(supabaseUrl, supabaseAnonKey);
  const { data: authData, error: authError } = await authClient.auth.getUser(token);

  if (authError || !authData?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Body & Schema Validation
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid input", issues: ["Request body must be valid JSON"] },
      { status: 400 }
    );
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues },
      { status: 400 }
    );
  }

  const { product_id, rating, comment } = parsed.data;

  // 3. Product check
  const productExists = products.some((p) => p.id === product_id);
  if (!productExists) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // 4. Insert into reviews using user's token
  const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const { data, error } = await userSupabase
    .from("reviews")
    .insert({
      product_id,
      rating,
      comment,
    })
    .select("id, product_id, rating, comment, author, created_at")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "You already reviewed this product" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // 5. Revalidate cached detail page
  revalidatePath(`/products/${product_id}`);

  return NextResponse.json(data, { status: 201 });
}
