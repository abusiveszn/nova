import { useState, useMemo, useRef } from "react";
import JSZip from "jszip";
import {
  Folder,
  FileCode,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Play,
  Terminal,
  Sparkles,
  Download,
  Minimize2,
  Maximize2,
  X,
  FileText,
  Eye,
  Star,
  GitFork,
  ChevronDown,
  MoreHorizontal,
  FolderOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface TeamRepositoryProps {
  roomId: string;
  roomName: string;
  currentUser: any;
}

interface RepoFile {
  path: string;
  content: string;
  language: string;
  category: "frontend" | "backend" | "api";
  lastModifiedBy: string;
  lastModifiedTime: string;
}

interface Commit {
  id: string;
  authorName: string;
  authorRole: string;
  message: string;
  timestamp: number;
  filesModified: string[];
}

export function TeamRepository({ roomName, currentUser }: TeamRepositoryProps) {
  // 1. Initial Database of Repository Files matching fintech-app tree
  const [files, setFiles] = useState<Record<string, RepoFile>>({
    "app/(dashboard)/analytics/page.tsx": {
      path: "app/(dashboard)/analytics/page.tsx",
      content: `import { DashboardLayout } from "@/components/layout/dashboard-layout";\nimport { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";\nimport { getDashboardData } from "@/lib/dashboard";\nimport { formatCurrency } from "@/lib/utils";\nimport { TrendingUp, Users, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";\n\nexport default async function DashboardPage() {\n  const data = await getDashboardData();\n  return (\n    <DashboardLayout>\n      <div className="space-y-6 p-6">\n        <div className="flex items-center justify-between">\n          <div>\n            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>\n            <p className="text-muted-foreground">Overview of your fintech platform</p>\n          </div>\n          <div className="flex items-center gap-2">\n            <button className="btn btn-outline">Export</button>\n            <button className="btn btn-primary">New Report</button>\n          </div>\n        </div>\n        \n        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">\n          <Card>\n            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">\n              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>\n              <TrendingUp className="h-4 w-4 text-green-500" />\n            </CardHeader>\n            <CardContent>\n              <div className="text-2xl font-bold">{formatCurrency(data.revenue.total)}</div>\n              <p className="text-xs text-green-500 flex items-center">\n                <ArrowUpRight className="h-3 w-3 mr-1" /> {data.revenue.growth}% from last month\n              </p>\n            </CardContent>\n          </Card>\n        </div>\n      </div>\n    </DashboardLayout>\n  );\n}`,
      language: "typescript",
      category: "frontend",
      lastModifiedBy: "Aisha Mohammed",
      lastModifiedTime: "2 hours ago",
    },
    "app/layout.tsx": {
      path: "app/layout.tsx",
      content: `import React from 'react';\nimport '../globals.css';\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body className="bg-slate-950 text-slate-100">{children}</body>\n    </html>\n  );\n}`,
      language: "typescript",
      category: "frontend",
      lastModifiedBy: "Aisha Mohammed",
      lastModifiedTime: "2 hours ago",
    },
    "app/page.tsx": {
      path: "app/page.tsx",
      content: `import React from 'react';\n\nexport default function Home() {\n  return (\n    <div className="p-8 text-center">\n      <h1 className="text-2xl font-bold">Welcome to Fintech App</h1>\n      <p className="text-sm text-slate-400 mt-2">Private repository workspace</p>\n    </div>\n  );\n}`,
      language: "typescript",
      category: "frontend",
      lastModifiedBy: "Aisha Mohammed",
      lastModifiedTime: "2 hours ago",
    },
    "components/DashboardLayout.tsx": {
      path: "components/DashboardLayout.tsx",
      content: `import React from 'react';\n\nexport function DashboardLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">\n      <main className="flex-grow">{children}</main>\n    </div>\n  );\n}`,
      language: "typescript",
      category: "frontend",
      lastModifiedBy: "Aisha Mohammed",
      lastModifiedTime: "5 hours ago",
    },
    "lib/dashboard.ts": {
      path: "lib/dashboard.ts",
      content: `export async function getDashboardData() {\n  return {\n    revenue: {\n      total: 1420500,\n      growth: 12.5\n    }\n  };\n}`,
      language: "typescript",
      category: "api",
      lastModifiedBy: "Chen Wei",
      lastModifiedTime: "4 hours ago",
    },
    "lib/utils.ts": {
      path: "lib/utils.ts",
      content: `export function formatCurrency(amount: number): string {\n  return new Intl.NumberFormat('en-US', {\n    style: 'currency',\n    currency: 'USD'\n  }).format(amount);\n}`,
      language: "typescript",
      category: "api",
      lastModifiedBy: "Danielle Smith",
      lastModifiedTime: "1 day ago",
    },
    ".env.local": {
      path: ".env.local",
      content: `MONGODB_URI=mongodb+srv://admin:fintech-admin@cluster0.mongodb.net/fintech\nJWT_SECRET=supersecrettoken`,
      language: "plaintext",
      category: "backend",
      lastModifiedBy: "Chen Wei",
      lastModifiedTime: "3 days ago",
    },
    ".gitignore": {
      path: ".gitignore",
      content: `# dependencies\n/node_modules\n/.pnp\n.pnp.js\n\n# testing\n/coverage\n\n# production\n/build\n\n# misc\n.DS_Store\n.env.local`,
      language: "plaintext",
      category: "backend",
      lastModifiedBy: "Chen Wei",
      lastModifiedTime: "3 days ago",
    },
    "package.json": {
      path: "package.json",
      content: `{\n  "name": "fintech-app",\n  "version": "1.0.0",\n  "private": true,\n  "dependencies": {\n    "next": "latest",\n    "react": "latest",\n    "lucide-react": "^0.294.0"\n  }\n}`,
      language: "json",
      category: "backend",
      lastModifiedBy: "Chen Wei",
      lastModifiedTime: "3 days ago",
    },
    "tsconfig.json": {
      path: "tsconfig.json",
      content: `{\n  "compilerOptions": {\n    "target": "es5",\n    "lib": ["dom", "dom.iterable", "esnext"],\n    "allowJs": true,\n    "skipLibCheck": true,\n    "strict": true,\n    "forceConsistentCasingInFileNames": true\n  }\n}`,
      language: "json",
      category: "backend",
      lastModifiedBy: "Chen Wei",
      lastModifiedTime: "3 days ago",
    },
    "README.md": {
      path: "README.md",
      content: `# fintech-app\n\nModern fintech application built with Next.js, Node.js and MongoDB.\n\nCollaborative development room workspace active.`,
      language: "markdown",
      category: "frontend",
      lastModifiedBy: "Danielle Smith",
      lastModifiedTime: "3 days ago",
    }
  });

  // 2. Active Tab States
  const [selectedFilePath, setSelectedFilePath] = useState<string>("app/(dashboard)/analytics/page.tsx");
  const [openFiles, setOpenFiles] = useState<string[]>([
    "app/(dashboard)/analytics/page.tsx",
    "app/layout.tsx",
    "lib/dashboard.ts",
    "lib/utils.ts",
    "README.md",
  ]);

  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    "app": true,
    "app/(dashboard)": true,
    "app/(dashboard)/analytics": true,
    "app/(dashboard)/customers": false,
    "app/(dashboard)/transactions": false,
    "components": true,
    "lib": true,
  });

  const [localEdits, setLocalEdits] = useState<Record<string, string>>({});
  const [commitMessage, setCommitMessage] = useState<string>("");
  const [branch] = useState<string>("main");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(true); // Default to fullscreen focus mode
  const [isCommitModalOpen, setIsCommitModalOpen] = useState<boolean>(false);
  const [isNewFileModalOpen, setIsNewFileModalOpen] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>("");
  const [showTerminal, setShowTerminal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 3. Simulated GitHub Commits History
  const [commits, setCommits] = useState<Commit[]>([
    {
      id: "a1b2c3d",
      authorName: "Aisha",
      authorRole: "Front End",
      message: "feat: build analytics dashboard views",
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      filesModified: ["app/(dashboard)/analytics/page.tsx"],
    },
    {
      id: "b4d1a8e",
      authorName: "Chen",
      authorRole: "Backend Dev",
      message: "refactor: mount api routes with database models",
      timestamp: Date.now() - 8 * 60 * 60 * 1000,
      filesModified: ["lib/dashboard.ts"],
    },
    {
      id: "f9e2b4c",
      authorName: "Danielle",
      authorRole: "API Dev",
      message: "style: add utils currency formatting tag helpers",
      timestamp: Date.now() - 10 * 60 * 60 * 1000,
      filesModified: ["lib/utils.ts"],
    },
  ]);

  // 4. Remote commits (to pull)
  const [pendingRemoteCommits, setPendingRemoteCommits] = useState<Commit[]>([]);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "Initializing workspace...",
    "Connected to remote repo: origin/main",
    "Branch set to 'main'. Local copy is up to date.",
  ]);

  const [notification, setNotification] = useState<string | null>(null);

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const logTerminal = (msg: string) => {
    setTerminalLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const activeFile = files[selectedFilePath];
  const activeCode = localEdits[selectedFilePath] !== undefined ? localEdits[selectedFilePath] : activeFile?.content || "";

  const isDirty = selectedFilePath && localEdits[selectedFilePath] !== undefined && localEdits[selectedFilePath] !== activeFile?.content;
  const modifiedFiles = useMemo(() => {
    return Object.keys(localEdits).filter((path) => files[path] && localEdits[path] !== files[path].content);
  }, [localEdits, files]);

  const totalDirtyCount = modifiedFiles.length;

  const handleCodeChange = (newCode: string) => {
    if (!selectedFilePath) return;
    setLocalEdits((prev) => ({
      ...prev,
      [selectedFilePath]: newCode,
    }));
  };

  const selectFile = (filePath: string) => {
    setSelectedFilePath(filePath);
    if (!openFiles.includes(filePath)) {
      setOpenFiles((prev) => [...prev, filePath]);
    }
  };

  const closeFileTab = (filePath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = openFiles.filter((p) => p !== filePath);
    setOpenFiles(filtered);
    if (selectedFilePath === filePath && filtered.length > 0) {
      setSelectedFilePath(filtered[filtered.length - 1]);
    }
  };

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderKey]: !prev[folderKey],
    }));
  };

  const handleDiscardChanges = () => {
    if (!selectedFilePath) return;
    setLocalEdits((prev) => {
      const next = { ...prev };
      delete next[selectedFilePath];
      return next;
    });
    logTerminal(`Discarded local edits on ${selectedFilePath}`);
  };

  // Commit and Push local changes
  const handleCommitAndPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim()) return;
    if (totalDirtyCount === 0) return;

    const newCommitId = Math.random().toString(16).slice(2, 9);
    const authorName = currentUser?.fullName.split(" ")[0] || "You";

    const updatedFiles = { ...files };
    modifiedFiles.forEach((path) => {
      if (updatedFiles[path]) {
        updatedFiles[path] = {
          ...updatedFiles[path],
          content: localEdits[path],
          lastModifiedBy: authorName,
          lastModifiedTime: "Just now",
        };
      }
    });

    const newCommit: Commit = {
      id: newCommitId,
      authorName,
      authorRole: "Full Stack",
      message: commitMessage.trim(),
      timestamp: Date.now(),
      filesModified: [...modifiedFiles],
    };

    setFiles(updatedFiles);
    setLocalEdits({});
    setCommits((prev) => [newCommit, ...prev]);
    setCommitMessage("");
    setIsCommitModalOpen(false);
    logTerminal(`Pushed commit ${newCommitId} to origin/${branch}`);
    logTerminal(`Files updated: ${modifiedFiles.join(", ")}`);
    triggerNotification(`Successfully pushed 1 commit to origin/${branch}`);
  };

  // Pull remote changes
  const handlePull = () => {
    if (pendingRemoteCommits.length === 0) {
      logTerminal("Already up to date.");
      return;
    }

    let updatedFiles = { ...files };
    [...pendingRemoteCommits].reverse().forEach((commit) => {
      commit.filesModified.forEach((filePath) => {
        if (updatedFiles[filePath]) {
          if (filePath === "app/(dashboard)/analytics/page.tsx") {
            updatedFiles[filePath].content = files["app/(dashboard)/analytics/page.tsx"].content + `\n// Collaborator pull update: Added a new collaborative sidebar!\n`;
          } else if (filePath === "lib/dashboard.ts") {
            updatedFiles[filePath].content = `export async function getDashboardData() {\n  return {\n    revenue: {\n      total: 1420500,\n      growth: 12.5\n    },\n    // Added custom health check logs\n    health: 'ok',\n    time: Date.now()\n  };\n}`;
          } else if (filePath === "lib/utils.ts") {
            updatedFiles[filePath].content = `export function formatCurrency(amount: number): string {\n  return new Intl.NumberFormat('en-US', {\n    style: 'currency',\n    currency: 'USD'\n  }).format(amount);\n}\n\n// Added custom percentage formatter\nexport function formatPercentage(pct: number): string {\n  return \`\${pct}%\`;\n}`;
          }
          updatedFiles[filePath].lastModifiedBy = commit.authorName;
          updatedFiles[filePath].lastModifiedTime = "Just now (Pulled)";
        }
      });
    });

    setFiles(updatedFiles);
    setCommits((prev) => [...pendingRemoteCommits, ...prev]);
    setPendingRemoteCommits([]);
    logTerminal("Successfully pulled origin/main changes.");
    triggerNotification("Pulled origin/main updates!");
  };

  // Simulate collaborator changes
  const handleSimulateTeammateAction = () => {
    const authors = [
      { name: "Aisha", role: "Front End" },
      { name: "Chen", role: "Backend Dev" },
      { name: "Danielle", role: "API Dev" },
    ];
    const targetAuthor = authors[Math.floor(Math.random() * authors.length)];

    let filePath = "";
    let message = "";

    if (targetAuthor.name === "Aisha") {
      filePath = "app/(dashboard)/analytics/page.tsx";
      message = "style: add responsive alignment adjustments in analytics page";
    } else if (targetAuthor.name === "Chen") {
      filePath = "lib/dashboard.ts";
      message = "refactor: add api server health response data";
    } else {
      filePath = "lib/utils.ts";
      message = "feat: add support for percentage helper tags";
    }

    const commitId = Math.random().toString(16).slice(2, 9);
    const simulatedCommit: Commit = {
      id: commitId,
      authorName: targetAuthor.name,
      authorRole: targetAuthor.role,
      message,
      timestamp: Date.now(),
      filesModified: [filePath],
    };

    setPendingRemoteCommits((prev) => [simulatedCommit, ...prev]);
    logTerminal(`Remote: ${targetAuthor.name} pushed commit ${commitId} to origin/${branch}`);
    triggerNotification(`New push notification: ${targetAuthor.name} pushed a change!`);
  };

  // ZIP Downloader
  const handleDownloadZip = async () => {
    try {
      const zip = new JSZip();
      Object.entries(files).forEach(([filePath, fileObj]) => {
        const code = localEdits[filePath] !== undefined ? localEdits[filePath] : fileObj.content;
        zip.file(filePath, code);
      });
      const blob = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${roomName.toLowerCase().replace(/\s+/g, "-")}-repo.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
      logTerminal("Repository successfully exported and downloaded as ZIP archive.");
      triggerNotification("Repository ZIP downloaded!");
    } catch (err) {
      console.error("ZIP Generation Failed", err);
      triggerNotification("Failed to download ZIP.");
    }
  };

  const handleCreateFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    let path = newFileName.trim().replace(/\\/g, "/");
    if (files[path]) {
      triggerNotification("File path already exists!");
      return;
    }

    const category = path.startsWith("app") ? "frontend" : path.startsWith("components") ? "frontend" : "backend";
    const authorName = currentUser?.fullName.split(" ")[0] || "You";

    setFiles((prev) => ({
      ...prev,
      [path]: {
        path,
        content: `// Created file: ${path}\n\nexport {};`,
        language: path.split(".").pop() || "typescript",
        category,
        lastModifiedBy: authorName,
        lastModifiedTime: "Just now",
      },
    }));

    selectFile(path);
    setNewFileName("");
    setIsNewFileModalOpen(false);
    logTerminal(`Created new file: ${path}`);
    triggerNotification(`Created file ${path.split("/").pop()}`);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUploadFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const authorName = currentUser?.fullName.split(" ")[0] || "You";
      const extension = file.name.split(".").pop() || "txt";
      let category: "frontend" | "backend" | "api" = "frontend";
      let path = `app/${file.name}`;

      if (extension === "ts" || extension === "tsx") {
        category = "api";
        path = `lib/${file.name}`;
      }

      setFiles((prev) => ({
        ...prev,
        [path]: {
          path,
          content: content || "",
          language: extension,
          category,
          lastModifiedBy: authorName,
          lastModifiedTime: "Just now (Uploaded)",
        },
      }));

      selectFile(path);
      logTerminal(`Uploaded local file: ${file.name} to ${path}`);
      triggerNotification(`Uploaded ${file.name}!`);
    };
    reader.readAsText(file);
  };

  const lines = activeCode.split("\n");

  return (
    <div
      className={
        isFullscreen
          ? "fixed inset-0 z-50 bg-[#0c1017] overflow-y-auto flex flex-col font-sans text-slate-100"
          : "p-4 lg:p-8 max-w-[1600px] w-full mx-auto px-6 lg:px-10 flex flex-col animate-fade-in-up bg-[#0c1017] rounded-3xl border border-white/5 overflow-hidden"
      }
    >
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 rounded-2xl bg-indigo-500/90 text-white shadow-xl px-6 py-4 flex items-center gap-3 backdrop-blur-md border border-white/10 animate-fade-in">
          <Sparkles className="w-5 h-5 animate-pulse" />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      {/* GitHub Bar (Top Bar) */}
      <div className="bg-[#0c1017] border-b border-white/5 px-4 py-3 flex items-center justify-between text-slate-300 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-[#22d3ee]/20 flex items-center justify-center font-bold text-[#22d3ee] text-sm">
            N
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-white">nova-workspace</span>
            <span className="text-slate-600">/</span>
            <span className="font-semibold text-white">fintech-app</span>
            <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-800 text-slate-400 border border-slate-700">
              Private
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Actions: Watch, Star, Fork */}
          <div className="flex items-center border border-white/10 rounded-md bg-[#131a26]/40 overflow-hidden text-[10px]">
            <button className="px-2.5 py-1 hover:bg-white/5 flex items-center gap-1.5 border-r border-white/10">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>Watch</span>
            </button>
            <span className="bg-transparent text-[10px] px-2 py-0.2 text-slate-400 font-bold pr-2 pl-1.5">6</span>
          </div>
          
          <div className="flex items-center border border-white/10 rounded-md bg-[#131a26]/40 overflow-hidden text-[10px]">
            <button className="px-2.5 py-1 border-r border-white/10 hover:bg-white/5 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-slate-400" />
              <span>Star</span>
            </button>
            <span className="bg-transparent text-[10px] px-2 py-0.2 text-slate-400 font-bold pr-2 pl-1.5">12</span>
          </div>

          <div className="flex items-center border border-white/10 rounded-md bg-[#131a26]/40 overflow-hidden text-[10px]">
            <button className="px-2.5 py-1 border-r border-white/10 hover:bg-white/5 flex items-center gap-1.5">
              <GitFork className="w-3.5 h-3.5 text-slate-400" />
              <span>Fork</span>
            </button>
            <span className="bg-transparent text-[10px] px-2 py-0.2 text-slate-400 font-bold pr-2 pl-1.5">3</span>
          </div>

          {currentUser && (
            <img
              src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.userId}`}
              alt=""
              className="w-5 h-5 rounded-full object-cover ml-1 border border-white/10"
            />
          )}
        </div>
      </div>

      {/* Sub-Navigation Tabs Row */}
      <div className="bg-[#0c1017] border-b border-white/5 px-4 flex items-center justify-between text-slate-400 text-xs">
        <div className="flex items-center gap-4">
          <button className="px-3 py-2.5 border-b-2 border-[#22d3ee] text-white flex items-center gap-1.5 font-semibold">
            <FileCode className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span>Code</span>
          </button>
          <button className="px-3 py-2.5 hover:text-white flex items-center gap-1.5 text-slate-500 font-medium font-semibold">
            <span>Issues</span>
            <span className="bg-slate-800/60 text-[10px] px-1.5 py-0.2 rounded-full text-slate-400 font-semibold">3</span>
          </button>
          <button className="px-3 py-2.5 hover:text-white flex items-center gap-1.5 text-slate-500 font-medium font-semibold">
            <span>Pull requests</span>
            <span className="bg-slate-800/60 text-[10px] px-1.5 py-0.2 rounded-full text-slate-400 font-semibold">1</span>
          </button>
          <button className="px-3 py-2.5 hover:text-white flex items-center gap-1.5 text-slate-500 font-medium">
            <span>Actions</span>
          </button>
          <button className="px-3 py-2.5 hover:text-white flex items-center gap-1.5 text-slate-500 font-medium">
            <span>Projects</span>
            <span className="bg-slate-800/60 text-[10px] px-1.5 py-0.2 rounded-full text-slate-400 font-semibold">0</span>
          </button>
          <button className="px-3 py-2.5 hover:text-white flex items-center gap-1.5 text-slate-500 font-medium">
            <span>Wiki</span>
          </button>
          <button className="px-3 py-2.5 hover:text-white flex items-center gap-1.5 text-slate-500 font-medium">
            <span>Security</span>
          </button>
          <button className="px-3 py-2.5 hover:text-white flex items-center gap-1.5 text-slate-500 font-medium">
            <span>Insights</span>
          </button>
        </div>
        <button className="text-slate-500 hover:text-white p-2">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Description & Action Bar */}
      <div className="p-4 bg-[#0c1017] border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white font-['Space_Grotesk']">fintech-app</span>
            <span className="px-1.5 py-0.2 text-[9px] font-semibold rounded bg-slate-800 border border-slate-700 text-slate-400">
              Private
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5 font-medium">
            Modern fintech application built with Next.js, Node.js and MongoDB
          </p>
        </div>
        
        {/* Actions Button Panel */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulateTeammateAction}
            className="border-white/10 text-slate-300 hover:bg-white/5 text-[10px] h-8"
          >
            <Play className="w-3 h-3 mr-1 text-cyan-400" />
            Simulate Teammate
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handlePull}
            className={`border-indigo-500/20 text-[10px] h-8 relative ${
              pendingRemoteCommits.length > 0
                ? "border-cyan-400 text-cyan-400 bg-cyan-400/5 animate-pulse"
                : "text-indigo-400 hover:bg-indigo-500/10"
            }`}
          >
            <GitPullRequest className="w-3 h-3 mr-1" />
            Pull {pendingRemoteCommits.length > 0 && `(${pendingRemoteCommits.length})`}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadZip}
            className="border-white/10 text-slate-300 hover:bg-white/5 text-[10px] h-8"
          >
            <Download className="w-3 h-3 mr-1 text-emerald-400" />
            ZIP
          </Button>

          {/* Add File Dropdown Group */}
          <div className="relative group">
            <button className="bg-[#131a26] border border-white/10 text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg text-[10px] flex items-center gap-1 font-semibold">
              <span>Add file</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            
            <div className="absolute right-0 top-full mt-1 hidden group-hover:block bg-[#0c1017] border border-white/15 rounded-lg shadow-xl py-1 w-28 z-10">
              <button
                onClick={() => setIsNewFileModalOpen(true)}
                className="w-full text-left px-3 py-1.5 text-[10px] text-slate-400 hover:text-white hover:bg-white/5 font-medium"
              >
                Create file
              </button>
              <button
                onClick={handleUploadClick}
                className="w-full text-left px-3 py-1.5 text-[10px] text-slate-400 hover:text-white hover:bg-white/5 font-medium"
              >
                Upload file
              </button>
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUploadFileChange}
            className="hidden"
            accept=".ts,.tsx,.js,.jsx,.json,.txt,.py,.css,.html"
          />

          <Button
            onClick={() => setIsCommitModalOpen(true)}
            disabled={totalDirtyCount === 0}
            className={`text-[10px] h-8 px-3 font-semibold rounded-lg ${
              totalDirtyCount > 0
                ? "bg-[#22d3ee] text-[#030712] hover:bg-[#22d3ee]/90"
                : "bg-slate-900 border border-white/5 text-slate-500 cursor-not-allowed"
            }`}
          >
            <GitCommit className="w-3.5 h-3.5 mr-1" />
            Commit {totalDirtyCount > 0 && `(${totalDirtyCount})`}
          </Button>
        </div>
      </div>

      {/* Committer Activity Status Row */}
      <div className="bg-[#131a26]/20 border-b border-white/5 px-4 py-2.5 flex items-center justify-between text-[10px] text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-indigo-500/20 text-[#22d3ee] flex items-center justify-center text-[8px] font-bold uppercase">
            {commits[0]?.authorName.charAt(0) || "A"}
          </div>
          <span className="text-white font-semibold">{commits[0]?.authorName || "Aisha"}</span>
          <span className="font-medium">committed {commits[0] ? new Date(commits[0].timestamp).toLocaleTimeString() : "2 hours ago"}</span>
          <span className="text-slate-700">•</span>
          <span className="font-mono text-[9px] text-[#22d3ee] bg-[#22d3ee]/5 px-1 rounded">{commits[0]?.id || "a1b2c3d"}</span>
        </div>

        <button
          onClick={() => logTerminal("Fetch workspace changes history index...")}
          className="hover:text-white flex items-center gap-1 text-slate-500 text-[10px] font-semibold"
        >
          <GitBranch className="w-3 h-3" />
          <span>History</span>
        </button>
      </div>

      {/* Main IDE Grid Container */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[240px_1fr] items-stretch min-h-[480px]">
        {/* Left explorer panel */}
        <div className="bg-[#0c1017] border-r border-white/5 flex flex-col py-3 px-2 gap-3">
          <div className="px-2">
            <input
              type="text"
              placeholder="Go to file..."
              onClick={() => logTerminal("Triggering workspace quick open search...")}
              className="w-full bg-[#131a26] border border-white/5 rounded-md px-2.5 py-1 text-[10px] text-slate-300 placeholder-slate-500 font-mono focus:outline-none"
            />
          </div>

          {/* Interactive Folders Tree explorer */}
          <div className="flex-grow overflow-y-auto space-y-1 py-1 pr-1 font-mono select-none">
            <div className="flex items-center gap-1.5 text-xs text-[#22d3ee] font-bold tracking-wider py-1 px-1">
              <FolderOpen className="w-4 h-4 text-[#22d3ee]" />
              <span>fintech-app</span>
            </div>

            <div className="pl-3 border-l border-white/5 ml-3 space-y-0.5">
              {/* Folder: app */}
              <div>
                <button
                  onClick={() => toggleFolder("app")}
                  className="w-full flex items-center gap-1.5 py-1 text-xs text-slate-400 hover:text-white text-left font-medium"
                >
                  <Folder className="w-3.5 h-3.5 text-indigo-400" />
                  <span>app</span>
                </button>
                
                {expandedFolders["app"] && (
                  <div className="pl-3 border-l border-white/5 ml-2 space-y-0.5">
                    {/* Folder: (dashboard) */}
                    <div>
                      <button
                        onClick={() => toggleFolder("app/(dashboard)")}
                        className="w-full flex items-center gap-1.5 py-1 text-xs text-slate-400 hover:text-white text-left font-medium"
                      >
                        <Folder className="w-3.5 h-3.5 text-indigo-400" />
                        <span>(dashboard)</span>
                      </button>
                      
                      {expandedFolders["app/(dashboard)"] && (
                        <div className="pl-3 border-l border-white/5 ml-2 space-y-0.5">
                          {/* Folder: analytics */}
                          <div>
                            <button
                              onClick={() => toggleFolder("app/(dashboard)/analytics")}
                              className="w-full flex items-center gap-1.5 py-1 text-xs text-slate-400 hover:text-white text-left font-medium"
                            >
                              <Folder className="w-3.5 h-3.5 text-indigo-400" />
                              <span>analytics</span>
                            </button>
                            {expandedFolders["app/(dashboard)/analytics"] && (
                              <div className="pl-3 ml-2">
                                <button
                                  onClick={() => selectFile("app/(dashboard)/analytics/page.tsx")}
                                  className={`w-full text-left py-1 text-xs ${selectedFilePath === "app/(dashboard)/analytics/page.tsx" ? "text-[#22d3ee] font-bold" : "text-slate-500 hover:text-slate-300"}`}
                                >
                                  page.tsx
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Folder: customers */}
                          <div>
                            <button
                              onClick={() => toggleFolder("app/(dashboard)/customers")}
                              className="w-full flex items-center gap-1.5 py-1 text-xs text-slate-400 hover:text-white text-left font-medium"
                            >
                              <Folder className="w-3.5 h-3.5 text-indigo-400" />
                              <span>customers</span>
                            </button>
                            {expandedFolders["app/(dashboard)/customers"] && (
                              <div className="pl-3 ml-2">
                                <button
                                  onClick={() => selectFile("app/(dashboard)/customers/page.tsx")}
                                  className={`w-full text-left py-1 text-xs ${selectedFilePath === "app/(dashboard)/customers/page.tsx" ? "text-[#22d3ee] font-bold" : "text-slate-500 hover:text-slate-300"}`}
                                >
                                  page.tsx
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Folder: transactions */}
                          <div>
                            <button
                              onClick={() => toggleFolder("app/(dashboard)/transactions")}
                              className="w-full flex items-center gap-1.5 py-1 text-xs text-slate-400 hover:text-white text-left font-medium"
                            >
                              <Folder className="w-3.5 h-3.5 text-indigo-400" />
                              <span>transactions</span>
                            </button>
                            {expandedFolders["app/(dashboard)/transactions"] && (
                              <div className="pl-3 ml-2">
                                <button
                                  onClick={() => selectFile("app/(dashboard)/transactions/page.tsx")}
                                  className={`w-full text-left py-1 text-xs ${selectedFilePath === "app/(dashboard)/transactions/page.tsx" ? "text-[#22d3ee] font-bold" : "text-slate-500 hover:text-slate-300"}`}
                                >
                                  page.tsx
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => selectFile("app/layout.tsx")}
                      className={`w-full text-left py-1 text-xs pl-5 ${selectedFilePath === "app/layout.tsx" ? "text-[#22d3ee] font-bold" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      layout.tsx
                    </button>
                    <button
                      onClick={() => selectFile("app/page.tsx")}
                      className={`w-full text-left py-1 text-xs pl-5 ${selectedFilePath === "app/page.tsx" ? "text-[#22d3ee] font-bold" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      page.tsx
                    </button>
                  </div>
                )}
              </div>

              {/* Folder: components */}
              <div>
                <button
                  onClick={() => toggleFolder("components")}
                  className="w-full flex items-center gap-1.5 py-1 text-xs text-slate-400 hover:text-white text-left font-medium"
                >
                  <Folder className="w-3.5 h-3.5 text-indigo-400" />
                  <span>components</span>
                </button>
                {expandedFolders["components"] && (
                  <div className="pl-3 border-l border-white/5 ml-2 space-y-0.5">
                    <button
                      onClick={() => selectFile("components/DashboardLayout.tsx")}
                      className={`w-full text-left py-1 text-xs pl-5 ${selectedFilePath === "components/DashboardLayout.tsx" ? "text-[#22d3ee] font-bold" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      DashboardLayout.tsx
                    </button>
                  </div>
                )}
              </div>

              {/* Folder: lib */}
              <div>
                <button
                  onClick={() => toggleFolder("lib")}
                  className="w-full flex items-center gap-1.5 py-1 text-xs text-slate-400 hover:text-white text-left font-medium"
                >
                  <Folder className="w-3.5 h-3.5 text-indigo-400" />
                  <span>lib</span>
                </button>
                {expandedFolders["lib"] && (
                  <div className="pl-3 border-l border-white/5 ml-2 space-y-0.5">
                    <button
                      onClick={() => selectFile("lib/dashboard.ts")}
                      className={`w-full text-left py-1 text-xs pl-5 ${selectedFilePath === "lib/dashboard.ts" ? "text-[#22d3ee] font-bold" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      dashboard.ts
                    </button>
                    <button
                      onClick={() => selectFile("lib/utils.ts")}
                      className={`w-full text-left py-1 text-xs pl-5 ${selectedFilePath === "lib/utils.ts" ? "text-[#22d3ee] font-bold" : "text-slate-500 hover:text-slate-300"}`}
                    >
                      utils.ts
                    </button>
                  </div>
                )}
              </div>

              {/* Flat Files */}
              <button
                onClick={() => selectFile(".env.local")}
                className={`w-full text-left py-1 text-xs pl-5 ${selectedFilePath === ".env.local" ? "text-[#22d3ee] font-bold" : "text-slate-500 hover:text-slate-300"}`}
              >
                .env.local
              </button>
              <button
                onClick={() => selectFile(".gitignore")}
                className={`w-full text-left py-1 text-xs pl-5 ${selectedFilePath === ".gitignore" ? "text-[#22d3ee] font-bold" : "text-slate-500 hover:text-slate-300"}`}
              >
                .gitignore
              </button>
              <button
                onClick={() => selectFile("package.json")}
                className={`w-full text-left py-1 text-xs pl-5 ${selectedFilePath === "package.json" ? "text-[#22d3ee] font-bold" : "text-slate-500 hover:text-slate-300"}`}
              >
                package.json
              </button>
              <button
                onClick={() => selectFile("tsconfig.json")}
                className={`w-full text-left py-1 text-xs pl-5 ${selectedFilePath === "tsconfig.json" ? "text-[#22d3ee] font-bold" : "text-slate-500 hover:text-slate-300"}`}
              >
                tsconfig.json
              </button>
              <button
                onClick={() => selectFile("README.md")}
                className={`w-full text-left py-1 text-xs pl-5 ${selectedFilePath === "README.md" ? "text-[#22d3ee] font-bold" : "text-slate-500 hover:text-slate-300"}`}
              >
                README.md
              </button>
            </div>
          </div>
        </div>

        {/* Right Editor Area */}
        <div className="bg-[#0b0f19] flex flex-col min-w-0">
          {/* File Tabs Bar */}
          <div className="bg-[#0c1017] border-b border-white/5 flex items-center justify-between pl-2 pr-4 h-9">
            <div className="flex items-center gap-1 overflow-x-auto flex-1 h-full scrollbar-none select-none">
              {openFiles.map(filePath => {
                const isSelected = selectedFilePath === filePath;
                const fileName = filePath.split("/").pop();
                return (
                  <div
                    key={filePath}
                    onClick={() => setSelectedFilePath(filePath)}
                    className={`h-full px-3 flex items-center gap-2 text-[10px] border-r border-white/5 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#0b0f19] text-white border-t-2 border-[#22d3ee]"
                        : "text-slate-500 hover:text-slate-300 hover:bg-white/5"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>{fileName}</span>
                    <button
                      onClick={(e) => closeFileTab(filePath, e)}
                      className="w-3 h-3 rounded-full flex items-center justify-center hover:bg-white/10 text-slate-500 hover:text-white"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => logTerminal("AI Assistant chat helper mounting...")}
                className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white bg-[#131a26] border border-white/10 rounded px-2 py-1"
              >
                <Sparkles className="w-3 h-3 text-[#22d3ee]" />
                <span>AI Assistant</span>
              </button>
              
              <button
                onClick={() => setShowTerminal(!showTerminal)}
                className={`text-slate-500 hover:text-white p-1 rounded ${showTerminal ? "text-[#22d3ee] bg-[#22d3ee]/5" : ""}`}
                title="Toggle integrated console"
              >
                <Terminal className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`text-slate-500 hover:text-white p-1 rounded ${isFullscreen ? "text-[#22d3ee] bg-[#22d3ee]/5" : ""}`}
                title="Toggle fullscreen focus mode"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Editor Sub-Header Details */}
          <div className="flex items-center justify-between border-b border-white/5 px-4 py-2 bg-[#0c1017]/40 text-xs select-none">
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-slate-400 truncate block">
                Workspace Path: <span className="text-slate-200">{selectedFilePath || "No Active File"}</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isDirty ? (
                <>
                  <span className="px-2 py-0.5 text-[9px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    Modified
                  </span>
                  <button
                    onClick={handleDiscardChanges}
                    className="text-[10px] text-slate-400 hover:text-white border border-white/10 px-2 py-0.5 rounded transition-colors"
                  >
                    Discard Edits
                  </button>
                </>
              ) : (
                <span className="px-2 py-0.5 text-[9px] font-bold text-slate-500 bg-white/5 border border-white/10 rounded-full flex items-center gap-1">
                  Synced
                </span>
              )}
            </div>
          </div>

          {/* Code canvas viewport with Line numbers and MiniMap */}
          <div className="flex-1 flex items-stretch font-mono text-xs bg-[#0b0f19] overflow-hidden min-h-[400px]">
            {/* Line numbers column */}
            <div className="select-none text-right pr-3 pl-2 py-3 text-slate-600 bg-[#0c1017] border-r border-white/5 w-11 flex flex-col font-mono text-xs leading-5">
              {lines.map((_, i) => (
                <span key={i} className="block">{i + 1}</span>
              ))}
            </div>

            {/* Input canvas */}
            <div className="flex-1 relative">
              <textarea
                className="w-full h-full bg-[#0b0f19] text-[#e2e8f0] py-3 px-4 focus:outline-none resize-none font-mono text-xs leading-5 focus:text-white caret-cyan-400 font-medium overflow-auto"
                value={activeCode}
                onChange={(e) => handleCodeChange(e.target.value)}
                placeholder="// Select a workspace file to write or review code..."
                disabled={!selectedFilePath}
                spellCheck={false}
              />
            </div>

            {/* Minimap column */}
            <div className="hidden lg:block w-16 bg-[#0c1017]/80 border-l border-white/5 select-none p-1.5 overflow-hidden opacity-30 hover:opacity-60 transition-opacity">
              <div className="text-[3px] font-mono leading-[4px] text-slate-500 scale-95 origin-top-left break-all whitespace-pre">
                {activeCode.slice(0, 1200)}
              </div>
            </div>
          </div>

          {/* Collapsible terminal console */}
          {showTerminal && (
            <div className="h-36 bg-[#070a13] border-t border-white/5 flex flex-col min-w-0">
              <div className="bg-[#0c1017] px-3 py-1 flex items-center justify-between text-[9px] text-slate-400 border-b border-white/5">
                <span className="font-semibold uppercase tracking-wider font-mono">Terminal Console Output</span>
                <button onClick={() => setShowTerminal(false)} className="hover:text-white">×</button>
              </div>
              <div className="flex-1 p-3 overflow-y-auto font-mono text-[10px] text-slate-300 space-y-1">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className={log.includes("Remote") ? "text-cyan-400" : log.includes("Successfully") ? "text-emerald-400" : ""}>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* IDE Bottom Status Bar */}
          <div className="bg-[#0c1017] border-t border-white/5 px-4 py-1.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 hover:text-white cursor-pointer">
                <GitBranch className="w-3.5 h-3.5 text-slate-400" />
                <span>{branch}</span>
              </span>
              <span className="text-slate-700">|</span>
              <span className="hover:text-white cursor-pointer">TypeScript: Ready</span>
            </div>

            <div className="flex items-center gap-3">
              <span>Ln {lines.length}, Col 1</span>
              <span>Spaces: 2</span>
              <span>UTF-8</span>
              <span>LF</span>
              <span className="text-[#22d3ee]">TypeScript JSX</span>
            </div>
          </div>
        </div>
      </div>

      {/* COMMIT MODAL DRAWER */}
      {isCommitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0c1017] border border-white/15 p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-sm font-bold text-white font-['Space_Grotesk']">Git Commit & Push Changes</span>
              <button onClick={() => setIsCommitModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleCommitAndPush} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Files to Stage</label>
                <div className="max-h-24 overflow-y-auto bg-slate-950/50 rounded-lg p-2.5 border border-white/5 space-y-1 font-mono text-[10px] text-slate-300">
                  {modifiedFiles.map(path => (
                    <div key={path} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span className="truncate">{path}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Commit Message</label>
                <input
                  type="text"
                  required
                  value={commitMessage}
                  onChange={e => setCommitMessage(e.target.value)}
                  placeholder="e.g., feat: resolve analytics responsive grids"
                  className="w-full bg-[#131a26] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]/50"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCommitModalOpen(false)}
                  className="flex-1 border-white/10 text-slate-300 hover:bg-white/5 text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-grow bg-[#22d3ee] text-[#030712] hover:bg-[#22d3ee]/90 text-xs font-semibold h-9"
                >
                  Commit & Push
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE FILE MODAL */}
      {isNewFileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0c1017] border border-white/15 p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <span className="text-sm font-bold text-white font-['Space_Grotesk']">Create New Workspace File</span>
              <button onClick={() => setIsNewFileModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleCreateFileSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">File Path Name</label>
                <input
                  type="text"
                  required
                  value={newFileName}
                  onChange={e => setNewFileName(e.target.value)}
                  placeholder="e.g. app/components/AnalyticsCard.tsx"
                  className="w-full bg-[#131a26] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]/50 font-mono"
                />
                <span className="block text-[9px] text-slate-500 mt-1">Specify absolute folder path starting from repository root.</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsNewFileModalOpen(false)}
                  className="flex-1 border-white/10 text-slate-300 hover:bg-white/5 text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-grow bg-[#22d3ee] text-[#030712] hover:bg-[#22d3ee]/90 text-xs font-semibold h-9"
                >
                  Create File
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
