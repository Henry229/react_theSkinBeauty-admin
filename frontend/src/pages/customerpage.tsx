import { useEffect, useState } from 'react';
import axios from 'axios';
import useSWR from 'swr';
import { format } from 'date-fns';

import AppointmentSection from '../components/appointmentSection';
import AddCustomerModal from '../components/addCustomerModal';

export default function CustomerPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(
    null
  );

  const fetcher = async () => {
    const response = await axios.get('http://localhost:5100/customers');
    return response.data;
  };

  const { data, error } = useSWR('customers', fetcher);

  useEffect(() => {
    console.log('>>>> data', data);

    if (data && data.length > 0) {
      setSelectedCustomer(data[0]);
    }
  }, [data]);

  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Loading...</div>;

  type CustomerType = {
    id: string;
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
    createdAt: Date;
  };

  const { firstName, lastName, mobile, email, createdAt } =
    selectedCustomer ?? {};

  const handleCustomerClick = (customer: CustomerType) => {
    setSelectedCustomer(customer);
  };

  return (
    <>
      <div className='flex gap-4'>
        <button
          onClick={() => setModalOpen(true)}
          className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'
        >
          Add customer
        </button>
        <input
          className='px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
          type='text'
          placeholder='Search by name, phone number, etc'
        />
        <AddCustomerModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>

      <div className='flex'>
        <div className='w-1/4'>
          <div className='p-4 bg-gray-100'>
            <h2 className='font-bold text-right'>{data.length} customers</h2>
            <ul>
              {data.map((customer: CustomerType) => (
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
          <div className='px-4 py-5 sm:px-6'>
            <h3 className='text-2xl font-bold leading-6 text-gray-900'>
              {firstName} {lastName}
            </h3>
            <p className='max-w-2xl mt-1 text-sm text-gray-500'>
              Personal details and appointments.
            </p>
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
