import React from 'react';
import { Cliente } from '../types';

interface ResumenComisionesProps {
  clientes: Cliente[];
  onMarcarTodasComisionesCobradas: () => void;
  modoOscuro: boolean;
}

const ResumenComisiones: React.FC<ResumenComisionesProps> = ({
  clientes,
  onMarcarTodasComisionesCobradas,
  modoOscuro,
}) => {
  const comisionesPendientes = clientes
    .filter(
      (cliente) =>
        cliente.estadoCredito === 'aprobado' && !cliente.comisionPagada
    )
    .reduce((total, cliente) => total + cliente.comision, 0);

  return (
    <div className={`mt-8 ${modoOscuro ? 'bg-gray-700' : 'bg-blue-50'} p-8 rounded-lg shadow`}>
      <h2 className={`text-2xl font-semibold mb-6 ${modoOscuro ? 'text-white' : 'text-gray-800'}`}>Resumen de Comisiones</h2>
      <div className={`text-4xl font-bold ${modoOscuro ? 'text-blue-300' : 'text-blue-600'} mb-4`}>
        ${comisionesPendientes.toFixed(2)}
      </div>
      <p className={`text-base ${modoOscuro ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
        Total de comisiones pendientes por cobrar
      </p>
      <button
        onClick={onMarcarTodasComisionesCobradas}
        className={`w-full py-3 px-4 ${
          modoOscuro
            ? 'bg-green-600 hover:bg-green-700'
            : 'bg-green-500 hover:bg-green-600'
        } text-white rounded-md text-base font-medium transition-colors`}
      >
        Marcar todas como cobradas
      </button>
    </div>
  );
};

export default ResumenComisiones;