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
import moment from 'moment';
import {
  createBooking,
  createCustomer,
  updateBooking,
} from '../services/bookingService';

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
    watch,
    trigger,
    getValues,
  } = useForm<FormSchemaType>({
    // mode: 'onChange',
    resolver: zodResolver(formSchema),
  });

  const { services } = useServices();
  const { selectedCustomer } = useCustomerSelect();
  // const selectedCustomer = selectedCustomerRaw as CustomerType | null; // 타입 단언 사용
  const [clientSelected, setClientSelected] = useState(false);
  // 신규 고객을 추가할 수 있는지 여부를 결정하는 상태
  const [canAddCustomer, setCanAddCustomer] = useState(false);
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

  // 신규 고객인지 여부를 판단하는 상태를 watch 함수를 사용하여 추적합니다.
  // const isNewCustomer = watch('isNewCustomer');

  useEffect(() => {
    // 선택된 이벤트가 있을 경우, 폼 필드들을 해당 데이터로 채웁니다.
    console.log('==== selectedEvent: ', selectedEvent);

    const isCustomerDataEmpty =
      selectedEvent &&
      !selectedEvent.book.customer.firstName &&
      !selectedEvent.book.customer.lastName;
    setCanAddCustomer(!!isCustomerDataEmpty);

    if (!isCustomerDataEmpty) {
      setClientSelected(true);
    }

    if (selectedEvent) {
      setValue('firstName', selectedEvent.book.customer.firstName);
      setValue('lastName', selectedEvent.book.customer.lastName);
      setValue('mobile', selectedEvent.book.customer.mobile);
      setValue('email', selectedEvent.book.customer.email);
      setValue('service', selectedEvent.book.service.name);
      // const duration = formatDuration(Number(selectedEvent.book.realDuration));
      console.log(
        '>>>>> type of selectedEvent.book.realDuration: ',
        typeof selectedEvent.book.realDuration
      );

      const initialDuration = selectedEvent.book.realDuration.toString();
      console.log('>>>>> initialDuration: ', initialDuration);

      setValue('duration', initialDuration);
      setSelectedDuration({
        value: initialDuration,
        label: initialDuration,
      });

      setValue('price', selectedEvent.book.realPrice.valueOf());
      console.log(
        '### selectedEvent.book.startDate: ',
        selectedEvent.book.startDate
      );

      const appointmentTime = moment(selectedEvent.book.startDate).format(
        'HH:mm'
      );
      setValue('appointmentTime', appointmentTime);
      // ... 다른 필드들도 동일하게 적용
    }
  }, [selectedEvent, setValue]);

  useEffect(() => {
    console.log('+++++ selectedCustomer: ', selectedCustomer);
    if (selectedCustomer) {
      setValue('firstName', selectedCustomer.firstName);
      setValue('lastName', selectedCustomer.lastName);
      setValue('mobile', selectedCustomer.mobile);
      setValue('email', selectedCustomer.email);
      setClientSelected(true);
    }
    // } else if (canAddCustomer) {
    //   console.log('+++++<<<<< selectedEvent: ', selectedEvent);

    //   setValue('firstName', '');
    //   setValue('lastName', '');
    //   setValue('mobile', '');
    //   setValue('email', '');
    //   setClientSelected(false);
    // }
  }, [selectedCustomer, selectedEvent, setValue]);

  useEffect(() => {
    if (services) {
      const options = serviceOptions(services);
      setServiceOptionArray(options);
    }
  }, [services]);

  useEffect(() => {
    // selectedEvent가 변경될 때마다 실행됩니다.
    if (selectedEvent && services) {
      // services 배열에서 selectedEvent의 service ID에 해당하는 서비스 객체를 찾습니다.
      const matchingService = services.find(
        (service: ServiceType) => service.id === selectedEvent.book.service.id
      );

      // 해당 서비스 객체를 사용하여 serviceSelected 상태를 설정합니다.
      if (matchingService) {
        const serviceOption = {
          value: matchingService.id,
          label: matchingService.name,
        };
        setServiceSelected(serviceOption);

        // Controller를 통해 Select 컴포넌트의 값을 설정합니다.
        setValue('service', serviceOption.label);
      }
    }
  }, [selectedEvent, services, setValue, setServiceSelected]);

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

  const handleAddCustomer = async (data: FormSchemaType) => {
    const newClient = {
      firstName: data?.firstName,
      lastName: data?.lastName,
      mobile: data?.mobile,
      email: data?.email,
    };
    createCustomer(newClient);
  };

  const onClickAddCustomer = async () => {
    // handleSubmit(handleAddCustomer)();
    const result = await trigger(['firstName', 'lastName', 'mobile', 'email']);
    if (result) {
      // 해당 필드가 유효하다면 handleAddCustomer를 호출합니다
      const customerData = {
        firstName: getValues('firstName'),
        lastName: getValues('lastName'),
        mobile: getValues('mobile'),
        email: getValues('email'),
        service: '',
        appointmentTime: '',
        price: 0,
        duration: '',
      };
      handleAddCustomer(customerData);
    }
  };

  const handleDurationChange = (selectedOption: SingleValue<OptionType>) => {
    setSelectedDuration(selectedOption);
    if (selectedOption) {
      setValue('duration', selectedOption.value);
    } else {
      setValue('duration', '');
    }
  };

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    console.log('>>>>data: ', data);
    console.log('++++selectedEvent: ', selectedEvent);
    console.log('++++selectedCustomer.mobile: ', selectedCustomer?.mobile);
    console.log('++++serviceSelected.value: ', serviceSelected?.value);

    try {
      // Create a start date object
      const startDate = createStartDate({
        date: selectedEvent ? new Date(selectedEvent.start) : new Date(),
        time: data.appointmentTime,
      });

      if (!startDate) {
        console.error('Invalid start date : ');
        return;
      }
      // get the duration in minutes
      console.log('>>>>+++++ data.duration: ', data.duration);
      const durationInMinutes = getMinutesFromDuration(data.duration);
      // const durationInMinutes = getMinutesFromDuration(selectedDuration!.label);
      const endDate = calculateEndDate({
        startDate: startDate,
        durationInMinutes: durationInMinutes,
      });

      console.log('>>>>+++++ endDate: ', endDate);

      // 폼에서 받은 데이터와 함께 추가적으로 필요한 정보를 구성합니다.
      if (!selectedEvent || !selectedEvent?.id) {
        // !selectedCustomer?.mobile ||
        // !serviceSelected?.value
        // console.error('Missing required booking information');
        // toast.error('Required booking information is missing');
        // return;

        if (selectedCustomer) {
          const newBookingData = {
            customerId: selectedCustomer?.id, // selectedCustomer에서 ID를 가져옵니다. 여기서 단언이 아닌 옵셔널 체이닝을 사용하고 있습니다.
            serviceId: serviceSelected?.value, // 선택된 서비스에서 ID를 가져옵니다.
            startDate, // 사용자가 선택한 예약 시작 시간
            endDate, // 예약 종료 시간을 계산하는 함수를 사용해야 합니다.
            realDuration: selectedDuration ? selectedDuration.label : '', // 실제 지속 시간
            // realDuration: parseFloat(selectedDuration?.value || '0'), // 실제 지속 시간
            realPrice: data.price, // 실제 가격
            // 기타 필요한 데이터...
          };
          createBooking(newBookingData)
            .then((res) => {
              console.log('>>>>> res: ', res);
              toast.success('Created booking data successfully');
              mutate('fetchBooks');
              closeModal();
            })
            .catch((err) => {
              console.log('>>>>> err: ', err);
              toast.error('An error occurred while creating the booking data');
            });
        }
      } else {
        const updatedBookingData = {
          serviceId: serviceSelected?.value,
          startDate: startDate,
          endDate: endDate,
          realDuration: selectedDuration ? selectedDuration.label : '',
          realPrice: data.price,
        };
        updateBooking(selectedEvent.id, updatedBookingData)
          .then((res) => {
            console.log('>>>>> res: ', res);
            toast.success('Updated booking data successfully');
            mutate('fetchBooks');
            closeModal();
          })
          .catch((err) => {
            console.log('>>>>> err: ', err);
            toast.error('An error occurred while updating the booking data');
          });
      }

      // if (selectedEvent?.id) {

      //   updateBooking(selectedEvent.id, updatedBookingData)
      //     .then((res) => {
      //       console.log('>>>>> res: ', res);
      //       toast.success('Updated booking data successfully');
      //       mutate('fetchBooks');
      //       closeModal();
      //     })
      //     .catch((err) => {
      //       console.log('>>>>> err: ', err);
      //       toast.error('An error occurred while updating the booking data');
      //     });
      // } else {

      //   createBooking(newBookingData)

      // }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while saving the booking data');
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
        {!clientSelected && canAddCustomer && (
          <div className='flex justify-end mt-4'>
            <button
              type='button' // 폼 제출이 아닌 일반 버튼으로 설정
              onClick={onClickAddCustomer}
              className='px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700'
            >
              Add Customer
            </button>
          </div>
        )}
      </div>
      <div className='flex flex-col items-center gap-2 p-2 border-2 rounded md:flex-row md:space-x-4 border-slate-300 bg-slate-100'>
        {/* <pre>console.log({`>>>> !clientSelected: , ${!clientSelected}`})</pre> */}
        <Controller
          name='service'
          control={control}
          rules={{
            required: clientSelected ? undefined : 'Service is required',
          }} // 신규 고객이 아닌 경우에만 필수로 설정합니다.
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
          rules={{ required: clientSelected ? undefined : 'Time is required' }} // 신규 고객이 아닌 경우에만 필수로 설정합니다.
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
          rules={{
            required: clientSelected ? undefined : 'Duration is required',
          }} // 신규 고객이 아닌 경우에만 필수로 설정합니다.
          render={({ field }) => (
            <Select
              {...field}
              options={durationOptions}
              value={selectedDuration}
              onChange={handleDurationChange}
              // value={
              //   field.value ? { label: field.value, value: field.value } : null
              // }
              // onChange={(option) => {
              //   field.onChange(option ? option.value : '');
              //   setSelectedDuration(option as OptionType);
              // }}
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
