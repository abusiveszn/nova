import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, DollarSign, Percent } from "lucide-react";
import type { InvestmentProject } from "@/types";

interface ROICalculatorProps {
  project: InvestmentProject;
  onAmountChange?: (amount: number) => void;
}

export function ROICalculator({ project, onAmountChange }: ROICalculatorProps) {
  const [investmentAmount, setInvestmentAmount] = useState<number>(
    project.minInvestment || 50000,
  );

  // Calculate metrics
  const metrics = useMemo(() => {
    const investmentPercent = (investmentAmount / project.targetFunding) * 100;
    const equityAccquired = (investmentPercent / 100) * project.equityOffered;
    const estimatedReturn = investmentAmount * (1 + project.expectedROI / 100);
    const profit = estimatedReturn - investmentAmount;

    return {
      investmentPercent,
      equityAcquired: equityAccquired,
      estimatedReturn,
      profit,
    };
  }, [investmentAmount, project]);

  const handleSliderChange = (value: number[]) => {
    const newAmount = value[0];
    setInvestmentAmount(newAmount);
    onAmountChange?.(newAmount);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    const newAmount = Math.max(0, value);
    setInvestmentAmount(newAmount);
    onAmountChange?.(newAmount);
  };

  const maxInvestment = Math.min(
    project.targetFunding * 0.5,
    project.targetFunding - project.raisedFunding,
  );

  return (
    <div className="space-y-6">
      {/* Investment Amount Input */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold mb-2 block">
              Investment Amount
            </label>
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <Input
                type="number"
                value={investmentAmount}
                onChange={handleInputChange}
                className="text-lg font-semibold"
                min={project.minInvestment || 0}
                max={maxInvestment}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Min: ${(project.minInvestment || 0).toLocaleString()} | Max: $
              {Math.floor(maxInvestment).toLocaleString()}
            </p>
          </div>

          {/* Slider */}
          <div>
            <Slider
              value={[investmentAmount]}
              onValueChange={handleSliderChange}
              min={project.minInvestment || 0}
              max={maxInvestment}
              step={10000}
              className="w-full"
            />
          </div>
        </div>
      </Card>

      {/* Calculation Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Your Equity */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your Equity</p>
              <div className="text-3xl font-bold">
                {metrics.equityAcquired.toFixed(3)}%
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {metrics.investmentPercent.toFixed(2)}% of total funding
              </p>
            </div>
            <Percent className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </Card>

        {/* Estimated Return */}
        <Card className="p-6 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/50">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Estimated Return (at {project.expectedROI}% ROI)
              </p>
              <div className="text-3xl font-bold">
                $
                {metrics.estimatedReturn.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                +$
                {metrics.profit.toLocaleString(undefined, {
                  maximumFractionDigits: 0,
                })}{" "}
                profit
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </Card>
      </div>

      {/* Breakdown Table */}
      <Card className="p-6">
        <h4 className="font-semibold mb-4">Investment Breakdown</h4>
        <div className="space-y-3">
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-muted-foreground">Your Investment</span>
            <span className="font-semibold">
              ${investmentAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-muted-foreground">Expected ROI Rate</span>
            <span className="font-semibold">{project.expectedROI}%</span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-muted-foreground">Equity Stake</span>
            <span className="font-semibold">
              {metrics.equityAcquired.toFixed(3)}% of {project.equityOffered}%
            </span>
          </div>

          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-muted-foreground">
              Contribution to Funding
            </span>
            <span className="font-semibold">
              {metrics.investmentPercent.toFixed(2)}%
            </span>
          </div>

          <div className="flex justify-between items-center pt-3">
            <span className="text-muted-foreground font-medium">
              Estimated Profit
            </span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              +$
              {metrics.profit.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })}
            </span>
          </div>
        </div>
      </Card>

      {/* Disclaimer */}
      <Card className="p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50">
        <p className="text-xs text-amber-900 dark:text-amber-200">
          ⚠️ <strong>Disclaimer:</strong> This ROI is estimated based on project
          metrics and is not guaranteed. Actual returns depend on project
          performance, market conditions, and other factors. Always conduct due
          diligence before investing.
        </p>
      </Card>
    </div>
  );
}
