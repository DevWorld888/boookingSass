// src/features/services/ServicesTable.tsx
"use client";
import { useEffect, useState } from "react";

export default function ServicesTable({ orgId }: { orgId: string }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/services?orgId=${orgId}`)
      .then(r => r.json())
      .then(d => setRows(d.services || []))
      .finally(() => setLoading(false));
  }, [orgId]);

  if (loading) return <p>Cargando...</p>;

  return (
    <table className="w-full border text-sm">
      <thead className="bg-slate-50">
        <tr>
          <th className="p-2 border">Nombre</th>
          <th className="p-2 border">Duración</th>
          <th className="p-2 border">Capacidad</th>
          <th className="p-2 border">Precio</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((s:any) => (
          <tr key={s.id} className="border">
            <td className="p-2 border">{s.name}</td>
            <td className="p-2 border">{s.durationMinutes} min</td>
            <td className="p-2 border">{s.capacity}</td>
            <td className="p-2 border">{s.priceCents ? (s.priceCents/100).toFixed(2) : "-"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
