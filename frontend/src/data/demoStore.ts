import type { PropertyListing } from './listings';

export type DemoRole = 'tenant' | 'landlord' | 'agent';

export type DemoAccount = {
  id: string;
  role: DemoRole;
  name: string;
  email: string;
  phone: string;
};

export type DemoApartment = {
  id: string;
  landlordId: string;
  title: string;
  location: string;
  neighborhood: string;
  state: string;
  propertyType: string;
  rent: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  occupantId: string | null;
};

export type DemoRequest = {
  id: string;
  apartmentId: string;
  tenantId: string;
  status: 'pending' | 'accepted' | 'declined';
};

export type DemoState = {
  accounts: DemoAccount[];
  apartments: DemoApartment[];
  requests: DemoRequest[];
  activeAccountId: string | null;
};

const storageKey = 'dwellsafe-demo-state-v1';

function isDemoState(value: unknown): value is DemoState {
  if (typeof value !== 'object' || value === null) return false;
  const state = value as Record<string, unknown>;
  return Array.isArray(state.accounts)
    && state.accounts.every((account) => typeof account === 'object' && account !== null
      && typeof account.id === 'string'
      && (account.role === 'tenant' || account.role === 'landlord' || account.role === 'agent')
      && typeof account.name === 'string'
      && typeof account.email === 'string'
      && typeof account.phone === 'string')
    && Array.isArray(state.apartments)
    && state.apartments.every((apartment) => typeof apartment === 'object' && apartment !== null
      && typeof apartment.id === 'string'
      && typeof apartment.landlordId === 'string'
      && typeof apartment.title === 'string'
      && typeof apartment.location === 'string'
      && typeof apartment.neighborhood === 'string'
      && typeof apartment.state === 'string'
      && typeof apartment.propertyType === 'string'
      && typeof apartment.rent === 'number'
      && typeof apartment.bedrooms === 'number'
      && typeof apartment.bathrooms === 'number'
      && typeof apartment.description === 'string'
      && (apartment.occupantId === null || typeof apartment.occupantId === 'string'))
    && Array.isArray(state.requests)
    && state.requests.every((request) => typeof request === 'object' && request !== null
      && typeof request.id === 'string'
      && typeof request.apartmentId === 'string'
      && typeof request.tenantId === 'string'
      && (request.status === 'pending' || request.status === 'accepted' || request.status === 'declined'))
    && (typeof state.activeAccountId === 'string' || state.activeAccountId === null);
}

export function readDemoState(): DemoState {
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return { accounts: [], apartments: [], requests: [], activeAccountId: null };

  const state: unknown = JSON.parse(saved);
  if (!isDemoState(state)) {
    throw new Error('Saved demo data is invalid. Clear this site’s local storage to restart the demo.');
  }
  return state;
}

export function writeDemoState(state: DemoState) {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
}

export function activeDemoAccount(state: DemoState) {
  return state.accounts.find((account) => account.id === state.activeAccountId) ?? null;
}

export function createDemoAccount(account: Omit<DemoAccount, 'id'>) {
  const state = readDemoState();
  if (state.accounts.some((saved) => saved.email.toLowerCase() === account.email.toLowerCase())) {
    throw new Error('An account with this email already exists in this browser. Sign in or use another email.');
  }

  const created = { ...account, id: crypto.randomUUID() };
  writeDemoState({
    ...state,
    accounts: [...state.accounts, created],
    activeAccountId: created.id,
  });
  return created;
}

export function signInDemoAccount(email: string) {
  const state = readDemoState();
  const account = state.accounts.find((saved) => saved.email.toLowerCase() === email.toLowerCase());
  if (!account) throw new Error('No demo account was found for this email in this browser.');
  writeDemoState({ ...state, activeAccountId: account.id });
  return account;
}

export function signOutDemoAccount() {
  const state = readDemoState();
  writeDemoState({ ...state, activeAccountId: null });
}

export function addDemoApartment(apartment: Omit<DemoApartment, 'id' | 'occupantId'>) {
  const state = readDemoState();
  const created: DemoApartment = {
    ...apartment,
    id: crypto.randomUUID(),
    occupantId: null,
  };
  writeDemoState({ ...state, apartments: [...state.apartments, created] });
  return created;
}

export function requestDemoApartment(apartmentId: string, tenantId: string) {
  const state = readDemoState();
  const apartment = state.apartments.find((saved) => saved.id === apartmentId);
  if (!apartment || apartment.occupantId) throw new Error('This apartment is no longer available.');
  if (state.apartments.some((saved) => saved.occupantId === tenantId)) {
    throw new Error('Your demo account already has an assigned apartment.');
  }
  if (state.requests.some((request) => request.apartmentId === apartmentId && request.tenantId === tenantId)) {
    throw new Error('You have already requested this apartment.');
  }

  const created: DemoRequest = {
    id: crypto.randomUUID(),
    apartmentId,
    tenantId,
    status: 'pending',
  };
  writeDemoState({ ...state, requests: [...state.requests, created] });
}

export function respondToDemoRequest(requestId: string, status: 'accepted' | 'declined') {
  const state = readDemoState();
  const request = state.requests.find((saved) => saved.id === requestId && saved.status === 'pending');
  if (!request) throw new Error('This request is no longer pending.');

  const apartment = state.apartments.find((saved) => saved.id === request.apartmentId);
  if (!apartment || apartment.occupantId) throw new Error('This apartment is no longer available.');
  if (status === 'accepted' && state.apartments.some((saved) => saved.occupantId === request.tenantId)) {
    throw new Error('This tenant already has an assigned apartment.');
  }

  const requests = state.requests.map((saved) => {
    if (saved.id === requestId) return { ...saved, status };
    if (status === 'accepted' && saved.apartmentId === apartment.id && saved.status === 'pending') {
      return { ...saved, status: 'declined' as const };
    }
    return saved;
  });
  const apartments = status === 'accepted'
    ? state.apartments.map((saved) => saved.id === apartment.id ? { ...saved, occupantId: request.tenantId } : saved)
    : state.apartments;
  writeDemoState({ ...state, requests, apartments });
}

export function demoApartmentListing(apartment: DemoApartment): PropertyListing {
  return {
    id: apartment.id,
    title: apartment.title,
    location: apartment.location,
    neighborhood: apartment.neighborhood,
    state: apartment.state,
    propertyType: apartment.propertyType,
    rent: apartment.rent,
    bedrooms: apartment.bedrooms,
    bathrooms: apartment.bathrooms,
    furnishing: 'Not specified',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80',
    imageAlt: 'Sample apartment interior',
    description: apartment.description,
    relevance: 0,
  };
}
