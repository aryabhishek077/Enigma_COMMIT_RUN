import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  initialDoses,
  initialPharmacyRequests,
  initialSupply,
  type Dose,
  type DoseStatus,
  type PharmacyRequest,
  type PharmacyRequestStatus,
  type SupplyItem,
} from "./demo-data";

type CareState = {
  doses: Dose[];
  supply: SupplyItem[];
  requests: PharmacyRequest[];
  prescriptionVerified: boolean;
  doctorVerified: boolean;
  availabilityConfirmedBy: string | null;
  setDoseStatus: (id: string, status: DoseStatus) => void;
  setRequestStatus: (id: string, status: PharmacyRequestStatus) => void;
  verifyPrescription: () => void;
  verifyDoctor: () => void;
  confirmAvailability: (pharmacyName: string) => void;
  resetAvailability: () => void;
  takenCount: number;
  adherencePercent: number;
};

const CareContext = createContext<CareState | null>(null);

export function CareProvider({ children }: { children: ReactNode }) {
  const [doses, setDoses] = useState<Dose[]>(initialDoses);
  const [supply, setSupply] = useState<SupplyItem[]>(initialSupply);
  const [requests, setRequests] = useState<PharmacyRequest[]>(initialPharmacyRequests);
  const [prescriptionVerified, setPrescriptionVerified] = useState(false);
  const [doctorVerified, setDoctorVerified] = useState(false);
  const [availabilityConfirmedBy, setAvailabilityConfirmedBy] = useState<string | null>(null);

  const setDoseStatus = useCallback((id: string, status: DoseStatus) => {
    setDoses((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    if (status === "taken") {
      setSupply((prev) =>
        prev.map((s) =>
          s.medicine === initialDoses.find((d) => d.id === id)?.medicine && s.tabletsLeft > 0
            ? { ...s, tabletsLeft: s.tabletsLeft - 1 }
            : s,
        ),
      );
    }
  }, []);

  const setRequestStatus = useCallback((id: string, status: PharmacyRequestStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }, []);

  const takenCount = doses.filter((d) => d.status === "taken").length;
  const adherencePercent = Math.round((takenCount / doses.length) * 100);

  const value = useMemo<CareState>(
    () => ({
      doses,
      supply,
      requests,
      prescriptionVerified,
      doctorVerified,
      availabilityConfirmedBy,
      setDoseStatus,
      setRequestStatus,
      verifyPrescription: () => setPrescriptionVerified(true),
      verifyDoctor: () => setDoctorVerified(true),
      confirmAvailability: (name: string) => setAvailabilityConfirmedBy(name),
      resetAvailability: () => setAvailabilityConfirmedBy(null),
      takenCount,
      adherencePercent,
    }),
    [
      doses,
      supply,
      requests,
      prescriptionVerified,
      doctorVerified,
      availabilityConfirmedBy,
      setDoseStatus,
      setRequestStatus,
      takenCount,
      adherencePercent,
    ],
  );

  return <CareContext.Provider value={value}>{children}</CareContext.Provider>;
}

export function useCare() {
  const ctx = useContext(CareContext);
  if (!ctx) throw new Error("useCare must be used inside CareProvider");
  return ctx;
}
