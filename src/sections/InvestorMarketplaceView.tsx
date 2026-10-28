import { useState, useMemo } from "react";
import { useApp } from "@/state/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  TrendingUp,
  Zap,
  Calendar,
  Eye,
  DollarSign,
} from "lucide-react";
import type { InvestmentProject } from "@/types";
import { InvestmentProjectDetailModal } from "@/components/InvestmentProjectDetailModal";

export function InvestorMarketplaceView() {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] =
    useState<InvestmentProject | null>(null);

  // Unique sectors from investment projects
  const sectors = useMemo(() => {
    const unique = new Set(
      state.investmentProjects
        .map((p) => p.sector)
        .filter((s): s is string => Boolean(s)),
    );
    return Array.from(unique);
  }, [state.investmentProjects]);

  // Filter projects based on search and sector
  const filteredProjects = useMemo(() => {
    return state.investmentProjects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack.some((tech) =>
          tech.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesSector =
        sectorFilter === "all" || project.sector === sectorFilter;

      return matchesSearch && matchesSector;
    });
  }, [state.investmentProjects, searchTerm, sectorFilter]);

  const fundingPercentage = (project: InvestmentProject) => {
    return Math.min(100, (project.raisedFunding / project.targetFunding) * 100);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Investment Marketplace</h1>
        <p className="text-muted-foreground">
          Discover and invest in promising tech projects across Africa
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects, tech stack..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Sector Filter */}
          <Select value={sectorFilter} onValueChange={setSectorFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Sectors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map((sector) => (
                <SelectItem key={sector} value={sector}>
                  {sector}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active filters display */}
        {(searchTerm || sectorFilter !== "all") && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {filteredProjects.length} project
              {filteredProjects.length !== 1 ? "s" : ""} found
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSectorFilter("all");
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              {/* Cover Image */}
              <div className="h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 overflow-hidden">
                {project.coverImage ? (
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <TrendingUp className="h-12 w-12 text-muted-foreground/30" />
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
                      project.status === "funding" ? "default" : "secondary"
                    }
                    className="mt-1"
                  >
                    {project.status.charAt(0).toUpperCase() +
                      project.status.slice(1)}
                  </Badge>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>

                {/* Funding Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      Funding
                    </span>
                    <span className="text-muted-foreground">
                      {fundingPercentage(project).toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={fundingPercentage(project)} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>
                      ${(project.raisedFunding / 1000000).toFixed(1)}M
                    </span>
                    <span>
                      ${(project.targetFunding / 1000000).toFixed(1)}M
                    </span>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="font-semibold text-sm">
                        {project.expectedROI}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Expected ROI
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-sm">
                      {project.equityOffered}%
                    </div>
                    <p className="text-xs text-muted-foreground">Equity</p>
                  </div>
                  {project.fundingDeadline && (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span className="text-xs font-semibold">
                          {Math.ceil(
                            (project.fundingDeadline - Date.now()) /
                              (24 * 60 * 60 * 1000),
                          )}{" "}
                          d
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Left</p>
                    </div>
                  )}
                </div>

                {/* Tech Stack Tags */}
                <div className="flex flex-wrap gap-1 pt-2">
                  {project.techStack.slice(0, 2).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                  {project.techStack.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{project.techStack.length - 2}
                    </Badge>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full mt-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(project);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <Zap className="h-12 w-12 text-muted-foreground/50 mx-auto" />
            <div>
              <h3 className="font-semibold">No projects found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or search term
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSectorFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <InvestmentProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
