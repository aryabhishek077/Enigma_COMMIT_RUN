import { createContext, useCallback, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import {
  initialDoses,
  initialPharmacyRequests,
  initialSupply,
  pharmacies,
  caregiverAlerts as initialCaregiverAlerts,
  doctorPatients,
  type Dose,
  type DoseStatus,
  type PharmacyRequest,
  type PharmacyRequestStatus,
  type SupplyItem,
  type Pharmacy,
} from "./demo-data";

export type Role = "patient" | "doctor" | "caregiver" | "pharmacy" | "admin";

export type AuthUser = {
  email: string;
  name: string;
  role: Role;
  codeOrReg: string;
};

export type DoctorVerification = {
  doctorName: string;
  council: string;
  regNumber: string;
  specialization: string;
  status: "PENDING" | "VERIFIED" | "REJECTED";
  verifiedAt?: string;
};

export type DoctorPatientRel = {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  patientCode: string;
  status: "ACTIVE" | "PENDING" | "REJECTED";
  createdAt: string;
};

export type Prescription = {
  id: string;
  patientName: string;
  patientCode: string;
  doctorName: string;
  date: string;
  status: "VERIFIED" | "PENDING_VERIFICATION";
  medicine: string;
  strength: string;
  dose: string;
  frequency: string;
  timing: string;
  duration: string;
  instructions: string;
  aiConfidence: string;
};

export type CareAlert = {
  id: string;
  tone: "warning" | "danger" | "success" | "info";
  title: string;
  detail: string;
  time: string;
};

export const REGISTERED_ACCOUNTS: Record<string, { password: string; user: AuthUser }> = {
  "doctor@swasthya.com": {
    password: "doctor123",
    user: { email: "doctor@swasthya.com", name: "Dr. Amit Sharma", role: "doctor", codeOrReg: "MMC123456" },
  },
  "patient@swasthya.com": {
    password: "patient123",
    user: { email: "patient@swasthya.com", name: "Mrs. Sunita Sharma", role: "patient", codeOrReg: "SWS-P-8F42K91" },
  },
  "caretaker@swasthya.com": {
    password: "caretaker123",
    user: { email: "caretaker@swasthya.com", name: "Rahul Sharma", role: "caregiver", codeOrReg: "Caregiver (Son)" },
  },
  "medical@swasthya.com": {
    password: "medical123",
    user: { email: "medical@swasthya.com", name: "ABC Medical", role: "pharmacy", codeOrReg: "Lic: MH-PUN-2024" },
  },
  "admin@swasthya.com": {
    password: "admin123",
    user: { email: "admin@swasthya.com", name: "Swasthya Admin", role: "admin", codeOrReg: "Auditor" },
  },
};

type CareState = {
  // Authentication & Verification
  isAuthenticated: boolean;
  currentUser: AuthUser | null;
  loginUser: (email: string, pass: string) => { success: boolean; error?: string };
  logout: () => void;
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
  // Admin Doctor Verification
  doctorVerification: DoctorVerification;
  verifyDoctor: () => void;
  rejectDoctor: () => void;
  // Doctor Patient Authorization
  doctorPatientRels: DoctorPatientRel[];
  requestDoctorConnection: (doctorName: string) => void;
  approveDoctorConnection: (relId: string) => void;
  // Prescriptions & AI extraction
  prescriptions: Prescription[];
  verifyPrescription: (rxId?: string) => void;
  addPrescription: (rx: Omit<Prescription, "id">) => void;
  // Doses & Adherence
  doses: Dose[];
  setDoseStatus: (id: string, status: DoseStatus) => void;
  simulateRepeatedMissed: () => void;
  hasRepeatedMissed: boolean;
  takenCount: number;
  adherencePercent: number;
  // Supply
  supply: SupplyItem[];
  // Pharmacy Requests
  requests: PharmacyRequest[];
  pharmaciesList: Pharmacy[];
  createPharmacyRequest: (medicine: string, strength: string, quantity: string, pharmacyName: string) => void;
  respondToRequest: (id: string, status: PharmacyRequestStatus) => void;
  lastPatientNotification: string | null;
  clearNotification: () => void;
  // Caregiver Alerts
  alerts: CareAlert[];
  // Reset demo
  resetAllDemoData: () => void;
};

const CareContext = createContext<CareState | null>(null);

const STORAGE_KEY = "swasthya_care_state_v3";

export function CareProvider({ children }: { children: ReactNode }) {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>({
    email: "patient@swasthya.com",
    name: "Mrs. Sunita Sharma",
    role: "patient",
    codeOrReg: "SWS-P-8F42K91",
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentRole, setCurrentRole] = useState<Role>("patient");

  // Doctor Verification
  const [doctorVerification, setDoctorVerification] = useState<DoctorVerification>({
    doctorName: "Dr. Amit Sharma",
    council: "Maharashtra Medical Council",
    regNumber: "MMC123456",
    specialization: "General Medicine",
    status: "VERIFIED",
    verifiedAt: "26 Sep 2026",
  });

  // Doctor-Patient Relationships
  const [doctorPatientRels, setDoctorPatientRels] = useState<DoctorPatientRel[]>([
    {
      id: "rel-1",
      doctorId: "doc-1",
      doctorName: "Dr. Amit Sharma",
      patientId: "pat-1",
      patientName: "Mrs. Sunita Sharma",
      patientCode: "SWS-P-8F42K91",
      status: "ACTIVE",
      createdAt: "2026-08-15",
    },
  ]);

  // Prescriptions
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: "rx-101",
      patientName: "Mrs. Sunita Sharma",
      patientCode: "SWS-P-8F42K91",
      doctorName: "Dr. Amit Sharma",
      date: "2026-09-26",
      status: "VERIFIED",
      medicine: "Metformin",
      strength: "500 mg",
      dose: "1 tablet",
      frequency: "Twice daily",
      timing: "Morning + Night",
      duration: "30 days",
      instructions: "After meals",
      aiConfidence: "High (98%)",
    },
    {
      id: "rx-102",
      patientName: "Mrs. Sunita Sharma",
      patientCode: "SWS-P-8F42K91",
      doctorName: "Dr. Amit Sharma",
      date: "2026-09-20",
      status: "VERIFIED",
      medicine: "Amlodipine",
      strength: "5 mg",
      dose: "1 tablet",
      frequency: "Once daily",
      timing: "Morning",
      duration: "30 days",
      instructions: "With water",
      aiConfidence: "High (99%)",
    },
  ]);

  // Doses
  const [doses, setDoses] = useState<Dose[]>(initialDoses);

  // Supply
  const [supply, setSupply] = useState<SupplyItem[]>(initialSupply);

  // Pharmacy Requests
  const [requests, setRequests] = useState<PharmacyRequest[]>(initialPharmacyRequests);

  // Alerts
  const [alerts, setAlerts] = useState<CareAlert[]>(initialCaregiverAlerts);

  // Missed simulation flag
  const [hasRepeatedMissed, setHasRepeatedMissed] = useState(false);

  // Real-time notification for patient
  const [lastPatientNotification, setLastPatientNotification] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.doctorVerification) setDoctorVerification(parsed.doctorVerification);
        if (parsed.doctorPatientRels) setDoctorPatientRels(parsed.doctorPatientRels);
        if (parsed.prescriptions) setPrescriptions(parsed.prescriptions);
        if (parsed.doses) setDoses(parsed.doses);
        if (parsed.supply) setSupply(parsed.supply);
        if (parsed.requests) setRequests(parsed.requests);
        if (parsed.hasRepeatedMissed !== undefined) setHasRepeatedMissed(parsed.hasRepeatedMissed);
        if (parsed.currentRole) setCurrentRole(parsed.currentRole);
        if (parsed.currentUser) setCurrentUser(parsed.currentUser);
        if (parsed.isAuthenticated !== undefined) setIsAuthenticated(parsed.isAuthenticated);
      }
    } catch (e) {
      console.warn("Could not parse saved care state", e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          doctorVerification,
          doctorPatientRels,
          prescriptions,
          doses,
          supply,
          requests,
          hasRepeatedMissed,
          currentRole,
          currentUser,
          isAuthenticated,
        }),
      );
    } catch {
      // ignore
    }
  }, [
    doctorVerification,
    doctorPatientRels,
    prescriptions,
    doses,
    supply,
    requests,
    hasRepeatedMissed,
    currentRole,
    currentUser,
    isAuthenticated,
  ]);

  // Authentication logic
  const loginUser = useCallback((email: string, pass: string) => {
    const acc = REGISTERED_ACCOUNTS[email.trim().toLowerCase()];
    if (!acc) {
      return { success: false, error: "Account not found. Use one of the 4 demo accounts." };
    }
    if (acc.password !== pass) {
      return { success: false, error: `Invalid password. Demo password is "${acc.password}".` };
    }
    setCurrentUser(acc.user);
    setIsAuthenticated(true);
    setCurrentRole(acc.user.role);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  }, []);

  // Admin Actions
  const verifyDoctor = useCallback(() => {
    setDoctorVerification((prev) => ({
      ...prev,
      status: "VERIFIED",
      verifiedAt: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
    }));
  }, []);

  const rejectDoctor = useCallback(() => {
    setDoctorVerification((prev) => ({
      ...prev,
      status: "REJECTED",
    }));
  }, []);

  // Connection Actions
  const requestDoctorConnection = useCallback((doctorName: string) => {
    setDoctorPatientRels((prev) => [
      ...prev,
      {
        id: "rel-" + Date.now(),
        doctorId: "doc-" + Date.now(),
        doctorName,
        patientId: "pat-1",
        patientName: "Mrs. Sunita Sharma",
        patientCode: "SWS-P-8F42K91",
        status: "ACTIVE",
        createdAt: "Today",
      },
    ]);
  }, []);

  const approveDoctorConnection = useCallback((relId: string) => {
    setDoctorPatientRels((prev) =>
      prev.map((r) => (r.id === relId ? { ...r, status: "ACTIVE" } : r)),
    );
  }, []);

  // Dose status update
  const setDoseStatus = useCallback((id: string, status: DoseStatus) => {
    setDoses((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    if (status === "taken") {
      setSupply((prev) =>
        prev.map((s) => {
          const match = initialDoses.find((d) => d.id === id);
          if (match && s.medicine.toLowerCase() === match.medicine.toLowerCase() && s.tabletsLeft > 0) {
            const nextLeft = s.tabletsLeft - 1;
            return {
              ...s,
              tabletsLeft: nextLeft,
              daysRemaining: Math.max(0, Math.floor(nextLeft / 2)),
            };
          }
          return s;
        }),
      );
    }
  }, []);

  // Simulate repeated missed doses
  const simulateRepeatedMissed = useCallback(() => {
    setHasRepeatedMissed(true);
    setDoses((prev) =>
      prev.map((d) => (d.id === "d4" ? { ...d, status: "missed" } : d)),
    );
    setAlerts((prev) => [
      {
        id: "a-alert-" + Date.now(),
        tone: "warning",
        title: "Sunita has missed the evening medication acknowledgement multiple times this week",
        detail: "Pattern detected: 3 of last 4 evening Metformin 500 mg doses were not confirmed.",
        time: "Just now",
      },
      ...prev,
    ]);
  }, []);

  // Prescription Actions
  const verifyPrescription = useCallback((rxId?: string) => {
    setPrescriptions((prev) =>
      prev.map((rx) =>
        !rxId || rx.id === rxId ? { ...rx, status: "VERIFIED" } : rx,
      ),
    );
  }, []);

  const addPrescription = useCallback((rx: Omit<Prescription, "id">) => {
    const newRx: Prescription = {
      ...rx,
      id: "rx-" + Date.now(),
    };
    setPrescriptions((prev) => [newRx, ...prev]);
  }, []);

  // Pharmacy Requests
  const createPharmacyRequest = useCallback(
    (medicine: string, strength: string, quantity: string, pharmacyName: string) => {
      const newReq: PharmacyRequest = {
        id: "req-" + Date.now(),
        medicine,
        strength,
        quantity,
        patientLabel: "Sunita Sharma (SWS-P-8F42K91)",
        time: "Just now",
        status: "pending",
      };
      setRequests((prev) => [newReq, ...prev]);
      setLastPatientNotification(`Availability request sent to ${pharmacyName} for ${medicine} ${strength}.`);
    },
    [],
  );

  const respondToRequest = useCallback((id: string, status: PharmacyRequestStatus) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return { ...r, status };
        }
        return r;
      }),
    );
    const target = requests.find((r) => r.id === id);
    if (target) {
      if (status === "confirmed") {
        setLastPatientNotification(`ABC Medical confirmed availability of ${target.medicine} ${target.strength}.`);
      } else {
        setLastPatientNotification(`ABC Medical could not confirm availability of ${target.medicine} ${target.strength}.`);
      }
    }
  }, [requests]);

  const clearNotification = useCallback(() => {
    setLastPatientNotification(null);
  }, []);

  // Reset demo
  const resetAllDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser({
      email: "patient@swasthya.com",
      name: "Mrs. Sunita Sharma",
      role: "patient",
      codeOrReg: "SWS-P-8F42K91",
    });
    setIsAuthenticated(true);
    setCurrentRole("patient");
    setDoctorVerification({
      doctorName: "Dr. Amit Sharma",
      council: "Maharashtra Medical Council",
      regNumber: "MMC123456",
      specialization: "General Medicine",
      status: "VERIFIED",
      verifiedAt: "26 Sep 2026",
    });
    setDoses(initialDoses);
    setSupply(initialSupply);
    setRequests(initialPharmacyRequests);
    setAlerts(initialCaregiverAlerts);
    setHasRepeatedMissed(false);
    setLastPatientNotification(null);
  }, []);

  const takenCount = doses.filter((d) => d.status === "taken").length;
  const adherencePercent = Math.round((takenCount / doses.length) * 100);

  const value = useMemo<CareState>(
    () => ({
      isAuthenticated,
      currentUser,
      loginUser,
      logout,
      currentRole,
      setCurrentRole,
      doctorVerification,
      verifyDoctor,
      rejectDoctor,
      doctorPatientRels,
      requestDoctorConnection,
      approveDoctorConnection,
      prescriptions,
      verifyPrescription,
      addPrescription,
      doses,
      setDoseStatus,
      simulateRepeatedMissed,
      hasRepeatedMissed,
      takenCount,
      adherencePercent,
      supply,
      requests,
      pharmaciesList: pharmacies,
      createPharmacyRequest,
      respondToRequest,
      lastPatientNotification,
      clearNotification,
      alerts,
      resetAllDemoData,
    }),
    [
      isAuthenticated,
      currentUser,
      loginUser,
      logout,
      currentRole,
      doctorVerification,
      verifyDoctor,
      rejectDoctor,
      doctorPatientRels,
      requestDoctorConnection,
      approveDoctorConnection,
      prescriptions,
      verifyPrescription,
      addPrescription,
      doses,
      setDoseStatus,
      simulateRepeatedMissed,
      hasRepeatedMissed,
      takenCount,
      adherencePercent,
      supply,
      requests,
      createPharmacyRequest,
      respondToRequest,
      lastPatientNotification,
      clearNotification,
      alerts,
      resetAllDemoData,
    ],
  );

  return <CareContext.Provider value={value}>{children}</CareContext.Provider>;
}

export function useCare() {
  const ctx = useContext(CareContext);
  if (!ctx) throw new Error("useCare must be used inside CareProvider");
  return ctx;
}
