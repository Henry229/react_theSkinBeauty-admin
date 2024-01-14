import axios from 'axios';
import toast from 'react-hot-toast';

export async function createBooking(bookingData) {
  try {
    const response = await axios.post(
      'http://localhost:5100/books',
      bookingData
    );
    // 성공 처리
    toast.success('Appointment created successfully');
    return response.data;
  } catch (error) {
    // 에러 처리
    console.error('Failed to create booking:', error);
    toast.error('An error occurred while creating the booking');
  }
}

export async function updateBooking(id, bookingData) {
  try {
    const response = await axios.patch(
      `http://localhost:5100/books/${id}`,
      bookingData
    );
    // 성공 처리
    toast.success('Appointment updated successfully');
    return response.data;
  } catch (error) {
    // 에러 처리
    console.error('Failed to update booking:', error);
    toast.error('An error occurred while updating the booking');
  }
}

// export async function createCustomerAndBooking(data) {
//   try {
//     // 여기에 새로운 고객을 등록하는 로직을 구현
//     // const newCustomerId = await createCustomer(data);
//     // 새로운 고객 ID를 사용하여 예약 생성
//     await createBooking({ ...data, customerId: newCustomerId });
//     toast.success('New customer and appointment created successfully');
//   } catch (error) {
//     console.error('Error creating new customer and appointment:', error);
//     toast.error('Failed to create new customer and appointment');
//   }
// }

export async function createCustomer(newClient) {
  try {
    const response = await axios.post(
      'http://localhost:5100/customers',
      newClient
    );
    // 성공 처리
    toast.success('Customer created successfully');
    return response.data.id;
  } catch (error) {
    // 에러 처리
    console.error('Failed to create customer:', error);
    toast.error('An error occurred while creating the customer');
  }
}

export const handleDelete = async (bookingId, onSuccess) => {
  try {
    await axios.delete(`http://localhost:5100/books/${bookingId}`);
    toast.success('Booking deleted successfully');
    onSuccess();
  } catch (error) {
    console.error('Error deleting booking: ', error);
    toast.error('Error occurred while deleting the booking');
  }
};
