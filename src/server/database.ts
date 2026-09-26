import fs from "node:fs";
import path from "node:path";

export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  medicine_name: string;
  strength: string;
  dose: string;
  frequency: string;
  timing: string;
  duration: string;
  instructions: string;
  ai_confidence?: string;
  created_at: string;
}

export interface PrescriptionRecord {
  id: string;
  doctor_id: string;
  doctor_name: string;
  doctor_reg: string;
  patient_id: string;
  patient_code: string;
  patient_name: string;
  status: "ACTIVE" | "VERIFIED" | "SUPERSEDED";
  date: string;
  created_at: string;
  items: PrescriptionItem[];
}

export interface MedicationRecord {
  id: string;
  patient_id: string;
  medicine_name: string;
  strength: string;
  tablets_left: number;
  tablets_total: number;
  days_remaining: number;
  is_active: boolean;
  updated_at: string;
}

export interface ScheduleRecord {
  id: string;
  patient_id: string;
  medication_id?: string;
  scheduled_time: string;
  label: string;
  medicine: string;
  strength: string;
  amount: string;
  instruction: string;
  status: "pending" | "taken" | "snoozed" | "missed";
  updated_at: string;
}

export interface AdherenceLog {
  id: string;
  patient_id: string;
  schedule_id?: string;
  medicine_name: string;
  status: "TAKEN" | "MISSED" | "SNOOZED";
  scheduled_time: string;
  logged_at: string;
}

export interface MedicineRequestRecord {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_code: string;
  requested_by_user_id: string;
  requested_by_name: string;
  requested_by_role: "patient" | "caregiver";
  pharmacy_id: string;
  pharmacy_name: string;
  medicine_name: string;
  strength: string;
  quantity: number;
  status: "PENDING" | "AVAILABLE" | "NOT_AVAILABLE";
  notes?: string;
  requested_at: string;
  responded_at?: string;
}

export interface NotificationRecord {
  id: string;
  recipient_user_id: string;
  recipient_role: "patient" | "caregiver" | "doctor" | "pharmacy" | "all";
  type: "PRESCRIPTION_UPDATE" | "MEDICATION_ALERT" | "PHARMACY_RESPONSE" | "REQUEST_RECEIVED";
  title: string;
  message: string;
  related_entity_type?: string;
  related_entity_id?: string;
  read: boolean;
  created_at: string;
}

export interface DatabaseState {
  prescriptions: PrescriptionRecord[];
  medications: MedicationRecord[];
  schedules: ScheduleRecord[];
  adherence_logs: AdherenceLog[];
  medicine_requests: MedicineRequestRecord[];
  notifications: NotificationRecord[];
  last_updated: string;
}

const DB_DIR = path.resolve(process.cwd(), "data");
const DB_FILE = path.resolve(DB_DIR, "swasthya-db.json");

function getInitialDatabaseState(): DatabaseState {
  const now = new Date().toISOString();
  return {
    prescriptions: [
      {
        id: "RX-001",
        doctor_id: "DOC-001",
        doctor_name: "Dr. Amit Sharma",
        doctor_reg: "MMC123456",
        patient_id: "PAT-001",
        patient_code: "SWS-P-8F42K91",
        patient_name: "Mrs. Sunita Sharma",
        status: "ACTIVE",
        date: "2026-09-26",
        created_at: now,
        items: [
          {
            id: "ITEM-001",
            prescription_id: "RX-001",
            medicine_name: "Metformin",
            strength: "500 mg",
            dose: "1 tablet",
            frequency: "Twice daily",
            timing: "Morning + Night",
            duration: "30 days",
            instructions: "After meals",
            ai_confidence: "High (98%)",
            created_at: now,
          },
          {
            id: "ITEM-002",
            prescription_id: "RX-001",
            medicine_name: "Amlodipine",
            strength: "5 mg",
            dose: "1 tablet",
            frequency: "Once daily",
            timing: "Morning",
            duration: "30 days",
            instructions: "With water",
            ai_confidence: "High (99%)",
            created_at: now,
          },
        ],
      },
    ],
    medications: [
      {
        id: "MED-001",
        patient_id: "PAT-001",
        medicine_name: "Metformin",
        strength: "500 mg",
        tablets_left: 6,
        tablets_total: 60,
        days_remaining: 3,
        is_active: true,
        updated_at: now,
      },
      {
        id: "MED-002",
        patient_id: "PAT-001",
        medicine_name: "Amlodipine",
        strength: "5 mg",
        tablets_left: 18,
        tablets_total: 30,
        days_remaining: 18,
        is_active: true,
        updated_at: now,
      },
    ],
    schedules: [
      {
        id: "d1",
        patient_id: "PAT-001",
        scheduled_time: "08:00 AM",
        label: "Morning",
        medicine: "Metformin",
        strength: "500 mg",
        amount: "1 tablet",
        instruction: "After breakfast",
        status: "taken",
        updated_at: now,
      },
      {
        id: "d2",
        patient_id: "PAT-001",
        scheduled_time: "08:00 AM",
        label: "Morning",
        medicine: "Amlodipine",
        strength: "5 mg",
        amount: "1 tablet",
        instruction: "With water",
        status: "taken",
        updated_at: now,
      },
      {
        id: "d3",
        patient_id: "PAT-001",
        scheduled_time: "02:00 PM",
        label: "Afternoon",
        medicine: "Multivitamin",
        strength: "Daily",
        amount: "1 tablet",
        instruction: "After lunch",
        status: "taken",
        updated_at: now,
      },
      {
        id: "d4",
        patient_id: "PAT-001",
        scheduled_time: "08:00 PM",
        label: "Evening",
        medicine: "Metformin",
        strength: "500 mg",
        amount: "1 tablet",
        instruction: "After dinner",
        status: "pending",
        updated_at: now,
      },
    ],
    adherence_logs: [
      {
        id: "LOG-01",
        patient_id: "PAT-001",
        schedule_id: "d1",
        medicine_name: "Metformin",
        status: "TAKEN",
        scheduled_time: "08:00 AM",
        logged_at: now,
      },
      {
        id: "LOG-02",
        patient_id: "PAT-001",
        schedule_id: "d2",
        medicine_name: "Amlodipine",
        status: "TAKEN",
        scheduled_time: "08:00 AM",
        logged_at: now,
      },
      {
        id: "LOG-03",
        patient_id: "PAT-001",
        schedule_id: "d3",
        medicine_name: "Multivitamin",
        status: "TAKEN",
        scheduled_time: "02:00 PM",
        logged_at: now,
      },
    ],
    medicine_requests: [
      {
        id: "REQ-001",
        patient_id: "PAT-001",
        patient_name: "Mrs. Sunita Sharma",
        patient_code: "SWS-P-8F42K91",
        requested_by_user_id: "CAREGIVER-001",
        requested_by_name: "Rahul Sharma",
        requested_by_role: "caregiver",
        pharmacy_id: "PHARMACY-001",
        pharmacy_name: "ABC Medical",
        medicine_name: "Metformin",
        strength: "500 mg",
        quantity: 2,
        status: "PENDING",
        notes: "3 days supply remaining. Urgent refill requested for elderly mother.",
        requested_at: "Today, 10:30 AM",
      },
    ],
    notifications: [
      {
        id: "NOTIF-001",
        recipient_user_id: "CAREGIVER-001",
        recipient_role: "caregiver",
        type: "MEDICATION_ALERT",
        title: "Sunita has missed the evening medication acknowledgement multiple times this week",
        message: "Pattern detected: 3 of last 4 evening Metformin 500 mg doses were not confirmed.",
        read: false,
        created_at: now,
      },
    ],
    last_updated: now,
  };
}

class DatabaseManager {
  private state: DatabaseState;

  constructor() {
    this.state = this.loadFromDisk();
  }

  private loadFromDisk(): DatabaseState {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw) as DatabaseState;
        if (parsed && Array.isArray(parsed.prescriptions)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("[DatabaseManager] Could not read existing DB file, initializing seed:", e);
    }
    const seed = getInitialDatabaseState();
    this.saveToDisk(seed);
    return seed;
  }

  private saveToDisk(stateToSave: DatabaseState) {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(stateToSave, null, 2), "utf-8");
    } catch (e) {
      console.error("[DatabaseManager] Failed to write database to disk:", e);
    }
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public resetSeed(): DatabaseState {
    const seed = getInitialDatabaseState();
    this.state = seed;
    this.saveToDisk(seed);
    return seed;
  }

  /**
   * TEST 1 & TEST 4: Doctor creates or updates prescription
   * Supersedes old active prescriptions for the same medicine and creates new active prescription
   */
  public createOrUpdatePrescription(payload: {
    doctor_id?: string;
    doctor_name?: string;
    doctor_reg?: string;
    patient_id?: string;
    patient_name?: string;
    patient_code?: string;
    medicine_name: string;
    strength: string;
    dose?: string;
    frequency?: string;
    timing?: string;
    duration?: string;
    instructions?: string;
    ai_confidence?: string;
  }): { prescription: PrescriptionRecord; state: DatabaseState } {
    const now = new Date().toISOString();
    const rxId = "RX-" + Date.now();
    const medicine = payload.medicine_name.trim();
    const strength = payload.strength.trim();
    const dose = payload.dose || "1 tablet";
    const frequency = payload.frequency || "Twice daily";
    const timing = payload.timing || "Morning + Night";
    const duration = payload.duration || "30 days";
    const instructions = payload.instructions || "After meals";

    // 1. Mark existing ACTIVE prescriptions for this medicine as SUPERSEDED (Do NOT overwrite history)
    this.state.prescriptions = this.state.prescriptions.map((p) => {
      const hasMed = p.items.some(
        (it) => it.medicine_name.toLowerCase() === medicine.toLowerCase(),
      );
      if (hasMed && p.status === "ACTIVE") {
        return { ...p, status: "SUPERSEDED" };
      }
      return p;
    });

    // 2. Create the NEW ACTIVE prescription
    const newRx: PrescriptionRecord = {
      id: rxId,
      doctor_id: payload.doctor_id || "DOC-001",
      doctor_name: payload.doctor_name || "Dr. Amit Sharma",
      doctor_reg: payload.doctor_reg || "MMC123456",
      patient_id: payload.patient_id || "PAT-001",
      patient_code: payload.patient_code || "SWS-P-8F42K91",
      patient_name: payload.patient_name || "Mrs. Sunita Sharma",
      status: "ACTIVE",
      date: new Date().toISOString().split("T")[0] || "2026-09-26",
      created_at: now,
      items: [
        {
          id: "ITEM-" + Date.now(),
          prescription_id: rxId,
          medicine_name: medicine,
          strength: strength,
          dose: dose,
          frequency: frequency,
          timing: timing,
          duration: duration,
          instructions: instructions,
          ai_confidence: payload.ai_confidence || "High (98%)",
          created_at: now,
        },
      ],
    };
    this.state.prescriptions = [newRx, ...this.state.prescriptions];

    // 3. Update or Insert into Medications
    const medIndex = this.state.medications.findIndex(
      (m) => m.medicine_name.toLowerCase() === medicine.toLowerCase(),
    );
    if (medIndex >= 0) {
      this.state.medications[medIndex] = {
        ...this.state.medications[medIndex]!,
        strength: strength,
        tablets_left: 30,
        tablets_total: 30,
        days_remaining: 15,
        updated_at: now,
      };
    } else {
      this.state.medications.push({
        id: "MED-" + Date.now(),
        patient_id: payload.patient_id || "PAT-001",
        medicine_name: medicine,
        strength: strength,
        tablets_left: 30,
        tablets_total: 30,
        days_remaining: 15,
        is_active: true,
        updated_at: now,
      });
    }

    // 4. Update or Insert into Medication Schedules (Schedule for Patient Sunita)
    let foundInSchedule = false;
    this.state.schedules = this.state.schedules.map((s) => {
      if (s.medicine.toLowerCase() === medicine.toLowerCase()) {
        foundInSchedule = true;
        return {
          ...s,
          strength: strength,
          amount: dose,
          instruction: instructions,
          status: "pending" as const,
          updated_at: now,
        };
      }
      return s;
    });

    if (!foundInSchedule) {
      this.state.schedules.push({
        id: "d-" + Date.now(),
        patient_id: payload.patient_id || "PAT-001",
        scheduled_time: "08:00 PM",
        label: "Evening",
        medicine: medicine,
        strength: strength,
        amount: dose,
        instruction: instructions,
        status: "pending",
        updated_at: now,
      });
    }

    // 5. Generate Auditable Notifications
    // To Patient:
    this.state.notifications.unshift({
      id: "NOTIF-P-" + Date.now(),
      recipient_user_id: "PAT-001",
      recipient_role: "patient",
      type: "PRESCRIPTION_UPDATE",
      title: "Medication Plan Updated",
      message: `Dr. Amit Sharma updated your medication plan: ${medicine} ${strength} (${frequency}).`,
      related_entity_type: "prescription",
      related_entity_id: rxId,
      read: false,
      created_at: now,
    });

    // To Caregiver:
    this.state.notifications.unshift({
      id: "NOTIF-CG-" + Date.now(),
      recipient_user_id: "CAREGIVER-001",
      recipient_role: "caregiver",
      type: "PRESCRIPTION_UPDATE",
      title: `Doctor updated medication plan: ${medicine} ${strength}`,
      message: `Dr. Amit Sharma (MMC123456) verified a new prescription for Sunita Sharma: ${medicine} ${strength}, ${dose}, ${frequency}, ${instructions}.`,
      related_entity_type: "prescription",
      related_entity_id: rxId,
      read: false,
      created_at: now,
    });

    this.state.last_updated = now;
    this.saveToDisk(this.state);
    return { prescription: newRx, state: this.state };
  }

  /**
   * Log adherence response (TAKEN or MISSED or SNOOZED)
   */
  public logAdherence(payload: {
    patient_id?: string;
    schedule_id?: string;
    medicine_name?: string;
    status: "TAKEN" | "MISSED" | "SNOOZED";
    scheduled_time?: string;
  }): DatabaseState {
    const now = new Date().toISOString();
    const scheduleId = payload.schedule_id || "d4";
    const status = payload.status;

    // 1. Update schedule row
    const targetSchedule = this.state.schedules.find((s) => s.id === scheduleId);
    const medName = payload.medicine_name || targetSchedule?.medicine || "Metformin";

    if (targetSchedule) {
      targetSchedule.status = status === "TAKEN" ? "taken" : status === "MISSED" ? "missed" : "snoozed";
      targetSchedule.updated_at = now;
    }

    // 2. Insert into adherence_logs
    this.state.adherence_logs.unshift({
      id: "LOG-" + Date.now(),
      patient_id: payload.patient_id || "PAT-001",
      schedule_id: scheduleId,
      medicine_name: medName,
      status: status,
      scheduled_time: payload.scheduled_time || targetSchedule?.scheduled_time || "08:00 PM",
      logged_at: now,
    });

    // 3. If TAKEN, decrement medication stock
    if (status === "TAKEN") {
      const med = this.state.medications.find(
        (m) => m.medicine_name.toLowerCase() === medName.toLowerCase(),
      );
      if (med && med.tablets_left > 0) {
        med.tablets_left -= 1;
        med.days_remaining = Math.max(0, Math.floor(med.tablets_left / 2));
        med.updated_at = now;
      }
    }

    // 4. If MISSED or multiple misses detected, alert Caregiver
    if (status === "MISSED") {
      this.state.notifications.unshift({
        id: "NOTIF-ALERT-" + Date.now(),
        recipient_user_id: "CAREGIVER-001",
        recipient_role: "caregiver",
        type: "MEDICATION_ALERT",
        title: "Medication Attention Required",
        message: `Sunita has missed her evening ${medName} medication acknowledgement.`,
        related_entity_type: "adherence_log",
        related_entity_id: scheduleId,
        read: false,
        created_at: now,
      });
    }

    this.state.last_updated = now;
    this.saveToDisk(this.state);
    return this.state;
  }

  /**
   * Patient or Caregiver creates a medicine availability request to pharmacy
   */
  public createMedicineRequest(payload: {
    patient_id?: string;
    patient_name?: string;
    patient_code?: string;
    requested_by_user_id?: string;
    requested_by_name?: string;
    requested_by_role?: "patient" | "caregiver";
    pharmacy_id?: string;
    pharmacy_name?: string;
    medicine_name: string;
    strength: string;
    quantity?: number;
    notes?: string;
  }): { request: MedicineRequestRecord; state: DatabaseState } {
    const now = new Date().toISOString();
    const reqId = "REQ-" + Date.now();

    const newReq: MedicineRequestRecord = {
      id: reqId,
      patient_id: payload.patient_id || "PAT-001",
      patient_name: payload.patient_name || "Mrs. Sunita Sharma",
      patient_code: payload.patient_code || "SWS-P-8F42K91",
      requested_by_user_id: payload.requested_by_user_id || "PAT-001",
      requested_by_name: payload.requested_by_name || "Mrs. Sunita Sharma",
      requested_by_role: payload.requested_by_role || "patient",
      pharmacy_id: payload.pharmacy_id || "PHARMACY-001",
      pharmacy_name: payload.pharmacy_name || "ABC Medical",
      medicine_name: payload.medicine_name,
      strength: payload.strength,
      quantity: payload.quantity || 1,
      status: "PENDING",
      notes: payload.notes || "Availability check requested.",
      requested_at: "Today, " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };

    this.state.medicine_requests.unshift(newReq);

    // Notify Pharmacy
    this.state.notifications.unshift({
      id: "NOTIF-PHARM-" + Date.now(),
      recipient_user_id: payload.pharmacy_id || "PHARMACY-001",
      recipient_role: "pharmacy",
      type: "REQUEST_RECEIVED",
      title: "New Medicine Availability Request",
      message: `${newReq.requested_by_name} (${newReq.requested_by_role}) requested ${newReq.quantity} pack(s) of ${newReq.medicine_name} ${newReq.strength} for ${newReq.patient_name}.`,
      related_entity_type: "medicine_request",
      related_entity_id: reqId,
      read: false,
      created_at: now,
    });

    this.state.last_updated = now;
    this.saveToDisk(this.state);
    return { request: newReq, state: this.state };
  }

  /**
   * Pharmacy responds AVAILABLE or NOT_AVAILABLE
   */
  public respondMedicineRequest(payload: {
    request_id: string;
    status: "AVAILABLE" | "NOT_AVAILABLE";
    pharmacy_name?: string;
  }): { request?: MedicineRequestRecord | undefined; state: DatabaseState } {
    const now = new Date().toISOString();
    const req = this.state.medicine_requests.find((r) => r.id === payload.request_id);

    if (req) {
      req.status = payload.status;
      req.responded_at = "Today, " + new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

      const pharmacy = payload.pharmacy_name || req.pharmacy_name || "ABC Medical";
      const statusText = payload.status === "AVAILABLE" ? "confirmed availability of" : "reported unavailable for";

      // 1. Notify Patient
      this.state.notifications.unshift({
        id: "NOTIF-P-RESP-" + Date.now(),
        recipient_user_id: "PAT-001",
        recipient_role: "patient",
        type: "PHARMACY_RESPONSE",
        title: `${pharmacy}: ${payload.status === "AVAILABLE" ? "Stock Available" : "Out of Stock"}`,
        message: `${pharmacy} ${statusText} ${req.medicine_name} ${req.strength}.`,
        related_entity_type: "medicine_request",
        related_entity_id: req.id,
        read: false,
        created_at: now,
      });

      // 2. Notify Caregiver
      this.state.notifications.unshift({
        id: "NOTIF-CG-RESP-" + Date.now(),
        recipient_user_id: "CAREGIVER-001",
        recipient_role: "caregiver",
        type: "PHARMACY_RESPONSE",
        title: `${pharmacy}: Stock Response for Sunita`,
        message: `${pharmacy} ${statusText} ${req.medicine_name} ${req.strength} for Sunita Sharma.`,
        related_entity_type: "medicine_request",
        related_entity_id: req.id,
        read: false,
        created_at: now,
      });
    }

    this.state.last_updated = now;
    this.saveToDisk(this.state);
    return { request: req, state: this.state };
  }
}

export const sharedDatabase = new DatabaseManager();

// Swasthya MedCare - Commit&Run Hackathon
