import ServicesTable from "@/features/services/ServicesTable";
import NewServiceDialog from "@/features/services/NewServiceDialog";
import Breadcrumb from "@/components/Breadcrumb";
import { auth } from "@/lib/auth";
import { ArrowUpOnSquareIcon, ChartBarIcon, Cog6ToothIcon,RectangleGroupIcon } from '@heroicons/react/24/outline';

export default async function ServicesPage() {
  const session = await auth();
   if (!session?.user) return null;
  const orgId = (session as any).orgId as string;

  const breadcrumbItems = [
    { label: 'Admin Dashboard', href: '/dashboard' },
    { label: 'Gestión de Servicios' }
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb items={breadcrumbItems} />
      
      {/* Header Section */}
      <div className="bg-[#111827] rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Title and Description */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-[#151E34] rounded-lg">
                <RectangleGroupIcon className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 text-white">Gestión de Servicios</h1>
            </div>
            <p className="text-white">
              Administra todos tus servicios disponibles, precios y configuraciones.
            </p>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-white-700 hover:text-[#1C2438] bg-[#1C2438] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Cog6ToothIcon className="h-4 w-4 mr-2" />
              Configuración
            </button>            
            <NewServiceDialog orgId={orgId} />
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-[#0F172A] rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Total Servicios</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <div className="p-2 bg-[#151E34] rounded-lg">
                <RectangleGroupIcon className="h-6 w-6 text-white" />
                
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Servicios Activos</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
              <div className="p-2 bg-[#151E34] rounded-lg">
                <ArrowUpOnSquareIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          
          <div className="bg-[#0F172A] rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Precio Promedio</p>
                <p className="text-2xl font-bold text-white">$85.50</p>
              </div>
              <div className="p-2 bg-[#151E34] rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Services Table */}
      <ServicesTable orgId={orgId} />
    </div>
  );
}
