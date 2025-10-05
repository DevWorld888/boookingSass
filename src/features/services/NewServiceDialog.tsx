// src/features/services/NewServiceDialog.tsx
"use client";
import { useState } from "react";
import { PlusIcon, XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function NewServiceDialog({ orgId }: { orgId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    durationMinutes: 60,
    capacity: 1,
    priceCents: 0,
    currency: "USD",
    requiresResourceTypes: [] as string[],
    buffersBeforeMinutes: 0,
    buffersAfterMinutes: 0,
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...form, orgId }),
      });
      
      if (res.ok) {
        setOpen(false);
        setForm({
          name: "",
          durationMinutes: 60,
          capacity: 1,
          priceCents: 0,
          currency: "USD",
          requiresResourceTypes: [],
          buffersBeforeMinutes: 0,
          buffersAfterMinutes: 0,
        });
        window.location.reload(); // simple por ahora; luego usamos SWR/React Query
      }
    } catch (error) {
      console.error('Error creating service:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button 
        className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
        onClick={() => setOpen(true)}
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Nuevo Servicio
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Crear Nuevo Servicio</h3>
                  <p className="text-sm text-gray-500">Configura todos los detalles de tu servicio</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="p-6 space-y-6">
              {/* Información básica */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Información Básica</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre del Servicio *
                      </label>
                      <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Ej: Consulta de Nutrición"
                        value={form.name} 
                        onChange={(e) => setForm({...form, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Duración (minutos)
                        </label>
                        <input 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          type="number" 
                          min={10} 
                          placeholder="60"
                          value={form.durationMinutes} 
                          onChange={(e) => setForm({...form, durationMinutes: +e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capacidad
                        </label>
                        <input 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          type="number" 
                          min={1} 
                          placeholder="1"
                          value={form.capacity} 
                          onChange={(e) => setForm({...form, capacity: +e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Precio */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Configuración de Precio</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input 
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          type="number" 
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          value={form.priceCents / 100} 
                          onChange={(e) => setForm({...form, priceCents: Math.round(+e.target.value * 100)})}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Moneda
                      </label>
                      <select 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        value={form.currency} 
                        onChange={(e) => setForm({...form, currency: e.target.value})}
                      >
                        <option value="USD">USD - Dólar Americano</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="MXN">MXN - Peso Mexicano</option>
                        <option value="COP">COP - Peso Colombiano</option>
                        <option value="ARS">ARS - Peso Argentino</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Buffers */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Configuración de Tiempo</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buffer antes (minutos)
                      </label>
                      <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        type="number" 
                        min={0} 
                        placeholder="0"
                        value={form.buffersBeforeMinutes} 
                        onChange={(e) => setForm({...form, buffersBeforeMinutes: +e.target.value})}
                      />
                      <p className="text-xs text-gray-500 mt-1">Tiempo libre antes del servicio</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buffer después (minutos)
                      </label>
                      <input 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        type="number" 
                        min={0} 
                        placeholder="0"
                        value={form.buffersAfterMinutes} 
                        onChange={(e) => setForm({...form, buffersAfterMinutes: +e.target.value})}
                      />
                      <p className="text-xs text-gray-500 mt-1">Tiempo libre después del servicio</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <button 
                  type="button" 
                  className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={loading || !form.name.trim()}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creando...
                    </>
                  ) : (
                    <>
                      <SparklesIcon className="h-4 w-4" />
                      Crear Servicio
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
