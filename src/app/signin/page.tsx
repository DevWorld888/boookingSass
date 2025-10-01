"use client";
import { useState } from "react";
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const [email, setEmail] = useState("owner@demo.local");
   const [loading, setLoading] = useState(false)
   const [error, setError] = useState("")

  const router = useRouter()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);


    try {
      const result = await signIn("credentials", {
        email,
        redirect: false,
      })

      if (result?.error) {
        setError("Credenciales inválidas")
        setLoading(false)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      setError("Ocurrió un error")
      setLoading(false)
    }
   
    
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
        <p className="text-xs text-slate-500">Para dev usa <b>owner@demo.local</b></p>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {error}
          </div>
        )}
      </form>
    </main>
  );
}
