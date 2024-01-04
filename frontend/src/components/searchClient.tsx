import { useState, ChangeEvent } from 'react';
import Select, { SingleValue } from 'react-select';
import OptionTypeBase from 'react-select';
import { useCustomers } from '../hooks/useCustomer';
import { CustomerType } from '../types/types';
// import moment from 'moment';

interface OptionType extends OptionTypeBase {
  value: string; // CustomerType.id와 일치하는 타입
  label: string; // 표시될 문자열
}

export default function SearchClient() {
  const { fetchCustomers, isLoading, isError } = useCustomers();
  // const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] =
    useState<SingleValue<OptionType>>(null);

  const options: OptionType[] =
    fetchCustomers?.map((customer: CustomerType) => ({
      value: customer.id,
      label: `${customer.firstName} ${customer.lastName} - ${customer.mobile}`,
    })) || [];

  const handleChange = (selectedOption: SingleValue<OptionType>) => {
    setSelectedCustomer(selectedOption);
    // 여기에서 selectedOption.value를 사용하여 추가 작업을 수행할 수 있습니다.
  };

  // const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setSearchTerm(event.target.value);
  // };

  // const handleCustomerSelect = (customer: CustomerType) => {
  //   if (fetchCustomers) {
  //     const filtered = fetchCustomers.filter(
  //       (customer: CustomerType) =>
  //         customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         customer.mobile.includes(searchTerm)
  //     );
  //     setFilteredCustomers(filtered);
  //   }
  //   setSelectedCustomer(customer);
  //   setSearchTerm('');
  // }

  return (
    <Select
      options={options}
      value={selectedCustomer as OptionType}
      onChange={handleChange}
      isLoading={isLoading}
      isClearable
      isSearchable
      placeholder='Search by name or mobile'
      noOptionsMessage={() => 'No customers found'}
    />
    // <div>
    //   <input
    //       type="text"
    //       placeholder="Search by name or mobile"
    //       value={searchTerm}
    //       onChange={handleSearchChange}
    //       className="block w-full p-2 mt-1 border border-gray-300 rounded shadow-sm"
    //     />
    // </div>
  );
}
