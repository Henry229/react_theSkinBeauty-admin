import { useEffect, useState } from 'react';
import axios from 'axios';
import useSWR, { useSWRConfig } from 'swr';
import { format } from 'date-fns';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

import AppointmentSection from '../components/appointmentSection';
import AddEditCustomerModal from '../components/add-edit-customerModal';
import { CustomerType } from '../types/types';
import { log } from 'console';

export default function CustomerPage() {
  const { mutate } = useSWRConfig();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(
    null
  );
  const [isAddingNewCustomer, setIsAddingNewCustomer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const fetcher = async () => {
    const response = await axios.get('http://localhost:5100/customers');
    return response.data;
  };

  const { data, error } = useSWR('customers', fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedCustomer(data[0]);
      setFilteredCustomers(data);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const filtered = data.filter(
        (customer: CustomerType) =>
          customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.mobile.includes(searchTerm)
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, data]);

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Loading...</div>;

  // 고객리스트에서 선택된 고객의 정보 destructuring
  const { firstName, lastName, mobile, email, createdAt } =
    selectedCustomer ?? {};

  //왼쪽 고객 목록에서 고객을 클릭하면, 해당 고객의 정보가 오른쪽에 표시되도록 합니다.
  const handleCustomerClick = (customer: CustomerType) => {
    setSelectedCustomer(customer);
  };

  // Add customer 버튼을 클릭할때
  const handleAddCustomerClick = () => {
    setIsAddingNewCustomer(true);
    // setSelectedCustomer(null);
    setModalOpen(true);
  };

  // 고객 정보 edit 버튼을 클릭할때
  const handleEditClick = (customer: CustomerType) => {
    setSelectedCustomer(customer);
    // setEditingCustomer(customer);
    setModalOpen(true);
    // setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (customer: CustomerType) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        const response = await axios.delete(
          `http://localhost:5100/customers/${customer.id}`
        );
        console.log('>>>>delete: ', response.status);

        if (response.status === 200 || response.status === 201) {
          toast.success('Deleted customer successfully');
          mutate('customers');
        }
      } catch (error) {
        toast.error('Failed to delete customer');
      }
    }
  };

  const handleClose = (updatedCustomer?: CustomerType) => {
    setModalOpen(false);
    setIsAddingNewCustomer(false);
    if (updatedCustomer) {
      // 만약 업데이트된 고객 정보가 있다면, 선택된 고객을 업데이트합니다.
      setSelectedCustomer(updatedCustomer);
    }
  };

  return (
    <>
      <div className='flex gap-4'>
        <button
          onClick={handleAddCustomerClick}
          className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'
        >
          Add customer
        </button>
        <input
          className='px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
          type='text'
          placeholder='Search by name, phone number, etc'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <AddEditCustomerModal
          isOpen={modalOpen}
          onClose={handleClose}
          customer={isAddingNewCustomer ? null : selectedCustomer}
        />
      </div>

      <div className='flex'>
        <div className='w-1/4'>
          <div className='p-4 bg-gray-100'>
            <h2 className='font-bold text-right'>{data.length} customers</h2>
            <h3 className='font-semi text-slate-400'>
              {filteredCustomers.length} are selected
            </h3>
            <ul>
              {filteredCustomers.map((customer: CustomerType) => (
                <li
                  key={customer.id}
                  className='py-2 hover:bg-gray-300'
                  onClick={() => handleCustomerClick(customer)}
                >
                  {customer.firstName} {customer.lastName}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className='w-3/4 overflow-hidden bg-white shadow sm:rounded-lg'>
          <div className='flex items-center justify-between px-4 py-5 sm:px-6'>
            <div className=''>
              <h3 className='text-2xl font-bold leading-6 text-gray-900'>
                {firstName} {lastName}
              </h3>
              <p className='max-w-2xl mt-1 text-sm text-gray-500'>
                Personal details and appointments.
              </p>
            </div>
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => {
                  selectedCustomer && handleEditClick(selectedCustomer);
                }}
                className='text-blue-500 hover:text-blue-700'
              >
                <FaEdit className='w-5 h-5' />
              </button>
              <button
                onClick={() => {
                  selectedCustomer && handleDeleteClick(selectedCustomer);
                }}
                className='text-red-500 hover:text-red-700'
              >
                <FaTrash className='w-5 h-5' />
              </button>
            </div>
          </div>
          <div className='border-t border-gray-200'>
            <dl>
              <div className='px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>Telephone</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                  {mobile}
                </dd>
              </div>
              <div className='px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>Email</dt>
                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                  {email || 'n/a'}
                </dd>
              </div>
              <div className='px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
                <dt className='text-sm font-medium text-gray-500'>
                  Date Created
                </dt>
                <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                  {createdAt ? format(createdAt, 'MM/dd/yyyy') : 'Unknown'}
                </dd>
              </div>
            </dl>
          </div>
          <AppointmentSection />
          {/* Notes and other sections would go here */}
        </div>
      </div>
    </>
  );
}
