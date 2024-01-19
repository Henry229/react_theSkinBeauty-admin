// useCategories.js
import useSWR from 'swr';
import axios from 'axios';

const fetchCategories = async () => {
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/categories`
  );
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
