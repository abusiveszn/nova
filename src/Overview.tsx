import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/state/AppContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { TopNav } from "@/components/TopNav";
import { RoleSidebar } from "@/components/RoleSidebar";
import { getDashboardRole } from "@/types";
import { NotificationPanel } from "@/components/NotificationPanel";
import { ProfileEditModal } from "@/components/ProfileEditModal";
import { BuilderOverview } from "@/sections/BuilderOverview";
import { CompanyOverview } from "@/sections/CompanyOverview";
import { AdminOverview } from "@/sections/AdminOverview";
import { ProjectsView } from "@/sections/ProjectsView";
import { OpportunitiesView } from "@/sections/OpportunitiesView";
import { ApplicantsView } from "@/sections/ApplicantsView";
import { ProfileView } from "@/sections/ProfileView";
import { AdminUsersView } from "@/sections/AdminUsersView";
import { AdminMatchingView } from "@/sections/AdminMatchingView";
import { PostProjectView } from "@/sections/PostProjectView";
import { BuilderProfileView } from "@/sections/BuilderProfileView";
import { PortfolioView } from "@/sections/PortfolioView";
import { ReputationOverviewView } from "@/sections/ReputationOverviewView";
import { ReputationDeepDiveView } from "@/sections/ReputationDeepDiveView";
import { TeamChatView } from "@/sections/TeamChatView";
import { InvestorMarketplaceView } from "@/sections/InvestorMarketplaceView";
import { MyInvestmentsView } from "@/sections/MyInvestmentsView";
import { LearnerAcademyView } from "@/sections/LearnerAcademyView";
import { AdminLearnersView } from "@/sections/AdminLearnersView";
import { LearnerProfileView } from "@/sections/LearnerProfileView";
import { CommunityView } from "@/sections/CommunityView";

interface OverviewProps {
  onAddProfile: () => void;
}

export default function Overview({ onAddProfile }: OverviewProps) {
  const { state } = useApp();
  const isMobile = useIsMobile();
  const { userRole, activeTab } = state;

  // Calculate margin based on mobile and sidebar state
  const getMarginLeft = () => {
    if (isMobile) return "ml-0";
    return state.sidebarCollapsed ? "ml-16" : "ml-60";
  };

  const renderContent = () => {
    // Community view shared across all roles
    if (activeTab === "community") {
      return <CommunityView />;
    }

    const dashRole = getDashboardRole(userRole);
    const isInvestor = state.currentUser?.registeredRole === "investor";
    const isLearner = state.currentUser?.registeredRole === "learner";

    if (isLearner && dashRole === "builder") {
      if (activeTab === "profile") return <LearnerProfileView />;
      return <LearnerAcademyView activeTab={activeTab} />;
    }

    // Investor routes
    if (isInvestor && dashRole === "company") {
      switch (activeTab) {
        case "overview":
          return <MyInvestmentsView />;
        case "investment-marketplace":
          return <InvestorMarketplaceView />;
        case "my-investments":
          return <MyInvestmentsView />;
        case "profile":
          return <ProfileView />;
        default:
          return <MyInvestmentsView />;
      }
    }

    // Builder routes
    if (dashRole === "builder") {
      switch (activeTab) {
        case "overview":
          return <BuilderOverview />;
        case "portfolio":
          return <PortfolioView />;
        case "analytics":
          return <ReputationDeepDiveView />;
        case "reputation":
          return <ReputationOverviewView />;
        case "profile":
          return <BuilderProfileView />;
        case "network":
          return <BuilderOverview />;
        case "team-chat":
          return <TeamChatView />;
        case "projects":
          return <ProjectsView />;
        case "opportunities":
          return <OpportunitiesView />;
        default:
          return <BuilderOverview />;
      }
    }

    // Company routes
    if (dashRole === "company") {
      switch (activeTab) {
        case "overview":
          return <CompanyOverview />;
        case "projects":
          return <ProjectsView />;
        case "applicants":
          return <ApplicantsView />;
        case "post-project":
          return <PostProjectView />;
        case "profile":
          return <ProfileView />;
        default:
          return <CompanyOverview />;
      }
    }

    // Admin routes
    if (dashRole === "admin") {
      switch (activeTab) {
        case "overview":
          return <AdminOverview />;
        case "learners":
          return <AdminLearnersView />;
        case "users":
          return <AdminUsersView />;
        case "projects":
          return <ProjectsView />;
        case "matching":
          return <AdminMatchingView />;
        case "profile":
          return <ProfileView />;
        default:
          return <AdminOverview />;
      }
    }

    return <BuilderOverview />;
  };

  const contentKey = `${state.userRole}-${activeTab}`;

  return (
    <div className="min-h-screen bg-black text-[#f9fafb] flex">
      <RoleSidebar />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-out ${getMarginLeft()}`}
      >
        <TopNav onAddProfile={onAddProfile} />
        <main className="flex-1 overflow-auto pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={contentKey}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      {state.showNotifications && <NotificationPanel />}
      {state.showProfileEdit && <ProfileEditModal />}
    </div>
  );
}
