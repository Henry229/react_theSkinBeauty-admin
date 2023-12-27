interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCustomerModal({
  isOpen,
  onClose,
}: AddCustomerModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full'
      id='my-modal'
    >
      <div className='relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white'>
        <h3 className='text-lg font-bold text-center mb-4'>Add Customer</h3>
        <form className='space-y-3'>
          <input
            type='text'
            placeholder='First Name'
            className='block w-full p-2 border rounded'
          />
          <input
            type='text'
            placeholder='Last Name'
            className='block w-full p-2 border rounded'
          />
          <input
            type='text'
            placeholder='Mobile'
            className='block w-full p-2 border rounded'
          />
          <input
            type='email'
            placeholder='Email'
            className='block w-full p-2 border rounded'
          />
          <div className='flex justify-between'>
            <button
              type='button'
              onClick={onClose}
              className='py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-600'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
