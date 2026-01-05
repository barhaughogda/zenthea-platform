export const validatePatientData = (data: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => ({ success: true, data });
export const validatePasswordComplexity = (_password: string) => true;
export const getPasswordComplexityErrorMessage = (_password?: string) => '';
