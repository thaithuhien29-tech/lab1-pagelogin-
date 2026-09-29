"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Errors = {};

    if (!name.trim()) {
      err.name = "Full name is required";
    }

    if (!email.trim()) {
      err.email = "Email is required";
    } else if (!emailRegex.test(email.trim())) {
      err.email = "Please enter a valid email address";
    }

    if (!password) {
      err.password = "Password is required";
    } else if (password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    if (!confirm) {
      err.confirm = "Confirm password is required";
    } else if (confirm !== password) {
      err.confirm = "Passwords do not match";
    }

    setErrors(err);
    setSuccess(Object.keys(err).length === 0);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            noValidate
            data-testid="register-form"
            className="space-y-4"
          >
            <div className="space-y-1">
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="register-name"
              />
              {errors.name && (
                <p data-testid="error-name" className="text-sm text-red-600">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="register-email"
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
                data-testid="register-password"
              />
              {errors.password && (
                <p data-testid="error-password" className="text-sm text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                data-testid="register-confirm-password"
              />
              {errors.confirm && (
                <p data-testid="error-confirm-password" className="text-sm text-red-600">
                  {errors.confirm}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" data-testid="register-submit">
              Register
            </Button>

            {success && (
              <p data-testid="form-success" className="text-sm text-green-600">
                Registration successful (demo)
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}