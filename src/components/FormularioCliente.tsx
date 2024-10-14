import React, { useState, useEffect } from 'react';
import { Cliente } from '../types';

interface FormularioClienteProps {
  onSubmit: (cliente: Cliente) => void;
  datosIniciales?: Cliente | null;
  modoOscuro: boolean;
}

const FormularioCliente: React.FC<FormularioClienteProps> = ({
  onSubmit,
  datosIniciales,
  modoOscuro,
}) => {
  const [formData, setFormData] = useState<
    Omit<Cliente, 'id' | 'fechaCreacion' | 'comision' | 'comisionPagada'>
  >({
    nombre: '',
    empresa: '',
    montoCredito: 0,
    estadoCredito: 'pendiente',
  });

  const [errores, setErrores] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (datosIniciales) {
      setFormData({
        nombre: datosIniciales.nombre,
        empresa: datosIniciales.empresa,
        montoCredito: datosIniciales.montoCredito,
        estadoCredito: datosIniciales.estadoCredito,
      });
    } else {
      setFormData({
        nombre: '',
        empresa: '',
        montoCredito: 0,
        estadoCredito: 'pendiente',
      });
    }
  }, [datosIniciales]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'montoCredito' ? parseFloat(value) : value,
    }));
    // Limpiar el error del campo cuando se modifica
    setErrores((prev) => ({ ...prev, [name]: '' }));
  };

  const validarFormulario = (): boolean => {
    const nuevosErrores: { [key: string]: string } = {};

    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    }
    if (!formData.empresa.trim()) {
      nuevosErrores.empresa = 'La empresa es requerida';
    }
    if (formData.montoCredito <= 0) {
      nuevosErrores.montoCredito = 'El monto del crédito debe ser mayor a 0';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validarFormulario()) {
      const clienteSubmit: Cliente = {
        ...formData,
        id: datosIniciales?.id || Date.now().toString(),
        fechaCreacion: datosIniciales?.fechaCreacion || new Date().toISOString(),
        comision: formData.montoCredito * 0.02,
        comisionPagada: datosIniciales?.comisionPagada || false,
      };
      onSubmit(clienteSubmit);
      if (!datosIniciales) {
        setFormData({
          nombre: '',
          empresa: '',
          montoCredito: 0,
          estadoCredito: 'pendiente',
        });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`space-y-5 ${
        modoOscuro ? 'bg-gray-800' : 'bg-gray-50'
      } p-8 rounded-lg shadow`}
    >
      <h2 className={`text-2xl font-semibold mb-6 ${
        modoOscuro ? 'text-white' : 'text-gray-800'
      }`}>
        {datosIniciales ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
      </h2>
      <div>
        <label
          htmlFor="nombre"
          className={`block text-base font-medium ${
            modoOscuro ? 'text-gray-300' : 'text-gray-700'
          } mb-1`}
        >
          Nombre
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          className={`mt-1 block w-full rounded-md ${
            modoOscuro
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'border-gray-300'
          } shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-base py-2 px-3`}
        />
        {errores.nombre && (
          <p className="text-red-500 text-sm mt-1">{errores.nombre}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="empresa"
          className={`block text-base font-medium ${
            modoOscuro ? 'text-gray-300' : 'text-gray-700'
          } mb-1`}
        >
          Empresa
        </label>
        <input
          type="text"
          id="empresa"
          name="empresa"
          value={formData.empresa}
          onChange={handleChange}
          required
          className={`mt-1 block w-full rounded-md ${
            modoOscuro
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'border-gray-300'
          } shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-base py-2 px-3`}
        />
        {errores.empresa && (
          <p className="text-red-500 text-sm mt-1">{errores.empresa}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="montoCredito"
          className={`block text-base font-medium ${
            modoOscuro ? 'text-gray-300' : 'text-gray-700'
          } mb-1`}
        >
          Monto de Crédito
        </label>
        <input
          type="number"
          id="montoCredito"
          name="montoCredito"
          value={formData.montoCredito}
          onChange={handleChange}
          required
          min="0"
          step="0.01"
          className={`mt-1 block w-full rounded-md ${
            modoOscuro
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'border-gray-300'
          } shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-base py-2 px-3`}
        />
        {errores.montoCredito && (
          <p className="text-red-500 text-sm mt-1">{errores.montoCredito}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="estadoCredito"
          className={`block text-base font-medium ${
            modoOscuro ? 'text-gray-300' : 'text-gray-700'
          } mb-1`}
        >
          Estado del Crédito
        </label>
        <select
          id="estadoCredito"
          name="estadoCredito"
          value={formData.estadoCredito}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md ${
            modoOscuro
              ? 'bg-gray-700 border-gray-600 text-white'
              : 'border-gray-300'
          } shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 text-base py-2 px-3`}
        >
          <option value="pendiente">Pendiente</option>
          <option value="aprobado">Aprobado</option>
          <option value="rechazado">Rechazado</option>
        </select>
      </div>
      <button
        type="submit"
        className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
          modoOscuro
            ? 'bg-indigo-600 hover:bg-indigo-700'
            : 'bg-indigo-600 hover:bg-indigo-700'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        {datosIniciales ? 'Actualizar Cliente' : 'Agregar Cliente'}
      </button>
    </form>
  );
};

export default FormularioCliente;