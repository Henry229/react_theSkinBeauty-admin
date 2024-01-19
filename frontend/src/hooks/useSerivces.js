import useSWR from 'swr';
import axios from 'axios';

const fetchServices = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/services`);
  return response.data;
};

export const useServices = () => {
  const { data, error } = useSWR('services', fetchServices);
  return {
    services: data,
    isLoading: !error && !data,
    isError: error,
  };
};
