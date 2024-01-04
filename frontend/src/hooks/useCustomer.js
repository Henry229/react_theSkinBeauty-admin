import useSWR from 'swr';
import axios from 'axios';

const fetchCustomers = async () => {
  const response = await axios.get('http://localhost:5100/customers');
  return response.data;
};

export const useCustomers = () => {
  const { data, error } = useSWR('customers', fetchCustomers);
  return {
    fetchCustomers: data,
    isLoading: !error && !data,
    isError: error,
  };
};
