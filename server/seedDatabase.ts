import { User } from "./models/User";
import { Builder } from "./models/Builder";
import { Company } from "./models/Company";
import { Project } from "./models/Project";
import { Application } from "./models/Application";
import {
  InvestmentProject,
  InvestmentAgreement,
  InvestorInquiry,
} from "./models/Investment";
import { seedBuilders, seedCompanies, seedProjects, seedApplications } from "../src/data/seed";
import {
  seedInvestmentProjects,
  seedInvestmentAgreements,
  seedInvestorInquiries,
} from "../src/data/investor-seed";

/**
 * Seeds MongoDB collections if they are empty
 */
export async function seedDatabaseIfEmpty() {
  try {
    const adminUser = await User.findOne({ email: "novafuturegrid@gmail.com" });
    if (!adminUser) {
      console.log("[MongoDB] Seeding admin user novafuturegrid@gmail.com...");
      await User.create({
        email: "novafuturegrid@gmail.com",
        hash: "0b56f52c06cef94b5d6683e8ab607ad6abf90c627cb6fa68c3e85a740e86156b",
        name: "Nova Overseer Admin",
        phone: "+1-800-NOVA-ADM",
        registeredRole: "admin",
        verifiedAt: new Date().toISOString(),
      });
    }
    const builderCount = await Builder.countDocuments();
    if (builderCount === 0) {
      console.log("[MongoDB] Seeding builders...");
      await Builder.insertMany(seedBuilders as any);
    }

    const companyCount = await Company.countDocuments();
    if (companyCount === 0) {
      console.log("[MongoDB] Seeding companies...");
      await Company.insertMany(seedCompanies as any);
    }

    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      console.log("[MongoDB] Seeding projects...");
      await Project.insertMany(seedProjects as any);
    }

    const applicationCount = await Application.countDocuments();
    if (applicationCount === 0) {
      console.log("[MongoDB] Seeding applications...");
      await Application.insertMany(seedApplications as any);
    }

    const invProjCount = await InvestmentProject.countDocuments();
    if (invProjCount === 0) {
      console.log("[MongoDB] Seeding investment projects...");
      await InvestmentProject.insertMany(seedInvestmentProjects as any);
    }

    const invAgrCount = await InvestmentAgreement.countDocuments();
    if (invAgrCount === 0) {
      console.log("[MongoDB] Seeding investment agreements...");
      await InvestmentAgreement.insertMany(seedInvestmentAgreements as any);
    }

    const invInqCount = await InvestorInquiry.countDocuments();
    if (invInqCount === 0) {
      console.log("[MongoDB] Seeding investor inquiries...");
      await InvestorInquiry.insertMany(seedInvestorInquiries as any);
    }

    console.log("[MongoDB] Seed verification complete.");
  } catch (err: any) {
    console.warn("[MongoDB] Auto-seeding skipped or encountered error:", err.message);
  }
}
