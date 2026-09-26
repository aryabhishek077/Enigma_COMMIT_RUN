export type DoseStatus = "taken" | "pending" | "snoozed" | "missed";

export type Dose = {
  id: string;
  time: string;
  label: string;
  medicine: string;
  strength: string;
  amount: string;
  instruction: string;
  status: DoseStatus;
};

export const patient = {
  name: "Sunita Sharma",
  firstName: "Sunita",
  age: 62,
  city: "Pune",
  condition: "Type 2 diabetes, hypertension",
  doctor: "Dr. Amit Sharma",
  caregiver: "Rahul Sharma",
  caregiverRelation: "Son · Bengaluru",
};

export const initialDoses: Dose[] = [
  {
    id: "d1",
    time: "08:00 AM",
    label: "Morning",
    medicine: "Metformin",
    strength: "500 mg",
    amount: "1 tablet",
    instruction: "After breakfast",
    status: "taken",
  },
  {
    id: "d2",
    time: "09:00 AM",
    label: "Morning",
    medicine: "Amlodipine",
    strength: "5 mg",
    amount: "1 tablet",
    instruction: "With water",
    status: "taken",
  },
  {
    id: "d3",
    time: "02:00 PM",
    label: "Afternoon",
    medicine: "Atorvastatin",
    strength: "10 mg",
    amount: "1 tablet",
    instruction: "After lunch",
    status: "taken",
  },
  {
    id: "d4",
    time: "08:00 PM",
    label: "Evening",
    medicine: "Metformin",
    strength: "500 mg",
    amount: "1 tablet",
    instruction: "After dinner",
    status: "pending",
  },
];

export type SupplyItem = {
  id: string;
  medicine: string;
  strength: string;
  tabletsLeft: number;
  tabletsTotal: number;
  daysRemaining: number;
};

export const initialSupply: SupplyItem[] = [
  { id: "s1", medicine: "Metformin", strength: "500 mg", tabletsLeft: 6, tabletsTotal: 60, daysRemaining: 3 },
  { id: "s2", medicine: "Amlodipine", strength: "5 mg", tabletsLeft: 18, tabletsTotal: 30, daysRemaining: 18 },
  { id: "s3", medicine: "Atorvastatin", strength: "10 mg", tabletsLeft: 24, tabletsTotal: 30, daysRemaining: 24 },
];

export const weeklyAdherence = [
  { day: "Mon", taken: 4, planned: 4 },
  { day: "Tue", taken: 4, planned: 4 },
  { day: "Wed", taken: 3, planned: 4 },
  { day: "Thu", taken: 4, planned: 4 },
  { day: "Fri", taken: 3, planned: 4 },
  { day: "Sat", taken: 4, planned: 4 },
  { day: "Sun", taken: 3, planned: 4 },
];

export const medicationAdherence = [
  { medicine: "Metformin", value: 92 },
  { medicine: "Amlodipine", value: 84 },
  { medicine: "Atorvastatin", value: 91 },
];

export const adherenceTrend = [
  { week: "W1", value: 78 },
  { week: "W2", value: 82 },
  { week: "W3", value: 85 },
  { week: "W4", value: 84 },
  { week: "W5", value: 89 },
  { week: "W6", value: 87 },
];

export type DoctorPatient = {
  id: string;
  name: string;
  detail: string;
  medication: string;
  adherence: number;
  status: "Stable" | "Needs attention" | "New plan";
  lastActivity: string;
  verified: boolean;
};

export const doctorPatients: DoctorPatient[] = [
  {
    id: "p1",
    name: "Sunita Sharma",
    detail: "62 · Diabetes, hypertension",
    medication: "Metformin 500 mg +2",
    adherence: 87,
    status: "Needs attention",
    lastActivity: "Evening dose pending",
    verified: true,
  },
  {
    id: "p2",
    name: "Iqbal Ahmed",
    detail: "58 · Hypertension",
    medication: "Telmisartan 40 mg",
    adherence: 96,
    status: "Stable",
    lastActivity: "Acknowledged 2h ago",
    verified: true,
  },
  {
    id: "p3",
    name: "Meera Nair",
    detail: "47 · Thyroid",
    medication: "Levothyroxine 50 mcg",
    adherence: 93,
    status: "Stable",
    lastActivity: "Acknowledged today",
    verified: true,
  },
  {
    id: "p4",
    name: "Ramesh Patil",
    detail: "71 · Post-cardiac care",
    medication: "Aspirin 75 mg +3",
    adherence: 68,
    status: "Needs attention",
    lastActivity: "2 doses missed",
    verified: true,
  },
  {
    id: "p5",
    name: "Anjali Deshmukh",
    detail: "34 · Anaemia",
    medication: "Ferrous ascorbate",
    adherence: 81,
    status: "New plan",
    lastActivity: "Plan awaiting review",
    verified: false,
  },
];

export const caregiverAlerts = [
  {
    id: "a1",
    tone: "warning" as const,
    title: "Evening acknowledgement missed repeatedly",
    detail: "Sunita has not acknowledged the 8:00 PM Metformin dose on 2 of the last 3 days.",
    time: "Today · 8:35 PM",
  },
  {
    id: "a2",
    tone: "danger" as const,
    title: "Metformin supply running low",
    detail: "About 3 days of Metformin 500 mg left based on the current plan.",
    time: "Today · 7:10 AM",
  },
  {
    id: "a3",
    tone: "success" as const,
    title: "Morning medication complete",
    detail: "Both morning doses were acknowledged on time.",
    time: "Today · 9:05 AM",
  },
  {
    id: "a4",
    tone: "info" as const,
    title: "Doctor updated the medication plan",
    detail: "Dr. Amit Sharma verified the latest prescription.",
    time: "Yesterday · 6:20 PM",
  },
];

export type PharmacyRequestStatus = "pending" | "confirmed" | "unavailable";

export type PharmacyRequest = {
  id: string;
  medicine: string;
  strength: string;
  quantity: string;
  patientLabel: string;
  time: string;
  status: PharmacyRequestStatus;
};

export const initialPharmacyRequests: PharmacyRequest[] = [
  {
    id: "r1",
    medicine: "Metformin",
    strength: "500 mg",
    quantity: "2 strips",
    patientLabel: "Patient S. (via Swasthya)",
    time: "4 min ago",
    status: "pending",
  },
  {
    id: "r2",
    medicine: "Amlodipine",
    strength: "5 mg",
    quantity: "1 strip",
    patientLabel: "Patient I. (via Swasthya)",
    time: "22 min ago",
    status: "pending",
  },
  {
    id: "r3",
    medicine: "Levothyroxine",
    strength: "50 mcg",
    quantity: "1 bottle",
    patientLabel: "Patient M. (via Swasthya)",
    time: "1 h ago",
    status: "confirmed",
  },
  {
    id: "r4",
    medicine: "Ferrous ascorbate",
    strength: "100 mg",
    quantity: "2 strips",
    patientLabel: "Patient A. (via Swasthya)",
    time: "2 h ago",
    status: "unavailable",
  },
];

export type Pharmacy = {
  id: string;
  name: string;
  area: string;
  distanceKm: number;
  open: string;
  connected: boolean;
  x: number;
  y: number;
};

export const pharmacies: Pharmacy[] = [
  { id: "ph1", name: "ABC Medical", area: "Kothrud", distanceKm: 1.2, open: "Open till 11 PM", connected: true, x: 32, y: 34 },
  { id: "ph2", name: "Sanjeevani Pharmacy", area: "Karve Nagar", distanceKm: 2.4, open: "Open till 10 PM", connected: true, x: 68, y: 26 },
  { id: "ph3", name: "Shree Medico", area: "Warje", distanceKm: 3.1, open: "Open 24 hours", connected: false, x: 58, y: 70 },
  { id: "ph4", name: "Nirmal Chemists", area: "Erandwane", distanceKm: 3.8, open: "Open till 9 PM", connected: true, x: 22, y: 74 },
];

export const prescriptionFields = [
  { label: "Medicine", value: "Metformin" },
  { label: "Strength", value: "500 mg" },
  { label: "Dose", value: "1 tablet" },
  { label: "Frequency", value: "Twice daily (1-0-1)" },
  { label: "Duration", value: "30 days" },
  { label: "Instruction", value: "After meals" },
];

export const journeySteps = [
  { n: "01", title: "Doctor", detail: "Registered doctor is verified by the medical council record." },
  { n: "02", title: "Prescription", detail: "Prescription is uploaded and read with AI assistance." },
  { n: "03", title: "Personalised plan", detail: "Doses are mapped to the patient's real daily routine." },
  { n: "04", title: "Reminder", detail: "Screen and voice reminders arrive at each dose time." },
  { n: "05", title: "Adherence", detail: "Every acknowledgement builds an honest adherence record." },
  { n: "06", title: "Caregiver", detail: "Family sees meaningful alerts, not constant noise." },
  { n: "07", title: "Medicine discovery", detail: "Low supply triggers a nearby pharmacy search." },
  { n: "08", title: "Pharmacy confirmation", detail: "The pharmacy confirms availability before the trip." },
];
