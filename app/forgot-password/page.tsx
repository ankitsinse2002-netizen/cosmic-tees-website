"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(data.message || "Unable to process request.");
        return;
      }

      setMessage(data.message || "If an account exists, reset instructions have been sent.");
    } catch {
      setError("Unable to process request.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-8">
          <h1 className="font-display text-3xl font-black uppercase tracking-tight">Forgot Password</h1>
          <p className="mt-2 text-sm text-muted-foreground">Reset your account access.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-2 text-sm">
              <span className="font-medium text-foreground">Email</span>
              <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>

            {error ? (
              <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            {message ? (
              <p className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
                {message}
              </p>
            ) : null}

            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? "Processing..." : "Send Reset Instructions"}
            </Button>
          </form>

          <div className="mt-4 text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
