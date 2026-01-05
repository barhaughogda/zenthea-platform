import { PatientProfileService, PatientProfile, AppointmentService } from '../lib/contracts/patient';

export const mockPatientProfile: PatientProfile = {
  gender: 'other',
  primaryLanguage: 'en',
  email: 'patient@example.com',
  phone: '1234567890',
  emergencyContacts: [
    { name: 'Emergency Contact', phone: '0987654321', relationship: 'Other', isPrimary: true }
  ],
  medications: [],
  dateOfBirth: '1990-01-01',
  primaryProviderId: 'mock-provider-id',
  preferredName: 'Mock',
  genderIdentity: 'other',
  preferredPronouns: 'they/them',
  maritalStatus: 'single',
  occupation: 'tester',
  race: 'other',
  ethnicity: 'other',
  cellPhone: '1234567890',
  workPhone: '',
  address: {
    street: '123 Mock St',
    city: 'Mock City',
    state: 'MC',
    zipCode: '12345',
  },
  medicalHistory: {
    chronicConditions: []
  },
  allergies: {
    medications: []
  },
  insurance: {
    primary: {
      provider: 'Mock Insurance',
      policyNumber: '12345',
      subscriberName: 'Mock Patient',
    }
  },
  settings: {
    timezone: 'UTC',
  },
  preferredClinicId: 'mock-clinic-id',
  timezone: 'UTC',
};

export const mockPatientProfileService: PatientProfileService = {
  getProfile: (_patientId: string) => ({
    patientId: 'mock-patient-id',
    patientProfile: mockPatientProfile,
    isLoading: false,
  }),
};

export const mockAppointmentService: AppointmentService = {
  getAppointments: (_patientId: string) => ({
    appointments: [],
    isLoading: false,
    patientId: 'mock-patient-id',
  }),
};
