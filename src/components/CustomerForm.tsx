import React, { useState } from 'react';
import { Customer } from '../types';

interface CustomerFormProps {
  onSubmit: (customer: Omit<Customer, 'id'>) => void;
  initialData?: Customer;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Omit<Customer, 'id'>>({
    name: initialData?.name || '',
    company: initialData?.company || '',
    approvedCreditAmount: initialData?.approvedCreditAmount || 0,
    creditStatus: initialData?.creditStatus || 'pending',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'approvedCreditAmount' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    if (!initialData) {
      setFormData({ name: '', company: '', approvedCreditAmount: 0, creditStatus: 'pending' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="approvedCreditAmount" className="block text-sm font-medium text-gray-700">Approved Credit Amount</label>
        <input
          type="number"
          id="approvedCreditAmount"
          name="approvedCreditAmount"
          value={formData.approvedCreditAmount}
          onChange={handleChange}
          required
          min="0"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="creditStatus" className="block text-sm font-medium text-gray-700">Credit Status</label>
        <select
          id="creditStatus"
          name="creditStatus"
          value={formData.creditStatus}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {initialData ? 'Update Customer' : 'Add Customer'}
      </button>
    </form>
  );
};

export default CustomerForm;