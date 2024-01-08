import React, { useState } from 'react';
import axios from 'axios';
import { Calendar } from 'react-big-calendar';
import Modal from 'react-modal';
import moment from 'moment';

import { OptionType, SlotInfo } from '../types/optionType';

import { useForm, SubmitHandler } from 'react-hook-form';
import { OptionsOrGroups, GroupBase, SingleValue } from 'react-select';
import { zodResolver } from '@hookform/resolvers/zod';

import { CustomerType, ServiceType } from '../types/types';
import { FormSchemaType, formSchema } from '../config/formSchema';
import { localizer } from '../utils/calendarUtils';

import SearchClient from '../components/searchClient';

import { useServices } from '../hooks/useSerivces';
import BookModalForm from '../components/book-modal-form';

Modal.setAppElement('#root');

// Event 타입을 정의합니다.
interface Event {
  start: Date;
  end: Date;
}

export default function CalendarPage() {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedOption, setSelectedOption] = useState<OptionType | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<OptionType | null>(
    null
  );
  const [clientSelected, setClientSelected] = useState(false);
  const [serviceSelected, setServiceSelected] = useState<OptionType | null>(
    null
  );
  const [selectedService, setSelectedService] = useState<OptionType | null>(
    null
  );

  const formatSelectedDate = () => {
    if (!selectedEvent) return '';
    return moment(selectedEvent.start).format('YYYY년 MM월 DD일 dddd');
  };

  // 캘린더에서 이벤트(시간 슬롯)를 선택했을 때 호출되는 함수입니다.
  const handleSelect = ({ start, end }: SlotInfo) => {
    // 모달 상태를 열고 선택된 이벤트(시간)을 설정합니다.
    setSelectedEvent({ start, end });
    setModalIsOpen(true);
  };

  // 폼 제출 처리 함수
  // const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
  // console.log('>>>>data: ', data);

  //   const bookDate = {
  //     ...data,
  //     serviceId: selectedService?.value,
  //     startDate: ,
  //     duration: selectedDuration?.label, // 선택된 시간 (시간 포맷)
  //   appointmentTime: selectedOption?.label, // 예약 시간
  //   date: selectedEvent?.start, // 선택된 이벤트의 시작 날짜 및 시간
  //   }

  //   try {
  //     // axios를 사용하여 POST 요청을 전송
  //   const response = await axios.post(endpoint, appointmentData);

  //   // 응답이 성공적으로 돌아온 경우의 로직
  //   console.log('Appointment booked successfully', response.data);
  //   setModalIsOpen(false); // 성공시 모달을 닫습니다.
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       console.error('Failed to book appointment', error.response?.data);
  //     } else {
  //       console.error('An unexpected error occurred', error);
  //     }
  //   }

  //   const customerName = (
  //     event.currentTarget.elements.namedItem('customerName') as HTMLInputElement
  //   ).value;
  //   // 예약 로직 구현
  //   console.log('Booking appointment for:', customerName, selectedEvent);
  //   // 모달을 닫습니다.
  //   setModalIsOpen(false);
  // };

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

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel='Appointment Modal'
        className={
          'absolute z-50 w-full max-w-2xl p-8 mx-auto ' +
          '-translate-x-1/2 -translate-y-1/2 bg-white border rounded shadow-lg ' +
          'top-1/2 left-1/2 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 ' +
          'sm:-translate-y-1/2 sm:w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl '
        }
        overlayClassName='fixed inset-0 z-50 bg-black bg-opacity-50'
      >
        <h2 className='mb-4 text-2xl font-semibold'>Add Appointment</h2>
        <p className='mb-4 text-lg'>{formatSelectedDate()}</p>

        <SearchClient />

        <BookModalForm
          // selectEvent={selectedEvent}
          closeModal={() => setModalIsOpen(false)}
          setModalIsOpen={setModalIsOpen}
        />
      </Modal>
    </>
  );
}
