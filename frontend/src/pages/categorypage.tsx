import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { format } from 'date-fns';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { CategoryType } from '../types/types';
import AddEditCategoryModal from '../components/add-edit-categoryModal';

export default function CategoryPage() {
  const { mutate } = useSWRConfig();

  const [modalOpen, setModalOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]); // Add type annotation for categories
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

  const fetchCategories = async () => {
    const response = await axios.get('http://localhost:5100/categories');
    setCategories(response.data);
  };

  const { data, error } = useSWR('categories', fetchCategories);

  const handleAddCategoryClick = () => {
    setModalOpen(true);
    setIsAddingNewCategory(true);
    setSelectedCategory(null);
  };

  const editCategory = async (category: CategoryType) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const deleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Category?')) {
      try {
        await axios.delete(`http://localhost:5100/categories/${id}`);
        toast.success('Category deleted successfully');
        mutate('categories');
      } catch (error) {
        toast.error('Error deleting category');
      }
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setIsAddingNewCategory(false);
    setSelectedCategory(null);
  };

  return (
    <div className='container px-4 mx-auto'>
      <div className='flex items-center justify-between py-4'>
        <h1 className='text-2xl font-bold'>Category</h1>
        <button
          className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'
          onClick={handleAddCategoryClick}
        >
          Add Category
        </button>
        <AddEditCategoryModal
          isOpen={modalOpen}
          onClose={handleClose}
          title={isAddingNewCategory ? 'Add Category' : 'Edit Category'}
          category={isAddingNewCategory ? null : selectedCategory}
        />
      </div>
      <div className='my-6 bg-white rounded shadow-md'>
        <table className='block min-w-full border-collapse md:table'>
          <thead className='block md:table-header-group'>
            <tr className='block bg-gray-100 border-t border-b md:border-none md:table-row'>
              <th className='block p-3 text-left md:border md:border-gray-200 md:table-cell'>
                Category Name
              </th>
              <th className='block p-3 text-left md:border md:border-gray-200 md:table-cell'>
                Created At
              </th>
              <th className='block p-3 text-left md:border md:border-gray-200 md:table-cell'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='block md:table-row-group'>
            {categories.map((category) => (
              <tr
                key={category.id}
                className='flex-col mb-2 md:border md:border-gray-200 md:table-row flex-no wrap sm:table-row md:mb-0'
              >
                <td className='block p-3 md:table-cell'>{category.name}</td>
                <td className='block p-3 md:table-cell'>
                  {category.createdAt
                    ? format(category.createdAt, 'yyyy/MM/dd')
                    : 'Unknown'}
                </td>
                <td className='block p-3 space-x-2 md:table-cell'>
                  <button
                    className='mr-2 text-gray-600 hover:text-gray-900'
                    onClick={() => editCategory(category)}
                  >
                    <FaEdit className='w-5 h-5' />
                  </button>
                  <button
                    className='text-red-600 hover:text-red-900'
                    onClick={() => deleteCategory(category.id)}
                  >
                    <FaTrash className='w-5 h-5' />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
