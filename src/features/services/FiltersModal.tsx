"use client";
import { useState } from "react";
import { XMarkIcon, FunnelIcon, CheckIcon } from '@heroicons/react/24/outline';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
}

interface FilterOptions {
  priceRange: {
    min: number;
    max: number;
  };
  durationRange: {
    min: number;
    max: number;
  };
  capacityRange: {
    min: number;
    max: number;
  };
  status: 'all' | 'active' | 'inactive';
}

export default function FiltersModal({ isOpen, onClose, onApplyFilters }: FiltersModalProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: { min: 0, max: 1000 },
    durationRange: { min: 15, max: 300 },
    capacityRange: { min: 1, max: 50 },
    status: 'all'
  });

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      priceRange: { min: 0, max: 1000 },
      durationRange: { min: 15, max: 300 },
      capacityRange: { min: 1, max: 50 },
      status: 'all'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <FunnelIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Filtros Avanzados</h3>
              <p className="text-sm text-gray-500">Personaliza la vista de servicios</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Rango de Precio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Rango de Precio (USD)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
                <input
                  type="number"
                  min="0"
                  value={filters.priceRange.min}
                  onChange={(e) => setFilters({
                    ...filters,
                    priceRange: { ...filters.priceRange, min: +e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Máximo</label>
                <input
                  type="number"
                  min="0"
                  value={filters.priceRange.max}
                  onChange={(e) => setFilters({
                    ...filters,
                    priceRange: { ...filters.priceRange, max: +e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Rango de Duración */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Duración (minutos)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
                <input
                  type="number"
                  min="15"
                  value={filters.durationRange.min}
                  onChange={(e) => setFilters({
                    ...filters,
                    durationRange: { ...filters.durationRange, min: +e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Máximo</label>
                <input
                  type="number"
                  min="15"
                  value={filters.durationRange.max}
                  onChange={(e) => setFilters({
                    ...filters,
                    durationRange: { ...filters.durationRange, max: +e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Rango de Capacidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Capacidad (personas)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
                <input
                  type="number"
                  min="1"
                  value={filters.capacityRange.min}
                  onChange={(e) => setFilters({
                    ...filters,
                    capacityRange: { ...filters.capacityRange, min: +e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Máximo</label>
                <input
                  type="number"
                  min="1"
                  value={filters.capacityRange.max}
                  onChange={(e) => setFilters({
                    ...filters,
                    capacityRange: { ...filters.capacityRange, max: +e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Estado del Servicio
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'all', label: 'Todos' },
                { value: 'active', label: 'Activos' },
                { value: 'inactive', label: 'Inactivos' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilters({ ...filters, status: option.value as any })}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors duration-200 ${
                    filters.status === option.value
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            Limpiar Filtros
          </button>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 flex items-center gap-2 transition-colors duration-200"
            >
              <CheckIcon className="h-4 w-4" />
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}