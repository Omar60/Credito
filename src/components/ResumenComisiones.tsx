import React from 'react';
import { Cliente } from '../types';

interface ResumenComisionesProps {
  clientes: Cliente[];
  onMarcarTodasComisionesCobradas: () => void;
}

const ResumenComisiones: React.FC<ResumenComisionesProps> = ({ clientes, onMarcarTodasComisionesCobradas }) => {
  const comisionesPendientes = clientes
    .filter(cliente => cliente.estadoCredito === 'aprobado' && !cliente.comisionPagada)
    .reduce((total, cliente) => total + cliente.comision, 0);

  return (
    <div className="mt-8 bg-blue-50 p-8 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">Resumen de Comisiones</h2>
      <div className="text-4xl font-bold text-blue-600 mb-4">
        ${comisionesPendientes.toFixed(2)}
      </div>
      <p className="text-base text-gray-600 mb-6">
        Total de comisiones pendientes por cobrar
      </p>
      <button
        onClick={onMarcarTodasComisionesCobradas}
        className="w-full py-3 px-4 bg-green-500 text-white rounded-md text-base font-medium hover:bg-green-600 transition-colors"
      >
        Marcar todas como cobradas
      </button>
    </div>
  );
};

export default ResumenComisiones;