// Configuration et constantes de l'application
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://projetbooklite-backend.onrender.com',
  ENDPOINTS: {
    AUTH: '/api/auth',
    PRODUCTS: '/api/products',
    ORDERS: '/api/orders',
    USERS: '/api/users',
    CONTACT: '/api/contact',
    VERSION: '/api/version'
  }
} as const;

export const SOCIAL_LINKS = {
  TWITTER: 'https://twitter.com/booklite',
  LINKEDIN: 'https://linkedin.com/company/booklite',
  GITHUB: 'https://github.com/booklite',
} as const;

export const CONTACT_INFO = {
  EMAIL: 'contact@booklite.app',
  PHONE: '+224 123 456 789',
  ADDRESS: 'Labé, Guinée',
} as const;

export const APP_CONFIG = {
  COMPANY_NAME: 'Booklite',
  CURRENT_YEAR: new Date().getFullYear(),
  TESTIMONIAL_INTERVAL: 7000, // ms
  COUNT_UP_DURATION: 2000, // ms
} as const;

export const COOKIE_KEYS = {
  CONSENT: 'cookiesAccepted',
  CONSENT_DATE: 'cookiesConsentDate',
} as const;