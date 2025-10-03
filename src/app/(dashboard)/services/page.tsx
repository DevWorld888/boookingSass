import ServicesTable from "@/features/services/ServicesTable";
import NewServiceDialog from "@/features/services/NewServiceDialog";
import { auth } from "@/lib/auth";

export default async function ServicesPage() {
  const session = await auth();
   if (!session?.user) return null;
  const orgId = (session as any).orgId as string;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Services</h1>
        <NewServiceDialog orgId={orgId} />
      </div>
      <ServicesTable orgId={orgId} />
    </div>
  );
}
