import React, { useState } from 'react';
import { Cliente } from '../types';

interface FormularioClienteProps {
  onSubmit: (cliente: Omit<Cliente, 'id' | 'fechaCreacion' | 'comision' | 'comisionPagada'>) => void;
  datosIniciales?: Cliente;
}

const FormularioCliente: React.FC<FormularioClienteProps> = ({ onSubmit, datosIniciales }) => {
  const [formData, setFormData] = useState<Omit<Cliente, 'id' | 'fechaCreacion' | 'comision' | 'comisionPagada'>>({
    nombre: datosIniciales?.nombre || '',
    empresa: datosIniciales?.empresa || '',
    montoCredito: datosIniciales?.montoCredito || 0,
    estadoCredito: datosIniciales?.estadoCredito || 'pendiente',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'montoCredito' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!datosIniciales) {
      setFormData({ nombre: '', empresa: '', montoCredito: 0, estadoCredito: 'pendiente' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="empresa" className="block text-sm font-medium text-gray-700">Empresa</label>
        <input
          type="text"
          id="empresa"
          name="empresa"
          value={formData.empresa}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="montoCredito" className="block text-sm font-medium text-gray-700">Monto de Crédito Aprobado</label>
        <input
          type="number"
          id="montoCredito"
          name="montoCredito"
          value={formData.montoCredito}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="estadoCredito" className="block text-sm font-medium text-gray-700">Estado del Crédito</label>
        <select
          id="estadoCredito"
          name="estadoCredito"
          value={formData.estadoCredito}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {datosIniciales ? 'Actualizar Cliente' : 'Agregar Cliente'}
      </button>
    </form>
  );
};

export default FormularioCliente;