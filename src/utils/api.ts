import { Cliente } from '../types';

const API_URL = 'http://localhost:3000/api';

export const fetchClientes = async (): Promise<Cliente[]> => {
  const response = await fetch(`${API_URL}/clientes`);
  if (!response.ok) {
    throw new Error('Error al obtener los clientes');
  }
  return response.json();
};

export const createCliente = async (cliente: Cliente): Promise<void> => {
  const response = await fetch(`${API_URL}/clientes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cliente),
  });
  if (!response.ok) {
    throw new Error('Error al crear el cliente');
  }
};

export const updateCliente = async (cliente: Cliente): Promise<void> => {
  const response = await fetch(`${API_URL}/clientes/${cliente.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(cliente),
  });
  if (!response.ok) {
    throw new Error('Error al actualizar el cliente');
  }
};

export const deleteCliente = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/clientes/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Error al eliminar el cliente');
  }
};
