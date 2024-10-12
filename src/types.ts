export interface Cliente {
  id: string;
  nombre: string;
  empresa: string;
  montoCredito: number;
  estadoCredito: 'aprobado' | 'rechazado' | 'pendiente';
  fechaCreacion: string;
  comision: number;
  comisionPagada: boolean;
}