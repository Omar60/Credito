import React, { useState, useEffect } from 'react';
import FormularioCliente from './components/FormularioCliente';
import ListaClientes from './components/ListaClientes';
import ResumenComisiones from './components/ResumenComisiones';
import { Cliente } from './types';
import { CreditCard, Search } from 'lucide-react';
import { saveClientes, loadClientes } from './utils/storage';

const App: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [filtro, setFiltro] = useState<'todos' | 'aprobado' | 'rechazado' | 'pendiente'>('todos');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  useEffect(() => {
    const clientesGuardados = loadClientes();
    if (clientesGuardados) {
      setClientes(clientesGuardados);
    }
  }, []);

  useEffect(() => {
    saveClientes(clientes);
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

  const handleMarcarTodasComisionesCobradas = () => {
    setClientes(clientes.map(c => ({ ...c, comisionPagada: true })));
  };

  const clientesFiltrados = clientes.filter(cliente => {
    const cumpleFiltroEstado = filtro === 'todos' || cliente.estadoCredito === filtro;
    const cumpleBusqueda = cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                           cliente.empresa.toLowerCase().includes(busqueda.toLowerCase());
    const fechaCliente = new Date(cliente.fechaCreacion);
    const cumpleFechaInicio = !fechaInicio || fechaCliente >= new Date(fechaInicio);
    const cumpleFechaFin = !fechaFin || fechaCliente <= new Date(fechaFin);
    
    return cumpleFiltroEstado && cumpleBusqueda && cumpleFechaInicio && cumpleFechaFin;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-full mx-auto w-full px-16 m-16">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-full mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-5">
                <CreditCard className="h-16 w-16 text-blue-500" />
                <div className="text-3xl font-bold">Sistema de Gestión de Crédito 1.0</div>
              </div>
              <button
                onClick={() => setMostrarFormulario(!mostrarFormulario)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-600 transition-colors"
              >
                {mostrarFormulario ? 'Cerrar' : 'Agregar Cliente'}
              </button>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
              <div className="w-full md:w-1/3 mb-4 md:mb-0">
                <select
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value as any)}
                  className="w-full py-3 px-4 text-lg border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="todos">Todos</option>
                  <option value="aprobado">Aprobados</option>
                  <option value="rechazado">Rechazados</option>
                  <option value="pendiente">Pendientes</option>
                </select>
              </div>
              <div className="w-full md:w-2/3 flex space-x-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Buscar por nombre o empresa"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="w-full py-3 pl-12 pr-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <Search className="absolute left-4 top-3.5 h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-1/4 py-3 px-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-1/4 py-3 px-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:space-x-6">
              <div className="w-full lg:w-4/5">
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
              <div className="w-full lg:w-1/5 mt-6 lg:mt-0">
                {mostrarFormulario && (
                  <FormularioCliente
                    onSubmit={clienteEditando ? handleActualizarCliente : handleAgregarCliente}
                    datosIniciales={clienteEditando || undefined}
                  />
                )}
                <ResumenComisiones 
                  clientes={clientes}
                  onMarcarTodasComisionesCobradas={handleMarcarTodasComisionesCobradas}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
