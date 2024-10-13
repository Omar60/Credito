import { Cliente } from '../types';

export const saveClientes = (clientes: Cliente[]) => {
  localStorage.setItem('clientes', JSON.stringify(clientes));
};

export const loadClientes = (): Cliente[] => {
  const clientesString = localStorage.getItem('clientes');
  return clientesString ? JSON.parse(clientesString) : [];
};