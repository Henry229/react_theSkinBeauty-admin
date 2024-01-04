import React, { useState, FormEvent } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import SearchClient from '../components/searchClient';

Modal.setAppElement('#root');

// Event 타입을 정의합니다.
interface Event {
  start: Date;
  end: Date;
}

// moment localizer를 설정합니다.
const localizer = momentLocalizer(moment);

export default function CalendarPage() {
  // const MyCalendar: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const formatSelectedDate = () => {
    if (!selectedEvent) return '';
    return moment(selectedEvent.start).format('YYYY년 MM월 DD일 dddd');
  };

  type SlotInfo = {
    start: Date;
    end: Date;
  };

  // 캘린더에서 이벤트(시간 슬롯)를 선택했을 때 호출되는 함수입니다.
  const handleSelect = ({ start, end }: SlotInfo) => {
    // 모달 상태를 열고 선택된 이벤트(시간)을 설정합니다.
    setSelectedEvent({ start, end });
    setModalIsOpen(true);
  };

  // 폼 제출 처리 함수
  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const customerName = (
      event.currentTarget.elements.namedItem('customerName') as HTMLInputElement
    ).value;
    // 예약 로직 구현
    console.log('Booking appointment for:', customerName, selectedEvent);
    // 모달을 닫습니다.
    setModalIsOpen(false);
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
        className='absolute p-8 transform -translate-x-1/2 -translate-y-1/2 bg-white border rounded shadow-lg z-60 top-1/2 left-1/2'
        overlayClassName='fixed inset-0 z-50 bg-black bg-opacity-50'
      >
        <h2 className='mb-4 text-lg font-semibold'>Add Appointment</h2>
        <p className='mb-4 text-sm'>{formatSelectedDate()}</p>
        <SearchClient />
        <form onSubmit={handleFormSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Customer Name:
              <input
                type='text'
                name='customerName'
                required
                className='block w-full p-2 mt-1 border border-gray-300 rounded shadow-sm'
              />
            </label>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Appointment Time:
              <input
                type='text'
                value={moment(selectedEvent?.start).format('LT')}
                readOnly
                className='block w-full p-2 mt-1 border border-gray-300 rounded shadow-sm bg-gray-1'
              />
            </label>
          </div>
          <button
            type='submit'
            className='px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            Book Appointment
          </button>
        </form>
        <button
          onClick={() => setModalIsOpen(false)}
          className='px-4 py-2 mt-4 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
        >
          Close
        </button>
      </Modal>
    </>
  );
}
