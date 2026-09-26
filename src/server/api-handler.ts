import { sharedDatabase } from "./database";

export async function handleApiRequest(
  pathname: string,
  method: string,
  bodyText?: string,
): Promise<{ status: number; headers: Record<string, string>; body: string } | null> {
  if (!pathname.startsWith("/api/db")) {
    return null;
  }

  const headers = {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "Content-Type, Authorization",
  };

  if (method === "OPTIONS") {
    return { status: 204, headers, body: "" };
  }

  try {
    let body: any = {};
    if (bodyText && bodyText.trim()) {
      try {
        body = JSON.parse(bodyText);
      } catch {
        body = {};
      }
    }

    if (pathname === "/api/db/health" && method === "GET") {
      return {
        status: 200,
        headers,
        body: JSON.stringify({ status: "ok", mode: "persistent_relational", timestamp: new Date().toISOString() }),
      };
    }

    if (pathname === "/api/db/all" && method === "GET") {
      const state = sharedDatabase.getState();
      return {
        status: 200,
        headers,
        body: JSON.stringify(state),
      };
    }

    if (pathname === "/api/db/prescription" && method === "POST") {
      const result = sharedDatabase.createOrUpdatePrescription(body);
      return {
        status: 200,
        headers,
        body: JSON.stringify({ success: true, ...result }),
      };
    }

    if (pathname === "/api/db/adherence" && method === "POST") {
      const state = sharedDatabase.logAdherence(body);
      return {
        status: 200,
        headers,
        body: JSON.stringify({ success: true, state }),
      };
    }

    if (pathname === "/api/db/request-medicine" && method === "POST") {
      const result = sharedDatabase.createMedicineRequest(body);
      return {
        status: 200,
        headers,
        body: JSON.stringify({ success: true, ...result }),
      };
    }

    if (pathname === "/api/db/respond-medicine" && method === "POST") {
      const result = sharedDatabase.respondMedicineRequest(body);
      return {
        status: 200,
        headers,
        body: JSON.stringify({ success: true, ...result }),
      };
    }

    if (pathname === "/api/db/reset-seed" && method === "POST") {
      const state = sharedDatabase.resetSeed();
      return {
        status: 200,
        headers,
        body: JSON.stringify({ success: true, state }),
      };
    }

    return {
      status: 404,
      headers,
      body: JSON.stringify({ error: "Endpoint not found" }),
    };
  } catch (error: any) {
    console.error("[API Handler Error]", error);
    return {
      status: 500,
      headers,
      body: JSON.stringify({ error: error?.message || "Internal server error" }),
    };
  }
}
