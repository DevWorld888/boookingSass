// src/app/(dashboard)/layout.tsx
import LogoutButton from "@/components/logoutButton";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth(); // server-side
  if (!session?.user) return null; // middleware ya redirige a /signin

  const orgId = (session as any).orgId as string;

  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r p-4 space-y-2">
        <div className="font-semibold">Mi Org</div>
        <div className="text-xs text-slate-500 break-all">{orgId}</div>
        <nav className="pt-4 space-y-2 text-sm">
          <Link href="/dashboard">Dashboard</Link><br/>
          <Link href="/bookings">Bookings</Link><br/>
          <Link href="/services">Services</Link><br/>
          <Link href="/resources">Resources</Link><br/>
          <Link href="/customers">Customers</Link><br/>
          <Link href="/settings">Settings</Link>
        </nav>
        <LogoutButton />
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}
