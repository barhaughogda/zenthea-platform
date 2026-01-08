/* eslint-disable */
export const useClinics = () => ({ clinics: [], isLoading: false, error: null });
export const useClinicProfile = () => ({ 
  data: null, 
  tenantData: null, 
  tenantId: null, 
  isLoading: false, 
  hasError: false, 
  canQuery: false,
  error: null,
  updateTenantProfile: async () => {},
  uploadLogo: async () => {},
  uploadFavicon: async () => {},
  updateBranding: async () => {}
});
