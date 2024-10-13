import React from 'react';
import { Cliente } from '../types';

interface ResumenComisionesProps {
  clientes: Cliente[];
}

const ResumenComisiones: React.FC<ResumenComisionesProps> = ({ clientes }) => {
  const comisionesPendientes = clientes
    .filter(cliente => cliente.estadoCredito === 'aprobado' && !cliente.comisionPagada)
    .reduce((total, cliente) => total + cliente.comision, 0);

  return (
    <div className="mt-8 bg-blue-50 p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Resumen de Comisiones</h2>
      <div className="text-3xl font-bold text-blue-600">
        ${comisionesPendientes.toFixed(2)}
      </div>
      <p className="text-sm text-gray-600 mt-2">
        Total de comisiones pendientes por cobrar
      </p>
    </div>
  );
};

export default ResumenComisiones;