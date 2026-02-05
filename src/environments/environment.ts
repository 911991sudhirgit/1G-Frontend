/**
 * Development environment.
 * OTP is sent by the backend via MSG91 (configure MSG91 in backend; see MSG91_CREDENTIALS.md in project root).
 */
export const environment = {
  production: false,
  apiUrl: 'https://og-backend-ec80a37e82c0.herokuapp.com/api',
  googleMapsApiKey: '', // Optional: set for map and drop-pin
};
