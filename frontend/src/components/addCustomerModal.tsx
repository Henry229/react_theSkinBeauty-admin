import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(10, 'Mobile should be at least 10 digits'),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function AddCustomerModal({
  isOpen,
  onClose,
}: AddCustomerModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });
  const navigate = useNavigate();

  const handleOutsideClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    onClose();
  };

  const handleModalClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    console.log(data);
    await axios.post('http://localhost:5100/customers', data);
    onClose();
    navigate('/customer');
  };

  return (
    <div
      className='fixed inset-0 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50'
      id='my-modal'
      onClick={handleOutsideClick}
    >
      <div
        className='relative p-5 mx-auto bg-white border rounded-md shadow-lg top-20 w-96'
        onClick={handleModalClick}
      >
        <h3 className='mb-4 text-lg font-bold text-center'>Add Customer</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-2'>
            <label
              htmlFor='firstName'
              className='block text-sm font-medium text-gray-700'
            >
              First Name
            </label>
            <input
              id='firstName'
              type='text'
              {...register('firstName')}
              className='block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm'
            />
            <p className='text-xs text-red-600'>{errors.firstName?.message}</p>
          </div>

          <div className='mb-2'>
            <label
              htmlFor='lastName'
              className='block text-sm font-medium text-gray-700'
            >
              Last Name
            </label>
            <input
              id='lastName'
              type='text'
              {...register('lastName')}
              className='block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm'
            />
            <p className='text-xs text-red-600'>{errors.lastName?.message}</p>
          </div>

          <div className='mb-2'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              id='email'
              type='email'
              {...register('email')}
              className='block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm'
            />
            <p className='text-xs text-red-600'>{errors.email?.message}</p>
          </div>

          <div className='mb-2'>
            <label
              htmlFor='mobile'
              className='block text-sm font-medium text-gray-700'
            >
              Mobile
            </label>
            <input
              id='mobile'
              type='text'
              {...register('mobile')}
              className='block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm'
            />
            <p className='text-xs text-red-600'>{errors.mobile?.message}</p>
          </div>

          <div className='flex mt-4'>
            <button
              type='submit'
              className='px-4 py-2 ml-auto text-white bg-blue-500 rounded hover:bg-blue-700'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
