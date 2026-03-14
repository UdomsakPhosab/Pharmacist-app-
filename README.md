# ⚕️ Pharmacist App — ระบบจัดการข้อมูลเภสัชกรรม

A comprehensive web application for pharmacists to manage medicines, diseases, patient records, and perform pharmaceutical calculations.

## ✨ Features

- **💊 Medicine Database** — CRUD for medicine details, dosage forms, side effects, contraindications
- **🏥 Disease Management** — Manage diseases with ICD codes, linked to relevant medicines
- **📋 Patient Records** — Track patient prescriptions and treatments with full data linking
- **🧮 Calculation Tools** — BMI, Creatinine Clearance, IBW, Total Daily Dose, Body Surface Area
- **🔗 Data Linking** — All modules are interconnected via relational database

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15+ with TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase (PostgreSQL) |
| Hosting | Vercel |
| Version Control | GitHub |
| CI/CD | GitHub Actions |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) account and project

### 1. Clone the repository

```bash
git clone https://github.com/UdomsakPhosab/Pharmacist-app-.git
cd Pharmacist-app-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

Run the SQL migration in your Supabase project's SQL Editor:

```
supabase/migrations/001_initial_schema.sql
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

```
diseases          ──────────────────────────────┐
  id, name, description, icd_code               │
                                                 │
medicines         ─────────────┐                │
  id, name, generic_name,      │                │
  dosage_form, strength, ...   │                │
                               ▼                ▼
disease_medicine_mapping: disease_id, medicine_id, dosage, ...

patient_records: patient_name, disease_id, medicine_id, dosage, ...

calculations: name, category, formula, description, unit
```

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with navigation
│   ├── page.tsx                # Home page
│   ├── medicines/page.tsx      # Medicine management
│   ├── diseases/page.tsx       # Disease management
│   ├── records/page.tsx        # Patient records
│   ├── calculations/page.tsx   # Calculation tools
│   └── api/
│       ├── medicines/          # Medicine CRUD API
│       ├── diseases/           # Disease CRUD API
│       ├── records/            # Records CRUD API
│       ├── calculations/       # Calculations API
│       └── mappings/           # Disease-medicine mapping API
├── components/
│   └── Navigation.tsx          # Top navigation bar
├── lib/
│   └── supabase.ts             # Supabase client
├── types/
│   └── database.ts             # TypeScript types
├── supabase/
│   └── migrations/             # SQL schema migrations
└── .github/workflows/          # CI/CD pipeline
```

## 🌐 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

### GitHub Secrets for CI/CD

Add these secrets to your GitHub repository settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📱 Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Dashboard overview |
| Medicines | `/medicines` | Medicine database with CRUD |
| Diseases | `/diseases` | Disease management with medicine linking |
| Patient Records | `/records` | Patient tracking with linked data |
| Calculations | `/calculations` | Pharmaceutical calculators |

## 🧮 Available Calculators

| Calculator | Formula | Use Case |
|------------|---------|----------|
| BMI | weight/height² | Body Mass Index |
| CrCl (Cockcroft-Gault) | ((140-age)×weight)/(72×SCr) | Kidney function / drug dosing |
| IBW (Devine) | 50 + 2.3×(height_in - 60) | Drug dosing reference weight |
| Total Daily Dose | dose × frequency | Daily medication load |
| BSA (Mosteller) | √(weight×height/3600) | Chemotherapy dosing |
