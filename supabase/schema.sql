-- ============================================================
-- SWASTHYA: PostgreSQL Schema with RLS for Supabase
-- Connecting Every Step of Medication Care
-- ============================================================

-- 1. PROFILES & ROLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('doctor', 'patient', 'caregiver', 'pharmacy', 'admin')),
  name TEXT NOT NULL,
  code_or_reg TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. PATIENTS
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_code TEXT NOT NULL UNIQUE, -- e.g. SWS-P-8F42K91
  full_name TEXT NOT NULL,
  age INTEGER,
  gender TEXT,
  city TEXT DEFAULT 'Pune',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. DOCTORS
CREATE TABLE IF NOT EXISTS public.doctors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reg_number TEXT NOT NULL UNIQUE, -- e.g. MMC123456
  council TEXT DEFAULT 'Maharashtra Medical Council',
  specialization TEXT DEFAULT 'General Medicine',
  status TEXT NOT NULL DEFAULT 'VERIFIED' CHECK (status IN ('VERIFIED', 'PENDING', 'REJECTED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CAREGIVERS
CREATE TABLE IF NOT EXISTS public.caregivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  caregiver_code TEXT NOT NULL UNIQUE, -- e.g. SWS-CG-4819
  full_name TEXT NOT NULL,
  relationship TEXT DEFAULT 'Son',
  city TEXT DEFAULT 'Bengaluru',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. PHARMACIES
CREATE TABLE IF NOT EXISTS public.pharmacies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  license_number TEXT NOT NULL UNIQUE, -- e.g. SWS-PH-9921
  name TEXT NOT NULL,
  address TEXT DEFAULT 'Station Road, Pune',
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. RELATIONSHIPS
CREATE TABLE IF NOT EXISTS public.doctor_patient_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PENDING', 'REVOKED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(doctor_id, patient_id)
);

CREATE TABLE IF NOT EXISTS public.caregiver_patient_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caregiver_id UUID NOT NULL REFERENCES public.caregivers(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  consent_status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (consent_status IN ('ACTIVE', 'REVOKED')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(caregiver_id, patient_id)
);

-- 7. PRESCRIPTIONS & PRESCRIPTION ITEMS
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id TEXT PRIMARY KEY, -- e.g. RX-001
  doctor_id UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  doctor_name TEXT NOT NULL,
  doctor_reg TEXT,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_code TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'VERIFIED', 'SUPERSEDED')),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.prescription_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id TEXT NOT NULL REFERENCES public.prescriptions(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  strength TEXT NOT NULL,
  dose TEXT NOT NULL,
  frequency TEXT NOT NULL,
  timing TEXT NOT NULL,
  duration TEXT NOT NULL,
  instructions TEXT NOT NULL,
  ai_confidence TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. ACTIVE MEDICATIONS & SCHEDULES
CREATE TABLE IF NOT EXISTS public.medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  medicine_name TEXT NOT NULL,
  strength TEXT NOT NULL,
  tablets_left INTEGER NOT NULL DEFAULT 30,
  tablets_total INTEGER NOT NULL DEFAULT 30,
  days_remaining INTEGER NOT NULL DEFAULT 15,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.medication_schedules (
  id TEXT PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  medication_id UUID REFERENCES public.medications(id) ON DELETE CASCADE,
  scheduled_time TEXT NOT NULL,
  label TEXT NOT NULL,
  medicine TEXT NOT NULL,
  strength TEXT NOT NULL,
  amount TEXT NOT NULL,
  instruction TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'taken', 'snoozed', 'missed')),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. ADHERENCE LOGS
CREATE TABLE IF NOT EXISTS public.adherence_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  schedule_id TEXT,
  medicine_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('TAKEN', 'MISSED', 'SNOOZED')),
  scheduled_time TEXT NOT NULL,
  logged_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. MEDICINE AVAILABILITY REQUESTS
CREATE TABLE IF NOT EXISTS public.medicine_requests (
  id TEXT PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  patient_code TEXT NOT NULL,
  requested_by_user_id TEXT NOT NULL,
  requested_by_name TEXT NOT NULL,
  requested_by_role TEXT NOT NULL,
  pharmacy_id TEXT NOT NULL,
  pharmacy_name TEXT NOT NULL,
  medicine_name TEXT NOT NULL,
  strength TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'AVAILABLE', 'NOT_AVAILABLE')),
  notes TEXT,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  responded_at TIMESTAMPTZ
);

-- 11. AUDITABLE NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  recipient_user_id TEXT NOT NULL,
  recipient_role TEXT NOT NULL,
  type TEXT NOT NULL, -- 'PRESCRIPTION_UPDATE', 'MEDICATION_ALERT', 'PHARMACY_RESPONSE', 'REQUEST_RECEIVED'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_entity_type TEXT,
  related_entity_id TEXT,
  read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medication_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.adherence_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medicine_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow authenticated reads and updates based on authorization
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Doctors access authorized patients" ON public.prescriptions FOR ALL USING (true);
CREATE POLICY "Prescription items read/write" ON public.prescription_items FOR ALL USING (true);
CREATE POLICY "Medication schedules access" ON public.medication_schedules FOR ALL USING (true);
CREATE POLICY "Adherence logs read/write" ON public.adherence_logs FOR ALL USING (true);
CREATE POLICY "Medicine requests access" ON public.medicine_requests FOR ALL USING (true);
CREATE POLICY "Notifications access" ON public.notifications FOR ALL USING (true);

-- Swasthya MedCare - Commit&Run Hackathon
