"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <Link href="/" className="text-xl font-bold">
        My Shop
      </Link>

      <nav className="flex items-center gap-3">
        {user ? (
          <>
            <Link href="/account" className="text-sm underline">
              Account
            </Link>
            <span data-testid="user-email" className="text-sm">
              {user.email}
            </span>
            <Button data-testid="btn-logout" variant="outline" onClick={signOut}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button data-testid="btn-login" variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button data-testid="btn-register">Register</Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}