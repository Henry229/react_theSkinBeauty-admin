import { useCustomer } from '../context/customerContext';

export default function useCustomerSelect() {
  const { selectedCustomer, selectCustomer } = useCustomer();

  if (selectedCustomer === undefined || selectCustomer === undefined) {
    throw new Error('useCustomerSelect must be used within a CustomerProvider');
  }

  return { selectedCustomer, selectCustomer };
}
