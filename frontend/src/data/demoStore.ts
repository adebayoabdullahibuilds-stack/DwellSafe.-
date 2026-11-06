import type { PropertyListing } from './listings';

export type DemoRole = 'tenant' | 'landlord' | 'agent';

export type DemoAccount = {
  id: string;
  role: DemoRole;
  name: string;
  email: string;
  phone: string;
  agentOnboardingMethod: 'self' | 'landlord' | null;
  agentOnboardingStatus: 'pending' | 'verified' | 'rejected' | null;
  verifyingLandlordId: string | null;
  identityDocumentType: DemoIdentityDocumentType | null;
  identityStatus: 'not-submitted' | 'pending';
};

export type DemoIdentityDocumentType = 'nin' | 'voters-card' | 'drivers-license';

export type DemoApartment = {
  id: string;
  landlordId: string;
  agentId: string | null;
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
  agentId: string | null;
  status: 'pending' | 'accepted' | 'declined';
};

export type DemoAgentRating = {
  id: string;
  requestId: string;
  agentId: string;
  tenantId: string;
  score: number;
};

export type DemoState = {
  accounts: DemoAccount[];
  apartments: DemoApartment[];
  requests: DemoRequest[];
  ratings: DemoAgentRating[];
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
      && typeof account.phone === 'string'
      && (account.agentOnboardingMethod === undefined || account.agentOnboardingMethod === null || account.agentOnboardingMethod === 'self' || account.agentOnboardingMethod === 'landlord')
      && (account.agentOnboardingStatus === undefined || account.agentOnboardingStatus === null || account.agentOnboardingStatus === 'pending' || account.agentOnboardingStatus === 'verified' || account.agentOnboardingStatus === 'rejected')
      && (account.verifyingLandlordId === undefined || account.verifyingLandlordId === null || typeof account.verifyingLandlordId === 'string')
      && (account.identityDocumentType === undefined || account.identityDocumentType === null || account.identityDocumentType === 'nin' || account.identityDocumentType === 'voters-card' || account.identityDocumentType === 'drivers-license')
      && (account.identityStatus === undefined || account.identityStatus === 'not-submitted' || account.identityStatus === 'pending'))
    && Array.isArray(state.apartments)
    && state.apartments.every((apartment) => typeof apartment === 'object' && apartment !== null
      && typeof apartment.id === 'string'
      && typeof apartment.landlordId === 'string'
      && (apartment.agentId === undefined || apartment.agentId === null || typeof apartment.agentId === 'string')
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
      && (request.agentId === undefined || request.agentId === null || typeof request.agentId === 'string')
      && (request.status === 'pending' || request.status === 'accepted' || request.status === 'declined'))
    && (state.ratings === undefined || (Array.isArray(state.ratings) && state.ratings.every((rating) => typeof rating === 'object' && rating !== null
      && typeof rating.id === 'string'
      && typeof rating.requestId === 'string'
      && typeof rating.agentId === 'string'
      && typeof rating.tenantId === 'string'
      && Number.isInteger(rating.score)
      && Number(rating.score) >= 1
      && Number(rating.score) <= 5)))
    && (typeof state.activeAccountId === 'string' || state.activeAccountId === null);
}

export function readDemoState(): DemoState {
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return { accounts: [], apartments: [], requests: [], ratings: [], activeAccountId: null };

  const state: unknown = JSON.parse(saved);
  if (!isDemoState(state)) {
    throw new Error('Saved demo data is invalid. Clear this site’s local storage to restart the demo.');
  }
  return {
    ...state,
    accounts: state.accounts.map((account) => ({
      ...account,
      agentOnboardingMethod: account.agentOnboardingMethod ?? null,
      agentOnboardingStatus: account.agentOnboardingStatus ?? null,
      verifyingLandlordId: account.verifyingLandlordId ?? null,
      identityDocumentType: account.identityDocumentType ?? null,
      identityStatus: account.identityStatus ?? 'not-submitted',
    })),
    apartments: state.apartments.map((apartment) => ({ ...apartment, agentId: apartment.agentId ?? null })),
    requests: state.requests.map((request) => ({ ...request, agentId: request.agentId ?? null })),
    ratings: state.ratings ?? [],
  };
}

export function writeDemoState(state: DemoState) {
  window.localStorage.setItem(storageKey, JSON.stringify(state));
}

export function activeDemoAccount(state: DemoState) {
  return state.accounts.find((account) => account.id === state.activeAccountId) ?? null;
}

export function createDemoAccount(account: Omit<DemoAccount, 'id' | 'identityDocumentType' | 'identityStatus'>) {
  const state = readDemoState();
  if (state.accounts.some((saved) => saved.email.toLowerCase() === account.email.toLowerCase())) {
    throw new Error('An account with this email already exists in this browser. Sign in or use another email.');
  }

  const created: DemoAccount = {
    ...account,
    id: crypto.randomUUID(),
    identityDocumentType: null,
    identityStatus: 'not-submitted',
  };
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

export function submitDemoIdentity(accountId: string, documentType: DemoIdentityDocumentType) {
  const state = readDemoState();
  const account = state.accounts.find((saved) => saved.id === accountId);
  if (!account) throw new Error('This demo account could not be found.');

  writeDemoState({
    ...state,
    accounts: state.accounts.map((saved) => saved.id === accountId
      ? { ...saved, identityDocumentType: documentType, identityStatus: 'pending' }
      : saved),
  });
}

export function reviewDemoAgent(landlordId: string, agentId: string, status: 'verified' | 'rejected') {
  const state = readDemoState();
  const landlord = state.accounts.find((saved) => saved.id === landlordId && saved.role === 'landlord');
  const agent = state.accounts.find((saved) => saved.id === agentId && saved.role === 'agent');
  if (!landlord || !agent) throw new Error('The landlord or agent account could not be found.');
  if (agent.verifyingLandlordId && agent.verifyingLandlordId !== landlordId) {
    throw new Error('Only the landlord selected by this agent can review this onboarding request.');
  }

  writeDemoState({
    ...state,
    accounts: state.accounts.map((saved) => saved.id === agentId
      ? { ...saved, agentOnboardingStatus: status, verifyingLandlordId: landlordId }
      : saved),
  });
}

export function assignDemoAgent(landlordId: string, apartmentId: string, agentId: string | null) {
  const state = readDemoState();
  const apartment = state.apartments.find((saved) => saved.id === apartmentId && saved.landlordId === landlordId);
  if (!apartment) throw new Error('This apartment is not in your portfolio.');
  if (agentId) {
    const agent = state.accounts.find((saved) => saved.id === agentId && saved.role === 'agent');
    if (!agent || agent.agentOnboardingStatus !== 'verified') {
      throw new Error('Only a landlord-verified agent can be assigned to an apartment.');
    }
  }

  writeDemoState({
    ...state,
    apartments: state.apartments.map((saved) => saved.id === apartmentId ? { ...saved, agentId } : saved),
  });
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
    agentId: apartment.agentId,
    status: 'pending',
  };
  writeDemoState({ ...state, requests: [...state.requests, created] });
}

export function rateDemoAgent(requestId: string, tenantId: string, score: number) {
  const state = readDemoState();
  const request = state.requests.find((saved) => saved.id === requestId && saved.tenantId === tenantId);
  if (!request || request.status !== 'accepted' || !request.agentId) {
    throw new Error('Only tenants with an accepted request involving an agent can leave a rating.');
  }
  if (!Number.isInteger(score) || score < 1 || score > 5) throw new Error('Choose a rating from 1 to 5 stars.');
  if (state.ratings.some((rating) => rating.requestId === requestId)) {
    throw new Error('You have already rated this agent for this request.');
  }

  writeDemoState({
    ...state,
    ratings: [...state.ratings, {
      id: crypto.randomUUID(),
      requestId,
      agentId: request.agentId,
      tenantId,
      score,
    }],
  });
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
