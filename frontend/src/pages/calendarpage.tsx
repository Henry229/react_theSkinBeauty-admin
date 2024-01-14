import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar } from 'react-big-calendar';
import Event from 'react-big-calendar';
import Modal from 'react-modal';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { OptionType, SlotInfo, MyCalendarEvent } from '../types/optionType';

import { localizer } from '../utils/calendarUtils';

import SearchClient from '../components/searchClient';
import BookModalForm from '../components/book-modal-form';

import { useServices } from '../hooks/useSerivces';
import { useBooks } from '../hooks/useBooks';
import { bookType } from '../types/types';
import useCustomerSelect from '../hooks/useCustomerSelect';
import { handleDelete } from '../services/bookingService';

Modal.setAppElement('#root');

// 사용자 정의 이벤트 컴포넌트
const CustomEvent: React.FC<{ event: MyCalendarEvent }> = ({ event }) => {
  return (
    <div style={{ fontSize: '0.75rem', whiteSpace: 'normal' }}>
      <strong>
        {`${event.book?.customer?.firstName}${event.book?.customer?.lastName} `}
      </strong>
      {moment(event.start).format('h:mm A')}
      <br />
      {event.book?.service?.name} - ${String(event.book?.realPrice)}
    </div>
  );
};

// 이벤트 스타일을 사용자 정의하는 함수
const eventStyleGetter = (
  event: MyCalendarEvent,
  start: Date,
  end: Date,
  isSelected: boolean
) => {
  const style = {
    backgroundColor: '#f0f0f0',
    borderRadius: '0px',
    opacity: 0.8,
    color: 'black',
    border: '0px',
    display: 'block',
  };
  return {
    style: style,
  };
};

export default function CalendarPage() {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<MyCalendarEvent | null>(
    null
  );
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
  // const [events, setEvents] = useState([]);

  const { books, isLoading, isError, mutate } = useBooks();
  const { selectCustomer } = useCustomerSelect();

  const refreshBooks = () => {
    mutate();
  };

  // 예약 데이터를 캘린더 이벤트 형식에 맞게 변환하는 로직...
  const events: MyCalendarEvent[] =
    books?.map((booking: bookType) => ({
      id: booking.id,
      book: booking,
      start: new Date(booking.startDate),
      end: new Date(booking.endDate),
    })) || [];

  const formatSelectedDate = () => {
    if (!selectedEvent) return '';
    return moment(selectedEvent.start).format('YYYY년 MM월 DD일 dddd');
  };

  const handleSelect = (slotInfo: SlotInfo) => {
    const startDate = slotInfo.start;
    const endDate = slotInfo.end;
    const pickBook: MyCalendarEvent = {
      id: '',
      book: {
        id: '',
        customer: {
          id: '',
          firstName: '',
          lastName: '',
          mobile: '',
          email: '',
          createdAt: new Date(),
        },
        service: {
          id: '',
          name: '',
          price: '',
          duration: '',
          category: {
            id: '',
            name: '',
            createdAt: new Date(),
          },
          createdAt: new Date(),
        },
        startDate: slotInfo.start,
        endDate: slotInfo.end,
        realDuration: '',
        realPrice: 0,
        createdAt: new Date(),
      },
      start: slotInfo.start,
      end: slotInfo.end,
    };
    setSelectedEvent(pickBook);
    setModalIsOpen(true);
  };

  // 캘린더에서 기존 예약 이벤트를 클릭했을 때 호출되는 함수입니다.
  const handleSelectEvent = (event: MyCalendarEvent) => {
    const booking = books.find((booking: bookType) => booking.id === event.id);
    if (booking) {
      setSelectedEvent(event);
      setModalIsOpen(true);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    selectCustomer(null); // selectCustomer 함수를 null과 함께 호출하여 고객 선택을 초기화
  };

  const handleDeleteBook = () => {
    if (selectedEvent) {
      handleDelete(selectedEvent.id, onDeleteSuccess);
    }
  };

  const onDeleteSuccess = () => {
    mutate();
    setModalIsOpen(false);
  };

  const modalTitle = selectedEvent?.id ? 'Edit Booking' : 'Add Appointment';

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading bookings</div>;

  return (
    <>
      <div className='p-4 m-4 border rounded shadow'>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor='start'
          endAccessor='end'
          style={{ height: 500 }}
          onSelectSlot={handleSelect}
          onSelectEvent={handleSelectEvent} // 기존 예약 이벤트를 클릭했을 때 호출되는 함수
          selectable
          eventPropGetter={eventStyleGetter}
          components={{
            event: CustomEvent,
          }}
        />
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Appointment Modal'
        className={
          'absolute z-50 w-full max-w-2xl p-8 mx-auto ' +
          '-translate-x-1/2 -translate-y-1/2 bg-white border rounded shadow-lg ' +
          'top-1/2 left-1/2 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 ' +
          'sm:-translate-y-1/2 sm:w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl '
        }
        overlayClassName='fixed inset-0 z-50 bg-black bg-opacity-50'
      >
        <h2 className='mb-4 text-2xl font-semibold'>{modalTitle}</h2>
        <p className='mb-4 text-lg'>{formatSelectedDate()}</p>

        <SearchClient
          onDelete={handleDeleteBook}
          isSelectedEvent={!!selectedEvent?.id}
        />

        <BookModalForm
          // closeModal={() => setModalIsOpen(false)}
          closeModal={closeModal}
          setModalIsOpen={setModalIsOpen}
          selectedEvent={selectedEvent}
        />
      </Modal>
    </>
  );
}
