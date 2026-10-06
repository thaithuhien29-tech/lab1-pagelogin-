"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext"; // THÊM: dùng context

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const router = useRouter(); // THÊM
  const { signIn } = useAuth(); // THÊM

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [authError, setAuthError] = useState(""); // THÊM: lỗi từ Supabase
  const [submitting, setSubmitting] = useState(false); // THÊM: chặn bấm nhiều lần

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return; // còn lỗi validation thì dừng

    // THAY: bỏ "Login successful (demo)", gọi Supabase thật
    setSubmitting(true);
    const { error } = await signIn(email.trim(), password);
    setSubmitting(false);

    if (error) {
      setAuthError(error); // ví dụ "Invalid login credentials"
    } else {
      router.push("/"); // thành công thì về trang chủ
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            noValidate
            data-testid="login-form"
            className="space-y-4"
          >
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="login-email"
              />
              {errors.email && (
                <p data-testid="error-email" className="text-sm text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                data-testid="login-password"
              />
              {errors.password && (
                <p data-testid="error-password" className="text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              data-testid="login-submit"
              disabled={submitting}
            >
              {submitting ? "Logging in..." : "Login"}
            </Button>

            {/* THÊM: lỗi trả về từ Supabase */}
            {authError && (
              <p data-testid="error-auth" className="text-sm text-red-600">
                {authError}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}