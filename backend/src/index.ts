import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);

app.use(cors());
app.use(express.json());

const listings = [
  {
    id: 'LS-1001',
    title: '2-bedroom apartment in Lekki Phase 1',
    location: 'Lekki Phase 1, Lagos',
    price: 'N8,500,000 / year',
    status: 'Demo listing — not verified',
    landlord: 'Adebisi O.',
    agent: 'BrightHomes Realty',
    bedrooms: 2,
    bathrooms: 2,
    available: true,
  },
  {
    id: 'LS-1002',
    title: 'Studio flat near Yaba Tech',
    location: 'Yaba, Lagos',
    price: 'N4,200,000 / year',
    status: 'Demo listing — not verified',
    landlord: 'Chidi M.',
    agent: 'Urban Nest Agents',
    bedrooms: 1,
    bathrooms: 1,
    available: true,
  },
  {
    id: 'LS-1003',
    title: '3-bedroom duplex in Gwarinpa',
    location: 'Gwarinpa, Abuja',
    price: 'N12,000,000 / year',
    status: 'Demo listing — not verified',
    landlord: 'Fatima A.',
    agent: 'Prime Property Co.',
    bedrooms: 3,
    bathrooms: 3,
    available: false,
  },
];

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'dwellsafe-backend',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/listings', (_req, res) => {
  res.json(listings);
});

app.get('/api/verification-status', (_req, res) => {
  res.json({
    totalListings: listings.length,
    verified: 0,
    pending: 0,
    demo: listings.length,
    note: 'All API listings are fictional demonstration data and have not been verified.',
    lastUpdated: new Date().toISOString(),
  });
});

app.listen(port, () => {
  console.log(`Legacy Express API retained for migration rollback on http://localhost:${port}`);
});
