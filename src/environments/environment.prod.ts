/**
 * Production environment.
 * Backend API: set here or override at runtime via /config.json (Heroku: set API_URL on frontend app).
 */
export const environment = {
  production: true,
  apiUrl: 'https://og-backend-ec80a37e82c0.herokuapp.com/api',
  googleMapsApiKey: '', // Optional: set in build/env for production
};
