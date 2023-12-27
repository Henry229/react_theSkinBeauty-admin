import React, { useState } from 'react';
import AppointmentSection from '../components/appointmentSection';
import AddCustomerModal from '../components/addCustomerModal';

export default function CustomerPage() {
  const customer = [
    {
      name: 'Henry',
      mobile: '0412345678',
      email: 'henry@mail.com',
      createdDate: '2021-09-30',
    },
  ];
  const { name, mobile, email, createdDate } = customer[0];
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <div className='flex gap-4'>
        <button
          onClick={() => setModalOpen(true)}
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
        >
          Add customer
        </button>
        <input
          className='shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
          type='text'
          placeholder='Search by name, phone number, etc'
        />
        <AddCustomerModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </div>

      <div className='bg-white shadow overflow-hidden sm:rounded-lg'>
        <div className='px-4 py-5 sm:px-6'>
          <h3 className='text-lg leading-6 font-medium text-gray-900'>
            {name}
          </h3>
          <p className='mt-1 max-w-2xl text-sm text-gray-500'>
            Personal details and appointments.
          </p>
        </div>
        <div className='border-t border-gray-200'>
          <dl>
            <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>Telephone</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                {mobile}
              </dd>
            </div>
            <div className='bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>Email</dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                {email || 'n/a'}
              </dd>
            </div>
            <div className='bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500'>
                Date Created
              </dt>
              <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                {createdDate}
              </dd>
            </div>
          </dl>
        </div>
        <AppointmentSection />
        {/* Notes and other sections would go here */}
      </div>
    </>
  );
}
