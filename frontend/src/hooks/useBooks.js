import useSWR from 'swr';
import axios from 'axios';

const fetchBooks = async () => {
  const response = await axios.get('http://localhost:5100/books');
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
