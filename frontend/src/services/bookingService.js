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
