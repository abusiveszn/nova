import type {
  BuilderProfile,
  CompanyProfile,
  Project,
  Application,
  InvestmentProject,
  InvestmentAgreement,
  InvestorInquiry,
  TeamRoom,
  TeamMessage,
} from "@/types";

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:4001" : "");

/**
 * Generic safe fetch helper with JSON parsing and error handling
 */
async function safeFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      return {
        data: null,
        error: errBody.error || `HTTP error ${res.status}: ${res.statusText}`,
      };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || "Network request failed" };
  }
}

// ==================== AUTH & USERS ====================

export interface DbAuthUser {
  email: string;
  name: string;
  registeredRole: string;
  phone?: string;
  verifiedAt: string;
}

export async function registerUserApi(params: {
  email: string;
  hash: string;
  name: string;
  phone?: string;
  registeredRole: string;
}) {
  return safeFetch<{ success: boolean; user: DbAuthUser; userId: string }>(
    "/api/auth/register",
    {
      method: "POST",
      body: JSON.stringify(params),
    }
  );
}

export async function loginUserApi(params: { email: string; hash: string }) {
  return safeFetch<{
    success: boolean;
    user: DbAuthUser;
    profile: BuilderProfile | CompanyProfile | null;
  }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

export async function getUserApi(email: string) {
  return safeFetch<DbAuthUser>(`/api/auth/user/${encodeURIComponent(email)}`);
}

export async function resetPasswordApi(email: string, hash: string) {
  return safeFetch<{ success: boolean; message: string }>(
    "/api/auth/reset-password",
    {
      method: "PUT",
      body: JSON.stringify({ email, hash }),
    }
  );
}

// ==================== PROJECTS ====================

export async function getProjectsApi() {
  return safeFetch<Project[]>("/api/projects");
}

export async function createProjectApi(project: Project) {
  return safeFetch<Project>("/api/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });
}

export async function updateProjectApi(project: Project) {
  return safeFetch<Project>(`/api/projects/${encodeURIComponent(project.id)}`, {
    method: "PUT",
    body: JSON.stringify(project),
  });
}

export async function deleteProjectApi(projectId: string) {
  return safeFetch<{ success: boolean; id: string }>(
    `/api/projects/${encodeURIComponent(projectId)}`,
    {
      method: "DELETE",
    }
  );
}

// ==================== PROFILES ====================

export async function getBuildersApi() {
  return safeFetch<BuilderProfile[]>("/api/profiles/builders");
}

export async function updateBuilderApi(builder: BuilderProfile) {
  return safeFetch<BuilderProfile>(
    `/api/profiles/builders/${encodeURIComponent(builder.userId)}`,
    {
      method: "PUT",
      body: JSON.stringify(builder),
    }
  );
}

export async function getCompaniesApi() {
  return safeFetch<CompanyProfile[]>("/api/profiles/companies");
}

export async function updateCompanyApi(company: CompanyProfile) {
  return safeFetch<CompanyProfile>(
    `/api/profiles/companies/${encodeURIComponent(company.userId)}`,
    {
      method: "PUT",
      body: JSON.stringify(company),
    }
  );
}

// ==================== APPLICATIONS ====================

export async function getApplicationsApi() {
  return safeFetch<Application[]>("/api/applications");
}

export async function createApplicationApi(app: Application) {
  return safeFetch<Application>("/api/applications", {
    method: "POST",
    body: JSON.stringify(app),
  });
}

export async function updateApplicationStatusApi(
  id: string,
  status: "pending" | "accepted" | "rejected"
) {
  return safeFetch<Application>(
    `/api/applications/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }
  );
}

// ==================== INVESTMENTS ====================

export async function getInvestmentProjectsApi() {
  return safeFetch<InvestmentProject[]>("/api/investor/projects");
}

export async function getInvestmentAgreementsApi(investorId?: string) {
  const query = investorId ? `?investorId=${encodeURIComponent(investorId)}` : "";
  return safeFetch<InvestmentAgreement[]>(`/api/investor/agreements${query}`);
}

export async function createInvestmentAgreementApi(
  agreement: InvestmentAgreement
) {
  return safeFetch<InvestmentAgreement>("/api/investor/agreements", {
    method: "POST",
    body: JSON.stringify(agreement),
  });
}

export async function getInvestorInquiriesApi(projectId?: string) {
  const query = projectId ? `?projectId=${encodeURIComponent(projectId)}` : "";
  return safeFetch<InvestorInquiry[]>(`/api/investor/inquiries${query}`);
}

export async function createInvestorInquiryApi(inquiry: InvestorInquiry) {
  return safeFetch<InvestorInquiry>("/api/investor/inquiries", {
    method: "POST",
    body: JSON.stringify(inquiry),
  });
}

// ==================== TEAMS ====================

export async function getTeamRoomsApi() {
  return safeFetch<TeamRoom[]>("/api/team/rooms");
}

export async function createTeamRoomApi(room: TeamRoom) {
  return safeFetch<TeamRoom>("/api/team/rooms", {
    method: "POST",
    body: JSON.stringify(room),
  });
}

export async function getTeamMessagesApi(roomId?: string) {
  const query = roomId ? `?roomId=${encodeURIComponent(roomId)}` : "";
  return safeFetch<TeamMessage[]>(`/api/team/messages${query}`);
}

export async function createTeamMessageApi(message: TeamMessage) {
  return safeFetch<TeamMessage>("/api/team/messages", {
    method: "POST",
    body: JSON.stringify(message),
  });
}

// ==================== DB STATUS ====================

export async function checkDbStatusApi() {
  return safeFetch<{
    connected: boolean;
    state: string;
    uri: string;
    collections: Record<string, number>;
  }>("/api/db-status");
}
