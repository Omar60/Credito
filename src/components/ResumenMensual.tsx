import React, { useState, useMemo } from 'react';
import { Cliente } from '../types';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ResumenMensualProps {
  clientes: Cliente[];
  modoOscuro: boolean;
}

const ResumenMensual: React.FC<ResumenMensualProps> = ({ clientes, modoOscuro }) => {
  const [mesSeleccionado, setMesSeleccionado] = useState(() => {
    const fechaActual = new Date();
    return `${fechaActual.getFullYear()}-${String(fechaActual.getMonth() + 1).padStart(2, '0')}`;
  });

  const [pestanaActiva, setPestanaActiva] = useState('estadisticas');

  const estadisticas = useMemo(() => {
    const clientesFiltrados = clientes.filter(cliente => {
      const fechaCliente = new Date(cliente.fechaCreacion);
      return fechaCliente.getFullYear() === parseInt(mesSeleccionado.split('-')[0]) &&
             fechaCliente.getMonth() === parseInt(mesSeleccionado.split('-')[1]) - 1 &&
             cliente.estadoCredito !== 'rechazado';
    });

    const totalClientes = clientesFiltrados.length;
    const totalCreditos = clientesFiltrados.reduce((sum, cliente) => sum + cliente.montoCredito, 0);
    const totalComisiones = clientesFiltrados.reduce((sum, cliente) => sum + cliente.comision, 0);
    const creditosActivos = clientesFiltrados.filter(cliente => cliente.estadoCredito === 'aprobado').length;
    const clienteMaxCredito = clientesFiltrados.reduce((max, cliente) => 
      cliente.montoCredito > max.montoCredito ? cliente : max, clientesFiltrados[0]);
    
    const clientesAutorizados = clientesFiltrados.filter(cliente => cliente.estadoCredito === 'aprobado').length;
    const clientesRechazados = clientes.filter(cliente => 
      new Date(cliente.fechaCreacion).getFullYear() === parseInt(mesSeleccionado.split('-')[0]) &&
      new Date(cliente.fechaCreacion).getMonth() === parseInt(mesSeleccionado.split('-')[1]) - 1 &&
      cliente.estadoCredito === 'rechazado'
    ).length;

    return {
      totalClientes,
      totalCreditos,
      totalComisiones,
      creditosActivos,
      clienteMaxCredito,
      clientesAutorizados,
      clientesRechazados,
    };
  }, [clientes, mesSeleccionado]);

  const chartData = {
    labels: ['Total Clientes', 'Créditos Activos', 'Cliente Max Crédito', 'Autorizados', 'Rechazados'],
    datasets: [
      {
        label: 'Estadísticas',
        data: [
          estadisticas.totalClientes,
          estadisticas.creditosActivos,
          estadisticas.clienteMaxCredito?.montoCredito || 0,
          estadisticas.clientesAutorizados,
          estadisticas.clientesRechazados
        ],
        backgroundColor: modoOscuro 
          ? ['rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 99, 132, 0.8)']
          : ['rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: modoOscuro ? '#ffffff' : '#000000',
        },
      },
      title: {
        display: true,
        text: 'Resumen Mensual',
        color: modoOscuro ? '#ffffff' : '#000000',
      },
    },
    scales: {
      y: {
        ticks: {
          color: modoOscuro ? '#ffffff' : '#000000',
        },
      },
      x: {
        ticks: {
          color: modoOscuro ? '#ffffff' : '#000000',
        },
      },
    },
  };

  return (
    <div className={`p-6 rounded-lg shadow-lg ${modoOscuro ? 'bg-gray-800 text-white' : 'bg-white'}`}>
      <h2 className="text-2xl font-bold mb-4">Resumen Mensual</h2>
      <div className="mb-4">
        <label htmlFor="mes" className="mr-2">Seleccionar mes:</label>
        <input
          type="month"
          id="mes"
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
          className={`p-2 rounded ${modoOscuro ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}
        />
      </div>
      <div className="mb-4">
        <button
          onClick={() => setPestanaActiva('estadisticas')}
          className={`mr-2 px-4 py-2 rounded ${pestanaActiva === 'estadisticas' ? 'bg-blue-500 text-white' : modoOscuro ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          Estadísticas
        </button>
        <button
          onClick={() => setPestanaActiva('grafico')}
          className={`px-4 py-2 rounded ${pestanaActiva === 'grafico' ? 'bg-blue-500 text-white' : modoOscuro ? 'bg-gray-700' : 'bg-gray-200'}`}
        >
          Gráfico
        </button>
      </div>
      {pestanaActiva === 'estadisticas' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="font-semibold">Total de Clientes:</p>
            <p className="text-xl">{estadisticas.totalClientes}</p>
          </div>
          <div>
            <p className="font-semibold">Total de Créditos Otorgados:</p>
            <p className="text-xl">${estadisticas.totalCreditos.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold">Comisión Total Generada:</p>
            <p className="text-xl">${estadisticas.totalComisiones.toFixed(2)}</p>
          </div>
          <div>
            <p className="font-semibold">Créditos Activos:</p>
            <p className="text-xl">{estadisticas.creditosActivos}</p>
          </div>
          <div>
            <p className="font-semibold">Clientes Autorizados:</p>
            <p className="text-xl">{estadisticas.clientesAutorizados}</p>
          </div>
          <div>
            <p className="font-semibold">Clientes Rechazados:</p>
            <p className="text-xl">{estadisticas.clientesRechazados}</p>
          </div>
          <div className="col-span-2">
            <p className="font-semibold">Cliente con Mayor Crédito:</p>
            <p className="text-xl">
              {estadisticas.clienteMaxCredito
                ? `${estadisticas.clienteMaxCredito.nombre} - $${estadisticas.clienteMaxCredito.montoCredito.toFixed(2)}`
                : 'N/A'}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-8">
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default ResumenMensual;