import React from 'react';
import { Customer } from '../types';
import { Edit2, Trash2 } from 'lucide-react';

interface CustomerListProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => void;
}

const CustomerList: React.FC<CustomerListProps> = ({
  customers,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Company</th>
            <th className="py-2 px-4 text-left">Credit Amount</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id} className="border-b">
              <td className="py-2 px-4">{customer.name}</td>
              <td className="py-2 px-4">{customer.company}</td>
              <td className="py-2 px-4">
                ${customer.approvedCreditAmount.toFixed(2)}
              </td>
              <td className="py-2 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    customer.creditStatus === 'approved'
                      ? 'bg-green-200 text-green-800'
                      : customer.creditStatus === 'rejected'
                      ? 'bg-red-200 text-red-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}
                >
                  {customer.creditStatus.charAt(0).toUpperCase() +
                    customer.creditStatus.slice(1)}
                </span>
              </td>
              <td className="py-2 px-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onEdit(customer)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(customer.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                  {customer.creditStatus === 'pending' && (
                    <>
                      <button
                        onClick={() => onUpdateStatus(customer.id, 'approved')}
                        className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => onUpdateStatus(customer.id, 'rejected')}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
