import { useEffect, useMemo, useState } from 'react';
import { listings, type PropertyListing } from './data/listings';
import {
  activeDemoAccount,
  demoApartmentListing,
  readDemoState,
  requestDemoApartment,
  type DemoState,
} from './data/demoStore';
import { DashboardPage } from './components/Dashboard';
import { BrandLink } from './components/Brand';
import {
  AuthPage,
  type AuthRoute,
} from './components/AuthPages';

type Filters = {
  search: string;
  location: string;
  propertyType: string;
  minRent: string;
  maxRent: string;
  sort: string;
};

const emptyFilters: Filters = {
  search: '',
  location: '',
  propertyType: '',
  minRent: '',
  maxRent: '',
  sort: 'relevance',
};

const locations = ['Lekki', 'Yaba', 'Ikeja', 'Surulere', 'Abuja', 'Ibadan'];
const propertyTypes = ['Self-contained', 'Mini flat', '2-bedroom flat', '3-bedroom flat', 'Duplex'];

function readFiltersFromUrl(): Filters {
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get('search') ?? '',
    location: params.get('location') ?? '',
    propertyType: params.get('type') ?? '',
    minRent: params.get('minRent') ?? '',
    maxRent: params.get('maxRent') ?? '',
    sort: params.get('sort') ?? 'relevance',
  };
}

function updateUrl(filters: Filters) {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.location) params.set('location', filters.location);
  if (filters.propertyType) params.set('type', filters.propertyType);
  if (filters.minRent) params.set('minRent', filters.minRent);
  if (filters.maxRent) params.set('maxRent', filters.maxRent);
  if (filters.sort !== 'relevance') params.set('sort', filters.sort);
  const query = params.toString();
  window.history.replaceState({}, '', `${window.location.pathname}${query ? `?${query}` : ''}`);
}

function formatNaira(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <BrandLink />
        <button
          className="mobile-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
          <span />
        </button>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
          <a href="/properties" onClick={() => setMenuOpen(false)}>Discover properties</a>
          <a href="/#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="/#for-landlords" onClick={() => setMenuOpen(false)}>For landlords</a>
          <a href="/#for-agents" onClick={() => setMenuOpen(false)}>For agents</a>
          <div className="mobile-nav-actions">
            <a className="button button-outline" href="/login">Sign in</a>
            <a className="button button-primary" href="/register">Get started</a>
          </div>
        </nav>
        <div className="header-actions">
          <a className="sign-in-link" href="/login">Sign in</a>
          <a className="button button-primary header-cta" href="/register">Get started</a>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <BrandLink />
          <p>Clearer property information for renters, landlords, and agents across Nigeria.</p>
        </div>
        <div className="footer-links-group">
          <strong>Explore</strong>
          <a href="/properties">Discover properties</a>
          <a href="/#how-it-works">How it works</a>
        </div>
        <div className="footer-links-group">
          <strong>For professionals</strong>
          <a href="/register/landlord">Landlords</a>
          <a href="/register/agent">Agents</a>
          <a href="/login">Sign in</a>
        </div>
        <div className="footer-links-group">
          <strong>Support</strong>
          <a href="mailto:support@dwellsafe.ng">Contact support</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
        </div>
        <p className="footer-note">© {new Date().getFullYear()} DwellSafe. Verification is a helpful check, not a guarantee of a risk-free transaction.</p>
      </div>
    </footer>
  );
}

function DemoBadge() {
  return <span className="demo-badge"><span aria-hidden="true">●</span> Demo listing</span>;
}

function PropertyCard({ listing, action }: { listing: PropertyListing; action?: React.ReactNode }) {
  return (
    <article className="property-card">
      <a className="property-image-link" href={`/properties/${listing.id}`} aria-label={`View ${listing.title}`}>
        <img className="property-image" src={listing.image} alt={listing.imageAlt} loading="lazy" />
        <DemoBadge />
        <span className="image-location">{listing.neighborhood}</span>
      </a>
      <div className="property-card-body">
        <div className="property-card-heading">
          <div>
            <p className="property-type">{listing.propertyType}</p>
            <h3><a href={`/properties/${listing.id}`}>{listing.title}</a></h3>
          </div>
          <span className="verification-pending">Pending verification</span>
        </div>
        <p className="property-address">{listing.location}, {listing.state}</p>
        <div className="property-facts">
          <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</span>
          <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'bath' : 'baths'}</span>
          <span>{listing.furnishing}</span>
        </div>
        <div className="property-card-bottom">
          <p className="property-price">{formatNaira(listing.rent)} <span>/ year</span></p>
          <a className="text-link" href={`/properties/${listing.id}`}>View details <span aria-hidden="true">→</span></a>
        </div>
        {action}
      </div>
    </article>
  );
}

function SearchForm() {
  return (
    <form className="home-search" action="/properties" method="get">
      <label className="search-field search-location">
        <span>Where do you want to live?</span>
        <select name="location" defaultValue="">
          <option value="">All locations</option>
          {locations.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label className="search-field">
        <span>Property type</span>
        <select name="type" defaultValue="">
          <option value="">Any type</option>
          {propertyTypes.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <label className="search-field">
        <span>Maximum yearly rent</span>
        <select name="maxRent" defaultValue="">
          <option value="">Any budget</option>
          <option value="2000000">Up to ₦2m</option>
          <option value="5000000">Up to ₦5m</option>
          <option value="10000000">Up to ₦10m</option>
          <option value="20000000">Up to ₦20m</option>
        </select>
      </label>
      <button className="button button-primary search-submit" type="submit">
        <span aria-hidden="true">⌕</span> Search homes
      </button>
    </form>
  );
}

function HomePage() {
  const featured = listings.slice(0, 3);

  return (
    <>
      <Header />
      <main>
        <section className="hero-section">
          <div className="hero-content">
            <p className="eyebrow"><span className="eyebrow-dot" /> A clearer way to find home</p>
            <h1>Find a home you can feel <em>good about.</em></h1>
            <p className="hero-copy">Explore rental homes across Nigeria with clear details and honest information about what has — and hasn’t — been checked.</p>
            <div className="hero-assurance"><span className="assurance-icon" aria-hidden="true">✓</span> See listing details. Understand verification. Decide with confidence.</div>
            <a className="hero-discover-link" href="/properties">Discover homes <span aria-hidden="true">→</span></a>
          </div>
          <div className="hero-photo">
            <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=85" alt="Bright, welcoming living room in a modern rental home" />
            <div className="photo-caption"><span className="photo-caption-dot" /> Thoughtful homes. Clearer choices.</div>
          </div>
        </section>

        <section className="search-section" aria-label="Search available properties">
          <SearchForm />
        </section>

        <section className="popular-section section-wrap">
          <div className="section-heading compact-heading">
            <div><p className="eyebrow">Start somewhere familiar</p><h2>Popular places to call home</h2></div>
            <a className="text-link" href="/properties">Explore all locations <span aria-hidden="true">→</span></a>
          </div>
          <div className="location-list">
            {locations.map((place, index) => (
              <a className="location-chip" key={place} href={`/properties?location=${encodeURIComponent(place)}`}>
                <span className={`location-mark location-mark-${index}`} aria-hidden="true">{place.slice(0, 1)}</span>
                <span>{place}</span>
                <span className="location-arrow" aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </section>

        <section className="featured-section section-wrap">
          <div className="section-heading">
            <div><p className="eyebrow">A few places to explore</p><h2>Featured rental homes</h2><p className="section-description">A sample of the kinds of homes you can discover on DwellSafe.</p></div>
            <a className="button button-outline" href="/properties">Browse all homes <span aria-hidden="true">→</span></a>
          </div>
          <p className="demo-disclaimer"><DemoBadge /> Every home shown is sample data for demonstration only. These are not real listings.</p>
          <div className="property-grid">
            {featured.map((listing) => <PropertyCard key={listing.id} listing={listing} />)}
          </div>
        </section>

        <section className="verification-section" id="how-it-works">
          <div className="verification-inner">
            <div className="verification-copy">
              <p className="eyebrow">Trust, with transparency</p>
              <h2>Know what a verification badge actually means.</h2>
              <p>We want you to see the status of checks clearly — not guess what a badge promises. Verification is a process, not a guarantee about your whole rental experience.</p>
              <a className="text-link" href="/properties">Explore sample listings <span aria-hidden="true">→</span></a>
            </div>
            <div className="verification-steps">
              <div className="verification-step">
                <span className="step-number">01</span>
                <div><h3>Discover a property</h3><p>Compare rent, location, and the details provided for each home.</p></div>
                <span className="verification-pending">Demo examples</span>
              </div>
              <div className="verification-step">
                <span className="step-number">02</span>
                <div><h3>Understand who represents it</h3><p>Check whether a landlord or agent is named and what authority they describe.</p></div>
                <span className="verification-review">Details matter</span>
              </div>
              <div className="verification-step">
                <span className="step-number">03</span>
                <div><h3>Read the verification status</h3><p>Pending means checks are incomplete. Verified should only mean specified checks are genuinely complete.</p></div>
                <span className="verification-not-done">Not a guarantee</span>
              </div>
            </div>
            <div className="verification-caveat">
              <strong>Verification has limits.</strong> It does not guarantee current availability, property condition, legal title, or a risk-free transaction. Confirm details independently and inspect before paying. All current listings on DwellSafe are fictional demo data and have not been checked.
            </div>
          </div>
        </section>

        <section className="trust-section section-wrap" id="about">
          <div className="section-heading trust-heading">
            <div><p className="eyebrow">A marketplace built around people</p><h2>One marketplace. A clearer path for everyone.</h2></div>
            <p className="section-description">Renters can discover sample homes. Landlords and agents can start their professional onboarding journey.</p>
          </div>
          <div className="trust-cards">
            <article className="trust-card renter-card">
              <div className="trust-icon" aria-hidden="true">⌂</div>
              <p className="eyebrow">For renters</p>
              <h3>Find a place with clearer information.</h3>
              <p>Compare rent, location, and property facts, then see verification status without mistaking sample content for a real home.</p>
              <a className="text-link" href="/properties">Find a home <span aria-hidden="true">→</span></a>
            </article>
            <article className="trust-card agent-card" id="for-landlords">
              <div className="trust-icon" aria-hidden="true">⌂</div>
              <p className="eyebrow">For landlords</p>
              <h3>Represent your property with confidence.</h3>
              <p>Start with an account, complete your profile, and prepare ownership or authorization evidence for future property checks.</p>
              <a className="text-link" href="/register/landlord">Get started as a landlord <span aria-hidden="true">→</span></a>
            </article>
            <article className="trust-card agent-card" id="for-agents">
              <div className="trust-icon" aria-hidden="true">↗</div>
              <p className="eyebrow">For agents</p>
              <h3>Build trust through clear representation.</h3>
              <p>Share your operating areas and prepare identity or property-representation evidence for applicable checks.</p>
              <a className="text-link" href="/register/agent">Get started as an agent <span aria-hidden="true">→</span></a>
            </article>
          </div>
        </section>

        <section className="closing-cta">
          <div><p className="eyebrow">A clearer start for every move</p><h2>Find a home or get started as a professional.</h2><p>Choose the path that fits where you are today.</p></div>
          <div className="closing-actions">
            <a className="button button-light" href="/properties">Explore rental homes <span aria-hidden="true">→</span></a>
            <a className="button button-cta-outline" href="/register/landlord">Landlord registration</a>
            <a className="button button-cta-outline" href="/register/agent">Agent registration</a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ListingsPage() {
  const [filters, setFilters] = useState<Filters>(readFiltersFromUrl);
  const [demoState, setDemoState] = useState<DemoState>(() => readDemoState());
  const [requestMessage, setRequestMessage] = useState('');
  const account = activeDemoAccount(demoState);
  const landlordApartments = demoState.apartments.filter((apartment) => apartment.occupantId === null);
  const availableListings = [...listings, ...landlordApartments.map(demoApartmentListing)];

  useEffect(() => {
    const handlePopState = () => setFilters(readFiltersFromUrl());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const filteredListings = useMemo(() => {
    const searchTerm = filters.search.trim().toLowerCase();
    const results = availableListings.filter((listing) => {
      const matchesSearch = !searchTerm || `${listing.title} ${listing.location} ${listing.neighborhood} ${listing.state} ${listing.propertyType}`.toLowerCase().includes(searchTerm);
      const matchesLocation = !filters.location || listing.location.toLowerCase() === filters.location.toLowerCase();
      const matchesType = !filters.propertyType || listing.propertyType === filters.propertyType;
      const minRent = filters.minRent ? Number(filters.minRent) : 0;
      const maxRent = filters.maxRent ? Number(filters.maxRent) : Number.POSITIVE_INFINITY;
      return matchesSearch && matchesLocation && matchesType && listing.rent >= minRent && listing.rent <= maxRent;
    });

    if (filters.sort === 'price-low') return results.sort((a, b) => a.rent - b.rent);
    if (filters.sort === 'price-high') return results.sort((a, b) => b.rent - a.rent);
    return results.sort((a, b) => b.relevance - a.relevance);
  }, [filters, demoState.apartments]);

  const setFilter = (key: keyof Filters, value: string) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    updateUrl(next);
  };

  const clearFilters = () => {
    setFilters(emptyFilters);
    updateUrl(emptyFilters);
  };

  return (
    <>
      <Header />
      <main className="listings-page section-wrap">
        <div className="listings-heading">
        <div><p className="eyebrow">Find your next place</p><h1>Homes for rent in Nigeria</h1><p>Browse demo rentals by category, location, and budget.</p></div>
          <div className="result-count"><strong>{filteredListings.length}</strong><span>{filteredListings.length === 1 ? 'sample home' : 'sample homes'}</span></div>
        </div>
        <p className="demo-disclaimer listings-disclaimer"><DemoBadge /> These listings are fictional demonstration data, not real homes or agent offers.</p>
        <div className="listings-layout">
          <aside className="filter-panel" aria-label="Filter properties">
            <div className="filter-panel-heading"><h2>Filter homes</h2><button className="clear-filters" type="button" onClick={clearFilters}>Clear all</button></div>
            <label className="filter-field">
              <span>Search by keyword</span>
              <input type="search" placeholder="Area, city or keyword" value={filters.search} onChange={(event) => setFilter('search', event.target.value)} />
            </label>
            <label className="filter-field">
              <span>Location</span>
              <select value={filters.location} onChange={(event) => setFilter('location', event.target.value)}>
                <option value="">All locations</option>
                {[...new Set([...locations, ...landlordApartments.map((apartment) => apartment.location)])].map((location) => <option key={location} value={location}>{location}</option>)}
              </select>
            </label>
            <label className="filter-field">
              <span>Property type</span>
              <select value={filters.propertyType} onChange={(event) => setFilter('propertyType', event.target.value)}>
                <option value="">All types</option>
                {[...new Set([...propertyTypes, ...landlordApartments.map((apartment) => apartment.propertyType)])].map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
            <fieldset className="rent-filter">
              <legend>Yearly rent (₦)</legend>
              <label className="filter-field"><span>Minimum rent</span><input inputMode="numeric" type="number" min="0" placeholder="No minimum" value={filters.minRent} onChange={(event) => setFilter('minRent', event.target.value)} /></label>
              <label className="filter-field"><span>Maximum rent</span><input inputMode="numeric" type="number" min="0" placeholder="No maximum" value={filters.maxRent} onChange={(event) => setFilter('maxRent', event.target.value)} /></label>
            </fieldset>
            <div className="filter-trust-note"><span aria-hidden="true">ⓘ</span><p>Demo data is used on this page. No properties shown here have been verified.</p></div>
          </aside>
          <section className="results-section" aria-live="polite">
            <div className="results-toolbar">
              <p><strong>{filteredListings.length}</strong> {filteredListings.length === 1 ? 'home' : 'homes'} found</p>
              <label className="sort-control"><span>Sort by</span><select value={filters.sort} onChange={(event) => setFilter('sort', event.target.value)}><option value="relevance">Relevance</option><option value="price-low">Rent: low to high</option><option value="price-high">Rent: high to low</option></select></label>
            </div>
            {requestMessage && <div className="form-alert form-alert-warning" role="status">{requestMessage}</div>}
            {filteredListings.length ? (
              <div className="property-grid">
                {filteredListings.map((listing) => {
                  const apartment = landlordApartments.find((saved) => saved.id === listing.id);
                  const previousRequest = apartment && account
                    ? demoState.requests.find((request) => request.apartmentId === apartment.id && request.tenantId === account.id)
                    : undefined;
                  let action: React.ReactNode;
                  if (apartment && account?.role === 'tenant') {
                    if (previousRequest) {
                      action = <p className={`request-status is-${previousRequest.status}`}>Request {previousRequest.status}</p>;
                    } else {
                      action = <button className="button button-primary property-request-button" type="button" onClick={() => {
                        try {
                          requestDemoApartment(apartment.id, account.id);
                          setDemoState(readDemoState());
                          setRequestMessage('Request sent to the landlord. You can track it from your tenant dashboard.');
                        } catch (error) {
                          setRequestMessage(error instanceof Error ? error.message : 'Could not send this demo request.');
                        }
                      }}>Request this apartment</button>;
                    }
                  } else if (apartment && !account) {
                    action = <a className="button button-outline property-request-button" href="/register/tenant">Create a tenant demo account to request</a>;
                  } else if (apartment && account?.role !== 'tenant') {
                    action = <a className="button button-outline property-request-button" href="/login">Sign in as a tenant to request</a>;
                  }
                  return <PropertyCard key={listing.id} listing={listing} action={action} />;
                })}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-state-icon" aria-hidden="true">⌕</span>
                <h2>No homes match those filters</h2>
                <p>Try a different location or rent range, or clear your filters to see all sample homes.</p>
                <button className="button button-primary" type="button" onClick={clearFilters}>Clear all filters</button>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

function PropertyDetailPage({ listing }: { listing: PropertyListing }) {
  return (
    <>
      <Header />
      <main className="detail-page section-wrap">
        <a className="back-link" href="/properties">← Back to homes</a>
        <div className="detail-image-wrap">
          <img src={listing.image} alt={listing.imageAlt} />
          <DemoBadge />
        </div>
        <div className="detail-content">
          <div>
            <p className="eyebrow">{listing.location}, {listing.state}</p>
            <h1>{listing.title}</h1>
            <p className="detail-description">{listing.description}</p>
          </div>
          <aside className="detail-facts">
            <span className="verification-pending">Pending verification</span>
            <p className="property-price">{formatNaira(listing.rent)} <span>/ year</span></p>
            <p>{listing.propertyType} · {listing.bedrooms} bedroom · {listing.bathrooms} bath</p>
            <p><strong>Sample listing only.</strong> This property and the agent details are fictional demonstration content.</p>
            <p className="detail-safety">No verification has been completed. Do not treat this sample as a real listing or make payments based on demo information.</p>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

function NotFoundPage() {
  return <><Header /><main className="not-found section-wrap"><p className="eyebrow">Page not found</p><h1>We couldn't find that page.</h1><a className="button button-primary" href="/">Back to DwellSafe</a></main><Footer /></>;
}

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return <HomePage />;
  if (path === '/properties') return <ListingsPage />;
  if (path === '/login' || path === '/signin') return <AuthPage route="login" />;
  if (path === '/register') return <AuthPage route="choose-role" />;
  if (path === '/register/landlord') return <AuthPage route="register-landlord" />;
  if (path === '/register/agent') return <AuthPage route="register-agent" />;
  if (path === '/register/tenant') return <AuthPage route="register-tenant" />;
  if (path === '/tenant/dashboard') return <DashboardPage role="tenant" />;
  if (path === '/forgot-password') return <AuthPage route="forgot-password" />;
  if (path === '/privacy') return <AuthPage route="privacy" />;
  if (path === '/terms') return <AuthPage route="terms" />;
  if (path === '/landlord/dashboard') return <DashboardPage role="landlord" />;
  if (path === '/agent/dashboard') return <DashboardPage role="agent" />;
  const detailMatch = path.match(/^\/properties\/([^/]+)$/);
  if (detailMatch) {
    const dynamicListings = readDemoState().apartments
      .filter((apartment) => apartment.occupantId === null)
      .map(demoApartmentListing);
    const listing = [...listings, ...dynamicListings].find((item) => item.id === decodeURIComponent(detailMatch[1]));
    return listing ? <PropertyDetailPage listing={listing} /> : <NotFoundPage />;
  }
  return <NotFoundPage />;
}

export default App;
