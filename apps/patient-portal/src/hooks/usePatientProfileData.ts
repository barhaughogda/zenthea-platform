import { mockPatientProfileService } from '@/mocks/patient';

export const usePatientProfileData = () => {
  return mockPatientProfileService.getProfile('mock-patient-id');
};
