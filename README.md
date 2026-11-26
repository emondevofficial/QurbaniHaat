# QurbaniHaat - Modern Livestock Marketplace

A modern, responsive, full-featured digital livestock marketplace where users can explore verified cattle, bulls, and goats for the sacred Qurbani (Eid-ul-Adha) sacrifice, review authentic veterinary and dental records, and place bookings with free farm boarding until Eid.

---

## 🌐 Live Application URL
- **Production Live URL:** [https://qurbani-haat-rosy.vercel.app](https://qurbani-haat-rosy.vercel.app)
- **Development URL:** `http://localhost:3000`

---

## 📋 Project Purpose
Traditional animal haats during Eid-ul-Adha are frequently chaotic, prone to middleman price gouging, lack verifiable health histories, and force stressful transport on animals. **QurbaniHaat** bridges the gap between ethical rural pastoral farms (across Bogura, Pabna, Sirajganj, and Kushtia) and urban devotees:
1. Guaranteeing **100% Shariah compliance** (strict 2-tooth age verification for cattle and 1-year criteria for goats).
2. Providing **digital scale live weight transparency** with zero weight guesswork.
3. Enabling **authenticated private animal booking** with free farm boarding and stress-free doorstep truck delivery.

---

## ✨ Key Features

### 1. Layout & Architecture
- **Responsive Navbar**:
  - Logo with quick home navigation.
  - Links: `Home`, `All Animals`.
  - Conditional authentication state:
    - **Logged In**: Shows user avatar, name, dropdown menu (`My Profile`, `Browse Livestock`, `Log Out`).
    - **Logged Out**: Shows dedicated `Log In` and `Register` action buttons.
  - Mobile hamburger drawer with full navigation access.
- **Comprehensive Footer**:
  - Detailed about section explaining ethical sourcing.
  - Haat office location, hotline, and support email.
  - Social media channels (Facebook, YouTube, Twitter, Instagram).
  - Quick navigation shortcuts.

### 2. Comprehensive Animal Dataset (`src/data/animals.json`)
Contains rich, realistic cattle and livestock records with:
- `id`, `name`, `type` (`Cow`, `Goat`, `Sheep`)
- `breed` (Shahiwal Cross, Local Deshi, Black Bengal, Jamunapari, Boer, etc.)
- `price` (formatted in BDT ৳), `weight` (live kg), `age` (years)
- `location` (Bogura, Sirajganj, Pabna, Kushtia, Rajshahi, etc.)
- `description`, `image`, `category` (`Large Animal`, `Medium Animal`, `Small Animal`)
- `teethCount`, `vaccinationStatus`, `diet`, and `color`

### 3. Home Page (`/`)
- **Hero Section**: Catchy banner, value proposition, quick metrics (1,250+ Verified Animals, 100% Shariah Age Check, 64 Districts Delivery), and "Explore All Animals" CTA.
- **Featured Animals**: Spotlight grid of 4 handpicked livestock with live weight, age, and quick details link.
- **Qurbani Tips Section**: Islamic guidelines on sacrificial age criteria, physical defect checks, halal nutrition, and humane pre-slaughter treatment.
- **Top Breeds Section**: Educational breakdown of Shahiwal, Black Bengal, Red Chittagong (RCC), and Jamunapari breeds.
- **Extra Section**: *Certified Veterinarian & Halal Inspection Standard* detailing digital live weighing, dental audits, free pre-Eid boarding, and air-suspension transport trucks.

### 4. All Animals Page (`/animals`)
- **Sort by Price**: Real-time sorting by Price (Low to High, High to Low), Live Weight (Heaviest first), and Default order.
- **Interactive Search**: Search instantly by breed name, farm location, or keyword.
- **Filter Pills**: Quick filters for Animal Type (`All`, `Cow`, `Goat`, `Sheep`) and Category (`Large`, `Medium`, `Small`).
- **Loading Skeleton**: Responsive skeleton placeholders simulating async data fetching.
- **Empty State**: Friendly reset prompt when no criteria matches.

### 5. Animal Details Page (`/details-page?id=...`)
- **Private Route Protection**: Prompts unauthenticated visitors with an intuitive login lock card.
- **Full Animal Profile**: High-resolution gallery, breed badge, live weight, age, 2-teeth validation badge, dietary regimen, vaccination history, and origin farm.
- **Booking Form**:
  - Fields: `name`, `email`, `phone`, `address`, and preferred delivery date.
  - Automatically pre-fills logged-in user's name and email.
  - On submit: Form resets immediately and displays a success toast notification without saving data to DB/Local Storage (per assignment specification).

### 6. User Authentication
- **Google OAuth (`/login`, `/register`)**:
  - Both pages use the same Google account chooser and sign-in flow.
  - Better Auth validates OAuth state and persists users, provider identities, and HTTP-only sessions in SQLite.
  - Google email, verification status, name, and picture populate the user's profile.
  - Email/password login and registration are disabled; legacy database records are left intact.

### 7. Additional Requirements
- **Toast Notifications**: Built-in, responsive floating notification system for success, error, and info alerts.
- **Loading on Fetch Data**: Animated skeleton components for smooth visual transitions.
- **404 Not Found Page**: Friendly customized error view with quick route recovery buttons.

---

## 🏆 Completed Challenges

### Challenge 1: My Profile (`/my-profile`)
- Dedicated private route displaying logged-in profile details:
  - User Full Name
  - Avatar Photo (with live fallback)
  - Registered Email Address
  - Patron tier and membership registration date.

### Challenge 2: Update Information Feature (`/update-profile`)
- An "Update Information" button on `/my-profile` navigates to `/update-profile`.
- Displays a dedicated form with **2 input fields**:
  1. `image` (Profile Photo URL)
  2. `Name` (Full Name)
- Features a live avatar preview and avatar presets.
- Uses the **Better Auth** user update API (`auth.updateUser({ name, image })`), persists changes into the authenticated user session, shows a success toast, and navigates back to `/my-profile`.

### Challenge 3: NPM Package Implementation (`animate.css`)
- Integrated **`animate.css`** for smooth UI transitions:
  - Hero banner entrances (`animate__fadeInDown`, `animate__fadeInUp`, `animate__fadeInRight`).
  - Booking confirmation popups (`animate__bounceIn`).
  - Toast notification slides (`animate__fadeInRight`).
  - Form error shakes (`animate__shakeX`).

---

## 📦 NPM Packages Used
| Package | Version | Purpose |
| :--- | :--- | :--- |
| `animate.css` | `^4.1.1` | Smooth CSS animation primitives for banners, modals, and toasts |
| `lucide-react` | `^0.546.0` | Comprehensive vector icon set |
| `motion` | `^12.23.24` | Modern animation and layout effects |
| `react` | `^19.0.1` | Core UI library |
| `react-dom` | `^19.0.1` | React DOM renderer |
| `tailwindcss` | `^4.1.14` | Utility-first responsive CSS framework |
| `vite` | `^6.2.3` | Ultra-fast frontend bundler and development server |

---

## 🛣️ Route Breakdown
| Route | Access | Purpose |
| :--- | :--- | :--- |
| `/` | **Public** | Home page (Hero, Featured Animals, Qurbani Tips, Top Breeds, Vet Standards) |
| `/animals` | **Public** | All animals catalog with price sorting, filtering, and live search |
| `/login` | **Public** | Google OAuth sign-in |
| `/register` | **Public** | Google OAuth account creation or sign-in |
| `/details-page` | **Private** | Detailed animal dossier & temporary booking reservation form |
| `/my-profile` | **Private** | Authenticated buyer profile overview with account status |
| `/update-profile` | **Private** | Challenge 2: Better-Auth user information update form (image & name) |
| `*` | **Public** | Custom 404 Not Found page |

---

## 🔐 Google OAuth Setup

Authentication uses Better Auth with SQLite for local development and persistent Turso/libSQL storage in serverless production. It requires Node.js 22.5 or newer. OAuth credentials, database tokens, and session secrets are server-only; do not prefix them with `VITE_`.

1. Copy `.env.example` to `.env` for local development and set `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `AUTH_SECRET`. Generate a secret with `node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`. Run the app with `npm run dev`.
2. In Google Cloud Console, configure the OAuth consent screen and add these authorized JavaScript origins and redirect URIs:
   - Development origin: `http://localhost:3000`
   - Development redirect URI: `http://localhost:3000/api/auth/callback/google`
   - Production origin: `https://qurbani-haat-rosy.vercel.app`
   - Production redirect URI: `https://qurbani-haat-rosy.vercel.app/api/auth/callback/google`
3. Create a persistent Turso/libSQL database. Add these server-side environment variables to Vercel for **Production** (and Preview if needed): `APP_URL` (the canonical HTTPS deployment origin), `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `AUTH_SECRET` (at least 32 characters), `DATABASE_URL` (the database's `libsql://` URL), and `DATABASE_AUTH_TOKEN`. Do not expose these values as `VITE_` variables. Set `VITE_APP_TITLE=Qurbani Haat` only if you want to override the built-in brand.
4. Vercel automatically deploys the Better Auth handler from `api/auth/[...all].ts` at `/api/auth/*`; keep the frontend and API on the same origin. The production database schema is migrated on the first API request (or run `npm run auth:migrate` manually with the production database variables before deployment). Vercel should build the frontend with `npm run build`.
5. Netlify is also supported by the existing `netlify.toml` and `netlify/functions/auth.ts`; configure the same server-side variables there and use the site’s own canonical `APP_URL` and matching Google callback URI. The standalone Express server can be used with `npm start` and the same environment variables.

Better Auth manages OAuth state, synchronizes existing Google identities, and uses secure HTTP-only session cookies; production cookies use the `Secure` attribute. If the Google client variables are missing, `/api/auth/config` reports Google sign-in as unconfigured so the UI can show a specific setup message instead of a generic service error.
