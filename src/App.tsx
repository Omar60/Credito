import React, { useState, useEffect } from 'react';
import FormularioCliente from './components/FormularioCliente';
import ListaClientes from './components/ListaClientes';
import { Cliente } from './types';
import { CreditCard } from 'lucide-react';

const App: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [filtro, setFiltro] = useState<'todos' | 'aprobado' | 'rechazado' | 'pendiente'>('todos');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  useEffect(() => {
    const clientesGuardados = localStorage.getItem('clientes');
    if (clientesGuardados) {
      setClientes(JSON.parse(clientesGuardados));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('clientes', JSON.stringify(clientes));
  }, [clientes]);

  const handleAgregarCliente = (nuevoCliente: Omit<Cliente, 'id' | 'fechaCreacion' | 'comision' | 'comisionPagada'>) => {
    const fechaCreacion = new Date().toISOString();
    const comision = nuevoCliente.montoCredito * 0.02;
    const cliente: Cliente = {
      ...nuevoCliente,
      id: Date.now().toString(),
      fechaCreacion,
      comision,
      comisionPagada: false
    };
    setClientes([...clientes, cliente]);
    setMostrarFormulario(false);
  };

  const handleActualizarCliente = (clienteActualizado: Cliente) => {
    setClientes(clientes.map(c => c.id === clienteActualizado.id ? {
      ...clienteActualizado,
      comision: clienteActualizado.montoCredito * 0.02
    } : c));
    setClienteEditando(null);
    setMostrarFormulario(false);
  };

  const handleEliminarCliente = (id: string) => {
    setClientes(clientes.filter(c => c.id !== id));
  };

  const handleActualizarEstado = (id: string, estado: 'aprobado' | 'rechazado') => {
    setClientes(clientes.map(c => c.id === id ? { ...c, estadoCredito: estado } : c));
  };

  const handleActualizarComision = (id: string, pagada: boolean) => {
    setClientes(clientes.map(c => c.id === id ? { ...c, comisionPagada: pagada } : c));
  };

  const clientesFiltrados = clientes.filter(cliente => {
    if (filtro === 'todos') return true;
    return cliente.estadoCredito === filtro;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-5">
                <CreditCard className="h-14 w-14 text-blue-500" />
                <div className="text-2xl font-bold">Sistema de Gestión de Crédito</div>
              </div>
              <button
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                {mostrarFormulario ? 'Cerrar' : 'Agregar Cliente'}
              </button>
            </div>
            {mostrarFormulario && (
              <div className="mb-6">
                <FormularioCliente
                  onSubmit={clienteEditando ? handleActualizarCliente : handleAgregarCliente}
                  datosIniciales={clienteEditando || undefined}
                />
              </div>
            )}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Lista de Clientes</h2>
                <select
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value as any)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="todos">Todos</option>
                  <option value="aprobado">Aprobados</option>
                  <option value="rechazado">Rechazados</option>
                  <option value="pendiente">Pendientes</option>
                </select>
              </div>
              <ListaClientes
                clientes={clientesFiltrados}
                onEditar={(cliente) => {
                  setClienteEditando(cliente);
                  setMostrarFormulario(true);
                }}
                onEliminar={handleEliminarCliente}
                onActualizarEstado={handleActualizarEstado}
                onActualizarComision={handleActualizarComision}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;