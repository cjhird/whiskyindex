export const AUTH_COOKIE = 'wi_session';
export const DEMO_EMAIL = 'collector@whiskyindex.com';

export type MockUser = {
  email: string;
  name: string;
};

export const demoUser: MockUser = {
  email: DEMO_EMAIL,
  name: 'Demo Collector',
};
