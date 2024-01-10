import { useContext } from 'react';
import { ClientContext, useCustomer } from '../context/customerContext';

export default function useCustomerSelect() {
  const context = useContext(ClientContext);

  if (!context) {
    throw new Error('useCustomerSelect must be used within a CustomerProvider');
  }

  const { selectedCustomer, selectCustomer } = useCustomer();

  // 이 부분에서 selectCustomer가 never로 추론되지 않도록 처리합니다.
  if (typeof selectCustomer !== 'function') {
    throw new Error('selectCustomer is not a function');
  }

  // if (selectedCustomer === undefined || selectCustomer === undefined) {
  //   throw new Error('useCustomerSelect must be used within a CustomerProvider');
  // }

  return { selectedCustomer, selectCustomer };
}
