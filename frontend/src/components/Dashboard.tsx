import { useState, type FormEvent } from 'react';
import { AuthLayout, type RegistrationRole } from './AuthShared';
import {
  activeDemoAccount,
  addDemoApartment,
  readDemoState,
  respondToDemoRequest,
  signOutDemoAccount,
  type DemoState,
} from '../data/demoStore';

function formatRent(amount: number) {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0,
  }).format(amount);
}

function DemoDashboardNotice() {
  return (
    <div className="form-alert form-alert-warning" role="note">
      Demo only: this information is saved in this browser, is not backed up, and is not protected by secure authentication. Do not enter real personal or property data.
    </div>
  );
}

export function DashboardPage({ role }: { role: RegistrationRole }) {
  const [data, setData] = useState<DemoState>(() => readDemoState());
  const [message, setMessage] = useState('');
  const account = activeDemoAccount(data);

  const refresh = () => setData(readDemoState());
  const handleSignOut = () => {
    signOutDemoAccount();
    window.location.assign('/');
  };

  if (!account || account.role !== role) {
    return (
      <AuthLayout>
        <main className="auth-main single-auth-main">
          <section className="auth-card auth-card-centered">
            <p className="eyebrow">Demo dashboard</p>
            <h1>Choose a demo account</h1>
            <p>Sign in with an account saved in this browser to open this dashboard.</p>
            <a className="button button-primary auth-submit" href="/login">Continue to sign in</a>
            <p className="auth-switch"><a href="/">Return to DwellSafe</a></p>
          </section>
        </main>
      </AuthLayout>
    );
  }

  if (role === 'landlord') {
    const apartments = data.apartments.filter((apartment) => apartment.landlordId === account.id);
    const apartmentIds = new Set(apartments.map((apartment) => apartment.id));
    const pendingRequests = data.requests.filter(
      (request) => apartmentIds.has(request.apartmentId) && request.status === 'pending',
    );

    const handleAddApartment = (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const values = new FormData(form);
      try {
        addDemoApartment({
          landlordId: account.id,
          title: String(values.get('title') ?? '').trim(),
          location: String(values.get('location') ?? '').trim(),
          neighborhood: String(values.get('neighborhood') ?? '').trim(),
          state: String(values.get('state') ?? '').trim(),
          propertyType: String(values.get('propertyType') ?? ''),
          rent: Number(values.get('rent')),
          bedrooms: Number(values.get('bedrooms')),
          bathrooms: Number(values.get('bathrooms')),
          description: String(values.get('description') ?? '').trim(),
        });
        form.reset();
        setMessage('Demo apartment added to your portfolio.');
        refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Could not save this demo apartment.');
      }
    };

    const handleRequest = (requestId: string, status: 'accepted' | 'declined') => {
      try {
        respondToDemoRequest(requestId, status);
        setMessage(status === 'accepted'
          ? 'Tenant request accepted. The tenant is now shown as the occupant.'
          : 'Tenant request declined.');
        refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Could not update this request.');
      }
    };

    return (
      <AuthLayout>
        <main className="dashboard-page">
          <div className="dashboard-heading">
            <div><p className="eyebrow">Landlord dashboard</p><h1>Welcome, {account.name}</h1><p>Manage your demo apartments and tenant requests.</p></div>
            <button className="button button-outline" type="button" onClick={handleSignOut}>Sign out</button>
          </div>
          <DemoDashboardNotice />
          {message && <div className="form-alert form-alert-warning" role="status">{message}</div>}

          <section className="dashboard-section">
            <div className="dashboard-section-heading"><div><p className="eyebrow">Your portfolio</p><h2>Apartments and occupants</h2></div><span className="result-count"><strong>{apartments.length}</strong><span>{apartments.length === 1 ? 'apartment' : 'apartments'}</span></span></div>
            {apartments.length ? (
              <div className="dashboard-property-grid">
                {apartments.map((apartment) => {
                  const occupant = data.accounts.find((person) => person.id === apartment.occupantId);
                  return (
                    <article className="dashboard-property-card" key={apartment.id}>
                      <p className="property-type">{apartment.propertyType}</p>
                      <h3>{apartment.title}</h3>
                      <p>{apartment.neighborhood}, {apartment.location}, {apartment.state}</p>
                      <p><strong>{formatRent(apartment.rent)}</strong> / year · {apartment.bedrooms} bed · {apartment.bathrooms} bath</p>
                      <div className="occupant-summary">
                        <strong>{occupant ? 'Current occupant' : 'No occupant yet'}</strong>
                        {occupant && <span>{occupant.name} · {occupant.email}</span>}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : <p className="dashboard-empty">You have not added any apartments yet.</p>}
          </section>

          <section className="dashboard-section">
            <p className="eyebrow">Tenant requests</p>
            <h2>Requests awaiting your response</h2>
            {pendingRequests.length ? (
              <div className="dashboard-request-list">
                {pendingRequests.map((request) => {
                  const tenant = data.accounts.find((person) => person.id === request.tenantId);
                  const apartment = apartments.find((place) => place.id === request.apartmentId);
                  if (!tenant || !apartment) return null;
                  return (
                    <article className="dashboard-request" key={request.id}>
                      <div><strong>{tenant.name}</strong><span>{tenant.email}</span><span>Interested in: {apartment.title}</span></div>
                      <div className="dashboard-actions">
                        <button className="button button-primary" type="button" onClick={() => handleRequest(request.id, 'accepted')}>Accept</button>
                        <button className="button button-outline" type="button" onClick={() => handleRequest(request.id, 'declined')}>Decline</button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : <p className="dashboard-empty">There are no pending tenant requests.</p>}
          </section>

          <section className="dashboard-section">
            <p className="eyebrow">Add to your portfolio</p>
            <h2>List an apartment</h2>
            <form className="dashboard-form" onSubmit={handleAddApartment}>
              <label>Listing title<input name="title" required minLength={4} placeholder="e.g. Two-bedroom flat near the park" /></label>
              <label>Property category<select name="propertyType" defaultValue="" required><option value="" disabled>Select a category</option><option>Self-contained</option><option>Mini flat</option><option>2-bedroom flat</option><option>3-bedroom flat</option><option>Duplex</option></select></label>
              <label>City<input name="location" required placeholder="e.g. Lagos" /></label>
              <label>Neighborhood<input name="neighborhood" required placeholder="e.g. Yaba" /></label>
              <label>State<input name="state" required placeholder="e.g. Lagos" /></label>
              <label>Yearly rent (₦)<input name="rent" type="number" min="1" required /></label>
              <label>Bedrooms<input name="bedrooms" type="number" min="0" max="20" required /></label>
              <label>Bathrooms<input name="bathrooms" type="number" min="1" max="20" required /></label>
              <label className="dashboard-form-wide">Description<textarea name="description" rows={3} required minLength={10} /></label>
              <button className="button button-primary" type="submit">Add demo apartment</button>
            </form>
          </section>
        </main>
      </AuthLayout>
    );
  }

  if (role === 'tenant') {
    const occupied = data.apartments.find((apartment) => apartment.occupantId === account.id);
    const requests = data.requests
      .filter((request) => request.tenantId === account.id)
      .map((request) => ({
        ...request,
        apartment: data.apartments.find((apartment) => apartment.id === request.apartmentId),
      }))
      .filter((request) => request.apartment);

    return (
      <AuthLayout>
        <main className="dashboard-page">
          <div className="dashboard-heading">
            <div><p className="eyebrow">Tenant dashboard</p><h1>Welcome, {account.name}</h1><p>See your current apartment and follow up on your demo requests.</p></div>
            <button className="button button-outline" type="button" onClick={handleSignOut}>Sign out</button>
          </div>
          <DemoDashboardNotice />
          <section className="dashboard-section">
            <p className="eyebrow">Your home</p>
            <h2>Current apartment</h2>
            {occupied ? (
              <article className="dashboard-property-card">
                <p className="property-type">{occupied.propertyType}</p>
                <h3>{occupied.title}</h3>
                <p>{occupied.neighborhood}, {occupied.location}, {occupied.state}</p>
                <p><strong>{formatRent(occupied.rent)}</strong> / year · {occupied.bedrooms} bed · {occupied.bathrooms} bath</p>
              </article>
            ) : <p className="dashboard-empty">No apartment has been assigned to your demo account yet.</p>}
          </section>
          <section className="dashboard-section">
            <p className="eyebrow">Apartment requests</p>
            <h2>Your requests</h2>
            {requests.length ? (
              <div className="dashboard-request-list">
                {requests.map(({ id, status, apartment }) => apartment && (
                  <article className="dashboard-request" key={id}>
                    <div><strong>{apartment.title}</strong><span>{apartment.neighborhood}, {apartment.location}</span></div>
                    <span className={`request-status is-${status}`}>{status}</span>
                  </article>
                ))}
              </div>
            ) : <p className="dashboard-empty">You have not requested an apartment yet.</p>}
          </section>
          <a className="button button-primary" href="/properties">Search homes by category</a>
        </main>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <main className="auth-main single-auth-main">
        <section className="auth-card auth-card-centered">
          <h1>Agent dashboard</h1>
          <p>Agent portfolio tools are not included in this demo yet.</p>
          <a className="button button-primary auth-submit" href="/">Return to DwellSafe</a>
        </section>
      </main>
    </AuthLayout>
  );
}
