import { z } from 'zod';

export const formSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(10, 'Mobile should be at least 10 digits'),
  service: z.string().min(1, 'Service is required'),
  appointmentTime: z.string().min(1, 'Appointment time is required'),
  price: z.coerce.number().min(0, 'Price must be greater than 0'),
  duration: z.string().min(1, 'Duration is required'),
  // isNewCustomer: z.boolean().optional(),
});

// You might also want to export the type for use in your form component
export type FormSchemaType = z.infer<typeof formSchema>;
