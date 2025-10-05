"use client";
import { useState, useEffect } from "react";
import { PencilIcon, XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  capacity: number;
  priceCents: number;
}

interface EditServiceModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Service) => void;
}

export default function EditServiceModal({ service, isOpen, onClose, onSave }: EditServiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: service?.name || "",
    durationMinutes: service?.durationMinutes || 60,
    capacity: service?.capacity || 1,
    priceCents: service?.priceCents || 0,
  });

  // Actualizar el formulario cuando cambie el servicio
  useEffect(() => {
    if (service) {
      setForm({
        name: service.name,
        durationMinutes: service.durationMinutes,
        capacity: service.capacity,
        priceCents: service.priceCents,
      });
    }
  }, [service]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!service) return;
    
    setLoading(true);
    
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      
      if (res.ok) {
        const updatedService = await res.json();
        onSave(updatedService);
        onClose();
      }
    } catch (error) {
      console.error('Error updating service:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <PencilIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Editar Servicio</h3>
              <p className="text-sm text-gray-500">Actualiza la información del servicio</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Servicio
            </label>
            <input 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={form.name} 
              onChange={(e) => setForm({...form, name: e.target.value})}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración (min)
              </label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="number" 
                min={10}
                value={form.durationMinutes} 
                onChange={(e) => setForm({...form, durationMinutes: +e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacidad
              </label>
              <input 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="number" 
                min={1}
                value={form.capacity} 
                onChange={(e) => setForm({...form, capacity: +e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input 
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                type="number" 
                min={0}
                step="0.01"
                value={form.priceCents / 100} 
                onChange={(e) => setForm({...form, priceCents: Math.round(+e.target.value * 100)})}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button 
              type="button" 
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit"
              disabled={loading || !form.name.trim()}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Actualizando...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}