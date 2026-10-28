import type {
  InvestmentProject,
  InvestmentAgreement,
  InvestorInquiry,
} from "@/types";

/** Mock investment projects available for investors */
export const seedInvestmentProjects: InvestmentProject[] = [
  {
    id: "inv_proj_001",
    title: "AfroChat - AI-Powered Community Platform",
    description:
      "Building the largest AI-powered social platform for African creators and entrepreneurs. Connect, collaborate, and monetize your talent across the continent.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Redis", "OpenAI API"],
    targetFunding: 2000000,
    raisedFunding: 750000,
    expectedROI: 35,
    equityOffered: 8,
    projectManagerId: "company_001",
    projectManagerName: "Chioma Obi",
    projectManagerAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=chioma",
    status: "funding",
    deckUrl: "https://docs.google.com/presentation/d/...",
    coverImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    companyWebsite: "https://afrochatter.io",
    sector: "SaaS/AI",
    tags: ["AI", "Social", "Africa", "Community", "Creator Economy"],
    minInvestment: 50000,
    fundingDeadline: Date.now() + 90 * 24 * 60 * 60 * 1000, // 90 days
    createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
  },
  {
    id: "inv_proj_002",
    title: "FinFlow - Smart Financial Management",
    description:
      "A fintech solution empowering SMEs across Africa with AI-driven expense tracking, invoicing, and cash flow optimization. Trusted by 10,000+ businesses.",
    techStack: ["React", "Node.js", "Python", "MongoDB", "Stripe API"],
    targetFunding: 5000000,
    raisedFunding: 3200000,
    expectedROI: 42,
    equityOffered: 12,
    projectManagerId: "company_002",
    projectManagerName: "Kwame Asante",
    projectManagerAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=kwame",
    status: "active",
    deckUrl: "https://docs.google.com/presentation/d/...",
    coverImage:
      "https://images.unsplash.com/photo-1554224311-beee415c15c7?w=500&h=300&fit=crop",
    companyWebsite: "https://finflow.io",
    sector: "Fintech",
    tags: ["Fintech", "SME", "Finance", "Africa"],
    minInvestment: 100000,
    fundingDeadline: Date.now() + 60 * 24 * 60 * 60 * 1000, // 60 days
    createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000, // 45 days ago
  },
  {
    id: "inv_proj_003",
    title: "EduVerse - Decentralized Learning Platform",
    description:
      "Blockchain-based education platform offering micro-credentials and skill-based learning. Connecting learners with global opportunities and employers.",
    techStack: ["Solidity", "React", "Hardhat", "Web3.js", "IPFS"],
    targetFunding: 1500000,
    raisedFunding: 450000,
    expectedROI: 55,
    equityOffered: 6,
    projectManagerId: "company_003",
    projectManagerName: "Adeline Okoro",
    projectManagerAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=adeline",
    status: "funding",
    deckUrl: "https://docs.google.com/presentation/d/...",
    coverImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
    companyWebsite: "https://eduverse.io",
    sector: "EdTech",
    tags: ["Web3", "Education", "Blockchain", "Credentials"],
    minInvestment: 25000,
    fundingDeadline: Date.now() + 120 * 24 * 60 * 60 * 1000, // 120 days
    createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000, // 15 days ago
  },
  {
    id: "inv_proj_004",
    title: "HealthSync - Medical Records Platform",
    description:
      "HIPAA-compliant digital health records platform connecting patients, doctors, and laboratories. Streamlining healthcare delivery across remote areas.",
    techStack: ["React", "PostgreSQL", "Node.js", "Docker", "AWS", "GraphQL"],
    targetFunding: 3000000,
    raisedFunding: 1100000,
    expectedROI: 38,
    equityOffered: 10,
    projectManagerId: "company_004",
    projectManagerName: "Dr. Miriam Mensah",
    projectManagerAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=miriam",
    status: "active",
    deckUrl: "https://docs.google.com/presentation/d/...",
    coverImage:
      "https://images.unsplash.com/photo-1576091160550-112173f7f477?w=500&h=300&fit=crop",
    companyWebsite: "https://healthsync.io",
    sector: "HealthTech",
    tags: ["Healthcare", "Medical Records", "Africa", "Telemedicine"],
    minInvestment: 50000,
    fundingDeadline: Date.now() + 75 * 24 * 60 * 60 * 1000, // 75 days
    createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
  },
  {
    id: "inv_proj_005",
    title: "AgroDrive - Agricultural Tech Platform",
    description:
      "IoT and data-driven platform helping farmers optimize crop yields, manage weather patterns, and access premium markets.",
    techStack: ["Python", "React", "TensorFlow", "PostgreSQL", "AWS"],
    targetFunding: 2500000,
    raisedFunding: 800000,
    expectedROI: 48,
    equityOffered: 9,
    projectManagerId: "company_005",
    projectManagerName: "Jacob Mwangi",
    projectManagerAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=jacob",
    status: "funding",
    deckUrl: "https://docs.google.com/presentation/d/...",
    coverImage:
      "https://images.unsplash.com/photo-1574143611937-0df059b5ef3e?w=500&h=300&fit=crop",
    companyWebsite: "https://agrodrive.io",
    sector: "AgriTech",
    tags: ["Agriculture", "IoT", "Sustainability", "Climate"],
    minInvestment: 50000,
    fundingDeadline: Date.now() + 100 * 24 * 60 * 60 * 1000, // 100 days
    createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
  },
];

/** Mock investment agreements */
export const seedInvestmentAgreements: InvestmentAgreement[] = [
  {
    id: "agree_001",
    investorId: "investor_001",
    projectId: "inv_proj_002",
    amount: 250000,
    agreedReturnPercentage: 42,
    status: "signed",
    createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
    signedAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
    fundedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    equityPercentage: 1.5,
  },
  {
    id: "agree_002",
    investorId: "investor_002",
    projectId: "inv_proj_001",
    amount: 150000,
    agreedReturnPercentage: 35,
    status: "pending_signature",
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    equityPercentage: 0.75,
  },
];

/** Mock investor inquiries/messages */
export const seedInvestorInquiries: InvestorInquiry[] = [
  {
    id: "inq_001",
    senderId: "investor_001",
    senderName: "Amina Hassan",
    receiverId: "company_001",
    projectId: "inv_proj_001",
    content:
      "Hi Chioma! Interested in AfroChat. Can you elaborate on your go-to-market strategy for West Africa?",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    read: true,
  },
  {
    id: "inq_002",
    senderId: "company_001",
    senderName: "Chioma Obi",
    receiverId: "investor_001",
    projectId: "inv_proj_001",
    content:
      "Absolutely! We have partnerships with major telecom providers and are targeting 5M users in Q3. Detailed breakdown in the deck.",
    createdAt: Date.now() - 1.5 * 24 * 60 * 60 * 1000,
    read: true,
  },
  {
    id: "inq_003",
    senderId: "investor_002",
    senderName: "Kofi Mensah",
    receiverId: "company_002",
    projectId: "inv_proj_002",
    content:
      "What are your current MRR and churn rates? Also interested in the cap table.",
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    read: false,
  },
];
