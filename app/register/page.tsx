"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone, email, password }),
      });

      const data = (await response.json()) as { message?: string };
      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      router.replace("/my-account");
      router.refresh();
    } catch {
      setError("Unable to register right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-8">
          <h1 className="font-display text-3xl font-black uppercase tracking-tight">Register</h1>
          <p className="mt-2 text-sm text-muted-foreground">Create your Cosmic Tees account.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-foreground">First Name</span>
                <Input value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
              </label>
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-foreground">Last Name</span>
                <Input value={lastName} onChange={(event) => setLastName(event.target.value)} required />
              </label>
            </div>

            <label className="block space-y-2 text-sm">
              <span className="font-medium text-foreground">Phone</span>
              <Input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-medium text-foreground">Email</span>
              <Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="font-medium text-foreground">Password</span>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={8}
                required
              />
            </label>

            {error ? (
              <p className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="h-11 w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-4 text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
