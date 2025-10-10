// src/app/(dashboard)/layout.tsx
import { auth } from "@/lib/auth";
import Sidebar from "@/components/Sidebar";
import "../../styles/globals.css";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth(); // server-side
  if (!session?.user) return null; // middleware ya redirige a /signin

  const orgId = (session as any).orgId as string;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar session={session} orgId={orgId} />
      {/* Main Content */}
      <main className="lg:ml-72 pt-16 lg:pt-0">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
