import axios from 'axios';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import Modal from 'react-modal';
// import moment from 'moment';
import { useEffect, useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Select from 'react-select';
import { SingleValue } from 'react-select';

import { CustomerType, ServiceType } from '../types/types';

import { useServices } from '../hooks/useSerivces';
import useCustomerSelect from '../hooks/useCustomerSelect';
import { FormSchemaType, formSchema } from '../config/formSchema';
import { OptionType, MyCalendarEvent } from '../types/optionType';
import {
  serviceOptions,
  timeOption,
  durationOptions,
} from '../utils/optionUtils';
import { formatDuration } from '../utils/calendarUtils';
import {
  calculateEndDate,
  createStartDate,
  getMinutesFromDuration,
} from '../utils/dateUtils';
import toast from 'react-hot-toast';
import { mutate } from 'swr';

interface BookModalFormProps {
  closeModal: () => void;
  setModalIsOpen: (isOpen: boolean) => void;
  selectedEvent: MyCalendarEvent | null;
}

export default function BookModalForm({
  closeModal,
  setModalIsOpen,
  selectedEvent,
}: BookModalFormProps) {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const { services } = useServices();
  const { selectedCustomer } = useCustomerSelect();
  // const selectedCustomer = selectedCustomerRaw as CustomerType | null; // 타입 단언 사용
  const [clientSelected, setClientSelected] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [serviceOptionArray, setServiceOptionArray] = useState<OptionType[]>(
    []
  );
  const [selectedService, setSelectedService] = useState<OptionType | null>(
    null
  );
  const [serviceSelected, setServiceSelected] = useState<OptionType | null>(
    null
  );
  const [selectedDuration, setSelectedDuration] = useState<OptionType | null>(
    null
  );

  useEffect(() => {
    console.log('+++++ selectedCustomer: ', selectedCustomer);
    if (selectedCustomer) {
      setValue('firstName', selectedCustomer.firstName);
      setValue('lastName', selectedCustomer.lastName);
      setValue('mobile', selectedCustomer.mobile);
      setValue('email', selectedCustomer.email);
      setClientSelected(true);
    } else {
      setValue('firstName', '');
      setValue('lastName', '');
      setValue('mobile', '');
      setValue('email', '');
      setClientSelected(false);
    }
  }, [selectedCustomer, setValue]);

  useEffect(() => {
    if (services) {
      const options = serviceOptions(services);
      setServiceOptionArray(options);
    }
  }, [services]);

  const handleServiceChange = (selectedOption: SingleValue<OptionType>) => {
    setSelectedService(selectedOption);
    if (selectedOption) {
      const service = services.find(
        (service: ServiceType) => service.id === selectedOption.value
      );
      if (service) {
        setValue('service', service?.name);
        const formattedDuration = formatDuration(service.duration);
        setValue('duration', formattedDuration);
        setValue('price', service?.price.toString());

        setServiceSelected(selectedOption as OptionType);
        setSelectedDuration({
          value: formattedDuration,
          label: formattedDuration,
        });
      }
    } else {
      // 선택이 취소되면 모든 필드를 초기화합니다.
      setValue('service', '');
      setValue('duration', '');
      setValue('price', 0);
      setServiceSelected(null);
      setSelectedDuration(null);
    }
  };

  const handleAddCustomer = async () => {
    // const response = await axios.post(
    //   'http://localhost:5100/customers',
    //   data
    // );
    // updatedCustomer = response.data;
    // toast.success('Updated customer data successfully');
  };

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    console.log('>>>>data: ', data);
    try {
      // 폼에서 받은 데이터와 함께 추가적으로 필요한 정보를 구성합니다.
      if (
        !selectedEvent?.startDate ||
        !selectedCustomer?.id ||
        !serviceSelected?.value
      ) {
        console.error('Missing required booking information');
        // 필요한 경우 추가적인 사용자 알림이나 오류 처리를 수행합니다.
        return;
      }
      // 예약 시작 시간을 생성합니다.
      const startDate = createStartDate({
        date: new Date(selectedEvent.startDate),
        time: data.appointmentTime,
      });

      if (!startDate) {
        console.error('Invalid start date : ');
        return; // startDate가 유효하지 않으면 함수 실행을 중단합니다.
      }
      // 예약 종료 시간을 계산합니다.
      console.log('>>>>+++++ selectedDuration: ', selectedDuration);
      const durationInMinutes = getMinutesFromDuration(selectedDuration!.label);

      const endDate = calculateEndDate({
        startDate: startDate,
        // durationInMinutes: parseInt(selectedDuration?.value || '0'),
        durationInMinutes: durationInMinutes,
      });

      console.log('>>>>+++++ endDate: ', endDate);

      const newBookingData = {
        customerId: selectedCustomer?.id, // selectedCustomer에서 ID를 가져옵니다. 여기서 단언이 아닌 옵셔널 체이닝을 사용하고 있습니다.
        serviceId: serviceSelected?.value, // 선택된 서비스에서 ID를 가져옵니다.
        startDate: startDate, // 사용자가 선택한 예약 시작 시간
        endDate: endDate, // 예약 종료 시간을 계산하는 함수를 사용해야 합니다.
        realDuration: selectedDuration ? selectedDuration.label : '', // 실제 지속 시간
        // realDuration: parseFloat(selectedDuration?.value || '0'), // 실제 지속 시간
        realPrice: data.price, // 실제 가격
        // 기타 필요한 데이터...
      };

      // 서버로 POST 요청을 보냅니다.
      const response = await axios.post(
        'http://localhost:5100/books',
        newBookingData
      );

      // 요청 성공 처리...\
      toast.success('Appointment booked successfully');
      mutate('fetchBooks');
      console.log('Booking created successfully:', response.data);
      closeModal(); // 모달 닫기
    } catch (error) {
      // 에러 처리...
      toast.error('An error occurred while creating the booking data');
      console.error('Failed to create booking:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='p-4 bg-gray-100 border-2 border-gray-300 rounded'>
        <div className='flex flex-col md:flex-row md:space-x-4'>
          <input
            {...register('firstName')}
            disabled={clientSelected}
            placeholder='First Name'
            className={`flex-1 block w-full p-2 mt-1 border border-gray-300 rounded shadow-sm placeholder:text-sm placeholder:opacity-50 ${
              clientSelected ? 'text-black text-opacity-50' : ''
            }`}
          />
          {errors.firstName && (
            <p className='text-sm text-red-500'>{errors.firstName.message}</p>
          )}
          <input
            {...register('lastName')}
            disabled={clientSelected}
            placeholder='Last Name'
            className={`flex-1 block w-full p-2 mt-1 border border-gray-300 rounded shadow-sm placeholder:text-sm placeholder:opacity-50 ${
              clientSelected ? 'text-black text-opacity-50' : ''
            }`}
          />
          {errors.lastName && (
            <p className='text-sm text-red-500'>{errors.lastName.message}</p>
          )}
        </div>
        <div className='flex flex-col md:flex-row md:space-x-4'>
          <input
            {...register('mobile')}
            placeholder='Mobile'
            disabled={clientSelected}
            className={`flex-1 block w-full p-2 mt-1 border border-gray-300 rounded shadow-sm placeholder:text-sm placeholder:opacity-50 ${
              clientSelected ? 'text-black text-opacity-50' : ''
            }`}
          />
          {errors.mobile && (
            <p className='text-sm text-red-500'>{errors.mobile.message}</p>
          )}
          <input
            {...register('email')}
            placeholder='Email'
            disabled={clientSelected}
            className={`flex-1 sm:w-full block w-full p-2 mt-1 border border-gray-300 rounded shadow-sm placeholder:text-sm placeholder:opacity-50 ${
              clientSelected ? 'text-black text-opacity-50' : ''
            }`}
          />
          {errors.email && (
            <p className='text-sm text-red-500'>{errors.email.message}</p>
          )}
        </div>
        {!clientSelected && (
          <div className='flex justify-end mt-4'>
            <button
              type='button' // 폼 제출이 아닌 일반 버튼으로 설정
              onClick={handleAddCustomer}
              className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700'
            >
              Add Customer
            </button>
          </div>
        )}
      </div>
      <div className='flex flex-col items-center gap-2 p-2 border-2 rounded md:flex-row md:space-x-4 border-slate-300 bg-slate-100'>
        <Controller
          name='service'
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={serviceOptionArray}
              placeholder='Select service'
              value={serviceSelected}
              onChange={handleServiceChange}
              className='flex-1 sm:w-full '
              styles={{
                placeholder: (provided) => ({
                  ...provided,
                  fontSize: '0.875rem', // Tailwind 'text-sm' equivalent
                  opacity: 0.5,
                }),
                control: (provided) => ({
                  ...provided,
                  borderColor: '#d1d5db', // Tailwind 'border-gray-300' equivalent
                  '&:hover': {
                    borderColor: '#d1d5db',
                  },
                }),
              }}
            />
          )}
        />
        {errors.service && (
          <p className='text-sm text-red-500'>{errors.service.message}</p>
        )}
        <Controller
          name='appointmentTime'
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={timeOption}
              value={
                field.value ? { label: field.value, value: field.value } : null
              } // 선택된 옵션의 객체를 사용하거나, 선택이 없는 경우 null이나 undefined를 사용
              onChange={(option) => {
                field.onChange(option ? option.value : '');
                setSelectedOption(option as OptionType); // 현재 선택된 옵션을 state에 저장
              }}
              className='flex-1 basic-single sm:w-full '
              classNamePrefix='select'
              placeholder='Select time'
              styles={{
                placeholder: (provided) => ({
                  ...provided,
                  fontSize: '0.875rem', // Tailwind 'text-sm' equivalent
                  opacity: 0.5,
                }),
                control: (provided) => ({
                  ...provided,
                  borderColor: '#d1d5db', // Tailwind 'border-gray-300' equivalent
                  '&:hover': {
                    borderColor: '#d1d5db', // Tailwind 'border-gray-300' equivalent
                  },
                }),
              }}
            />
          )}
        />
        {errors.appointmentTime && (
          <p className='text-sm text-red-500'>
            {errors.appointmentTime.message}
          </p>
        )}
        <Controller
          name='duration'
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              options={durationOptions}
              value={
                field.value ? { label: field.value, value: field.value } : null
              }
              // value={selectedDuration}
              onChange={(option) => {
                field.onChange(option ? option.value : '');
                setSelectedDuration(option as OptionType);
              }}
              className='flex-1 basic-single sm:w-full '
              classNamePrefix='select'
              placeholder='Select duration'
              styles={{
                placeholder: (provided) => ({
                  ...provided,
                  fontSize: '0.875rem', // Tailwind 'text-sm' equivalent
                  opacity: 0.5,
                }),
                control: (provided) => ({
                  ...provided,
                  borderColor: '#d1d5db', // Tailwind 'border-gray-300' equivalent
                  '&:hover': {
                    borderColor: '#d1d5db', // Tailwind 'border-gray-300' equivalent
                  },
                }),
              }}
            />
          )}
        />
        {errors.duration && (
          <p className='text-sm text-red-500'>{errors.duration.message}</p>
        )}
        <div className='flex items-center flex-1 sm:w-full '>
          <span className='text-lg'>$</span>
          <input
            {...register('price')}
            placeholder='$100'
            className='block w-full p-2 mt-1 ml-2 border border-gray-300 rounded shadow-sm placeholder:text-sm placeholder:opacity-50'
          />
        </div>
      </div>
      <div className='flex items-center justify-end gap-2 '>
        <button
          onClick={closeModal}
          className='flex items-center justify-center px-4 py-2 text-black bg-white border-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500'
        >
          Cancel
        </button>
        <button
          type='submit'
          className='flex items-center justify-center px-6 py-2 text-white bg-black rounded hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white'
        >
          Save
        </button>
      </div>
    </form>
  );
}
