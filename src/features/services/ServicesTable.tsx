// src/features/services/ServicesTable.tsx
"use client";
import { useEffect, useState } from "react";
import { 
  MagnifyingGlassIcon, 
  PencilIcon, 
  TrashIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  ChevronUpDownIcon
} from '@heroicons/react/24/outline';
import EditServiceModal from './EditServiceModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import FiltersModal from './FiltersModal';

interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  capacity: number;
  priceCents: number;
}

export default function ServicesTable({ orgId }: { orgId: string }) {
  const [rows, setRows] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Service | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  
  // Estados para los modales
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [filtersModalOpen, setFiltersModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeFilters, setActiveFilters] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/services?orgId=${orgId}`)
      .then(r => r.json())
      .then(d => setRows(d.services || []))
      .finally(() => setLoading(false));
  }, [orgId]);

  const handleSort = (key: keyof Service) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedRows = [...rows].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const filteredRows = sortedRows.filter(service => {
    // Filtro de búsqueda
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtros avanzados
    if (activeFilters) {
      const price = service.priceCents / 100;
      const matchesPrice = price >= activeFilters.priceRange.min && price <= activeFilters.priceRange.max;
      const matchesDuration = service.durationMinutes >= activeFilters.durationRange.min && 
                             service.durationMinutes <= activeFilters.durationRange.max;
      const matchesCapacity = service.capacity >= activeFilters.capacityRange.min && 
                             service.capacity <= activeFilters.capacityRange.max;
      
      return matchesSearch && matchesPrice && matchesDuration && matchesCapacity;
    }
    
    return matchesSearch;
  });

  const handleRowSelect = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === filteredRows.length 
        ? [] 
        : filteredRows.map(row => row.id)
    );
  };

  const handleEdit = (service: Service) => {
    setSelectedService(service);
    setEditModalOpen(true);
  };

  const handleDelete = (service: Service) => {
    setSelectedService(service);
    setDeleteModalOpen(true);
  };

  const handleSaveEdit = (updatedService: Service) => {
    setRows(prev => prev.map(row => 
      row.id === updatedService.id ? updatedService : row
    ));
  };

  const handleConfirmDelete = (deletedId: string) => {
    setRows(prev => prev.filter(row => row.id !== deletedId));
    setSelectedRows(prev => prev.filter(id => id !== deletedId));
  };

  const handleApplyFilters = (filters: any) => {
    setActiveFilters(filters);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#1a2332] rounded-xl overflow-hidden">
      {/* Header con búsqueda y filtros */}
      <div className="p-6 border-b border-gray-700/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-white">Lista de Servicios</h2>
            {selectedRows.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700/50 text-white">
                {selectedRows.length} seleccionado{selectedRows.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar servicios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-gray-800/50 border border-gray-700 text-white placeholder-gray-400 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button 
              onClick={() => setFiltersModalOpen(true)}
              className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                activeFilters 
                  ? 'border-blue-500 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30' 
                  : 'border-gray-700 text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filtros
              {activeFilters && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/30 text-blue-300">
                  Activos
                </span>
              )}
            </button>
            
            <button className="inline-flex items-center px-3 py-2 border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800/50 focus:ring-2 focus:ring-blue-500">
              <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
              Vista
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th scope="col" className="relative w-12 px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedRows.length === filteredRows.length && filteredRows.length > 0}
                  onChange={handleSelectAll}
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
              </th>
              
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800/30"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Nombre
                  <ChevronUpDownIcon className="h-4 w-4" />
                </div>
              </th>
              
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800/30"
                onClick={() => handleSort('durationMinutes')}
              >
                <div className="flex items-center gap-1">
                  Duración
                  <ChevronUpDownIcon className="h-4 w-4" />
                </div>
              </th>
              
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800/30"
                onClick={() => handleSort('capacity')}
              >
                <div className="flex items-center gap-1">
                  Capacidad
                  <ChevronUpDownIcon className="h-4 w-4" />
                </div>
              </th>
              
              <th 
                scope="col" 
                className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-800/30"
                onClick={() => handleSort('priceCents')}
              >
                <div className="flex items-center gap-1">
                  Precio
                  <ChevronUpDownIcon className="h-4 w-4" />
                </div>
              </th>
              
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Estado
              </th>
              
              <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          
          <tbody>
            {filteredRows.map((service, index) => (
              <tr 
                key={service.id} 
                className={`border-b border-gray-700/30 hover:bg-gray-800/30 transition-colors duration-150 ${
                  selectedRows.includes(service.id) ? 'bg-blue-900/20' : ''
                }`}
              >
                <td className="relative w-12 px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(service.id)}
                    onChange={() => handleRowSelect(service.id)}
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {service.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">{service.name}</div>
                      <div className="text-sm text-gray-400">ID: {service.id.slice(0, 8)}...</div>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-white">
                      {service.durationMinutes} min
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  <div className="flex items-center">
                    <span>
                      {service.capacity} personas
                    </span>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                  <span className="font-medium">
                    ${service.priceCents ? (service.priceCents / 100).toFixed(2) : "0.00"}
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-green-400 font-medium">
                    Activo
                  </span>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(service)}
                      className="inline-flex items-center p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-800/50 rounded-lg transition-colors duration-150"
                      title="Editar"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(service)}
                      className="inline-flex items-center p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800/50 rounded-lg transition-colors duration-150"
                      title="Eliminar"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer con información de paginación */}
      <div className="px-6 py-4 bg-[#1a2332] border-t border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Mostrando <span className="font-medium text-white">{filteredRows.length}</span> de{' '}
            <span className="font-medium text-white">{rows.length}</span> servicios
          </div>
          
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm border border-gray-700 text-gray-300 rounded-md hover:bg-gray-800/50 disabled:opacity-50">
              Anterior
            </button>
            <span className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md">1</span>
            <button className="px-3 py-1 text-sm border border-gray-700 text-gray-300 rounded-md hover:bg-gray-800/50 disabled:opacity-50">
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Modales */}
      <EditServiceModal
        service={selectedService}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedService(null);
        }}
        onSave={handleSaveEdit}
        orgId={orgId}
      />

      <DeleteConfirmationModal
        serviceName={selectedService?.name || null}
        serviceId={selectedService?.id || null}
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedService(null);
        }}
        onConfirm={handleConfirmDelete}
        orgId={orgId}
      />

      <FiltersModal
        isOpen={filtersModalOpen}
        onClose={() => setFiltersModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}
