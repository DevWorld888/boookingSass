"use client";
import { useState } from "react";
import { TrashIcon, XMarkIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface DeleteConfirmationModalProps {
  serviceName: string | null;
  serviceId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
}

export default function DeleteConfirmationModal({ 
  serviceName, 
  serviceId, 
  isOpen, 
  onClose, 
  onConfirm 
}: DeleteConfirmationModalProps) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!serviceId) return;
    
    setLoading(true);
    
    try {
      const res = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        onConfirm(serviceId);
        onClose();
      }
    } catch (error) {
      console.error('Error deleting service:', error);
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen || !serviceId) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Confirmar Eliminación</h3>
              <p className="text-sm text-gray-500">Esta acción no se puede deshacer</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            disabled={loading}
          >
            <XMarkIcon className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <TrashIcon className="h-6 w-6 text-red-600" />
            </div>
            
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              ¿Estás seguro de que quieres eliminar este servicio?
            </h4>
            
            <p className="text-sm text-gray-500 mb-6">
              El servicio <span className="font-semibold text-gray-900">"{serviceName}"</span> será eliminado permanentemente. 
              Esta acción no se puede deshacer y todos los datos asociados se perderán.
            </p>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-3 mt-0.5" />
                <div className="text-sm text-red-700">
                  <p className="font-medium">Advertencia:</p>
                  <p>Si este servicio tiene citas programadas, también serán afectadas.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button 
              type="button" 
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors duration-200"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Eliminando...
                </>
              ) : (
                <>
                  <TrashIcon className="h-4 w-4" />
                  Eliminar Servicio
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}