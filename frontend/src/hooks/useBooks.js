import useSWR from 'swr';
import axios from 'axios';

const fetchBooks = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/books`);
  return response.data;
};

export const useBooks = () => {
  const { data, error, mutate } = useSWR('fetchBooks', fetchBooks);
  return {
    books: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
