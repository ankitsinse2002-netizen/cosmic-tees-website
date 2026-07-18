"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      if (!response.ok) {
        window.location.href = "/login";
        return;
      }

      const data = (await response.json()) as { user: User | null };
      if (!data.user) {
        window.location.href = "/login";
        return;
      }
      setUser(data.user);
      setFirstName(data.user.firstName);
      setLastName(data.user.lastName);
      setPhone(data.user.phone || "");
    })();
  }, []);

  async function onSave() {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, phone }),
      });

      const data = (await response.json()) as { message?: string; user?: User };
      if (!response.ok) {
        setError(data.message || "Unable to update profile.");
        return;
      }

      if (data.user) {
        setUser(data.user);
      }
      setMessage("Profile updated successfully.");
    } catch {
      setError("Unable to update profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-border/70 bg-card/80 p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 className="font-display text-3xl font-black uppercase tracking-tight">Profile</h1>
            <Link href="/my-account" className="text-sm text-primary hover:underline">Back to account</Link>
          </div>

          {user ? (
            <div className="space-y-4">
              <label className="block space-y-2 text-sm">
                <span className="font-medium text-foreground">Email</span>
                <Input value={user.email} disabled />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2 text-sm">
                  <span className="font-medium text-foreground">First Name</span>
                  <Input value={firstName} onChange={(event) => setFirstName(event.target.value)} />
                </label>
                <label className="block space-y-2 text-sm">
                  <span className="font-medium text-foreground">Last Name</span>
                  <Input value={lastName} onChange={(event) => setLastName(event.target.value)} />
                </label>
              </div>

              <label className="block space-y-2 text-sm">
                <span className="font-medium text-foreground">Phone</span>
                <Input value={phone} onChange={(event) => setPhone(event.target.value)} />
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

              <Button className="h-11 w-full" disabled={loading} onClick={onSave}>
                {loading ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          )}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
