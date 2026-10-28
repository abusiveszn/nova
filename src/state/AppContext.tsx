import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import type {
  AppState,
  AppAction,
  BuilderProfile,
  CompanyProfile,
  Match,
  UserRole,
  TabId,
  Project,
  Profile,
} from "@/types";
import { USER_ROLES, TAB_IDS, getDashboardRole } from "@/types";
import {
  initializeData,
  saveBuilders,
  saveCompanies,
  saveProjects,
  saveMatches,
  saveNotifications,
  saveApplications,
  saveTeamRooms,
  saveTeamMessages,
  saveLastRun,
  saveUserRole,
  saveCurrentUserId,
  getDailyProgress,
  saveDailyProgress,
  saveInvestmentProjects,
  saveInvestmentAgreements,
  saveInvestorInquiries,
} from "@/data/storage";
import {
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
  updateBuilderApi,
  updateCompanyApi,
  createApplicationApi,
  updateApplicationStatusApi,
  createInvestmentAgreementApi,
  createInvestorInquiryApi,
  createTeamRoomApi,
  createTeamMessageApi,
  getProjectsApi,
  getBuildersApi,
  getCompaniesApi,
  getApplicationsApi,
  getInvestmentProjectsApi,
  getInvestmentAgreementsApi,
  getTeamRoomsApi,
  getTeamMessagesApi,
} from "@/data/api";
import { runMatchingPipeline, generateNotifications } from "@/engine/matcher";

/** Default tab for each user role */
const DEFAULT_TABS_BY_ROLE: Record<UserRole, TabId> = {
  [USER_ROLES.BUILDER]: TAB_IDS.OVERVIEW,
  [USER_ROLES.COMPANY]: TAB_IDS.OVERVIEW,
  [USER_ROLES.ADMIN]: TAB_IDS.OVERVIEW,
};

/** Initial application state */
const initialState: AppState = {
  currentUser: null,
  userRole: USER_ROLES.BUILDER,
  builders: [],
  companies: [],
  projects: [],
  matches: [],
  applications: [],
  notifications: [],
  teamRooms: [],
  teamMessages: [],
  investmentProjects: [],
  investmentAgreements: [],
  investorInquiries: [],
  activeTab: TAB_IDS.OVERVIEW,
  sidebarCollapsed: false,
  showNotifications: false,
  showProfileEdit: false,
  selectedProjectId: null,
  engineStatus: "online",
  lastRunTimestamp: null,
  streak: 0,
  lastActiveDate: null,
  systemProgress: 0,
  userProgress: 0,
};

/**
 * Main application state reducer
 * Handles all state mutations with persistence side-effects
 */
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    // ========== UI State Actions ==========
    case "SET_TAB":
      return { ...state, activeTab: action.payload };
    case "TOGGLE_SIDEBAR":
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case "TOGGLE_NOTIFICATIONS":
      return { ...state, showNotifications: !state.showNotifications };
    case "TOGGLE_PROFILE_EDIT":
      return { ...state, showProfileEdit: !state.showProfileEdit };

    // ========== Entity Data Actions ==========
    case "SET_BUILDERS":
      return { ...state, builders: action.payload };
    case "SET_COMPANIES":
      return { ...state, companies: action.payload };
    case "UPDATE_BUILDER": {
      const builders = state.builders.map((b) =>
        b.userId === action.payload.userId ? action.payload : b,
      );
      saveBuilders(builders);
      updateBuilderApi(action.payload).catch(() => {});
      return { ...state, builders };
    }
    case "UPDATE_COMPANY": {
      const companies = state.companies.map((c) =>
        c.userId === action.payload.userId ? action.payload : c,
      );
      saveCompanies(companies);
      updateCompanyApi(action.payload).catch(() => {});
      return { ...state, companies };
    }

    // ========== Project Actions ==========
    case "SET_PROJECTS":
      return { ...state, projects: action.payload };
    case "ADD_PROJECT": {
      const projects = [...state.projects, action.payload];
      saveProjects(projects);
      createProjectApi(action.payload).catch(() => {});
      return { ...state, projects };
    }
    case "UPDATE_PROJECT": {
      const projects = state.projects.map((p) =>
        p.id === action.payload.id ? action.payload : p,
      );
      saveProjects(projects);
      updateProjectApi(action.payload).catch(() => {});
      return { ...state, projects };
    }
    case "DELETE_PROJECT": {
      const projects = state.projects.filter((p) => p.id !== action.payload);
      const matches = state.matches.filter(
        (m) => m.projectId !== action.payload,
      );
      saveProjects(projects);
      saveMatches(matches);
      deleteProjectApi(action.payload).catch(() => {});
      return { ...state, projects, matches };
    }

    // ========== Matching Actions ==========
    case "SET_MATCHES":
      return { ...state, matches: action.payload };
    case "RUN_MATCHING": {
      const matches = runMatchingPipeline(state.builders, state.projects);
      const notifications = [
        ...generateNotifications(matches, state.applications),
        ...state.notifications,
      ].slice(0, 50);
      const lastRun = Date.now();
      saveMatches(matches);
      saveNotifications(notifications);
      saveLastRun(lastRun);
      return {
        ...state,
        matches,
        notifications,
        lastRunTimestamp: lastRun,
        engineStatus: "online",
      };
    }

    // ========== Application Actions ==========
    case "SET_APPLICATIONS":
      return { ...state, applications: action.payload };
    case "ADD_APPLICATION": {
      const applications = [...state.applications, action.payload];
      saveApplications(applications);
      createApplicationApi(action.payload).catch(() => {});
      return { ...state, applications };
    }
    case "UPDATE_APPLICATION": {
      const applications = state.applications.map((a) =>
        a.id === action.payload.id ? action.payload : a,
      );
      saveApplications(applications);
      updateApplicationStatusApi(action.payload.id, action.payload.status).catch(() => {});
      return { ...state, applications };
    }

    // ========== Notification Actions ==========
    case "ADD_NOTIFICATION": {
      const updated = [action.payload, ...state.notifications].slice(0, 50);
      saveNotifications(updated);
      return { ...state, notifications: updated };
    }
    case "MARK_NOTIFICATION_READ": {
      const updated = state.notifications.map((n) =>
        n.id === action.payload ? { ...n, read: true } : n,
      );
      saveNotifications(updated);
      return { ...state, notifications: updated };
    }

    // ========== Team Collaboration Actions ==========
    case "SET_TEAM_ROOMS":
      return { ...state, teamRooms: action.payload };
    case "SET_TEAM_MESSAGES":
      return { ...state, teamMessages: action.payload };
    case "CREATE_TEAM_ROOM": {
      const teamRooms = [...state.teamRooms, action.payload];
      saveTeamRooms(teamRooms);
      createTeamRoomApi(action.payload).catch(() => {});
      return { ...state, teamRooms };
    }
    case "JOIN_TEAM_ROOM": {
      const teamRooms = state.teamRooms.map((room) =>
        room.id === action.payload.roomId &&
        !room.memberIds.includes(action.payload.userId)
          ? { ...room, memberIds: [...room.memberIds, action.payload.userId] }
          : room,
      );
      saveTeamRooms(teamRooms);
      return { ...state, teamRooms };
    }
    case "SEND_TEAM_MESSAGE": {
      const teamMessages = [...state.teamMessages, action.payload];
      saveTeamMessages(teamMessages);
      createTeamMessageApi(action.payload).catch(() => {});
      return { ...state, teamMessages };
    }
    case "TOGGLE_PIN_TEAM_MESSAGE": {
      const teamMessages = state.teamMessages.map((message) =>
        message.id === action.payload
          ? { ...message, pinned: !message.pinned }
          : message,
      );
      saveTeamMessages(teamMessages);
      return { ...state, teamMessages };
    }
    case "REMOVE_TEAM_MEMBER": {
      const teamRooms = state.teamRooms.map((room) =>
        room.id === action.payload.roomId
          ? {
              ...room,
              memberIds: room.memberIds.filter(
                (id) => id !== action.payload.userId,
              ),
            }
          : room,
      );
      saveTeamRooms(teamRooms);
      return { ...state, teamRooms };
    }

    // ========== Investor Portal Actions ==========
    case "SET_INVESTMENT_PROJECTS":
      return { ...state, investmentProjects: action.payload };
    case "ADD_INVESTMENT_PROJECT": {
      const projects = [...state.investmentProjects, action.payload];
      saveInvestmentProjects(projects);
      return { ...state, investmentProjects: projects };
    }
    case "UPDATE_INVESTMENT_PROJECT": {
      const projects = state.investmentProjects.map((p) =>
        p.id === action.payload.id ? action.payload : p,
      );
      saveInvestmentProjects(projects);
      return { ...state, investmentProjects: projects };
    }
    case "SET_INVESTMENT_AGREEMENTS":
      return { ...state, investmentAgreements: action.payload };
    case "CREATE_INVESTMENT_AGREEMENT": {
      const agreements = [...state.investmentAgreements, action.payload];
      saveInvestmentAgreements(agreements);
      createInvestmentAgreementApi(action.payload).catch(() => {});
      return { ...state, investmentAgreements: agreements };
    }
    case "UPDATE_INVESTMENT_AGREEMENT": {
      const agreements = state.investmentAgreements.map((a) =>
        a.id === action.payload.id ? action.payload : a,
      );
      saveInvestmentAgreements(agreements);
      return { ...state, investmentAgreements: agreements };
    }
    case "SET_INVESTOR_INQUIRIES":
      return { ...state, investorInquiries: action.payload };
    case "ADD_INVESTOR_INQUIRY": {
      const inquiries = [...state.investorInquiries, action.payload];
      saveInvestorInquiries(inquiries);
      createInvestorInquiryApi(action.payload).catch(() => {});
      return { ...state, investorInquiries: inquiries };
    }
    case "MARK_INQUIRY_READ": {
      const inquiries = state.investorInquiries.map((i) =>
        i.id === action.payload ? { ...i, read: true } : i,
      );
      saveInvestorInquiries(inquiries);
      return { ...state, investorInquiries: inquiries };
    }

    // ========== Engine & Processing Actions ==========
    case "SET_ENGINE_STATUS":
      return { ...state, engineStatus: action.payload };
    case "SET_LAST_RUN":
      saveLastRun(action.payload);
      return { ...state, lastRunTimestamp: action.payload };

    case "AUTO_UPDATE": {
      const progress = getDailyProgress();
      const today = new Date().toISOString().slice(0, 10);
      if (progress.lastActiveDate === today) {
        return {
          ...state,
          streak: progress.streak,
          lastActiveDate: progress.lastActiveDate,
          systemProgress: progress.systemProgress,
          userProgress: progress.userProgress,
        };
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().slice(0, 10);
      const streak =
        progress.lastActiveDate === yesterdayKey ? progress.streak + 1 : 1;
      const builder = state.builders.find(
        (profile) => profile.userId === state.currentUser?.userId,
      );
      const company = state.companies.find(
        (profile) => profile.userId === state.currentUser?.userId,
      );
      const userProgress = builder
        ? Math.min(
            100,
            20 +
              (builder.bio ? 20 : 0) +
              Math.min(builder.skills.length * 10, 30) +
              Math.min(builder.portfolioLinks.length * 10, 30),
          )
        : company
          ? Math.min(
              100,
              20 +
                (company.bio ? 20 : 0) +
                (company.website ? 20 : 0) +
                (company.industry ? 20 : 0) +
                (company.companySize ? 20 : 0),
            )
          : state.currentUser
            ? 20
            : 0;
      const matches = runMatchingPipeline(state.builders, state.projects);
      const notifications = [
        ...generateNotifications(matches, state.applications),
        ...state.notifications,
      ].slice(0, 50);
      const lastRun = Date.now();
      const updatedProgress = {
        streak,
        lastActiveDate: today,
        systemProgress: Math.min(
          100,
          20 +
            Math.min(state.builders.length * 5, 40) +
            Math.min(matches.length * 2, 40),
        ),
        userProgress,
      };
      saveMatches(matches);
      saveNotifications(notifications);
      saveLastRun(lastRun);
      saveDailyProgress(updatedProgress);
      return {
        ...state,
        ...updatedProgress,
        matches,
        notifications,
        lastRunTimestamp: lastRun,
        engineStatus: "online",
      };
    }

    // ========== Authentication Actions ==========
    case "SWITCH_USER": {
      const targetRole = action.payload;
      const dashRole = getDashboardRole(targetRole);
      saveUserRole(targetRole);

      // Select the first available user of this role
      let newCurrentUser: any = null;
      if (dashRole === "builder" && state.builders.length > 0) {
        newCurrentUser = state.builders[0];
      } else if (dashRole === "company" && state.companies.length > 0) {
        newCurrentUser = state.companies[0];
      }

      if (newCurrentUser) {
        saveCurrentUserId(newCurrentUser.userId);
        localStorage.setItem(
          "nova_current_user_profile",
          JSON.stringify(newCurrentUser),
        );
      } else {
        localStorage.removeItem("nova_current_user_profile");
      }

      return {
        ...state,
        userRole: targetRole,
        activeTab: DEFAULT_TABS_BY_ROLE[dashRole],
        currentUser: newCurrentUser,
      };
    }

    case "SWITCH_PERSONA": {
      const persona = action.payload;
      const dashRole = getDashboardRole(persona);
      saveUserRole(dashRole);

      const profile =
        dashRole === "builder"
          ? state.builders[0]
          : dashRole === "company"
            ? state.companies[0]
            : null;
      const newCurrentUser = profile
        ? { ...profile, registeredRole: persona }
        : null;

      if (newCurrentUser) {
        saveCurrentUserId(newCurrentUser.userId);
        localStorage.setItem(
          "nova_current_user_profile",
          JSON.stringify(newCurrentUser),
        );
      }

      return {
        ...state,
        userRole: dashRole,
        activeTab: DEFAULT_TABS_BY_ROLE[dashRole],
        currentUser: newCurrentUser,
      };
    }

    case "SWITCH_ACCOUNT": {
      const email = action.payload.trim().toLowerCase();
      const account = [...state.builders, ...state.companies].find(
        (profile) => profile.email.toLowerCase() === email,
      );
      const newCurrentUser =
        account ||
        (state.currentUser?.email.toLowerCase() === email
          ? state.currentUser
          : null);

      if (!newCurrentUser) return state;

      const userRole = getDashboardRole(newCurrentUser.role);
      saveUserRole(userRole);
      saveCurrentUserId(newCurrentUser.userId);
      localStorage.setItem(
        "nova_current_user_profile",
        JSON.stringify(newCurrentUser),
      );
      return {
        ...state,
        userRole,
        activeTab: DEFAULT_TABS_BY_ROLE[userRole],
        currentUser: newCurrentUser,
      };
    }

    case "LOGIN_USER": {
      const userRole = action.payload.role;
      const dashRole = getDashboardRole(userRole);
      saveUserRole(userRole);
      saveCurrentUserId(action.payload.userId);
      localStorage.setItem(
        "nova_current_user_profile",
        JSON.stringify(action.payload),
      );
      return {
        ...state,
        userRole: userRole,
        activeTab: DEFAULT_TABS_BY_ROLE[dashRole],
        currentUser: action.payload,
      };
    }

    case "NEW_SIGNUP": {
      const userRole = action.payload.role;
      const dashRole = getDashboardRole(userRole);
      saveUserRole(userRole);
      saveCurrentUserId(action.payload.userId);
      localStorage.setItem(
        "nova_current_user_profile",
        JSON.stringify(action.payload),
      );

      const newState = {
        ...state,
        userRole: userRole,
        activeTab: DEFAULT_TABS_BY_ROLE[dashRole],
        currentUser: action.payload,
        // Clear dummy data on new signup
        projects: [],
        matches: [],
        applications: [],
        notifications: [],
      };

      if (dashRole === "builder") {
        newState.builders = [
          ...state.builders,
          action.payload as BuilderProfile,
        ];
        saveBuilders(newState.builders);
      } else if (dashRole === "company") {
        newState.companies = [
          ...state.companies,
          action.payload as CompanyProfile,
        ];
        saveCompanies(newState.companies);
      }

      saveProjects(newState.projects);
      saveMatches(newState.matches);
      saveApplications(newState.applications);
      saveNotifications(newState.notifications);

      return newState;
    }

    case "LOGOUT_USER": {
      localStorage.removeItem("nova_current_user_profile");
      localStorage.removeItem("nova_logged_in_user_id");
      localStorage.removeItem("nova_user_role");
      return {
        ...initialState,
        currentUser: null,
        userRole: USER_ROLES.BUILDER,
      };
    }

    default:
      return state;
  }
}

/**
 * Context type definition with all provided values and methods
 */
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Matching utilities
  runMatching: () => void;
  getProjectMatches: (projectId: string) => Match[];
  getBuilderMatches: (builderId: string) => Match[];
  // Entity getters
  getBuilder: (builderId: string) => BuilderProfile | undefined;
  getProject: (projectId: string) => Project | undefined;
  getCurrentProfile: () => BuilderProfile | CompanyProfile | undefined;
  // UI utilities
  unreadCount: number;
}

const AppContext = createContext<AppContextType | null>(null);

/**
 * AppProvider component
 * Manages global application state with context and reducer pattern
 * Initializes data from localStorage and provides utility methods
 */
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(
    appReducer,
    initialState,
    (initial: AppState) => {
      const data = initializeData();

      // Resolve current user from storage
      let currentUser: Profile | null = null;
      try {
        const savedProfileStr = localStorage.getItem(
          "nova_current_user_profile",
        );
        if (savedProfileStr) {
          currentUser = JSON.parse(savedProfileStr);
        }
      } catch (err) {
        console.error("Failed to restore current user profile:", err);
      }

      if (data.currentUserId && !currentUser) {
        const dashRole = getDashboardRole(data.userRole);
        if (dashRole === "builder") {
          currentUser =
            data.builders.find((b) => b.userId === data.currentUserId) ?? null;
        } else if (dashRole === "company") {
          currentUser =
            data.companies.find((c) => c.userId === data.currentUserId) ?? null;
        }
      }

      return {
        ...initial,
        currentUser,
        userRole: data.userRole as UserRole,
        builders: data.builders,
        companies: data.companies,
        projects: data.projects,
        matches: data.matches,
        applications: data.applications,
        notifications: data.notifications,
        teamRooms: data.teamRooms,
        teamMessages: data.teamMessages,
        investmentProjects: data.investmentProjects,
        investmentAgreements: data.investmentAgreements,
        investorInquiries: data.investorInquiries,
        lastRunTimestamp: data.lastRun,
        ...getDailyProgress(),
      };
    },
  );

  // Sync data with MongoDB backend on initial load
  useEffect(() => {
    let isMounted = true;
    async function syncWithMongoDb() {
      try {
        const [
          projectsRes,
          buildersRes,
          companiesRes,
          appsRes,
          invProjectsRes,
          invAgreementsRes,
          teamRoomsRes,
          teamMessagesRes,
        ] = await Promise.all([
          getProjectsApi(),
          getBuildersApi(),
          getCompaniesApi(),
          getApplicationsApi(),
          getInvestmentProjectsApi(),
          getInvestmentAgreementsApi(),
          getTeamRoomsApi(),
          getTeamMessagesApi(),
        ]);

        if (!isMounted) return;

        if (projectsRes.data && projectsRes.data.length > 0) {
          dispatch({ type: "SET_PROJECTS", payload: projectsRes.data });
          saveProjects(projectsRes.data);
        }
        if (buildersRes.data && buildersRes.data.length > 0) {
          dispatch({ type: "SET_BUILDERS", payload: buildersRes.data });
          saveBuilders(buildersRes.data);
        }
        if (companiesRes.data && companiesRes.data.length > 0) {
          dispatch({ type: "SET_COMPANIES", payload: companiesRes.data });
          saveCompanies(companiesRes.data);
        }
        if (appsRes.data && appsRes.data.length > 0) {
          dispatch({ type: "SET_APPLICATIONS", payload: appsRes.data });
          saveApplications(appsRes.data);
        }
        if (invProjectsRes.data && invProjectsRes.data.length > 0) {
          dispatch({
            type: "SET_INVESTMENT_PROJECTS",
            payload: invProjectsRes.data,
          });
          saveInvestmentProjects(invProjectsRes.data);
        }
        if (invAgreementsRes.data && invAgreementsRes.data.length > 0) {
          dispatch({
            type: "SET_INVESTMENT_AGREEMENTS",
            payload: invAgreementsRes.data,
          });
          saveInvestmentAgreements(invAgreementsRes.data);
        }
        if (teamRoomsRes.data && teamRoomsRes.data.length > 0) {
          dispatch({ type: "SET_TEAM_ROOMS", payload: teamRoomsRes.data });
          saveTeamRooms(teamRoomsRes.data);
        }
        if (teamMessagesRes.data && teamMessagesRes.data.length > 0) {
          dispatch({ type: "SET_TEAM_MESSAGES", payload: teamMessagesRes.data });
          saveTeamMessages(teamMessagesRes.data);
        }
      } catch (e) {
        console.warn("MongoDB initial sync finished with fallback:", e);
      }
    }

    syncWithMongoDb();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (state.currentUser) {
      dispatch({ type: "AUTO_UPDATE" });
    }
  }, [state.currentUser?.userId]);

  // ========== Matching Engine ==========
  const runMatching = useCallback(() => {
    dispatch({ type: "SET_ENGINE_STATUS", payload: "processing" });
    // Simulate processing delay for better UX
    setTimeout(() => {
      dispatch({ type: "RUN_MATCHING" });
    }, 800);
  }, []);

  // ========== Query Methods ==========
  const getProjectMatches = useCallback(
    (projectId: string) =>
      state.matches
        .filter((m) => m.projectId === projectId)
        .sort((a, b) => b.matchScore - a.matchScore),
    [state.matches],
  );

  const getBuilderMatches = useCallback(
    (builderId: string) =>
      state.matches
        .filter((m) => m.builderId === builderId)
        .sort((a, b) => b.matchScore - a.matchScore),
    [state.matches],
  );

  // ========== Entity Getters ==========
  const getBuilder = useCallback(
    (builderId: string) => state.builders.find((b) => b.userId === builderId),
    [state.builders],
  );

  const getProject = useCallback(
    (projectId: string) => state.projects.find((p) => p.id === projectId),
    [state.projects],
  );

  const getCurrentProfile = useCallback(() => {
    if (state.userRole === USER_ROLES.BUILDER) {
      return state.builders.find((b) => b.userId === state.currentUser?.userId);
    }
    if (state.userRole === USER_ROLES.COMPANY) {
      return state.companies.find(
        (c) => c.userId === state.currentUser?.userId,
      );
    }
    return undefined;
  }, [state.userRole, state.currentUser, state.builders, state.companies]);

  // ========== UI Utilities ==========
  const unreadCount = useMemo(
    () => state.notifications.filter((n) => !n.read).length,
    [state.notifications],
  );

  // ========== Context Value ==========
  const contextValue: AppContextType = useMemo(
    () => ({
      state,
      dispatch,
      runMatching,
      getProjectMatches,
      getBuilderMatches,
      getBuilder,
      getProject,
      getCurrentProfile,
      unreadCount,
    }),
    [
      state,
      runMatching,
      getProjectMatches,
      getBuilderMatches,
      getBuilder,
      getProject,
      getCurrentProfile,
      unreadCount,
    ],
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

/**
 * useApp hook - Access global application state
 * @throws Error if used outside of AppProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
