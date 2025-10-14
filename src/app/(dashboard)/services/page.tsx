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
          {/* Card 1 - Total Servicios */}
          <div className="bg-[#1a2332] rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all">
            {/* Header con ícono y menú */}
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center">
                <RectangleGroupIcon className="h-6 w-6 text-gray-400" />
              </div>
              <button className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

            {/* Título principal */}
            <div className="mb-2">
              <h3 className="text-3xl font-bold text-white">8/12</h3>
            </div>

            {/* Subtítulo */}
            <p className="text-sm text-gray-400 mb-6">Total Servicios</p>

            {/* Barra de progreso y detalles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Servicios Activos</span>
                <span className="text-white font-medium">8 <span className="text-blue-400">(67%)</span></span>
              </div>
              {/* Barra de progreso */}
              <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all" style={{ width: '67%' }}></div>
              </div>
            </div>
          </div>

          {/* Card 2 - Servicios Activos */}
          <div className="bg-[#1a2332] rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all">
            {/* Header con ícono y menú */}
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center">
                <ArrowUpOnSquareIcon className="h-6 w-6 text-gray-400" />
              </div>
              <button className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

            {/* Título principal */}
            <div className="mb-2">
              <h3 className="text-3xl font-bold text-white">52/86</h3>
            </div>

            {/* Subtítulo */}
            <p className="text-sm text-gray-400 mb-6">Servicios Activos</p>

            {/* Barra de progreso y detalles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Servicios Activos</span>
                <span className="text-white font-medium">52 Completados <span className="text-orange-400">(63%)</span></span>
              </div>
              {/* Barra de progreso */}
              <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full transition-all" style={{ width: '63%' }}></div>
              </div>
            </div>
          </div>
          
          {/* Card 3 - Precio Promedio */}
          <div className="bg-[#1a2332] rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all">
            {/* Header con ícono y menú */}
            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-gray-400" />
              </div>
              <button className="text-gray-400 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>

            {/* Título principal */}
            <div className="mb-2">
              <h3 className="text-3xl font-bold text-white">16/20</h3>
            </div>

            {/* Subtítulo */}
            <p className="text-sm text-gray-400 mb-6">Precio Promedio</p>

            {/* Barra de progreso y detalles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Proyectos En...</span>
                <span className="text-white font-medium">16 Completados <span className="text-green-400">(78%)</span></span>
              </div>
              {/* Barra de progreso */}
              <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                <div className="bg-green-500 h-full rounded-full transition-all" style={{ width: '78%' }}></div>
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
