import React, { createContext, useState, useContext } from 'react';
import { useCustomers } from '../hooks/useCustomer';

export const ClientContext = createContext(null);

export const useCustomer = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

export default function CustomerProvider({ children }) {
  const { fetchCustomers } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const selectCustomer = (customerId) => {
    const customer = fetchCustomers?.find(
      (customer) => customer.id === customerId
    );
    setSelectedCustomer(customer);
  };

  return (
    <ClientContext.Provider value={{ selectedCustomer, selectCustomer }}>
      {children}
    </ClientContext.Provider>
  );
}
