import type {
  BuilderProfile,
  CompanyProfile,
  Project,
  Match,
  Notification as AppNotification,
  Application,
  TeamRoom,
  TeamMessage,
  InvestmentProject,
  InvestmentAgreement,
  InvestorInquiry,
} from "@/types";
import {
  seedBuilders,
  seedCompanies,
  seedProjects,
  seedApplications,
} from "./seed";
import {
  seedInvestmentProjects,
  seedInvestmentAgreements,
  seedInvestorInquiries,
} from "./investor-seed";
import { runMatchingPipeline, generateNotifications } from "@/engine/matcher";

/** Storage keys for all persisted data */
const STORAGE_KEYS = {
  // Core entities
  builders: "nova_builders_v2",
  companies: "nova_companies_v2",
  projects: "nova_projects_v2",
  matches: "nova_matches_v2",
  notifications: "nova_notifications_v2",
  applications: "nova_applications_v2",

  // Team collaboration
  teamRooms: "nova_team_rooms_v2",
  teamMessages: "nova_team_messages_v2",

  // Investor portal
  investmentProjects: "nova_investment_projects_v1",
  investmentAgreements: "nova_investment_agreements_v1",
  investorInquiries: "nova_investor_inquiries_v1",

  // Metadata
  initialized: "nova_initialized_v2",
  lastRun: "nova_last_run_v2",

  // User session
  userRole: "nova_user_role",
  currentUserId: "nova_current_user_id",
  // Credentials (email -> password hash)
  credentials: "nova_credentials_v1",
  // Registered users (email -> account record)
  registeredUsers: "nova_registered_users_v1",
  dailyProgress: "nova_daily_progress_v1",
} as const;

export interface DailyProgress {
  streak: number;
  lastActiveDate: string | null;
  systemProgress: number;
  userProgress: number;
}

export interface RegisteredUser {
  email: string;
  hash: string;
  name: string;
  phone?: string;
  registeredRole: string;
  verifiedAt: string;
}

/** Return type for initializeData function */
export interface StorageData {
  builders: BuilderProfile[];
  companies: CompanyProfile[];
  projects: Project[];
  matches: Match[];
  notifications: AppNotification[];
  applications: Application[];
  teamRooms: TeamRoom[];
  teamMessages: TeamMessage[];
  investmentProjects: InvestmentProject[];
  investmentAgreements: InvestmentAgreement[];
  investorInquiries: InvestorInquiry[];
  lastRun: number | null;
  userRole: string;
  currentUserId: string | null;
}

/**
 * Initialize or retrieve persisted application data
 * Seeds demo data on first run, retrieves from localStorage on subsequent runs
 *
 * @returns Complete application data state
 */
const mockTeamBuilders: BuilderProfile[] = [
  {
    userId: "builder_aisha",
    role: "builder",
    fullName: "Aisha Mohammed",
    username: "aisha_frontend",
    avatarUrl: "/avatars/builder4.jpg",
    email: "aisha@nova.dev",
    skills: ["React", "TypeScript", "Tailwind", "CSS"],
    experienceLevel: "advanced",
    bio: "Frontend Developer specializing in React ecosystems and responsive web layout design.",
    portfolioLinks: [],
    availabilityStatus: "available",
    hoursPerWeek: 40,
    reputationScore: 92,
    completedProjects: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    userId: "builder_chen",
    role: "builder",
    fullName: "Chen Wei",
    username: "chen_backend",
    avatarUrl: "/avatars/builder5.jpg",
    email: "chen@nova.dev",
    skills: ["Node.js", "Express", "TypeScript", "PostgreSQL"],
    experienceLevel: "advanced",
    bio: "Backend Architect focused on highly scalable systems and databases.",
    portfolioLinks: [],
    availabilityStatus: "available",
    hoursPerWeek: 40,
    reputationScore: 90,
    completedProjects: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    userId: "builder_danielle",
    role: "builder",
    fullName: "Danielle Smith",
    username: "danielle_api",
    avatarUrl: "/avatars/builder3.jpg",
    email: "danielle@nova.dev",
    skills: ["REST APIs", "GraphQL", "TypeScript", "Node.js"],
    experienceLevel: "advanced",
    bio: "API Integration Specialist passionate about middleware security.",
    portfolioLinks: [],
    availabilityStatus: "available",
    hoursPerWeek: 40,
    reputationScore: 89,
    completedProjects: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function initializeData(): StorageData {
  const alreadyInit = localStorage.getItem(STORAGE_KEYS.initialized);

  if (alreadyInit) {
    const builders = safeJsonParse<BuilderProfile[]>(STORAGE_KEYS.builders, []);
    // Inject mock team builders if missing
    if (!builders.some((b) => b.userId === "builder_aisha")) {
      builders.push(...mockTeamBuilders);
      localStorage.setItem(STORAGE_KEYS.builders, JSON.stringify(builders));
    }

    return {
      builders,
      companies: safeJsonParse<CompanyProfile[]>(STORAGE_KEYS.companies, []),
      projects: safeJsonParse<Project[]>(STORAGE_KEYS.projects, []),
      matches: safeJsonParse<Match[]>(STORAGE_KEYS.matches, []),
      notifications: safeJsonParse<AppNotification[]>(
        STORAGE_KEYS.notifications,
        [],
      ),
      applications: safeJsonParse<Application[]>(STORAGE_KEYS.applications, []),
      teamRooms: safeJsonParse<TeamRoom[]>(STORAGE_KEYS.teamRooms, []),
      teamMessages: safeJsonParse<TeamMessage[]>(STORAGE_KEYS.teamMessages, []),
      investmentProjects: safeJsonParse<InvestmentProject[]>(
        STORAGE_KEYS.investmentProjects,
        [],
      ),
      investmentAgreements: safeJsonParse<InvestmentAgreement[]>(
        STORAGE_KEYS.investmentAgreements,
        [],
      ),
      investorInquiries: safeJsonParse<InvestorInquiry[]>(
        STORAGE_KEYS.investorInquiries,
        [],
      ),
      lastRun: parseLastRun(),
      userRole: localStorage.getItem(STORAGE_KEYS.userRole) || "builder",
      currentUserId: localStorage.getItem(STORAGE_KEYS.currentUserId),
    };
  }

  // First-time initialization — seed demo data and run initial matching
  const builders = [...seedBuilders, ...mockTeamBuilders];
  const companies = seedCompanies;
  const projects = seedProjects;
  const applications = seedApplications;
  const matches = runMatchingPipeline(builders, projects);
  const notifications = generateNotifications(matches, applications);
  const lastRun = Date.now();
  const userRole = "builder";
  const currentUserId = null;
  const investmentProjects = seedInvestmentProjects;
  const investmentAgreements = seedInvestmentAgreements;
  const investorInquiries = seedInvestorInquiries;

  // Persist all data without auto-signing-in a demo profile
  persistStorageData({
    builders,
    companies,
    projects,
    matches,
    notifications,
    applications,
    teamRooms: [],
    teamMessages: [],
    investmentProjects,
    investmentAgreements,
    investorInquiries,
    lastRun,
    userRole,
    currentUserId,
  });

  return {
    builders,
    companies,
    projects,
    matches,
    notifications,
    applications,
    teamRooms: [],
    teamMessages: [],
    investmentProjects,
    investmentAgreements,
    investorInquiries,
    lastRun,
    userRole,
    currentUserId,
  };
}

/**
 * Persist complete storage state
 * Used during initialization
 */
function persistStorageData(data: StorageData): void {
  localStorage.setItem(STORAGE_KEYS.builders, JSON.stringify(data.builders));
  localStorage.setItem(STORAGE_KEYS.companies, JSON.stringify(data.companies));
  localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(data.projects));
  localStorage.setItem(STORAGE_KEYS.matches, JSON.stringify(data.matches));
  localStorage.setItem(
    STORAGE_KEYS.notifications,
    JSON.stringify(data.notifications),
  );
  localStorage.setItem(
    STORAGE_KEYS.applications,
    JSON.stringify(data.applications),
  );
  localStorage.setItem(STORAGE_KEYS.teamRooms, JSON.stringify(data.teamRooms));
  localStorage.setItem(
    STORAGE_KEYS.teamMessages,
    JSON.stringify(data.teamMessages),
  );
  localStorage.setItem(
    STORAGE_KEYS.investmentProjects,
    JSON.stringify(data.investmentProjects),
  );
  localStorage.setItem(
    STORAGE_KEYS.investmentAgreements,
    JSON.stringify(data.investmentAgreements),
  );
  localStorage.setItem(
    STORAGE_KEYS.investorInquiries,
    JSON.stringify(data.investorInquiries),
  );
  localStorage.setItem(STORAGE_KEYS.initialized, "true");

  if (data.lastRun) {
    localStorage.setItem(STORAGE_KEYS.lastRun, data.lastRun.toString());
  }
  localStorage.setItem(STORAGE_KEYS.userRole, data.userRole);
  if (data.currentUserId) {
    localStorage.setItem(STORAGE_KEYS.currentUserId, data.currentUserId);
  }
}

/**
 * Credential helpers
 * Stored as a map: { [email]: { hash: string } }
 */
export function saveCredential(email: string, hash: string): void {
  try {
    const cur = safeJsonParse<Record<string, { hash: string }>>(
      STORAGE_KEYS.credentials,
      {},
    );
    cur[email.toLowerCase()] = { hash };
    localStorage.setItem(STORAGE_KEYS.credentials, JSON.stringify(cur));
  } catch (err) {
    console.warn("Failed to save credential", err);
  }
}

export function saveRegisteredUser(
  user: Omit<RegisteredUser, "email"> & { email: string },
): void {
  try {
    const users = safeJsonParse<Record<string, RegisteredUser>>(
      STORAGE_KEYS.registeredUsers,
      {},
    );
    const email = user.email.trim().toLowerCase();
    users[email] = { ...user, email };
    localStorage.setItem(STORAGE_KEYS.registeredUsers, JSON.stringify(users));

    // Keep the legacy credential index in sync for existing callers.
    saveCredential(email, user.hash);
  } catch (err) {
    console.warn("Failed to save registered user", err);
  }
}

export function getRegisteredUser(email: string): RegisteredUser | undefined {
  try {
    const users = safeJsonParse<Record<string, RegisteredUser>>(
      STORAGE_KEYS.registeredUsers,
      {},
    );
    return users[email.trim().toLowerCase()];
  } catch {
    return undefined;
  }
}

export function getRegisteredUsers(): RegisteredUser[] {
  try {
    return Object.values(
      safeJsonParse<Record<string, RegisteredUser>>(
        STORAGE_KEYS.registeredUsers,
        {},
      ),
    );
  } catch {
    return [];
  }
}

export function updateCredential(email: string, hash: string): void {
  saveCredential(email, hash);
}

export function getDailyProgress(): DailyProgress {
  return safeJsonParse<DailyProgress>(STORAGE_KEYS.dailyProgress, {
    streak: 0,
    lastActiveDate: null,
    systemProgress: 0,
    userProgress: 0,
  });
}

export function saveDailyProgress(progress: DailyProgress): void {
  localStorage.setItem(STORAGE_KEYS.dailyProgress, JSON.stringify(progress));
}

export function getCredential(email: string): { hash: string } | undefined {
  try {
    const cur = safeJsonParse<Record<string, { hash: string }>>(
      STORAGE_KEYS.credentials,
      {},
    );
    return cur[email.toLowerCase()];
  } catch {
    return undefined;
  }
}

/**
 * Safe JSON parse helper with type safety
 * @param key Storage key to retrieve
 * @param fallback Default value if parse fails
 * @returns Parsed data or fallback
 */
function safeJsonParse<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    console.warn(`Failed to parse storage key: ${key}`);
    return fallback;
  }
}

/**
 * Parse last run timestamp safely
 */
function parseLastRun(): number | null {
  const stored = localStorage.getItem(STORAGE_KEYS.lastRun);
  if (!stored) return null;
  const parsed = parseInt(stored);
  return isNaN(parsed) ? null : parsed;
}

// ============================================================================
// Save Functions - Update individual data types
// ============================================================================

/**
 * Persist builder profiles
 */
export function saveBuilders(builders: BuilderProfile[]): void {
  localStorage.setItem(STORAGE_KEYS.builders, JSON.stringify(builders));
}

/**
 * Persist company profiles
 */
export function saveCompanies(companies: CompanyProfile[]): void {
  localStorage.setItem(STORAGE_KEYS.companies, JSON.stringify(companies));
}

/**
 * Persist projects
 */
export function saveProjects(projects: Project[]): void {
  localStorage.setItem(STORAGE_KEYS.projects, JSON.stringify(projects));
}

/**
 * Persist match results
 */
export function saveMatches(matches: Match[]): void {
  localStorage.setItem(STORAGE_KEYS.matches, JSON.stringify(matches));
}

/**
 * Persist user notifications
 */
export function saveNotifications(notifications: AppNotification[]): void {
  localStorage.setItem(
    STORAGE_KEYS.notifications,
    JSON.stringify(notifications),
  );
}

/**
 * Persist project applications
 */
export function saveApplications(applications: Application[]): void {
  localStorage.setItem(STORAGE_KEYS.applications, JSON.stringify(applications));
}

/**
 * Persist team collaboration rooms
 */
export function saveTeamRooms(teamRooms: TeamRoom[]): void {
  localStorage.setItem(STORAGE_KEYS.teamRooms, JSON.stringify(teamRooms));
}

/**
 * Persist team room messages
 */
export function saveTeamMessages(teamMessages: TeamMessage[]): void {
  localStorage.setItem(STORAGE_KEYS.teamMessages, JSON.stringify(teamMessages));
}

/**
 * Persist investment projects
 */
export function saveInvestmentProjects(projects: InvestmentProject[]): void {
  localStorage.setItem(
    STORAGE_KEYS.investmentProjects,
    JSON.stringify(projects),
  );
}

/**
 * Persist investment agreements
 */
export function saveInvestmentAgreements(
  agreements: InvestmentAgreement[],
): void {
  localStorage.setItem(
    STORAGE_KEYS.investmentAgreements,
    JSON.stringify(agreements),
  );
}

/**
 * Persist investor inquiries/messages
 */
export function saveInvestorInquiries(inquiries: InvestorInquiry[]): void {
  localStorage.setItem(
    STORAGE_KEYS.investorInquiries,
    JSON.stringify(inquiries),
  );
}

/**
 * Update last matching engine run timestamp
 */
export function saveLastRun(timestamp: number): void {
  localStorage.setItem(STORAGE_KEYS.lastRun, timestamp.toString());
}

/**
 * Update current user role
 */
export function saveUserRole(role: string): void {
  localStorage.setItem(STORAGE_KEYS.userRole, role);
}

/**
 * Update current user session ID
 */
export function saveCurrentUserId(userId: string): void {
  localStorage.setItem(STORAGE_KEYS.currentUserId, userId);
}

/**
 * Clear all persisted data
 * Useful for testing or complete reset
 */
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
