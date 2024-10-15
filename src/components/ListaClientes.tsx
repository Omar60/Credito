import React, { useState } from 'react';
import { Cliente } from '../types';
import {
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from 'lucide-react';

interface ListaClientesProps {
  clientes: Cliente[];
  onEditar: (cliente: Cliente) => void;
  onEliminar: (id: string) => void;
  onActualizarEstado: (id: string, estado: 'aprobado' | 'rechazado') => void;
  onActualizarComision: (id: string, pagada: boolean) => void;
  columnasMostradas: { [key: string]: boolean };
  modoOscuro: boolean;
}

const ListaClientes: React.FC<ListaClientesProps> = ({
  clientes,
  onEditar,
  onEliminar,
  onActualizarEstado,
  onActualizarComision,
  columnasMostradas,
  modoOscuro,
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const clientesPorPagina = 20;

  const indiceUltimoCliente = paginaActual * clientesPorPagina;
  const indicePrimerCliente = indiceUltimoCliente - clientesPorPagina;
  const clientesActuales = clientes.slice(
    indicePrimerCliente,
    indiceUltimoCliente
  );

  const totalPaginas = Math.ceil(clientes.length / clientesPorPagina);

  const cambiarPagina = (numeroPagina: number) => {
    setPaginaActual(numeroPagina);
  };

  return (
    <div className="overflow-x-auto">
      <table
        className={`min-w-full ${
          modoOscuro ? 'bg-gray-800 text-white' : 'bg-white'
        } text-base`}
      >
        <thead className={modoOscuro ? 'bg-gray-700' : 'bg-gray-100'}>
          <tr>
            {columnasMostradas.nombre && (
              <th className="py-3 px-4 text-left">Nombre</th>
            )}
            {columnasMostradas.empresa && (
              <th className="py-3 px-4 text-left">Empresa</th>
            )}
            {columnasMostradas.montoCredito && (
              <th className="py-3 px-4 text-left">Crédito</th>
            )}
            {columnasMostradas.plazo && (
              <th className="py-3 px-4 text-left">Plazo</th>
            )}
            {columnasMostradas.estadoCredito && (
              <th className="py-3 px-4 text-left">Estado</th>
            )}
            {columnasMostradas.fechaCreacion && (
              <th className="py-3 px-4 text-left">Fecha Creación</th>
            )}
            {columnasMostradas.comision && (
              <th className="py-3 px-4 text-left">Comisión</th>
            )}
            <th className="py-3 px-4 text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientesActuales.map((cliente) => (
            <tr
              key={cliente.id}
              className={modoOscuro ? 'border-b border-gray-700' : 'border-b'}
            >
              {columnasMostradas.nombre && (
                <td className="py-3 px-4">{cliente.nombre}</td>
              )}
              {columnasMostradas.empresa && (
                <td className="py-3 px-4">{cliente.empresa}</td>
              )}
              {columnasMostradas.montoCredito && (
                <td className="py-3 px-4">
                  ${cliente.montoCredito.toFixed(2)}
                </td>
              )}
              {columnasMostradas.plazo && (
                <td className="py-3 px-4">{cliente.plazo} meses</td>
              )}
              {columnasMostradas.estadoCredito && (
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      cliente.estadoCredito === 'aprobado'
                        ? 'bg-green-200 text-green-800'
                        : cliente.estadoCredito === 'rechazado'
                        ? 'bg-red-200 text-red-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {cliente.estadoCredito.charAt(0).toUpperCase() +
                      cliente.estadoCredito.slice(1)}
                  </span>
                </td>
              )}
              {columnasMostradas.fechaCreacion && (
                <td className="py-3 px-4">
                  {new Date(cliente.fechaCreacion).toLocaleDateString()}
                </td>
              )}
              {columnasMostradas.comision && (
                <td className="py-3 px-4">
                  ${cliente.comision.toFixed(2)}
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      cliente.comisionPagada
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {cliente.comisionPagada ? 'Pagada' : 'Pendiente'}
                  </span>
                </td>
              )}
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEditar(cliente)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button
                    onClick={() => onEliminar(cliente.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
                  </button>
                  {cliente.estadoCredito === 'pendiente' && (
                    <>
                      <button
                        onClick={() =>
                          onActualizarEstado(cliente.id, 'aprobado')
                        }
                        className="px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() =>
                          onActualizarEstado(cliente.id, 'rechazado')
                        }
                        className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                  {!cliente.comisionPagada &&
                    cliente.estadoCredito === 'aprobado' && (
                      <button
                        onClick={() => onActualizarComision(cliente.id, true)}
                        className="px-2 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                      >
                        <DollarSign size={20} />
                      </button>
                    )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        className={`mt-6 flex justify-between items-center ${
          modoOscuro ? 'text-white' : 'text-gray-700'
        }`}
      >
        <span className="text-base">
          Mostrando {indicePrimerCliente + 1} -{' '}
          {Math.min(indiceUltimoCliente, clientes.length)} de {clientes.length}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => cambiarPagina(paginaActual - 1)}
            disabled={paginaActual === 1}
            className={`px-3 py-2 border rounded text-base ${
              modoOscuro
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300'
            } disabled:opacity-50`}
          >
            <ChevronLeft size={20} />
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
            (numero) => (
              <button
                key={numero}
                onClick={() => cambiarPagina(numero)}
                className={`px-3 py-2 border rounded text-base ${
                  paginaActual === numero
                    ? modoOscuro
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : modoOscuro
                    ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600'
                    : 'bg-white border-gray-300 hover:bg-gray-100'
                }`}
              >
                {numero}
              </button>
            )
          )}
          <button
            onClick={() => cambiarPagina(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className={`px-3 py-2 border rounded text-base ${
              modoOscuro
                ? 'bg-gray-700 border-gray-600 text-white'
                : 'bg-white border-gray-300'
            } disabled:opacity-50`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListaClientes;