import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Cliente } from '../types';

export const exportToPDF = (clientes: Cliente[]) => {
  const doc = new jsPDF();
  doc.text('Lista de Clientes', 14, 15);
  
  const tableColumn = ["Nombre", "Empresa", "Monto Crédito", "Estado", "Fecha Creación", "Comisión", "Comisión Pagada"];
  const tableRows = clientes.map(cliente => [
    cliente.nombre,
    cliente.empresa,
    `$${cliente.montoCredito.toFixed(2)}`,
    cliente.estadoCredito,
    new Date(cliente.fechaCreacion).toLocaleDateString(),
    `$${cliente.comision.toFixed(2)}`,
    cliente.comisionPagada ? 'Sí' : 'No'
  ]);

  (doc as any).autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 20
  });

  doc.save('clientes.pdf');
};

export const exportToExcel = (clientes: Cliente[]) => {
  const worksheet = XLSX.utils.json_to_sheet(clientes.map(cliente => ({
    Nombre: cliente.nombre,
    Empresa: cliente.empresa,
    'Monto Crédito': cliente.montoCredito,
    Estado: cliente.estadoCredito,
    'Fecha Creación': new Date(cliente.fechaCreacion).toLocaleDateString(),
    Comisión: cliente.comision,
    'Comisión Pagada': cliente.comisionPagada ? 'Sí' : 'No'
  })));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
  XLSX.writeFile(workbook, "clientes.xlsx");
};