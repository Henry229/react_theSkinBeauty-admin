import { useForm, SubmitHandler, Controller } from 'react-hook-form';
// import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import Select from 'react-select';
// import OptionsType from 'react-select';

import { CategoryType, ServiceType } from '../types/types';
import { useEffect } from 'react';
import { useSWRConfig } from 'swr';
import toast from 'react-hot-toast';

import { useCategories } from '../hooks/useCategories';

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  service?: ServiceType | null;
}

const formSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  price: z.coerce.number().min(1, 'Price is required'),
  duration: z.string().min(1, 'Duration is required'),
  categoryId: z.string().min(1, 'Category ID is required'),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function AddEditServiceModal({
  isOpen,
  onClose,
  title,
  service,
}: AddServiceModalProps) {
  const { mutate } = useSWRConfig();

  console.log('>>>>++++ service: ', service);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: service
      ? {
          ...service,
          price: parseFloat(String(service?.price)),
        }
      : {
          name: '',
          price: 0,
          duration: '',
          categoryId: '',
        },
  });

  const { categories, isLoading, isError } = useCategories();

  const generateDurationOptions = (interval: number, periods: number) => {
    const options: string[] = [];
    for (let i = 0; i <= periods; i += interval) {
      const hours = Math.floor(i / 60);
      const minutes = i % 60;
      const formatted = [hours, minutes]
        .map((unit) => unit.toString().padStart(2, '0'))
        .join(':');
      options.push(formatted);
    }
    return options;
  };

  const durationOptions = generateDurationOptions(5, 12 * 60);

  type OptionType = { label: string; value: string };

  const selectCategoryOptions =
    categories &&
    categories.map((category: CategoryType) => ({
      label: category.name,
      value: category.id,
    }));

  const selectDurationOptions = durationOptions.map((duration) => ({
    label: duration, // 화면에 표시될 문자열
    value: duration, // 실제 선택될 때 반환될 값
  }));

  useEffect(() => {
    if (service === null) {
      reset({
        name: '',
        price: 0,
        duration: '',
        categoryId: '',
      });
    } else {
      reset({
        ...service,
        price: parseFloat(String(service?.price)),
      });
    }
  }, [service, reset]);

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

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    // const durationInMinutes = parseFloat(data.duration.split(':').reduce((acc, time) => (60 * acc) + +time));
    const durationParts = data.duration.split(':');
    const durationInMinutes =
      parseFloat(durationParts[0]) * 60 + parseFloat(durationParts[1]);
    try {
      // let updatedCustomer: ServiceType | undefined;
      let response;
      const serviceData = {
        ...data,
        duration: durationInMinutes, // 변환된 duration 값을 사용합니다.
      };
      if (service) {
        console.log('>>>>update: ', serviceData, '/', service.id);
        response = await axios.patch(
          `http://localhost:5100/services/${service.id}`,
          serviceData
        );
        // updatedCustomer = response.data;
        toast.success('Updated service data successfully');
      } else {
        console.log('>>>>create: ', data);
        response = await axios.post(
          'http://localhost:5100/services',
          serviceData
        );
        // updatedCustomer = response.data;
        toast.success('Created service data successfully');
      }
      mutate('services');

      setTimeout(() => {
        onClose();
        // navigate('/customer');
      }, 2000);
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error('An error occurred while updating the data');
    }
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
        <h3 className='mb-4 text-lg font-bold text-center'>{title}</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='mb-2'>
            <label
              htmlFor='Name'
              className='block text-sm font-medium text-gray-700'
            >
              Service Name
            </label>
            <input
              id='name'
              type='text'
              {...register('name')}
              className='block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm'
            />
            <p className='text-xs text-red-600'>{errors.name?.message}</p>
          </div>

          <div className='mb-2'>
            <label
              htmlFor='category'
              className='block text-sm font-medium text-gray-700'
            >
              Category
            </label>
            <Controller
              name='categoryId'
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <Select
                  {...rest}
                  value={selectCategoryOptions.find(
                    (option: OptionType) => option.value === value
                  )} // 현재 선택된 값을 설정
                  onChange={(option) => onChange(option ? option.value : '')} // 선택된 옵션의 value를 Controller로 전달
                  options={selectCategoryOptions}
                  id='category'
                  classNamePrefix='select'
                  className='block w-full mt-1 border-gray-300 rounded-md shadow-sm'
                  styles={{
                    menu: (provided) => ({
                      ...provided,
                      backgroundColor: '#e5d5ef',
                    }),
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor: state.isFocused
                        ? '#a43ee8'
                        : provided.backgroundColor,
                      ':active': {
                        ...provided[':active'],
                        backgroundColor: state.isSelected
                          ? '#c925ea'
                          : provided.backgroundColor,
                      },
                    }),
                  }}
                />
              )}
            />
            <p className='text-xs text-red-600'>{errors.categoryId?.message}</p>
          </div>

          <div className='mb-2'>
            <label
              htmlFor='price'
              className='block text-sm font-medium text-gray-700'
            >
              Price
            </label>
            <input
              id='price'
              type='text'
              {...register('price')}
              className='block w-full p-2 mt-1 border-gray-300 rounded-md shadow-sm'
            />
            <p className='text-xs text-red-600'>{errors.price?.message}</p>
          </div>

          <div className='mb-2'>
            <label
              htmlFor='duration'
              className='block text-sm font-medium text-gray-700'
            >
              Duration
            </label>
            <Controller
              name='duration'
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <Select
                  {...rest}
                  value={selectDurationOptions.find(
                    (option) => option.value === value
                  )} // 현재 선택된 값을 설정
                  onChange={(option) => onChange(option?.value)} // 선택된 옵션의 value를 Controller로 전달
                  options={selectDurationOptions}
                  // options={durationOptions.map((duration) => ({
                  //   label: duration, value: duration
                  // })) }
                  id='duration'
                  classNamePrefix='select'
                  className='block w-full mt-1 border-gray-300 rounded-md shadow-sm'
                />
              )}
              // {...register('duration')}
              // options={durationOptions.map((duration: string) => ({label: duration, value: duration}))}
              // className='block w-full h-10 p-2 mt-1 text-sm border-gray-300 rounded-md shadow-sm'
            />
            {/* {durationOptions.map((duration: string) => (
                <option key={duration} value={duration}>
                  {duration}
                </option>
              ))} */}
            {/* </Select> */}
            <p className='text-xs text-red-600'>{errors.duration?.message}</p>
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
