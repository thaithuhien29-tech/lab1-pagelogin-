"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading || !user) return null;

  return (
    <div data-testid="account-page" className="mx-auto max-w-md p-6">
      <h1 className="mb-4 text-2xl font-bold">My Account</h1>
      <p>
        Email: <span data-testid="account-email">{user.email}</span>
      </p>
    </div>
  );
}