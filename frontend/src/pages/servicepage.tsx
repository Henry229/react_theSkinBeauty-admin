import { useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { format } from 'date-fns';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import toast from 'react-hot-toast';

import { ServiceType } from '../types/types';
import AddEditServiceModal from '../components/add-edit-serviceModal';
import { useServices } from '../hooks/useSerivces';

export default function ServicePage() {
  const { mutate } = useSWRConfig();

  const [modalOpen, setModalOpen] = useState(false);
  // const [services, setServices] = useState<ServiceType[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(
    null
  );
  const [isAddingNewService, setIsAddingNewService] = useState(false);

  const { services, isLoading, isError } = useServices();

  const handleAddServiceClick = () => {
    setModalOpen(true);
    setIsAddingNewService(true);
    setSelectedService(null);
  };

  const editService = async (service: ServiceType) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  const deleteService = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this Service?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/services/${id}`);
        toast.success('Service deleted successfully');
        mutate('services');
      } catch (error) {
        toast.error('Error deleting service');
      }
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setIsAddingNewService(false);
    setSelectedService(null);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading services.</div>;

  return (
    <div className='container px-4 mx-auto'>
      <div className='flex items-center justify-between py-4'>
        <h1 className='text-2xl font-bold'>Service</h1>
        <button
          className='px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700'
          onClick={handleAddServiceClick}
        >
          Add Service
        </button>
        <AddEditServiceModal
          isOpen={modalOpen}
          onClose={handleClose}
          title={isAddingNewService ? 'Add Service' : 'Edit Service'}
          service={isAddingNewService ? null : selectedService}
        />
      </div>
      <div className='my-6 bg-white rounded shadow-md'>
        <table className='block min-w-full border-collapse md:table'>
          <thead className='block md:table-header-group'>
            <tr className='block bg-gray-100 border-t border-b md:border-none md:table-row'>
              <th className='block p-3 text-left md:border md:border-gray-200 md:table-cell'>
                Service Name
              </th>
              <th className='block p-3 text-left md:border md:border-gray-200 md:table-cell'>
                Category Name
              </th>
              <th className='block p-3 text-left md:border md:border-gray-200 md:table-cell'>
                Price
              </th>
              <th className='block p-3 text-left md:border md:border-gray-200 md:table-cell'>
                Duration
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
            {services &&
              services.map((service: ServiceType) => (
                <tr
                  key={service.id}
                  className='flex-col mb-2 md:border md:border-gray-200 md:table-row flex-no wrap sm:table-row md:mb-0'
                >
                  <td className='block p-3 md:table-cell'>{service.name}</td>
                  <td className='block p-3 md:table-cell'>
                    {service.category.name}
                  </td>
                  <td className='block p-3 md:table-cell'>{service.price}</td>
                  <td className='block p-3 md:table-cell'>
                    {service.duration}
                  </td>
                  <td className='block p-3 md:table-cell'>
                    {service.createdAt
                      ? format(service.createdAt, 'yyyy/MM/dd')
                      : 'Unknown'}
                  </td>
                  <td className='block p-3 space-x-2 md:table-cell'>
                    <button
                      className='mr-2 text-gray-600 hover:text-gray-900'
                      onClick={() => editService(service)}
                    >
                      <FaEdit className='w-5 h-5' />
                    </button>
                    <button
                      className='text-red-600 hover:text-red-900'
                      onClick={() => deleteService(service.id)}
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
