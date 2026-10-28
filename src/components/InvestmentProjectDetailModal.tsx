import { useState } from "react";
import { useApp } from "@/state/AppContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  FileText,
  MessageCircle,
  Calendar,
  Zap,
} from "lucide-react";
import type { InvestmentProject } from "@/types";
import { ROICalculator } from "@/sections/ROICalculator";
import { InvestmentAgreementModal } from "./InvestmentAgreementModal";
import { InvestorMessaging } from "./InvestorMessaging";

interface InvestmentProjectDetailModalProps {
  project: InvestmentProject;
  onClose: () => void;
}

export function InvestmentProjectDetailModal({
  project,
  onClose,
}: InvestmentProjectDetailModalProps) {
  const { state } = useApp();
  const [investmentAmount, setInvestmentAmount] = useState<number | null>(null);
  const [showAgreement, setShowAgreement] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "overview" | "calculator" | "messages"
  >("overview");

  const fundingPercentage =
    (project.raisedFunding / project.targetFunding) * 100;
  const daysRemaining = project.fundingDeadline
    ? Math.ceil((project.fundingDeadline - Date.now()) / (24 * 60 * 60 * 1000))
    : null;

  // Get project manager info
  const projectManager = state.companies.find(
    (c) => c.userId === project.projectManagerId,
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project.title}</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="calculator">ROI Calculator</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Cover Image */}
            {project.coverImage && (
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            )}

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Project Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="text-2xl font-bold flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  {project.expectedROI}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Expected ROI
                </p>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold">
                  {project.equityOffered}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Equity Offered
                </p>
              </Card>
              <Card className="p-4">
                <div className="text-2xl font-bold flex items-center gap-2">
                  {fundingPercentage.toFixed(0)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">Funded</p>
              </Card>
              {daysRemaining && (
                <Card className="p-4">
                  <div className="text-2xl font-bold flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {daysRemaining}d
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Days Left
                  </p>
                </Card>
              )}
            </div>

            {/* Funding Progress */}
            <Card className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold">Funding Progress</h4>
                <span className="text-sm text-muted-foreground">
                  ${(project.raisedFunding / 1000000).toFixed(1)}M of $
                  {(project.targetFunding / 1000000).toFixed(1)}M
                </span>
              </div>
              <Progress value={fundingPercentage} />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Min Investment: ${(project.minInvestment || 0) / 1000}K
                </span>
                <span>
                  Deadline:{" "}
                  {project.fundingDeadline
                    ? new Date(project.fundingDeadline).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </Card>

            {/* Tech Stack */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Technology Stack</h4>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Project Manager */}
            {projectManager && (
              <Card className="p-4">
                <h4 className="font-semibold mb-3">Project Manager</h4>
                <div className="flex items-center gap-4">
                  <img
                    src={projectManager.avatarUrl}
                    alt={projectManager.fullName}
                    className="h-12 w-12 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{projectManager.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {projectManager.companyName}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("messages")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </Card>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-3 pt-4">
              <Button className="flex-1" onClick={() => setShowAgreement(true)}>
                <Zap className="h-4 w-4 mr-2" />
                Start Investment
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Download Pitch Deck
              </Button>
            </div>
          </TabsContent>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="mt-6">
            <ROICalculator
              project={project}
              onAmountChange={setInvestmentAmount}
            />
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-4 mt-6">
            <InvestorMessaging project={project} />
          </TabsContent>
        </Tabs>
      </DialogContent>

      {/* Investment Agreement Modal */}
      {showAgreement && (
        <InvestmentAgreementModal
          project={project}
          investmentAmount={investmentAmount}
          onClose={() => setShowAgreement(false)}
        />
      )}
    </Dialog>
  );
}
