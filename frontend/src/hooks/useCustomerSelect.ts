import { useState } from 'react';
import { CustomerType } from '../types/types';
import { useCustomers } from './useCustomer';

export default function useCustomerSelect() {
  // 고객 데이터를 가져오는 로직 (useCustomers 훅 사용)
  const { fetchCustomers, isLoading, isError } = useCustomers();

  // 선택된 고객 상태
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(
    null
  );

  // 선택된 고객을 설정하는 함수
  const handleSelectCustomer = (customerId: string) => {
    const customer = fetchCustomers?.find(
      (customer: CustomerType) => customer.id === customerId
    );
    setSelectedCustomer(customer || null);
  };

  // 고객 데이터가 변경되었을 때 특정 동작을 수행하려면 여기에 useEffect를 사용하세요.

  // 훅에서 반환할 값
  return {
    customers: fetchCustomers,
    selectedCustomer,
    selectCustomer: handleSelectCustomer,
    isLoading,
    isError,
  };
}
