import { z } from 'zod';

export const AppointmentStatusSchema = z.enum([
  'proposed',
  'pending',
  'confirmed',
  'scheduled',
  'completed',
  'cancelled',
]);

export type AppointmentStatus = z.infer<typeof AppointmentStatusSchema>;

export const AppointmentProviderSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  specialty: z.string().optional(),
});

export const AppointmentSchema = z.object({
  id: z.string().uuid(),
  patientId: z.string().uuid(),
  providerId: z.string().uuid(),
  provider: z.union([z.string(), AppointmentProviderSchema]),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  status: AppointmentStatusSchema,
  type: z.string().optional(),
  title: z.string().optional(),
  location: z.string().optional(),
  locationId: z.string().uuid().optional(),
  durationMinutes: z.number().optional(),
  notes: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional(),
});

export type Appointment = z.infer<typeof AppointmentSchema>;

export const AppointmentListSchema = z.array(AppointmentSchema);
export type AppointmentList = z.infer<typeof AppointmentListSchema>;
