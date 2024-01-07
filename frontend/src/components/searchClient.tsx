import { useState } from 'react';
import Select, { SingleValue } from 'react-select';
import OptionTypeBase from 'react-select';
import { useCustomers } from '../hooks/useCustomer';
import { CustomerType } from '../types/types';
import { FaSearch } from 'react-icons/fa';
import useCustomerSelect from '../hooks/useCustomerSelect';

interface OptionType extends OptionTypeBase {
  value: string; // CustomerType.id와 일치하는 타입
  label: string; // 표시될 문자열
}

interface SearchClientProps {
  onClientSelect: (customer: CustomerType) => void;
}

export default function SearchClient({ onClientSelect }: SearchClientProps) {
  const { fetchCustomers, isLoading, isError } = useCustomers();
  // const [searchTerm, setSearchTerm] = useState('');
  const { selectCustomer } = useCustomerSelect();
  const [selectedCustomer, setSelectedCustomer] =
    useState<SingleValue<OptionType>>(null);

  const options: OptionType[] =
    fetchCustomers?.map((customer: CustomerType) => ({
      value: customer.id,
      label: `${customer.firstName} ${customer.lastName} - ${customer.mobile}`,
    })) || [];

  const handleChange = (selectedOption: SingleValue<OptionType>) => {
    // setSelectedCustomer(selectedOption);
    // selectedOption이 존재하면 onCustomerSelect 콜백을 호출합니다.
    // if (selectedOption) {
    //   const customer = fetchCustomers.find(
    //     (customer: CustomerType) => customer.id === selectedOption.value
    //   );
    //   if (customer) onClientSelect(customer);
    // }
    if (selectedOption) {
      selectCustomer(selectedOption.value);
    } else {
      selectCustomer('');
    }
  };

  return (
    <div className='flex items-center justify-start mt-2 mb-4 space-x-1'>
      <Select
        options={options}
        value={selectedCustomer as OptionType}
        onChange={handleChange}
        isLoading={isLoading}
        isClearable
        isSearchable
        placeholder='Search by name or mobile'
        noOptionsMessage={() => 'No customers found'}
        className='w-full lg:w-1/2'
      />
      <FaSearch className='w-8 h-8 p-1 text-white bg-gray-500 rounded-sm' />
    </div>
  );
}
