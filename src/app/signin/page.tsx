"use client";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("owner@demo.local");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/callback/credentials", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ email, csrf: "" }) as any,
    });
    // NextAuth v5 redirige con 302 si ok
    if (res.redirected) window.location.href = "/dashboard";
  }

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm border p-4 rounded-xl space-y-3">
        <h1 className="text-xl font-semibold">Inicia sesión</h1>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />
        <button className="w-full rounded bg-black text-white py-2">Entrar</button>
        <p className="text-xs text-slate-500">Para dev usa <b>owner@demo.local</b></p>
      </form>
    </main>
  );
}
