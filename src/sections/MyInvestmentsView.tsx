import { useMemo } from "react";
import { useApp } from "@/state/AppContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Calendar,
  DollarSign,
  FileText,
  MessageCircle,
} from "lucide-react";

export function MyInvestmentsView() {
  const { state } = useApp();

  // Get current user's investments
  const myInvestments = useMemo(() => {
    return state.investmentAgreements.filter(
      (agreement) => agreement.investorId === state.currentUser?.userId,
    );
  }, [state.investmentAgreements, state.currentUser]);

  // Get project details for each investment
  const investmentsWithProjects = useMemo(() => {
    return myInvestments
      .map((agreement) => {
        const project = state.investmentProjects.find(
          (p) => p.id === agreement.projectId,
        );
        return { agreement, project };
      })
      .filter((item) => item.project !== undefined);
  }, [myInvestments, state.investmentProjects]);

  // Calculate portfolio stats
  const stats = useMemo(() => {
    const totalInvested = myInvestments.reduce((sum, a) => sum + a.amount, 0);
    const totalExpectedReturn = myInvestments.reduce(
      (sum, a) => sum + a.amount * (1 + a.agreedReturnPercentage / 100),
      0,
    );
    const totalProfit = totalExpectedReturn - totalInvested;
    const averageROI =
      myInvestments.length > 0
        ? myInvestments.reduce((sum, a) => sum + a.agreedReturnPercentage, 0) /
          myInvestments.length
        : 0;

    return {
      totalInvested,
      totalExpectedReturn,
      totalProfit,
      averageROI,
      count: myInvestments.length,
    };
  }, [myInvestments]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">My Investments</h1>
        <p className="text-muted-foreground">
          Track your investment portfolio and performance
        </p>
      </div>

      {/* Portfolio Stats */}
      {stats.count > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Invested</p>
              <div className="text-2xl font-bold flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {(stats.totalInvested / 1000000).toFixed(2)}M
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Total Expected Return
              </p>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {(stats.totalExpectedReturn / 1000000).toFixed(2)}M
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Expected Profit</p>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                +${(stats.totalProfit / 1000000).toFixed(2)}M
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Average ROI</p>
              <div className="text-2xl font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                {stats.averageROI.toFixed(1)}%
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Investments List */}
      {investmentsWithProjects.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Portfolio</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {investmentsWithProjects.map(({ agreement, project }) => {
              if (!project) return null;

              const expectedReturn =
                agreement.amount * (1 + agreement.agreedReturnPercentage / 100);
              const profit = expectedReturn - agreement.amount;

              return (
                <Card
                  key={agreement.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Project Image */}
                  <div className="h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 overflow-hidden">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <TrendingUp className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Title and Status */}
                    <div>
                      <h3 className="font-semibold line-clamp-2">
                        {project.title}
                      </h3>
                      <Badge
                        variant={
                          agreement.status === "signed"
                            ? "default"
                            : "secondary"
                        }
                        className="mt-1"
                      >
                        {agreement.status === "signed"
                          ? "Signed"
                          : agreement.status === "pending_signature"
                            ? "Pending"
                            : "Funded"}
                      </Badge>
                    </div>

                    {/* Investment Details */}
                    <div className="space-y-2 border-t pt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Investment
                        </span>
                        <span className="font-medium">
                          ${(agreement.amount / 1000000).toFixed(2)}M
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Your Equity
                        </span>
                        <span className="font-medium">
                          {(agreement.equityPercentage || 0).toFixed(3)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Expected ROI
                        </span>
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {agreement.agreedReturnPercentage}%
                        </span>
                      </div>
                    </div>

                    {/* Expected Return */}
                    <Card className="p-3 bg-green-50 dark:bg-green-950/20">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Expected Return
                          </p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            ${(expectedReturn / 1000000).toFixed(2)}M
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Profit
                          </p>
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            +${(profit / 1000000).toFixed(2)}M
                          </p>
                        </div>
                      </div>
                    </Card>

                    {/* Dates */}
                    {agreement.signedAt && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                        <Calendar className="h-3 w-3" />
                        Signed{" "}
                        {new Date(agreement.signedAt).toLocaleDateString()}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <FileText className="h-3 w-3 mr-1" />
                        Agreement
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground/50" />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-lg">No Investments Yet</h3>
              <p className="text-sm text-muted-foreground">
                Start exploring the marketplace to find promising projects to
                invest in
              </p>
            </div>
            <Button>Browse Marketplace</Button>
          </div>
        </Card>
      )}
    </div>
  );
}
