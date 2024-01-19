import axios from 'axios';

import { CategoryType } from '../types/types';
import toast from 'react-hot-toast';
import { mutate, useSWRConfig } from 'swr';
import { useEffect, useState } from 'react';

interface AddEditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category?: CategoryType | null;
}

export default function AddEditCategoryModal({
  isOpen,
  onClose,
  title,
  category,
}: AddEditCategoryModalProps) {
  const { mutate } = useSWRConfig();

  const [newCategoryName, setNewCategoryName] = useState('');

  console.log('>>>>>++++ category', category);

  useEffect(() => {
    setNewCategoryName(category ? category.name : '');
  }, [category, isOpen]);

  // 모달창 밖을 클릭했을떄 모달창이 닫히도록 합니다.
  const handleOutsideClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    onClose();
  };

  // 모달창 안을 클릭했을때 모달창이 닫히지 않도록 합니다.
  const handleModalClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  const addCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (category) {
        const response = await axios.patch(
          `${process.env.REACT_APP_API_URL}/categories/${category.id}`,
          {
            name: newCategoryName,
          }
        );
        toast.success('Category updated successfully');
        mutate('categories');
        onClose();
      } else {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/categories`,
          {
            name: newCategoryName,
          }
        );
        toast.success('Category added successfully');
        mutate('categories');
        onClose();
      }
    } catch (error) {
      toast.error('Error adding category');
    }
  };

  return (
    <div className='fixed inset-0 z-10 overflow-y-auto'>
      <div className='flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0'>
        {/* Background overlay, show modal over rest of page */}
        <div
          className='fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75'
          onClick={handleOutsideClick}
        ></div>

        {/* Modal panel */}
        <div
          className='inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
          onClick={handleModalClick}
        >
          <div className='px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4'>
            <div className='sm:flex sm:items-start'>
              <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                <h3
                  className='text-lg font-medium leading-6 text-gray-900'
                  id='modal-title'
                >
                  {title}
                </h3>
                <div className='mt-2'>
                  <form onSubmit={addCategory}>
                    <input
                      type='text'
                      className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
                      placeholder='Category name'
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      required
                    />
                    <button
                      type='submit'
                      className='px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'
                    >
                      Save Category
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
