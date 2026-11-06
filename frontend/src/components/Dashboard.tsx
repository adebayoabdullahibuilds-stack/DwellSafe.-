import { useState, type FormEvent } from 'react';
import { AuthLayout, type RegistrationRole } from './AuthShared';
import {
  activeDemoAccount,
  addDemoApartment,
  assignDemoAgent,
  rateDemoAgent,
  readDemoState,
  reviewDemoAgent,
  respondToDemoRequest,
  signOutDemoAccount,
  submitDemoIdentity,
  type DemoAccount,
  type DemoIdentityDocumentType,
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
      Demo only: this information is saved in this browser, is not backed up, and is not protected by secure authentication. Never select real identity documents or enter real personal or property data.
    </div>
  );
}

function IdentityVerificationPanel({ account, onResult }: { account: DemoAccount; onResult: (message: string, submitted?: boolean) => void }) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const file = formData.get('identityDocument');
    if (!(file instanceof File) || file.size === 0) {
      onResult('Choose a sample document to simulate an identity verification request.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      onResult('Choose a sample document smaller than 5 MB.');
      return;
    }
    if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
      onResult('Choose an image or PDF document.');
      return;
    }

    try {
      submitDemoIdentity(account.id, String(formData.get('documentType')) as DemoIdentityDocumentType);
      form.reset();
      onResult('Demo request recorded as pending. The selected file was not uploaded or saved.', true);
    } catch (error) {
      onResult(error instanceof Error ? error.message : 'Could not record this demo verification request.');
    }
  };

  return (
    <section className="dashboard-section">
      <p className="eyebrow">Identity checks · {account.role}</p>
      <h2>Identity verification</h2>
      <p className="dashboard-empty">
        Status: <strong>{account.identityStatus === 'pending' ? 'Pending review' : 'Not submitted'}</strong>
        {account.identityDocumentType && <> · Document type: {account.identityDocumentType === 'nin' ? 'NIN' : account.identityDocumentType === 'voters-card' ? 'Voter’s card' : 'Driver’s license'}</>}
      </p>
      <form className="dashboard-form identity-form" onSubmit={handleSubmit}>
        <label>Document type
          <select name="documentType" defaultValue="" required>
            <option value="" disabled>Select an identity document</option>
            <option value="nin">National Identity Number (NIN)</option>
            <option value="voters-card">Voter’s card</option>
            <option value="drivers-license">Driver’s license</option>
          </select>
        </label>
        <label>Sample document (image or PDF)
          <input name="identityDocument" type="file" accept="image/*,application/pdf" required />
        </label>
        <button className="button button-primary" type="submit">Submit demo verification</button>
      </form>
      <p className="field-hint">Applies equally to tenants, landlords, and agents. This prototype records only the document category and pending status. The selected file and ID number are never uploaded or stored. Real verification needs secure authentication, storage, and a reviewer.</p>
    </section>
  );
}

function agentRatingSummary(data: DemoState, agentId: string) {
  const ratings = data.ratings.filter((rating) => rating.agentId === agentId);
  if (!ratings.length) return 'No tenant ratings yet';
  const average = ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length;
  return `${average.toFixed(1)} / 5 · ${ratings.length} ${ratings.length === 1 ? 'rating' : 'ratings'}`;
}

export function DashboardPage({ role }: { role: RegistrationRole }) {
  const [data, setData] = useState<DemoState>(() => readDemoState());
  const [message, setMessage] = useState('');
  const account = activeDemoAccount(data);

  const refresh = () => setData(readDemoState());
  const handleIdentityResult = (result: string, submitted = false) => {
    setMessage(result);
    if (submitted) refresh();
  };
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
    const verifiedAgents = data.accounts.filter((person) => person.role === 'agent' && person.agentOnboardingStatus === 'verified');
    const pendingAgents = data.accounts.filter((person) => person.role === 'agent'
      && person.agentOnboardingStatus === 'pending'
      && (!person.verifyingLandlordId || person.verifyingLandlordId === account.id));
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
          agentId: String(values.get('agentId') ?? '') || null,
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

    const handleAgentReview = (agentId: string, status: 'verified' | 'rejected') => {
      try {
        reviewDemoAgent(account.id, agentId, status);
        setMessage(status === 'verified'
          ? 'Agent relationship verified for this demo.'
          : 'Agent onboarding declined.');
        refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Could not update this agent onboarding.');
      }
    };

    const handleAgentAssignment = (apartmentId: string, agentId: string) => {
      try {
        assignDemoAgent(account.id, apartmentId, agentId || null);
        setMessage('Apartment agent assignment updated.');
        refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Could not assign this agent.');
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
          <IdentityVerificationPanel account={account} onResult={handleIdentityResult} />
          {message && <div className="form-alert form-alert-warning" role="status">{message}</div>}

          <section className="dashboard-section">
            <p className="eyebrow">Agent network</p>
            <h2>Review agent onboarding</h2>
            <p className="field-hint">Landlord verification confirms your working relationship only; it is not an identity or regulatory check.</p>
            {pendingAgents.length ? (
              <div className="dashboard-request-list">
                {pendingAgents.map((agent) => (
                  <article className="dashboard-request" key={agent.id}>
                    <div><strong>{agent.name}</strong><span>{agent.email} · {agent.agentOnboardingMethod === 'landlord' ? 'Requested landlord verification' : 'Self-onboarded'}</span></div>
                    <div className="dashboard-actions">
                      <button className="button button-primary" type="button" onClick={() => handleAgentReview(agent.id, 'verified')}>Verify relationship</button>
                      <button className="button button-outline" type="button" onClick={() => handleAgentReview(agent.id, 'rejected')}>Decline</button>
                    </div>
                  </article>
                ))}
              </div>
            ) : <p className="dashboard-empty">No agent onboarding requests need your review.</p>}
          </section>

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
                      <label className="agent-assignment">Assigned agent
                        <select value={apartment.agentId ?? ''} onChange={(event) => handleAgentAssignment(apartment.id, event.target.value)}>
                          <option value="">No agent assigned</option>
                          {verifiedAgents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name} · {agentRatingSummary(data, agent.id)}</option>)}
                        </select>
                      </label>
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
                      <div><strong>{tenant.name}</strong><span>{tenant.email}</span><span>Interested in: {apartment.title}</span><span>Connection: {account.name} → {request.agentId ? data.accounts.find((person) => person.id === request.agentId)?.name ?? 'Agent' : 'No agent assigned'} → {tenant.name}</span></div>
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
              <label>Assign verified agent<select name="agentId" defaultValue=""><option value="">No agent</option>{verifiedAgents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name} · {agentRatingSummary(data, agent.id)}</option>)}</select></label>
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

    const handleRating = (event: FormEvent<HTMLFormElement>, requestId: string) => {
      event.preventDefault();
      const form = event.currentTarget;
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      try {
        rateDemoAgent(requestId, account.id, Number(new FormData(form).get('score')));
        setMessage('Your demo agent rating was saved.');
        refresh();
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Could not save this demo rating.');
      }
    };

    return (
      <AuthLayout>
        <main className="dashboard-page">
          <div className="dashboard-heading">
            <div><p className="eyebrow">Tenant dashboard</p><h1>Welcome, {account.name}</h1><p>See your current apartment and follow up on your demo requests.</p></div>
            <button className="button button-outline" type="button" onClick={handleSignOut}>Sign out</button>
          </div>
          <DemoDashboardNotice />
          <IdentityVerificationPanel account={account} onResult={handleIdentityResult} />
          {message && <div className="form-alert form-alert-warning" role="status">{message}</div>}
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
                {requests.map(({ id, status, apartment, agentId }) => apartment && (
                  <article className="dashboard-request dashboard-request-stacked" key={id}>
                    <div>
                      <strong>{apartment.title}</strong>
                      <span>{apartment.neighborhood}, {apartment.location}</span>
                      <span>Connection: {data.accounts.find((person) => person.id === apartment.landlordId)?.name ?? 'Landlord'} → {agentId ? data.accounts.find((person) => person.id === agentId)?.name ?? 'Agent' : 'No agent assigned'} → {account.name}</span>
                      {agentId && <span>Agent rating: {agentRatingSummary(data, agentId)}</span>}
                    </div>
                    <span className={`request-status is-${status}`}>{status}</span>
                    {status === 'accepted' && agentId && !data.ratings.some((rating) => rating.requestId === id) && (
                      <form className="agent-rating-form" onSubmit={(event) => handleRating(event, id)}>
                        <label>Rate your agent
                          <select name="score" defaultValue="" required>
                            <option value="" disabled>Choose stars</option>
                            {[5, 4, 3, 2, 1].map((score) => <option key={score} value={score}>{score} {score === 1 ? 'star' : 'stars'}</option>)}
                          </select>
                        </label>
                        <button className="button button-outline" type="submit">Save rating</button>
                      </form>
                    )}
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
      <main className="dashboard-page">
        <div className="dashboard-heading">
          <div><p className="eyebrow">Agent dashboard</p><h1>Welcome, {account.name}</h1><p>Follow your landlord connections, property assignments, and tenant feedback.</p></div>
          <button className="button button-outline" type="button" onClick={handleSignOut}>Sign out</button>
        </div>
        <DemoDashboardNotice />
        <IdentityVerificationPanel account={account} onResult={handleIdentityResult} />
        {message && <div className="form-alert form-alert-warning" role="status">{message}</div>}
        <section className="dashboard-section">
          <p className="eyebrow">Agent onboarding</p>
          <h2>{account.agentOnboardingStatus === 'verified' ? 'Landlord relationship verified' : account.agentOnboardingStatus === 'rejected' ? 'Onboarding declined' : 'Awaiting landlord review'}</h2>
          <p className="dashboard-empty">
            Route: {account.agentOnboardingMethod === 'landlord' ? 'Landlord verification' : 'Self-onboarding'}
            {account.verifyingLandlordId && <> · Verifier: {data.accounts.find((person) => person.id === account.verifyingLandlordId)?.name ?? 'Landlord'}</>}
            {' · '}Tenant rating: {agentRatingSummary(data, account.id)}
          </p>
          <p className="field-hint">A landlord’s confirmation describes a business relationship only. It does not verify your identity, licence, or legal authority.</p>
        </section>
        <section className="dashboard-section">
          <p className="eyebrow">Landlord network</p>
          <h2>Assigned properties</h2>
          {data.apartments.some((apartment) => apartment.agentId === account.id) ? (
            <div className="dashboard-property-grid">
              {data.apartments.filter((apartment) => apartment.agentId === account.id).map((apartment) => {
                const landlord = data.accounts.find((person) => person.id === apartment.landlordId);
                const tenantRequests = data.requests.filter((request) => request.apartmentId === apartment.id && request.agentId === account.id);
                return (
                  <article className="dashboard-property-card" key={apartment.id}>
                    <p className="property-type">{apartment.propertyType}</p>
                    <h3>{apartment.title}</h3>
                    <p>{apartment.neighborhood}, {apartment.location}, {apartment.state}</p>
                    <div className="occupant-summary"><strong>Landlord</strong><span>{landlord?.name ?? 'Unknown landlord'}</span></div>
                    <div className="occupant-summary"><strong>Tenant connections</strong><span>{tenantRequests.length ? tenantRequests.map((request) => {
                      const tenant = data.accounts.find((person) => person.id === request.tenantId);
                      return `${tenant?.name ?? 'Tenant'} (${request.status})`;
                    }).join(' · ') : 'No requests yet'}</span></div>
                  </article>
                );
              })}
            </div>
          ) : <p className="dashboard-empty">No landlords have assigned a property to you yet. Ask a landlord to verify your relationship and add you to a listing.</p>}
        </section>
        <a className="button button-outline" href="/">Return to DwellSafe</a>
      </main>
    </AuthLayout>
  );
}
