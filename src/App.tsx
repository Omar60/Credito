import React, { useState, useEffect } from 'react';
import FormularioCliente from './components/FormularioCliente';
import ListaClientes from './components/ListaClientes';
import ResumenComisiones from './components/ResumenComisiones';
import ResumenMensual from './components/ResumenMensual';
import { Cliente } from './types';
import {
  CreditCard,
  Search,
  Moon,
  Sun,
  Download,
  Upload,
  FileText,FileSpreadsheet,
} from 'lucide-react';
import {
  saveClientes,
  loadClientes,
  exportarDatos,
  importarDatos,
} from './utils/storage';
import { exportToPDF, exportToExcel } from './utils/exportUtils';

const App: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [filtro, setFiltro] = useState<
    'todos' | 'aprobado' | 'rechazado' | 'pendiente'
  >('todos');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [modoOscuro, setModoOscuro] = useState(true);
  const [mostrarResumenMensual, setMostrarResumenMensual] = useState(false);
  const [columnasMostradas, setColumnasMostradas] = useState({
    nombre: true,
    empresa: false,
    montoCredito: true,
    plazo: true,
    estadoCredito: true,
    fechaCreacion: false,
    comision: true,
  });

  useEffect(() => {
    const clientesGuardados = loadClientes();
    if (clientesGuardados) {
      setClientes(clientesGuardados);
    }
    const modoOscuroGuardado = localStorage.getItem('modoOscuro');
    if (modoOscuroGuardado === null) {
      setModoOscuro(true);
    } else {
      setModoOscuro(JSON.parse(modoOscuroGuardado));
    }
  }, []);

  useEffect(() => {
    saveClientes(clientes);
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem('modoOscuro', JSON.stringify(modoOscuro));
    if (modoOscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [modoOscuro]);

  const handleAgregarCliente = (nuevoCliente: Cliente) => {
    setClientes([...clientes, nuevoCliente]);
    setMostrarFormulario(false);
  };

  const handleActualizarCliente = (clienteActualizado: Cliente) => {
    setClientes(
      clientes.map((c) =>
        c.id === clienteActualizado.id ? clienteActualizado : c
      )
    );
    setClienteEditando(null);
    setMostrarFormulario(false);
  };

  const handleEliminarCliente = (id: string) => {
    setClientes(clientes.filter((c) => c.id !== id));
  };

  const handleActualizarEstado = (
    id: string,
    estado: 'aprobado' | 'rechazado'
  ) => {
    setClientes(
      clientes.map((c) => {
        if (c.id === id) {
          const comision = estado === 'rechazado' ? 0 : c.montoCredito * 0.02;
          return { ...c, estadoCredito: estado, comision };
        }
        return c;
      })
    );
  };

  const handleActualizarComision = (id: string, pagada: boolean) => {
    setClientes(
      clientes.map((c) => (c.id === id ? { ...c, comisionPagada: pagada } : c))
    );
  };

  const handleMarcarTodasComisionesCobradas = () => {
    setClientes(clientes.map((c) => ({ ...c, comisionPagada: true })));
  };

  const handleExportarDatos = () => {
    const datos = exportarDatos();
    const blob = new Blob([datos], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientes_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportarDatos = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const contenido = e.target?.result as string;
        if (importarDatos(contenido)) {
          setClientes(loadClientes());
          alert('Datos importados correctamente');
        } else {
          alert('Error al importar datos. Verifique el formato del archivo.');
        }
      };
      reader.readAsText(file);
    }
  };

  const clientesFiltrados = clientes.filter((cliente) => {
    const cumpleFiltroEstado =
      filtro === 'todos' || cliente.estadoCredito === filtro;
    const cumpleBusqueda =
      cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.empresa.toLowerCase().includes(busqueda.toLowerCase());
    const fechaCliente = new Date(cliente.fechaCreacion);
    const cumpleFechaInicio =
      !fechaInicio || fechaCliente >= new Date(fechaInicio);
    const cumpleFechaFin = !fechaFin || fechaCliente <= new Date(fechaFin);

    return (
      cumpleFiltroEstado &&
      cumpleBusqueda &&
      cumpleFechaInicio &&
      cumpleFechaFin
    );
  });

  return (
    <div
      className={`min-h-screen ${
        modoOscuro ? 'dark bg-gray-900 text-white' : 'bg-gray-100'
      } py-6 flex flex-col justify-center sm:py-12`}
    >
      <div className="relative py-3 sm:max-w-full mx-auto w-full px-4 sm:px-16 m-4 sm:m-16">
        <div
          className={`absolute inset-0 ${
            modoOscuro
              ? 'bg-gradient-to-r from-blue-900 to-purple-900'
              : 'bg-gradient-to-r from-cyan-400 to-light-blue-500'
          } shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl`}
        ></div>
        <div
          className={`relative px-4 py-10 ${
            modoOscuro ? 'bg-gray-800' : 'bg-white'
          } shadow-lg sm:rounded-3xl sm:p-20`}
        >
          <div className="max-w-full mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
              <div className="flex items-center space-x-5 mb-4 sm:mb-0">
                <CreditCard
                  className={`h-16 w-16 ${
                    modoOscuro ? 'text-blue-400' : 'text-blue-500'
                  }`}
                />
                <div className="text-3xl font-bold">
                  Sistema de Gestión de Crédito 1.0
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                  className={`${
                    modoOscuro
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white px-6 py-3 rounded-lg text-lg transition-colors`}
                >
                  {mostrarFormulario ? 'Cerrar' : 'Agregar Cliente'}
                </button>
                <button
                  onClick={() => setModoOscuro(!modoOscuro)}
                  className={`${
                    modoOscuro
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-gray-800 text-white'
                  } p-3 rounded-full`}
                >
                  {modoOscuro ? <Sun size={24} /> : <Moon size={24} />}
                </button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-4 mb-6">
              <div className="w-full sm:w-1/3 mb-4 sm:mb-0">
                <select
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value as any)}
                  className={`w-full py-3 px-4 text-lg border ${
                    modoOscuro
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'bg-white border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                >
                  <option value="todos">Todos</option>
                  <option value="aprobado">Aprobados</option>
                  <option value="rechazado">Rechazados</option>
                  <option value="pendiente">Pendientes</option>
                </select>
              </div>
              <div className="w-full sm:w-2/3 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Buscar por nombre o empresa"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className={`w-full py-3 pl-12 pr-4 text-lg border ${
                      modoOscuro
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'border-gray-300'
                    } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  <Search
                    className={`absolute left-4 top-3.5 h-6 w-6 ${
                      modoOscuro ? 'text-gray-400' : 'text-gray-400'
                    }`}
                  />
                </div>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className={`w-full sm:w-1/4 py-3 px-4 text-lg border ${
                    modoOscuro
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className={`w-full sm:w-1/4 py-3 px-4 text-lg border ${
                    modoOscuro
                      ? 'bg-gray-700 border-gray-600 text-white'
                      : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                />
              </div>
            </div>
            <div className="flex flex-col lg:flex-row lg:space-x-6">
              <div className="w-full lg:w-4/5">
                <div className="mb-4 flex flex-wrap gap-2">
                  {Object.entries(columnasMostradas).map(
                    ([columna, mostrada]) => (
                      <label
                        key={columna}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={mostrada}
                          onChange={() =>
                            setColumnasMostradas((prev) => ({
                              ...prev,
                              [columna]: !prev[columna],
                            }))
                          }
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                        <span className="text-sm">
                          {columna.charAt(0).toUpperCase() + columna.slice(1)}
                        </span>
                      </label>
                    )
                  )}
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
                  columnasMostradas={columnasMostradas}
                  modoOscuro={modoOscuro}
                />
              </div>
              <div className="w-full lg:w-1/5 mt-6 lg:mt-0">
                {mostrarFormulario && (
                  <FormularioCliente
                    onSubmit={
                      clienteEditando
                        ? handleActualizarCliente
                        : handleAgregarCliente
                    }
                    datosIniciales={clienteEditando}
                    modoOscuro={modoOscuro}
                  />
                )}
                <ResumenComisiones
                  clientes={clientes}
                  onMarcarTodasComisionesCobradas={
                    handleMarcarTodasComisionesCobradas
                  }
                  modoOscuro={modoOscuro}
                />
                <div className="mt-6 space-y-4">
                  <button
                    onClick={handleExportarDatos}
                    className={`w-full flex items-center justify-center space-x-2 py-2 px-4 ${
                      modoOscuro
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-green-500 hover:bg-green-600'
                    } text-white rounded-md transition-colors`}
                  >
                    <Download size={20} />
                    <span>Exportar Datos</span>
                  </button>
                  <label
                    className={`w-full flex items-center justify-center space-x-2 py-2 px-4 ${
                      modoOscuro
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-yellow-500 hover:bg-yellow-600'
                    } text-white rounded-md cursor-pointer transition-colors`}
                  >
                    <Upload size={20} />
                    <span>Importar Datos</span>
                    <input
                      type="file"
                      onChange={handleImportarDatos}
                      accept=".json"
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => exportToPDF(clientes)}
                    className={`w-full flex items-center justify-center space-x-2 py-2 px-4 ${
                      modoOscuro
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-red-500 hover:bg-red-600'
                    } text-white rounded-md transition-colors`}
                  >
                    <FileText size={20} />
                    <span>Exportar a PDF</span>
                  </button>
                  <button
                    onClick={() => exportToExcel(clientes)}
                    className={`w-full flex items-center justify-center space-x-2 py-2 px-4 ${
                      modoOscuro
                        ? 'bg-indigo-600 hover:bg-indigo-700'
                        : 'bg-indigo-500 hover:bg-indigo-600'
                    } text-white rounded-md transition-colors`}
                  >
                    <FileSpreadsheet size={20} />
                    <span>Exportar a Excel</span>
                  </button>
                  <button
                    onClick={() =>
                      setMostrarResumenMensual(!mostrarResumenMensual)
                    }
                    className={`w-full py-2 px-4 ${
                      modoOscuro
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-purple-500 hover:bg-purple-600'
                    } text-white rounded-md transition-colors`}
                  >
                    {mostrarResumenMensual
                      ? 'Ocultar Resumen Mensual'
                      : 'Mostrar Resumen Mensual'}
                  </button>
                </div>
              </div>
            </div>
            {mostrarResumenMensual && (
              <div className="mt-8">
                <ResumenMensual clientes={clientes} modoOscuro={modoOscuro} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;