import { useState } from "react";
import { useApp } from "@/state/AppContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, CheckCircle2, FileText, Signature } from "lucide-react";
import type { InvestmentProject } from "@/types";

interface InvestmentAgreementModalProps {
  project: InvestmentProject;
  investmentAmount: number | null;
  onClose: () => void;
}

export function InvestmentAgreementModal({
  project,
  investmentAmount,
  onClose,
}: InvestmentAgreementModalProps) {
  const { dispatch, state } = useApp();
  const [step, setStep] = useState<"review" | "sign" | "confirm">("review");
  const [agreementAmount, setAgreementAmount] = useState<number>(
    investmentAmount || project.minInvestment || 50000,
  );
  const [signerName, setSignerName] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const calculatedReturn = agreementAmount * (1 + project.expectedROI / 100);
  const equityStake =
    (agreementAmount / project.targetFunding) * project.equityOffered;

  const handleReview = () => {
    if (agreementAmount >= (project.minInvestment || 0)) {
      setStep("sign");
    }
  };

  const handleSign = () => {
    if (signerName && agreeToTerms) {
      setStep("confirm");
    }
  };

  const handleConfirm = () => {
    // Create investment agreement
    const agreement = {
      id: `agree_${Date.now()}`,
      investorId: state.currentUser?.userId || "investor_unknown",
      projectId: project.id,
      amount: agreementAmount,
      agreedReturnPercentage: project.expectedROI,
      status: "signed" as const,
      createdAt: Date.now(),
      signedAt: Date.now(),
      equityPercentage: equityStake,
    };

    dispatch({
      type: "CREATE_INVESTMENT_AGREEMENT",
      payload: agreement,
    });

    // Update project funding
    const updatedProject: InvestmentProject = {
      ...project,
      raisedFunding: project.raisedFunding + agreementAmount,
    };

    dispatch({
      type: "UPDATE_INVESTMENT_PROJECT",
      payload: updatedProject,
    });

    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Investment Agreement</DialogTitle>
        </DialogHeader>

        <Tabs value={step} onValueChange={(v) => setStep(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="review" disabled={step !== "review"}>
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Review
              </div>
            </TabsTrigger>
            <TabsTrigger value="sign" disabled={step === "review"}>
              <div className="flex items-center gap-2">
                <Signature className="h-4 w-4" />
                Sign
              </div>
            </TabsTrigger>
            <TabsTrigger value="confirm" disabled={step !== "confirm"}>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Confirm
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Step 1: Review Agreement */}
          <TabsContent value="review" className="space-y-6 mt-6">
            <Card className="p-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    Investment Terms
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                    Review the investment details and agreement before
                    proceeding to digital signature.
                  </p>
                </div>
              </div>
            </Card>

            {/* Investment Details */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Investment Details</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Investment Amount
                  </label>
                  <Input
                    type="number"
                    value={agreementAmount}
                    onChange={(e) =>
                      setAgreementAmount(parseFloat(e.target.value) || 0)
                    }
                    min={project.minInvestment || 0}
                    className="text-lg font-semibold"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Min: ${(project.minInvestment || 0).toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Expected Return
                    </p>
                    <p className="text-lg font-semibold">
                      $
                      {calculatedReturn.toLocaleString(undefined, {
                        maximumFractionDigits: 0,
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Equity Stake
                    </p>
                    <p className="text-lg font-semibold">
                      {equityStake.toFixed(3)}%
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Project Details */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Project Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project</span>
                  <span className="font-medium">{project.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected ROI</span>
                  <span className="font-medium">{project.expectedROI}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Total Equity Offered
                  </span>
                  <span className="font-medium">{project.equityOffered}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant={
                      project.status === "funding" ? "default" : "secondary"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Terms and Conditions */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Terms & Conditions</h4>
              <div className="bg-muted p-4 rounded-lg max-h-48 overflow-y-auto text-sm text-muted-foreground space-y-3">
                <p>
                  <strong>1. Investment Agreement:</strong> This investment
                  represents {equityStake.toFixed(3)}% equity stake in{" "}
                  {project.title}.
                </p>
                <p>
                  <strong>2. Return Terms:</strong> The investor agrees to
                  receive projected returns of {project.expectedROI}% based on
                  project performance.
                </p>
                <p>
                  <strong>3. Governance Rights:</strong> The investor shall have
                  proportional voting rights on major project decisions.
                </p>
                <p>
                  <strong>4. Funding Timeline:</strong> Upon signature, funds
                  will be transferred within 5 business days.
                </p>
                <p>
                  <strong>5. Confidentiality:</strong> All project information
                  shared under this agreement is confidential.
                </p>
                <p>
                  <strong>6. Risk Disclaimer:</strong> Investment involves risk.
                  Returns are not guaranteed and dependent on project success.
                </p>
              </div>
            </Card>

            <Button className="w-full" size="lg" onClick={handleReview}>
              Continue to Signature
            </Button>
          </TabsContent>

          {/* Step 2: Digital Signature */}
          <TabsContent value="sign" className="space-y-6 mt-6">
            <Card className="p-6 border-purple-200 bg-purple-50 dark:bg-purple-950/20">
              <div className="flex items-start gap-3">
                <Signature className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-purple-900 dark:text-purple-100">
                    Digital Signature Required
                  </p>
                  <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">
                    Sign this agreement digitally using your name. This acts as
                    your legal consent.
                  </p>
                </div>
              </div>
            </Card>

            {/* Signature Section */}
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Your Signature</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Full Name (as it appears in legal documents)
                  </label>
                  <Input
                    placeholder="Enter your full name"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    className="text-lg"
                  />
                </div>

                {/* Signature Pad */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Digital Signature
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-8 bg-muted flex flex-col items-center justify-center text-center">
                    <Signature className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Your signature will be automatically generated with your
                      name
                    </p>
                    {signerName && (
                      <div className="mt-6 p-4 bg-white dark:bg-slate-900 rounded border-2 border-blue-400">
                        <p className="text-2xl font-cursive italic text-blue-600">
                          {signerName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Agreement Checkbox */}
                <div className="flex items-start gap-3 pt-4 border-t">
                  <Checkbox
                    id="agree-terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) =>
                      setAgreeToTerms(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="agree-terms"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I agree to the investment terms and conditions, and
                    understand the risks associated with this investment. I
                    acknowledge that this digital signature is legally binding.
                  </label>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("review")}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleSign}
                disabled={!signerName || !agreeToTerms}
              >
                Sign Agreement
              </Button>
            </div>
          </TabsContent>

          {/* Step 3: Confirmation */}
          <TabsContent value="confirm" className="space-y-6 mt-6">
            <Card className="p-6 border-green-200 bg-green-50 dark:bg-green-950/20">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900 dark:text-green-100">
                    Agreement Ready for Confirmation
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                    Review and confirm your investment agreement before
                    submitting.
                  </p>
                </div>
              </div>
            </Card>

            {/* Summary */}
            <Card className="p-6 space-y-4">
              <h4 className="font-semibold">Investment Summary</h4>

              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Investor Name</span>
                  <span className="font-medium">{signerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project</span>
                  <span className="font-medium">{project.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Investment Amount
                  </span>
                  <span className="font-bold">
                    ${agreementAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Equity Acquired</span>
                  <span className="font-medium">{equityStake.toFixed(3)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected Return</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    $
                    {calculatedReturn.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Signed Date</span>
                  <span className="font-medium">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
              <p className="text-xs text-blue-900 dark:text-blue-100">
                ℹ️ A confirmation email will be sent to your registered email
                address with the signed agreement and payment details.
              </p>
            </Card>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("sign")}
              >
                Back
              </Button>
              <Button className="flex-1" onClick={handleConfirm}>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Confirm & Complete
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
