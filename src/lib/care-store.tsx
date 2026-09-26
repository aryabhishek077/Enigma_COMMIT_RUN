import { createContext, useCallback, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import {
  initialDoses,
  initialPharmacyRequests,
  initialSupply,
  pharmacies,
  caregiverAlerts as initialCaregiverAlerts,
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
  status: "ACTIVE" | "VERIFIED" | "SUPERSEDED" | "PENDING_VERIFICATION";
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
  // Demo domains requested
  "doctor@swasthya.demo": {
    password: "doctor123",
    user: { email: "doctor@swasthya.demo", name: "Dr. Amit Sharma", role: "doctor", codeOrReg: "MMC123456" },
  },
  "patient@swasthya.demo": {
    password: "patient123",
    user: { email: "patient@swasthya.demo", name: "Mrs. Sunita Sharma", role: "patient", codeOrReg: "SWS-P-8F42K91" },
  },
  "caregiver@swasthya.demo": {
    password: "caretaker123",
    user: { email: "caregiver@swasthya.demo", name: "Rahul Sharma", role: "caregiver", codeOrReg: "SWS-CG-4819" },
  },
  "pharmacy@swasthya.demo": {
    password: "medical123",
    user: { email: "pharmacy@swasthya.demo", name: "ABC Medical", role: "pharmacy", codeOrReg: "SWS-PH-9921" },
  },
  "admin@swasthya.demo": {
    password: "admin123",
    user: { email: "admin@swasthya.demo", name: "Swasthya Admin", role: "admin", codeOrReg: "Auditor" },
  },

  // Also support .com variants
  "doctor@swasthya.com": {
    password: "doctor123",
    user: { email: "doctor@swasthya.demo", name: "Dr. Amit Sharma", role: "doctor", codeOrReg: "MMC123456" },
  },
  "patient@swasthya.com": {
    password: "patient123",
    user: { email: "patient@swasthya.demo", name: "Mrs. Sunita Sharma", role: "patient", codeOrReg: "SWS-P-8F42K91" },
  },
  "caretaker@swasthya.com": {
    password: "caretaker123",
    user: { email: "caregiver@swasthya.demo", name: "Rahul Sharma", role: "caregiver", codeOrReg: "SWS-CG-4819" },
  },
  "medical@swasthya.com": {
    password: "medical123",
    user: { email: "pharmacy@swasthya.demo", name: "ABC Medical", role: "pharmacy", codeOrReg: "SWS-PH-9921" },
  },
  "admin@swasthya.com": {
    password: "admin123",
    user: { email: "admin@swasthya.demo", name: "Swasthya Admin", role: "admin", codeOrReg: "Auditor" },
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
  refreshFromDatabase: () => Promise<void>;
};

const CareContext = createContext<CareState | null>(null);

const STORAGE_KEY = "swasthya_care_auth_v4";

export function CareProvider({ children }: { children: ReactNode }) {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>({
    email: "patient@swasthya.demo",
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

  // Prescriptions (from Shared Database)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: "RX-001",
      patientName: "Mrs. Sunita Sharma",
      patientCode: "SWS-P-8F42K91",
      doctorName: "Dr. Amit Sharma",
      date: "2026-09-26",
      status: "ACTIVE",
      medicine: "Metformin",
      strength: "500 mg",
      dose: "1 tablet",
      frequency: "Twice daily",
      timing: "Morning + Night",
      duration: "30 days",
      instructions: "After meals",
      aiConfidence: "High (98%)",
    },
  ]);

  // Doses / Medication Schedules (from Shared Database)
  const [doses, setDoses] = useState<Dose[]>(initialDoses);

  // Supply / Inventory (from Shared Database)
  const [supply, setSupply] = useState<SupplyItem[]>(initialSupply);

  // Pharmacy Requests (from Shared Database)
  const [requests, setRequests] = useState<PharmacyRequest[]>(initialPharmacyRequests);

  // Alerts & Notifications (from Shared Database)
  const [alerts, setAlerts] = useState<CareAlert[]>(initialCaregiverAlerts);

  // Simulation flag
  const [hasRepeatedMissed, setHasRepeatedMissed] = useState(false);

  // Notification for patient / caregiver
  const [lastPatientNotification, setLastPatientNotification] = useState<string | null>(null);

  // Load auth state from localStorage
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEY);
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed.currentUser) setCurrentUser(parsed.currentUser);
        if (parsed.currentRole) setCurrentRole(parsed.currentRole);
        if (parsed.isAuthenticated !== undefined) setIsAuthenticated(parsed.isAuthenticated);
      }
    } catch {
      // ignore
    }
  }, []);

  // Save auth state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentUser,
          currentRole,
          isAuthenticated,
        }),
      );
    } catch {
      // ignore
    }
  }, [currentUser, currentRole, isAuthenticated]);

  /**
   * CENTRAL DATABASE SYNCHRONIZATION FUNCTION
   * Pulls latest relational tables from /api/db/all
   */
  const refreshFromDatabase = useCallback(async () => {
    try {
      const res = await fetch("/api/db/all", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();

      // 1. Prescriptions
      if (Array.isArray(data.prescriptions)) {
        const mappedRx: Prescription[] = data.prescriptions.map((p: any) => {
          const item = p.items?.[0] || {};
          return {
            id: p.id,
            patientName: p.patient_name || "Mrs. Sunita Sharma",
            patientCode: p.patient_code || "SWS-P-8F42K91",
            doctorName: p.doctor_name || "Dr. Amit Sharma",
            date: p.date || "2026-09-26",
            status: p.status || "ACTIVE",
            medicine: item.medicine_name || "Metformin",
            strength: item.strength || "500 mg",
            dose: item.dose || "1 tablet",
            frequency: item.frequency || "Twice daily",
            timing: item.timing || "Morning + Night",
            duration: item.duration || "30 days",
            instructions: item.instructions || "After meals",
            aiConfidence: item.ai_confidence || "High (98%)",
          };
        });
        setPrescriptions(mappedRx);
      }

      // 2. Schedules / Doses
      if (Array.isArray(data.schedules)) {
        const mappedDoses: Dose[] = data.schedules.map((s: any) => ({
          id: s.id,
          time: s.scheduled_time,
          label: s.label,
          medicine: s.medicine,
          strength: s.strength,
          amount: s.amount,
          instruction: s.instruction,
          status: s.status as DoseStatus,
        }));
        setDoses(mappedDoses);
      }

      // 3. Medications / Supply
      if (Array.isArray(data.medications)) {
        const mappedSupply: SupplyItem[] = data.medications.map((m: any) => ({
          id: m.id,
          medicine: m.medicine_name,
          strength: m.strength,
          tabletsLeft: m.tablets_left,
          tabletsTotal: m.tablets_total,
          daysRemaining: m.days_remaining,
        }));
        setSupply(mappedSupply);
      }

      // 4. Pharmacy Requests
      if (Array.isArray(data.medicine_requests)) {
        const mappedRequests: PharmacyRequest[] = data.medicine_requests.map((r: any) => ({
          id: r.id,
          medicine: r.medicine_name,
          strength: r.strength,
          quantity: `${r.quantity} pack(s)`,
          patientLabel: `${r.patient_name} (${r.patient_code})`,
          time: r.requested_at,
          status:
            r.status === "AVAILABLE"
              ? "confirmed"
              : r.status === "NOT_AVAILABLE"
              ? "unavailable"
              : "pending",
        }));
        setRequests(mappedRequests);
      }

      // 5. Notifications / Care Alerts
      if (Array.isArray(data.notifications)) {
        const mappedAlerts: CareAlert[] = data.notifications.map((n: any) => ({
          id: n.id,
          tone:
            n.type === "MEDICATION_ALERT"
              ? "warning"
              : n.type === "PHARMACY_RESPONSE"
              ? "success"
              : "info",
          title: n.title,
          detail: n.message,
          time: new Date(n.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        }));
        setAlerts(mappedAlerts);

        // Highlight latest notification for current user
        if (mappedAlerts.length > 0) {
          const latest = mappedAlerts[0]!;
          setLastPatientNotification(latest.detail);
        }
      }
    } catch (err) {
      console.warn("[CareStore] Sync error:", err);
    }
  }, []);

  // Poll database every 2.5 seconds + on window focus for continuous cross-user sync
  useEffect(() => {
    void refreshFromDatabase();
    const interval = setInterval(() => {
      void refreshFromDatabase();
    }, 2500);

    const onFocus = () => {
      void refreshFromDatabase();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [refreshFromDatabase]);

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
    void refreshFromDatabase();
    return { success: true };
  }, [refreshFromDatabase]);

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

  // Dose status update (TAKEN or MISSED or SNOOZED)
  const setDoseStatus = useCallback(
    async (id: string, status: DoseStatus) => {
      setDoses((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
      try {
        const targetDose = doses.find((d) => d.id === id);
        await fetch("/api/db/adherence", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            schedule_id: id,
            medicine_name: targetDose?.medicine || "Metformin",
            status: status === "taken" ? "TAKEN" : status === "missed" ? "MISSED" : "SNOOZED",
            patient_id: "PAT-001",
          }),
        });
        await refreshFromDatabase();
      } catch (e) {
        console.error("Failed to post adherence:", e);
      }
    },
    [doses, refreshFromDatabase],
  );

  // Simulate repeated missed doses
  const simulateRepeatedMissed = useCallback(async () => {
    setHasRepeatedMissed(true);
    setDoses((prev) =>
      prev.map((d) => (d.id === "d4" ? { ...d, status: "missed" } : d)),
    );
    try {
      await fetch("/api/db/adherence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schedule_id: "d4",
          medicine_name: "Metformin",
          status: "MISSED",
          patient_id: "PAT-001",
        }),
      });
      await refreshFromDatabase();
    } catch (e) {
      console.error("Failed to simulate missed dose:", e);
    }
  }, [refreshFromDatabase]);

  // Prescription Actions
  const verifyPrescription = useCallback(() => {
    // verified via addPrescription
  }, []);

  const addPrescription = useCallback(
    async (rx: Omit<Prescription, "id">) => {
      try {
        const res = await fetch("/api/db/prescription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            medicine_name: rx.medicine,
            strength: rx.strength,
            dose: rx.dose,
            frequency: rx.frequency,
            timing: rx.timing,
            duration: rx.duration,
            instructions: rx.instructions,
            ai_confidence: rx.aiConfidence,
            patient_id: "PAT-001",
            patient_name: "Mrs. Sunita Sharma",
            patient_code: "SWS-P-8F42K91",
            doctor_id: "DOC-001",
            doctor_name: "Dr. Amit Sharma",
            doctor_reg: "MMC123456",
          }),
        });
        if (res.ok) {
          await refreshFromDatabase();
        }
      } catch (e) {
        console.error("Failed to add prescription to database:", e);
      }
    },
    [refreshFromDatabase],
  );

  // Pharmacy Requests
  const createPharmacyRequest = useCallback(
    async (medicine: string, strength: string, quantity: string, pharmacyName: string) => {
      try {
        const qtyNum = parseInt(quantity.replace(/\D/g, "")) || 2;
        await fetch("/api/db/request-medicine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            medicine_name: medicine,
            strength: strength,
            quantity: qtyNum,
            pharmacy_id: "PHARMACY-001",
            pharmacy_name: pharmacyName,
            patient_id: "PAT-001",
            patient_name: "Mrs. Sunita Sharma",
            patient_code: "SWS-P-8F42K91",
            requested_by_user_id: currentUser?.codeOrReg || "PAT-001",
            requested_by_name: currentUser?.name || "Mrs. Sunita Sharma",
            requested_by_role: currentRole === "caregiver" ? "caregiver" : "patient",
            notes: `${quantity} requested. Shelf check required.`,
          }),
        });
        await refreshFromDatabase();
      } catch (e) {
        console.error("Failed to create medicine request:", e);
      }
    },
    [currentUser, currentRole, refreshFromDatabase],
  );

  const respondToRequest = useCallback(
    async (id: string, status: PharmacyRequestStatus) => {
      try {
        await fetch("/api/db/respond-medicine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            request_id: id,
            status: status === "confirmed" ? "AVAILABLE" : "NOT_AVAILABLE",
            pharmacy_name: "ABC Medical",
          }),
        });
        await refreshFromDatabase();
      } catch (e) {
        console.error("Failed to respond to request:", e);
      }
    },
    [refreshFromDatabase],
  );

  const clearNotification = useCallback(() => {
    setLastPatientNotification(null);
  }, []);

  // Reset demo
  const resetAllDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser({
      email: "patient@swasthya.demo",
      name: "Mrs. Sunita Sharma",
      role: "patient",
      codeOrReg: "SWS-P-8F42K91",
    });
    setIsAuthenticated(true);
    setCurrentRole("patient");
    void refreshFromDatabase();
  }, [refreshFromDatabase]);

  // Deterministic Adherence Calculation from database schedules & logs
  const takenCount = doses.filter((d) => d.status === "taken").length;
  const adherencePercent = doses.length > 0 ? Math.round((takenCount / doses.length) * 100) : 100;

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
      refreshFromDatabase,
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
      refreshFromDatabase,
    ],
  );

  return <CareContext.Provider value={value}>{children}</CareContext.Provider>;
}

export function useCare() {
  const ctx = useContext(CareContext);
  if (!ctx) throw new Error("useCare must be used inside CareProvider");
  return ctx;
}
