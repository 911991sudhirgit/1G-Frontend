/**
 * Production environment.
 * OTP is sent by the backend via MSG91 (configure MSG91 in backend; see MSG91_CREDENTIALS.md).
 */
export const environment = {
  production: true,
  apiUrl: '/api',
  googleMapsApiKey: '', // Optional: set in build/env for production
};
