export interface PatientProfile {
  gender: string;
  primaryLanguage: string;
  email: string;
  phone: string;
  emergencyContacts: Array<{
    name: string;
    phone: string;
    relationship: string;
    isPrimary: boolean;
  }>;
  medications: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */[];
  dateOfBirth: string;
  primaryProviderId: string;
  preferredName: string;
  genderIdentity: string;
  preferredPronouns: string;
  maritalStatus: string;
  occupation: string;
  race: string;
  ethnicity: string;
  cellPhone: string;
  workPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  medicalHistory: {
    chronicConditions: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */[];
  };
  allergies: {
    medications: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */[];
  };
  insurance: {
    primary: {
      provider: string;
      policyNumber: string;
      subscriberName: string;
    };
  };
  settings: {
    timezone: string;
  };
  preferredClinicId: string;
  timezone: string;
}

export interface PatientProfileService {
  getProfile(patientId: string): {
    patientId: string;
    patientProfile: PatientProfile;
    isLoading: boolean;
  };
}

export interface Appointment {
  id: string;
  date?: string;
  time: string;
  provider: string | { id: string; name: string; specialty: string };
  type?: string;
  title?: string;
  status: string;
  location?: string;
  locationId?: string;
  providerId?: string;
  duration?: string;
  durationMinutes?: number;
  notes?: string;
}

export interface AppointmentService {
  getAppointments(patientId: string): {
    appointments: Appointment[];
    isLoading: boolean;
    patientId: string;
  };
}
