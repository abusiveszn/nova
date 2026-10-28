/** User roles in the platform */
export const USER_ROLES = {
  BUILDER: "builder",
  COMPANY: "company",
  ADMIN: "admin",
} as const;
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/** Professional experience levels */
export const EXPERIENCE_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
} as const;
export type ExperienceLevel =
  (typeof EXPERIENCE_LEVELS)[keyof typeof EXPERIENCE_LEVELS];

/** Project lifecycle statuses */
export const PROJECT_STATUSES = {
  OPEN: "open",
  CLOSED: "closed",
  IN_PROGRESS: "in-progress",
} as const;
export type ProjectStatus =
  (typeof PROJECT_STATUSES)[keyof typeof PROJECT_STATUSES];

/** Matching algorithm result classifications */
export const MATCH_STATUSES = {
  AUTO_RECOMMEND: "auto-recommend",
  RECOMMEND: "recommend",
  IGNORED: "ignored",
} as const;
export type MatchStatus = (typeof MATCH_STATUSES)[keyof typeof MATCH_STATUSES];

/** Builder availability status */
export const AVAILABILITY_STATUSES = {
  AVAILABLE: "available",
  BUSY: "busy",
} as const;
export type AvailabilityStatus =
  (typeof AVAILABILITY_STATUSES)[keyof typeof AVAILABILITY_STATUSES];

/** Base user interface with common fields */
export interface BaseUser {
  userId: string;
  role: string;
  fullName: string;
  username: string;
  avatarUrl: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  registeredRole?: string;
}

/** Generic user type for flexible context */
export type User = BaseUser;

/** Builder-specific profile with skills and reputation tracking */
export interface BuilderProfile extends BaseUser {
  role: "builder";
  skills: string[];
  experienceLevel: ExperienceLevel;
  bio: string;
  portfolioLinks: string[];
  availabilityStatus: AvailabilityStatus;
  hoursPerWeek: number;
  reputationScore: number;
  completedProjects: number;
}

/** Company-specific profile with organization details */
export interface CompanyProfile extends BaseUser {
  role: "company";
  companyName: string;
  industry: string;
  companySize: string;
  website: string;
  bio: string;
  postedProjects: number;
}

/** Admin-specific profile */
export interface AdminProfile extends BaseUser {
  role: "admin";
}

/** Investor-specific profile (extends company profile) */
export interface InvestorProfile extends BaseUser {
  role: "company";
  registeredRole: "investor";
  companyName: string;
  industry: string;
  companySize: string;
  website: string;
  bio: string;
  investmentFocus?: string[]; // e.g., ["SaaS", "AI/ML", "Fintech"]
  investmentRange?: { min: number; max: number }; // Investment range in USD
  previousInvestments?: number;
}

/** Union type for all profile variants */
export type Profile = BuilderProfile | CompanyProfile | AdminProfile;

// ============================================================================
// INVESTOR PORTAL DATA MODELS
// ============================================================================

/** Investment project status */
export const INVESTMENT_STATUSES = {
  FUNDING: "funding",
  ACTIVE: "active",
  COMPLETED: "completed",
} as const;
export type InvestmentStatus =
  (typeof INVESTMENT_STATUSES)[keyof typeof INVESTMENT_STATUSES];

/** Investment project available to investors */
export interface InvestmentProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  targetFunding: number; // USD
  raisedFunding: number; // USD
  expectedROI: number; // Percentage
  equityOffered: number; // Percentage
  projectManagerId: string;
  projectManagerName: string;
  projectManagerAvatar: string;
  status: InvestmentStatus;
  deckUrl?: string;
  coverImage?: string;
  companyWebsite?: string;
  createdAt: number;
  updatedAt?: number;
  tags?: string[];
  fundingDeadline?: number; // Timestamp
  minInvestment?: number; // Minimum investment amount
  sector?: string; // Industry/sector
}

/** Investment agreement between investor and project */
export interface InvestmentAgreement {
  id: string;
  investorId: string;
  projectId: string;
  amount: number; // USD invested
  agreedReturnPercentage: number;
  status: "pending_signature" | "signed" | "funded";
  createdAt: number;
  signedAt?: number;
  fundedAt?: number;
  equityPercentage?: number;
  terms?: string; // Serialized terms
}

/** Message/Inquiry between investor and project manager */
export interface InvestorInquiry {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  projectId: string;
  content: string;
  createdAt: number;
  read: boolean;
  attachments?: string[]; // URLs
}

/** Helper to map original registration roles to dashboard archetypes */
export function getDashboardRole(
  role: string,
): "builder" | "company" | "admin" {
  const r = (role || "").toLowerCase();
  if (r === "admin") return "admin";
  if (["investor", "founder", "enterprise", "company"].includes(r)) {
    return "company";
  }
  return "builder";
}

/** Project representation with comprehensive metadata */
export interface Project {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  rolesNeeded: string[];
  experienceLevelRequired: ExperienceLevel;
  teamSize: number;
  status: ProjectStatus;
  coverImage: string;
  founderId: string;
  founderName: string;
  createdAt: number;
  updatedAt?: number;
  category: string;
  budget?: string;
  duration?: string;
  tags?: string[];
  priority?: "low" | "medium" | "high";
}

/** Application status lifecycle */
export const APPLICATION_STATUSES = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const;
export type ApplicationStatus =
  (typeof APPLICATION_STATUSES)[keyof typeof APPLICATION_STATUSES];

/** Builder's application to a specific project */
export interface Application {
  id: string;
  projectId: string;
  builderId: string;
  builderName: string;
  builderAvatar: string;
  status: ApplicationStatus;
  message: string;
  createdAt: number;
  updatedAt?: number;
  respondedAt?: number;
}

/** Score components breakdown for match results */
export interface ScoreComponents {
  skill: number;
  role: number;
  experience: number;
  availability: number;
  reputation: number;
}

/** Calculate total score from components */
export const calculateTotalScore = (components: ScoreComponents): number => {
  return (
    (components.skill +
      components.role +
      components.experience +
      components.availability +
      components.reputation) /
    5
  );
};

/** Matching result between builder and project */
export interface Match {
  id: string;
  projectId: string;
  builderId: string;
  matchScore: number;
  status: MatchStatus;
  components: ScoreComponents;
  createdAt: number;
  updatedAt?: number;
}

/** Notification types in the system */
export const NOTIFICATION_TYPES = {
  MATCH: "match",
  APPLICATION: "application",
  SYSTEM: "system",
  MESSAGE: "message",
  TEAM_INVITE: "team-invite",
} as const;
export type NotificationType =
  (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];

/** In-app notification with metadata and read status */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: number;
  relatedId?: string;
  actionUrl?: string;
}

/** Developer team collaboration room */
export interface TeamRoom {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  inviteCode: string;
  memberIds: string[];
  createdAt: number;
  updatedAt?: number;
  visibility?: "private" | "public";
}

/** Message in a team room with metadata */
export interface TeamMessage {
  id: string;
  roomId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: number;
  updatedAt?: number;
  pinned: boolean;
  edited?: boolean;
}

export interface MatchResult {
  builder: BuilderProfile;
  score: number;
  components: ScoreComponents;
  action: MatchStatus;
}

export interface OverviewMetrics {
  totalBuilders: number;
  totalCompanies: number;
  totalProjects: number;
  activeMatches: number;
  totalApplications: number;
  avgMatchScore: number;
}

export const TAB_IDS = {
  OVERVIEW: "overview",
  PROJECTS: "projects",
  OPPORTUNITIES: "opportunities",
  APPLICANTS: "applicants",
  MESSAGES: "messages",
  PROFILE: "profile",
  USERS: "users",
  MATCHING: "matching",
  REPORTS: "reports",
  POST_PROJECT: "post-project",
  PORTFOLIO: "portfolio",
  ANALYTICS: "analytics",
  REPUTATION: "reputation",
  NETWORK: "network",
  TEAM_CHAT: "team-chat",
  INVESTMENT_MARKETPLACE: "investment-marketplace",
  MY_INVESTMENTS: "my-investments",
  INVESTOR_MESSAGES: "investor-messages",
  LEARNER_CURRICULUM: "learner-curriculum",
  LEARNER_LAB: "learner-lab",
  LEARNER_BILLING: "learner-billing",
  LEARNERS: "learners",
  COMMUNITY: "community",
} as const;
export type TabId = (typeof TAB_IDS)[keyof typeof TAB_IDS];

/** Comprehensive application state managing all domain data */
export interface AppState {
  // Authentication & User Management
  currentUser: User | null;
  userRole: UserRole;

  // Core Domain Data
  builders: BuilderProfile[];
  companies: CompanyProfile[];
  projects: Project[];
  matches: Match[];
  applications: Application[];
  notifications: Notification[];

  // Investor Portal Data
  investmentProjects: InvestmentProject[];
  investmentAgreements: InvestmentAgreement[];
  investorInquiries: InvestorInquiry[];

  // Team Collaboration
  teamRooms: TeamRoom[];
  teamMessages: TeamMessage[];

  // UI State
  activeTab: TabId;
  sidebarCollapsed: boolean;
  showNotifications: boolean;
  showProfileEdit: boolean;
  selectedProjectId: string | null;

  // Engine & Processing State
  engineStatus: "online" | "processing" | "offline";
  lastRunTimestamp: number | null;
  streak: number;
  lastActiveDate: string | null;
  systemProgress: number;
  userProgress: number;
}

// ============================================================================
// ACTION TYPES - Type-safe redux-style actions for state management
// ============================================================================

// UI Actions
type UIActions =
  | { type: "SET_TAB"; payload: TabId }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "TOGGLE_NOTIFICATIONS" }
  | { type: "TOGGLE_PROFILE_EDIT" };

// Authentication Actions
type AuthActions =
  | { type: "SWITCH_USER"; payload: UserRole }
  | { type: "SWITCH_PERSONA"; payload: string }
  | { type: "SWITCH_ACCOUNT"; payload: string }
  | { type: "NEW_SIGNUP"; payload: Profile }
  | { type: "LOGIN_USER"; payload: Profile }
  | { type: "LOGOUT_USER" };

type AutomationActions = { type: "AUTO_UPDATE" };

// Builder/Company Data Actions
type EntityActions =
  | { type: "SET_BUILDERS"; payload: BuilderProfile[] }
  | { type: "SET_COMPANIES"; payload: CompanyProfile[] }
  | { type: "UPDATE_BUILDER"; payload: BuilderProfile }
  | { type: "UPDATE_COMPANY"; payload: CompanyProfile };

// Project Actions
type ProjectActions =
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "ADD_PROJECT"; payload: Project }
  | { type: "UPDATE_PROJECT"; payload: Project }
  | { type: "DELETE_PROJECT"; payload: string };

// Matching & Application Actions
type MatchingActions =
  | { type: "SET_MATCHES"; payload: Match[] }
  | { type: "SET_APPLICATIONS"; payload: Application[] }
  | { type: "ADD_APPLICATION"; payload: Application }
  | { type: "UPDATE_APPLICATION"; payload: Application }
  | { type: "RUN_MATCHING" };

// Notification Actions
type NotificationActions =
  | { type: "SET_APPLICATIONS"; payload: Application[] }
  | { type: "ADD_NOTIFICATION"; payload: Notification }
  | { type: "MARK_NOTIFICATION_READ"; payload: string };

// Team Chat Actions
type TeamActions =
  | { type: "SET_TEAM_ROOMS"; payload: TeamRoom[] }
  | { type: "SET_TEAM_MESSAGES"; payload: TeamMessage[] }
  | { type: "CREATE_TEAM_ROOM"; payload: TeamRoom }
  | { type: "JOIN_TEAM_ROOM"; payload: { roomId: string; userId: string } }
  | { type: "SEND_TEAM_MESSAGE"; payload: TeamMessage }
  | { type: "TOGGLE_PIN_TEAM_MESSAGE"; payload: string }
  | { type: "REMOVE_TEAM_MEMBER"; payload: { roomId: string; userId: string } };


// Investor Portal Actions
type InvestorActions =
  | { type: "SET_INVESTMENT_PROJECTS"; payload: InvestmentProject[] }
  | { type: "ADD_INVESTMENT_PROJECT"; payload: InvestmentProject }
  | { type: "UPDATE_INVESTMENT_PROJECT"; payload: InvestmentProject }
  | { type: "SET_INVESTMENT_AGREEMENTS"; payload: InvestmentAgreement[] }
  | { type: "CREATE_INVESTMENT_AGREEMENT"; payload: InvestmentAgreement }
  | { type: "UPDATE_INVESTMENT_AGREEMENT"; payload: InvestmentAgreement }
  | { type: "SET_INVESTOR_INQUIRIES"; payload: InvestorInquiry[] }
  | { type: "ADD_INVESTOR_INQUIRY"; payload: InvestorInquiry }
  | { type: "MARK_INQUIRY_READ"; payload: string };

// Engine Actions
type EngineActions =
  | { type: "SET_ENGINE_STATUS"; payload: "online" | "processing" | "offline" }
  | { type: "SET_LAST_RUN"; payload: number };

// Combined union of all possible actions
export type AppAction =
  | UIActions
  | AuthActions
  | AutomationActions
  | EntityActions
  | ProjectActions
  | MatchingActions
  | NotificationActions
  | TeamActions
  | InvestorActions
  | EngineActions;

export interface CommunityComment {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  content: string;
  createdAt: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface CommunityPoll {
  question: string;
  options: PollOption[];
  totalVotes: number;
  userVotedId?: string;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  location: string;
  timeAgo: string;
  title: string;
  content: string;
  tags: string[];
  category: "all" | "discussions" | "projects" | "announcements" | "mentorship";
  communityHub?: string;
  previewType?: "fintech" | "fashion" | "ai" | "generic";
  previewTitle?: string;
  previewSubtitle?: string;
  previewImage?: string;
  attachedImage?: string;
  attachedLink?: { url: string; title: string };
  attachedPoll?: CommunityPoll;
  attachedEvent?: { title: string; dateStr: string; location?: string; type?: "calendar" | "code"; joined?: boolean };
  likes: number;
  commentsCount: number;
  comments?: CommunityComment[];
  isLiked?: boolean;
  isBookmarked?: boolean;
  createdAt: number;
}

export interface CommunityEvent {
  id: string;
  title: string;
  dateStr: string;
  type: "calendar" | "code";
  joined: boolean;
  attendeesCount: number;
}

export interface CommunityMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isOnline: boolean;
}
