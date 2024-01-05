import React, { useState, FormEvent } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import Select from 'react-select';
import { OptionsOrGroups, GroupBase } from 'react-select';
import moment from 'moment';
import Modal from 'react-modal';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import SearchClient from '../components/searchClient';
import { useServices } from '../hooks/useSerivces';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { CustomerType, ServiceType } from '../types/types';

Modal.setAppElement('#root');

const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(10, 'Mobile should be at least 10 digits'),
  service: z.string().min(1, 'Service is required'),
  appointmentTime: z.string().min(1, 'Appointment time is required'),
  price: z.coerce.number().min(0, 'Price must be greater than 0'),
  duration: z.string().min(1, 'Duration is required'),
});

type FormSchemaType = z.infer<typeof formSchema>;

// Event 타입을 정의합니다.
interface Event {
  start: Date;
  end: Date;
}

const generateTimeOptions = () => {
  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
      timeOptions.push({ value: timeString, label: timeString });
    }
  }
  return timeOptions;
};

const generateDurationOptions = () => {
  const durationOptions = [];
  for (let hour = 0; hour < 12; hour++) {
    for (let minute = 0; minute < 60; minute += 5) {
      const durationString = `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`;
      durationOptions.push({ value: durationString, label: durationString });
    }
  }
  return durationOptions;
};

// moment localizer를 설정합니다.
const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  const { services } = useServices();
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormSchemaType>({
    resolver: zodResolver(formSchema),
  });

  const selectedService = watch('service');

  const timePick: OptionsOrGroups<
    OptionType,
    GroupBase<OptionType>
  > = generateTimeOptions();

  const durationOptions: OptionsOrGroups<
    OptionType,
    GroupBase<OptionType>
  > = generateDurationOptions();

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<OptionType | null>(
    null
  );
  const [clientSelected, setClientSelected] = useState(false);

  const formatSelectedDate = () => {
    if (!selectedEvent) return '';
    return moment(selectedEvent.start).format('YYYY년 MM월 DD일 dddd');
  };

  type SlotInfo = {
    start: Date;
    end: Date;
  };

  interface OptionType {
    value: string;
    label: string;
  }

  const serviceOptions =
    services?.map((service: ServiceType) => ({
      value: service.id,
      label: service.name,
    })) || [];

  // 캘린더에서 이벤트(시간 슬롯)를 선택했을 때 호출되는 함수입니다.
  const handleSelect = ({ start, end }: SlotInfo) => {
    // 모달 상태를 열고 선택된 이벤트(시간)을 설정합니다.
    setSelectedEvent({ start, end });
    setModalIsOpen(true);
  };

  const handleCustomerSelect = (customer: CustomerType) => {
    setValue('firstName', customer.firstName);
    setValue('lastName', customer.lastName);
    setValue('mobile', customer.mobile);
    setValue('email', customer.email);
    setClientSelected(true); // 입력 필드 비활성화
  };

  // 폼 제출 처리 함수
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    //   const customerName = (
    //     event.currentTarget.elements.namedItem('customerName') as HTMLInputElement
    //   ).value;
    //   // 예약 로직 구현
    //   console.log('Booking appointment for:', customerName, selectedEvent);
    //   // 모달을 닫습니다.
    //   setModalIsOpen(false);
  };

  return (
    <>
      <div className='p-4 m-4 border rounded shadow'>
        <Calendar
          localizer={localizer}
          startAccessor='start'
          endAccessor='end'
          style={{ height: 500 }}
          onSelectSlot={handleSelect}
          selectable
        />
      </div>

      {/* 예약 모달 */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel='Appointment Modal'
        // className='absolute p-8 transform -translate-x-1/2 -translate-y-1/2 bg-white border rounded shadow-lg z-60 top-1/2 left-1/2'
        className='absolute z-50 w-full max-w-2xl p-8 mx-auto -translate-x-1/2 -translate-y-1/2 bg-white border rounded shadow-lg top-1/2 left-1/2 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl '
        overlayClassName='fixed inset-0 z-50 bg-black bg-opacity-50'
      >
        <h2 className='mb-4 text-2xl font-semibold'>Add Appointment</h2>
        <p className='mb-4 text-lg'>{formatSelectedDate()}</p>

        <SearchClient onClientSelect={handleCustomerSelect} />

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
                <p className='text-sm text-red-500'>
                  {errors.firstName.message}
                </p>
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
                <p className='text-sm text-red-500'>
                  {errors.lastName.message}
                </p>
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
                className={`flex-1 block w-full p-2 mt-1 border border-gray-300 rounded shadow-sm placeholder:text-sm placeholder:opacity-50 ${
                  clientSelected ? 'text-black text-opacity-50' : ''
                }`}
              />
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email.message}</p>
              )}
            </div>
          </div>
          <div className='flex flex-col items-center gap-2 p-2 border-2 rounded md:flex-row md:space-x-4 border-slate-300 bg-slate-100'>
            <Controller
              name='service'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={serviceOptions}
                  placeholder='Select service'
                  onChange={(selectedOption) => {
                    selectedOption && selectedOption
                      ? setValue('service', selectedOption)
                      : setValue('service', '');
                  }}
                  className='w-full'
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
            {errors.service && (
              <p className='text-sm text-red-500'>{errors.service.message}</p>
            )}
            <Controller
              name='appointmentTime'
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={timePick}
                  value={selectedOption} // 선택된 옵션의 객체를 사용하거나, 선택이 없는 경우 null이나 undefined를 사용
                  onChange={(option) => {
                    field.onChange(option);
                    setSelectedOption(option as OptionType); // 현재 선택된 옵션을 state에 저장
                  }}
                  className='w-full basic-single'
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
                  value={selectedDuration}
                  onChange={(option) => {
                    field.onChange(option);
                    setSelectedDuration(option as OptionType);
                  }}
                  className='w-full basic-single'
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
            <input
              {...register('price')}
              placeholder='$100'
              className='block w-full p-2 mt-1 border border-gray-300 rounded shadow-sm placeholder:text-sm placeholder:opacity-50'
            />
          </div>
          <div className='flex items-center justify-end gap-2 '>
            <button
              onClick={() => setModalIsOpen(false)}
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
      </Modal>
    </>
  );
}
