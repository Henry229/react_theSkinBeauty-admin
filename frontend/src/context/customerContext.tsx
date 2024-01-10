import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useCustomers } from '../hooks/useCustomer';
import { CustomerType } from '../types/types';

export const ClientContext = createContext<{
  selectedCustomer: CustomerType | null;
  selectCustomer: (customerId: string | null) => void;
} | null>(null); // 초기값을 상태 타입에 맞게 설정

export const useCustomer = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};

export default function CustomerProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { fetchCustomers } = useCustomers();
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const selectCustomer = (customerId: string | null) => {
    console.log(' >>>!!!!! customerId', customerId, '/', selectCustomer);
    if (customerId === null) {
      setSelectedCustomer(null);
    } else {
      const customer = fetchCustomers?.find(
        (customer: CustomerType) => customer.id === customerId
      );
      setSelectedCustomer(customer);
    }
  };

  return (
    <ClientContext.Provider value={{ selectedCustomer, selectCustomer }}>
      {children}
    </ClientContext.Provider>
  );
}
