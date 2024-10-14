import { Cliente } from '../types';

export const saveClientes = (clientes: Cliente[]) => {
  localStorage.setItem('clientes', JSON.stringify(clientes));
};

export const loadClientes = (): Cliente[] => {
  const clientesString = localStorage.getItem('clientes');
  return clientesString ? JSON.parse(clientesString) : [];
};

export const exportarDatos = (): string => {
  const clientes = loadClientes();
  return JSON.stringify(clientes, null, 2);
};

export const importarDatos = (datos: string): boolean => {
  try {
    const clientesImportados = JSON.parse(datos);
    if (Array.isArray(clientesImportados) && clientesImportados.every(esClienteValido)) {
      saveClientes(clientesImportados);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error al importar datos:', error);
    return false;
  }
};

const esClienteValido = (cliente: any): boolean => {
  return (
    typeof cliente.id === 'string' &&
    typeof cliente.nombre === 'string' &&
    typeof cliente.empresa === 'string' &&
    typeof cliente.montoCredito === 'number' &&
    ['aprobado', 'rechazado', 'pendiente'].includes(cliente.estadoCredito) &&
    typeof cliente.fechaCreacion === 'string' &&
    typeof cliente.comision === 'number' &&
    typeof cliente.comisionPagada === 'boolean'
  );
};