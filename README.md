# SWASTHYA — Connecting Every Step of Medication Care

> **Hackathon Submission by Team COMMIT&RUN**  
> *"Connecting Doctor, Patient, Caretaker, and Pharmacy in One Continuous Line of Medication Care."*

---

## 🌐 Live Demo Deployments

- 🌟 **Option 1 (Active Full Feature Deployment with Real-time DB Sync & Judge Shortcuts)**:  
  👉 **[https://round-src-shopzilla-apart.trycloudflare.com](https://round-src-shopzilla-apart.trycloudflare.com)**
- 🛡️ **Option B (Original Deployment — Preserved & Untouched)**:  
  👉 **[https://shoulder-judges-organisation-firms.trycloudflare.com](https://shoulder-judges-organisation-firms.trycloudflare.com)**

---

## 👥 Team Information

- **Team Name**: `COMMIT&RUN`
- **Team Members**:
  - **Abhishek Kumar**
  - **Subhiksha Batwal**
  - **Ojas Karode**
  - **Fremont Fernandes**

---

## 🎯 Problem Statement

Medication non-adherence and fractured communication across healthcare touchpoints cause severe patient relapses, hospital readmissions, and wasted travel. 

Today:
1. **Doctors** write prescriptions without visibility into whether doses are acknowledged or medicines are available.
2. **Elderly patients** struggle with complex schedules, language barriers, and small text.
3. **Caretakers/Family members** are either overwhelmed by noisy alerts or completely left in the dark until an emergency occurs.
4. **Pharmacies** operate disconnected, leading patients to travel multiple stores only to discover medicines are out of stock.

**Swasthya** bridges this gap: a connected, accessible, and clinically safe medication-care platform linking **Doctor, Patient, Caretaker, and Pharmacy**.

---

## 💻 Tech Stack Used

- **Frontend & Routing**: React 19, TypeScript, Vite, TanStack Router (File-Based Routing)
- **Styling & UI**: Tailwind CSS, Radix UI primitives, Lucide Icons
- **Voice & Accessibility**: Web Speech API (`SpeechSynthesis` with English & Hindi `hi-IN` phonetics)
- **Data Visualization**: Recharts (Deterministic adherence rates & weekly dose graphs)
- **State & Real-time Sync**: Reactive in-memory / `localStorage` state with cross-role event bus
- **Deployment**: Vercel & Vite preview ready

---

## 🔑 Demo Accounts & Credentials

Swasthya comes pre-configured with **4 dedicated accounts** so judges can test every perspective instantly. You can enter credentials manually on the `/login` screen or use the **"1-Click Sign In"** button on each card:

| Role | Name / Organization | Account ID / Email | Password | Access Route |
| :--- | :--- | :--- | :--- | :--- |
| **Doctor** | **Dr. Amit Sharma** (General Medicine · MMC123456) | `doctor@swasthya.com` | `doctor123` | [`/doctor/dashboard`](http://localhost:8080/doctor/dashboard) |
| **Patient** | **Mrs. Sunita Sharma** (ID: `SWS-P-8F42K91` · Pune) | `patient@swasthya.com` | `patient123` | [`/patient/dashboard`](http://localhost:8080/patient/dashboard) |
| **Caretaker** | **Rahul Sharma** (Son · Bengaluru) | `caretaker@swasthya.com` | `caretaker123` | [`/caregiver/dashboard`](http://localhost:8080/caregiver/dashboard) |
| **Medical** | **ABC Medical** (Kothrud, Pune · Connected Chemist) | `medical@swasthya.com` | `medical123` | [`/pharmacy/dashboard`](http://localhost:8080/pharmacy/dashboard) |
| **Admin** *(Bonus)* | **Swasthya Admin** (Medical Council Verifier) | `admin@swasthya.com` | `admin123` | [`/admin/dashboard`](http://localhost:8080/admin/dashboard) |

---

## 🚀 Setup & Local Execution Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or bun

### Steps to Run:
```bash
# 1. Clone the repository
git clone https://github.com/aryabhishek077/Enigma_COMMIT_RUN.git
cd Enigma_COMMIT_RUN

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Start local development server
npm run dev

# 4. Open in your browser:
# http://localhost:8080
```

---

## 🌐 Deploy to Vercel

### Option A: 1-Click Vercel Import (Recommended)
1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import the GitHub repository: **`aryabhishek077/Enigma_COMMIT_RUN`**
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**!

---

## 🌟 Key Features & Innovations

### 1. 🇮🇳 Hindi Prescription Alert (हिंदी वॉइस अलर्ट)
- Supports native Hindi spoken voice synthesis (`hi-IN`) and Hindi script reminders for regional and elderly patients:
  > *"सुनीता जी, यह आपकी मेटफॉर्मिन 500 मिलीग्राम गोली लेने का समय है। कृपया रात के खाने के बाद एक गोली पानी के साथ लें।"*
- Bilingual toggle in modal: `ले ली (TAKEN)`, `बाद में (SNOOZE)`, `नहीं ली (NOT TAKEN)`.

### 2. 🤖 AI-Assisted Prescription Extraction with Safety Guardrails
- Scans handwritten or printed prescriptions and structures drug name, dose, frequency, and instructions.
- **Safety Rule**: AI strictly structures data and never prescribes or alters dosage autonomously; the registered doctor must verify and authorize before plans become active.

### 3. 📊 Deterministic Adherence Formula
- Adherence is strictly calculated mathematically without AI hallucination:
  $$\text{Adherence} = \frac{\text{Acknowledged Doses}}{\text{Scheduled Doses}} \times 100$$

### 4. 🛡️ Caretaker Alert Filtering & Clinical Guardrail
- Filters out single delays and only alerts caretakers for persistent repeated missed patterns.
- Restricts non-clinical roles: caretakers cannot modify dosages or alter prescriptions.

### 5. 🏪 Live Medical / Pharmacy Stock Verification
- Low medicine supply automatically triggers nearby pharmacy discovery.
- Patients send a real-time availability request $\rightarrow$ Appears live in ABC Medical's operational queue $\rightarrow$ Pharmacist confirms shelf availability $\rightarrow$ Patient is notified before traveling.

---

## 🎬 Step-by-Step Demo Flow for Judges

1. **Admin Verification** (`/admin/dashboard`):
   - Login as `admin@swasthya.com` / `admin123`.
   - Click **`VERIFY DOCTOR`** for Dr. Amit Sharma (`MMC123456`).
2. **Doctor Uploads & Verifies Rx** (`/doctor/prescriptions`):
   - Login as `doctor@swasthya.com` / `doctor123`.
   - Click **`Use Demo Prescription`** $\rightarrow$ Watch AI scanning $\rightarrow$ Review structured Metformin 500 mg $\rightarrow$ Click **`VERIFY PRESCRIPTION`**.
3. **Patient Experience & Hindi Voice Alert** (`/patient/dashboard`):
   - Login as `patient@swasthya.com` / `patient123`.
   - Click **`हिंदी अलर्ट (Hindi)`** $\rightarrow$ Hear voice alert in Hindi!
   - Click **`NOT TAKEN`** $\rightarrow$ Adherence graph drops and logs missed event.
4. **Caretaker Oversight** (`/caregiver/dashboard`):
   - Login as `caretaker@swasthya.com` / `caretaker123`.
   - Observe meaningful pattern alert: *"Sunita has missed evening medication acknowledgement multiple times this week"*.
   - Click **`Test Dosage Edit Security`** to demonstrate strict clinical boundary enforcement.
5. **Medical Availability Confirmation** (`/patient/find-medicine` & `/pharmacy/dashboard`):
   - In Patient View, click **`FIND MEDICINE`** on low-supply alert $\rightarrow$ Request ABC Medical.
   - Login as `medical@swasthya.com` / `medical123` $\rightarrow$ Click **`AVAILABLE`**.
   - Patient immediately receives stock confirmation!

---

*Submitted for Hackathon 2026 by Team COMMIT&RUN.*

<!-- Swasthya MedCare - Commit&Run Hackathon -->
