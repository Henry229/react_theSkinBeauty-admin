// useCategories.js
import useSWR from 'swr';
import axios from 'axios';

const fetchCategories = async () => {
  const response = await axios.get('http://localhost:5100/categories');
  return response.data;
};

export const useCategories = () => {
  const { data, error } = useSWR('categories', fetchCategories);
  return {
    categories: data,
    isLoading: !error && !data,
    isError: error,
  };
};
