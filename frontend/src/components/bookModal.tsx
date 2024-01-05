import React, { useState } from 'react';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
// import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { useServices } from '../hooks/useSerivces';
import { ServiceType } from '../types/types';
import SearchClient from './searchClient';
import moment from 'moment';

export default function AppointmentModal() {
  const { services } = useServices();
  const { control, register, handleSubmit, watch, setValue } = useForm();
  const selectedService = watch('service');

  const serviceOptions =
    services?.map((service: ServiceType) => ({
      value: service.id,
      label: service.name,
    })) || [];

  // 폼 제출 핸들러
  // const onSubmit = (data) => {
  //   console.log(data);
  //   // 여기서 서버로 폼 데이터를 보낼 수 있습니다.
  // };

  return (
    <div>
      {/* <h2 className='mb-4 text-lg font-semibold'>Add Appointment</h2>
      <p className='mb-4 text-sm'>{formatSelectedDate()}</p>
      <SearchClient /> */}
      {/* <form onSubmit={handleSubmit()}> */}
      <Controller
        name='service'
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            options={serviceOptions}
            placeholder='Select a service...'
            onChange={(selectedOption) => {
              setValue('service', selectedOption);
            }}
          />
        )}
      />
      <input type='text' {...register('mobile')} placeholder='Mobile' />
      <input type='email' {...register('email')} placeholder='Email' />
      {/* <Controller
          name='appointmentTime'
          control={control}
          render={({ field }) => (
            <DateTimePickerComponent
              {...field}
              onChange={(date) => {
                setValue('appointmentTime', date.value);
              }}
            />
          )}
        /> */}
      <input type='text' {...register('duration')} placeholder='Duration' />
      <input type='text' {...register('price')} placeholder='Price' />
      <input type='submit' />
      {/* </form> */}
    </div>
  );
}
