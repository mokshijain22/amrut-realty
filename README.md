# Amrut Realty — Full Stack Skeleton (MERN)

## Structure
- `backend/` — Node.js + Express + MongoDB (Mongoose), JWT auth, MLM commission engine
- `frontend/` — React + Vite, basic login/dashboard

## Backend setup
```
cd backend
cp .env.example .env      # edit MONGO_URI, JWT_SECRET
npm install
npm run seed               # creates admin@amrutrealty.com / changeme123
npm run dev                # starts on :5000
```

## Frontend setup
```
cd frontend
npm install
npm run dev                # starts on :5173
```

## What's built
- **Auth**: register/login/me, JWT, role-based middleware (super_admin, sub_admin, executive, investor, jv_partner, customer)
- **Models**: User (with sponsor/upline chain + rank L1–L9), Property, Lead, Sale, Commission, CommissionSlab
- **Tree service**: builds/reads each user's upline chain for MLM-style commission rollup, skips inactive executives
- **Commission service**: applies management-approved slabs to sales (direct_sale + team_override), plus a separate flat investor-referral bonus (3%) — nothing pays out until a slab is explicitly approved by a super_admin
- **Routes**: `/api/auth`, `/api/properties` (draft → publish workflow), `/api/leads` (public enquiry capture + staff CRM view), `/api/sales` (auto-triggers commission calc), `/api/commission-slabs` (admin-managed rate table)
- **Frontend**: login page, protected dashboard showing leads, AuthContext with token persistence

## Not yet built (next steps)
- Public marketing pages (Home, About, Projects, Gallery, Contact) — content pending final management sign-off per the business plan doc
- Partner registration + KYC upload UI
- Commission slab admin UI (currently API-only)
- Reports (CSV/PDF export) — can port patterns from the mlm-real-estate project
- JV partner listing/ownership flows
