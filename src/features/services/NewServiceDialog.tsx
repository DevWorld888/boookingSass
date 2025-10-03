// src/features/services/NewServiceDialog.tsx
"use client";
import { useState } from "react";

export default function NewServiceDialog({ orgId }: { orgId: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    durationMinutes: 60,
    capacity: 1,
    priceCents: 0,
    currency: "USD",
    requiresResourceTypes: [] as string[],
    buffersBeforeMinutes: 0,
    buffersAfterMinutes: 0,
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...form, orgId }),
    });
    if (res.ok) {
      setOpen(false);
      window.location.reload(); // simple por ahora; luego usamos SWR/React Query
    }
  }

  return (
    <>
      <button className="rounded bg-black text-white px-3 py-2" onClick={() => setOpen(true)}>
        Nuevo servicio
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 grid place-items-center">
          <form onSubmit={onSubmit} className="bg-white rounded-xl p-4 w-full max-w-md space-y-3">
            <h3 className="text-lg font-semibold">Crear servicio</h3>
            <input className="w-full border rounded px-3 py-2" placeholder="Nombre"
              value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/>
            <div className="grid grid-cols-2 gap-3">
              <input className="border rounded px-3 py-2" type="number" min={10} placeholder="Duración (min)"
                value={form.durationMinutes} onChange={(e)=>setForm({...form, durationMinutes:+e.target.value})}/>
              <input className="border rounded px-3 py-2" type="number" min={1} placeholder="Capacidad"
                value={form.capacity} onChange={(e)=>setForm({...form, capacity:+e.target.value})}/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input className="border rounded px-3 py-2" type="number" min={0} placeholder="Precio (centavos)"
                value={form.priceCents} onChange={(e)=>setForm({...form, priceCents:+e.target.value})}/>
              <input className="border rounded px-3 py-2" placeholder="Moneda (USD/AUD)"
                value={form.currency} onChange={(e)=>setForm({...form, currency:e.target.value.toUpperCase()})}/>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input className="border rounded px-3 py-2" type="number" min={0} placeholder="Buffer antes (min)"
                value={form.buffersBeforeMinutes} onChange={(e)=>setForm({...form, buffersBeforeMinutes:+e.target.value})}/>
              <input className="border rounded px-3 py-2" type="number" min={0} placeholder="Buffer después (min)"
                value={form.buffersAfterMinutes} onChange={(e)=>setForm({...form, buffersAfterMinutes:+e.target.value})}/>
            </div>

            <div className="flex gap-2 justify-end">
              <button type="button" className="px-3 py-2" onClick={()=>setOpen(false)}>Cancelar</button>
              <button className="rounded bg-black text-white px-3 py-2">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
