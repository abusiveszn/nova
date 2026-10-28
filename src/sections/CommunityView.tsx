import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/state/AppContext";
import type { CommunityPost } from "@/types";
import { CommunityGateway, AVAILABLE_COMMUNITIES } from "./CommunityGateway";
import {
  Users,
  Search,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Calendar,
  Image as ImageIcon,
  Link as LinkIcon,
  BarChart2,
  Send,
  Shield,
  Check,
  MoreHorizontal,
  X,
  Copy,
  ExternalLink,
  Code,
  Smartphone,
  Cpu,
  ShoppingBag,
  Plus,
  Trash2,
  Upload,
  Lock,
  LogOut,
  RefreshCw,
  Sparkles,
  ChevronDown,
  Compass,
  Activity,
  Layers,
  Terminal,
  Briefcase,
  FolderGit2,
  PlaySquare,
  Flame,
  UserCheck,
} from "lucide-react";
import { CommunitiesDirectoryView } from "./community/CommunitiesDirectoryView";
import { CommunityHubPageView } from "./community/CommunityHubPageView";
import { CommunityMediaView } from "./community/CommunityMediaView";
import { CommunityMissionsView } from "./community/CommunityMissionsView";
import { CommunityEventsView } from "./community/CommunityEventsView";
import { CommunityOpportunitiesView } from "./community/CommunityOpportunitiesView";
import { CommunityProjectsMarketplaceView } from "./community/CommunityProjectsMarketplaceView";
import { CreateCommunityModal } from "./community/CreateCommunityModal";
import { CommunityStudioView } from "./community/CommunityStudioView";
import { CommunityHealthView } from "./community/CommunityHealthView";
import { MemberProfileView } from "./community/MemberProfileView";
import { MyNetworkOrbitView } from "./community/MyNetworkOrbitView";
import { MobileCreateSheet } from "./community/MobileCreateSheet";

// Default seed community posts matching the sample screenshot with interactive components
const INITIAL_POSTS: CommunityPost[] = [
  // -------------------------------------------------------------
  // 1. FINTECH & WEB3 PIONEERS (fintech)
  // -------------------------------------------------------------
  {
    id: "post_01",
    authorId: "user_david",
    authorName: "David Okafor",
    authorRole: "Builder",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    location: "Lagos, Nigeria",
    timeAgo: "2h ago",
    title: "Looking for a UI/UX designer for a fintech app",
    content:
      "We're building a fintech mobile app and need a skilled UI/UX designer to work with our development team. Must have experience with modern design tools (Figma, etc).",
    tags: ["Design", "UI/UX", "Fintech", "Remote"],
    category: "projects",
    communityHub: "fintech",
    previewType: "fintech",
    previewTitle: "Fintech App Design",
    previewSubtitle: "Mobile Experience & Design System",
    likes: 24,
    commentsCount: 18,
    isLiked: false,
    isBookmarked: false,
    createdAt: Date.now() - 7200000,
    comments: [
      {
        id: "c1",
        authorId: "user_aisha",
        authorName: "Aisha Bello",
        authorRole: "Designer",
        authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        content: "Hi David! I have extensive experience designing fintech dashboards and mobile flows in Figma. Sent you a DM with my portfolio!",
        createdAt: "1h ago",
      },
      {
        id: "c2",
        authorId: "user_emmanuel",
        authorName: "Emmanuel Chinedu",
        authorRole: "Full Stack Developer",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        content: "Great initiative! What's the stack for the mobile app? React Native or Flutter?",
        createdAt: "45m ago",
      },
    ],
  },
  {
    id: "post_poll_01",
    authorId: "user_emmanuel",
    authorName: "Emmanuel Chinedu",
    authorRole: "Full Stack Developer",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    location: "Enugu, Nigeria",
    timeAgo: "5h ago",
    title: "Community Poll: Which mobile stack are you choosing in 2026?",
    content:
      "We're benchmarking mobile frameworks for our next cross-border payments product. What has given your team the best performance and developer velocity?",
    tags: ["Poll", "MobileDev", "Flutter", "ReactNative"],
    category: "discussions",
    communityHub: "fintech",
    likes: 41,
    commentsCount: 15,
    isLiked: false,
    isBookmarked: false,
    createdAt: Date.now() - 18000000,
    attachedPoll: {
      question: "Which mobile tech stack do you recommend for high-performance fintech apps?",
      options: [
        { id: "opt_1", text: "React Native + Expo SDK", votes: 56 },
        { id: "opt_2", text: "Flutter + Dart", votes: 38 },
        { id: "opt_3", text: "Native (Swift / Kotlin)", votes: 16 },
      ],
      totalVotes: 110,
    },
    comments: [],
  },
  {
    id: "post_fintech_02",
    authorId: "user_yunusa",
    authorName: "Yunusa Lukman",
    authorRole: "Backend Developer",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    location: "Kano, Nigeria",
    timeAgo: "1h ago",
    title: "Paystack Virtual Dedicated Account integration with Webhook signatures",
    content:
      "Just open-sourced a TypeScript microservice for verifying Paystack charge.success webhook events with HMAC SHA512 signatures and idempotent database writes. Check the link!",
    tags: ["Paystack", "Backend", "TypeScript", "Security"],
    category: "discussions",
    communityHub: "fintech",
    likes: 38,
    commentsCount: 12,
    isLiked: true,
    isBookmarked: false,
    createdAt: Date.now() - 3600000,
    comments: [],
  },

  // -------------------------------------------------------------
  // 2. AI & MACHINE LEARNING BUILDERS (ai)
  // -------------------------------------------------------------
  {
    id: "post_03",
    authorId: "user_michael",
    authorName: "Michael James",
    authorRole: "Founder",
    authorAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    location: "Remote",
    timeAgo: "6h ago",
    title: "Any developers interested in working on an AI project?",
    content:
      "I'm building an AI tool and looking for interested developers to join the team. This is a long-term project with potential funding.",
    tags: ["AI/ML", "Development", "Remote", "Team Formation"],
    category: "discussions",
    communityHub: "ai",
    previewType: "ai",
    previewTitle: "Autonomous AI Agent Core",
    previewSubtitle: "Next-gen LLM orchestration platform",
    likes: 15,
    commentsCount: 9,
    isLiked: false,
    isBookmarked: false,
    createdAt: Date.now() - 21600000,
    comments: [],
  },
  {
    id: "post_ai_02",
    authorId: "user_david",
    authorName: "David Okafor",
    authorRole: "Builder",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    location: "Lagos, Nigeria",
    timeAgo: "3h ago",
    title: "Deploying quantized 3B LLMs offline on low-end Android phones in Africa",
    content:
      "Tested llama.cpp compilation for mobile CPUs across devices in Lagos. Getting 14 tokens/sec on mid-tier hardware with 4-bit quantization without cellular connectivity!",
    tags: ["LocalLLM", "OnDeviceAI", "EdgeComputing", "Performance"],
    category: "discussions",
    communityHub: "ai",
    likes: 52,
    commentsCount: 22,
    isLiked: false,
    isBookmarked: true,
    createdAt: Date.now() - 10800000,
    comments: [],
  },

  // -------------------------------------------------------------
  // 3. STARTUP FOUNDERS & VCS (founders)
  // -------------------------------------------------------------
  {
    id: "post_event_01",
    authorId: "user_fatima",
    authorName: "Fatima Yusuf",
    authorRole: "Product Manager",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    location: "Lagos, Nigeria",
    timeAgo: "8h ago",
    title: "Official Invitation: NOVA Demo Day & Venture Showcase",
    content:
      "Showcase your finished projects to top founders and global angel investors. RSVP to secure your builder pitch slot or observer seat!",
    tags: ["Events", "DemoDay", "Showcase", "Funding"],
    category: "announcements",
    communityHub: "founders",
    likes: 58,
    commentsCount: 31,
    isLiked: false,
    isBookmarked: true,
    createdAt: Date.now() - 28800000,
    attachedEvent: {
      title: "NOVA Demo Day & Venture Showcase 2026",
      dateStr: "Fri, Oct 02 • 6:00 PM WAT",
      location: "Nova Virtual Arena & Live Stream",
      type: "code",
      joined: false,
    },
    comments: [],
  },
  {
    id: "post_founder_02",
    authorId: "user_michael",
    authorName: "Michael James",
    authorRole: "Founder",
    authorAvatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    location: "Nairobi, Kenya",
    timeAgo: "4h ago",
    title: "Seeking Technical Co-Founder (CTO) for B2B Supply Chain SaaS",
    content:
      "We have closed $150k angel funding with 4 signed LOIs from distributors across Kenya & Uganda. Looking for a senior full-stack/backend lead with 10-15% equity allocation.",
    tags: ["CoFounder", "Equity", "Hiring", "B2B"],
    category: "projects",
    communityHub: "founders",
    likes: 47,
    commentsCount: 19,
    isLiked: false,
    isBookmarked: false,
    createdAt: Date.now() - 14400000,
    comments: [],
  },

  // -------------------------------------------------------------
  // 4. FULL-STACK & MOBILE ENGINEERS (engineers)
  // -------------------------------------------------------------
  {
    id: "post_02",
    authorId: "user_aisha",
    authorName: "Aisha Bello",
    authorRole: "Designer",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    location: "Abuja, Nigeria",
    timeAgo: "4h ago",
    title: "New opportunity: E-commerce website project",
    content:
      "We're a growing fashion brand looking for a team to build our e-commerce website. Looking for a developer, designer and project manager. Budget is negotiable.",
    tags: ["Web Development", "E-commerce", "Team Needed", "Paid"],
    category: "projects",
    communityHub: "engineers",
    previewType: "fashion",
    previewTitle: "Modern Fashion For Everyone",
    previewSubtitle: "High-conversion E-commerce Platform",
    likes: 32,
    commentsCount: 27,
    isLiked: false,
    isBookmarked: false,
    createdAt: Date.now() - 14400000,
    comments: [],
  },
  {
    id: "post_eng_02",
    authorId: "user_yunusa",
    authorName: "Yunusa Lukman",
    authorRole: "Backend Developer",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    location: "Lagos, Nigeria",
    timeAgo: "2h ago",
    title: "Benchmarking Rust vs Go for high-throughput WebSocket backends",
    content:
      "We ran stress tests simulating 150,000 concurrent WebSocket connections. Memory consumption: Go (~2.4GB) vs Rust Axum (~480MB). CPU latency was also 3.5x lower under spike loads.",
    tags: ["Rust", "Golang", "WebSockets", "Performance"],
    category: "discussions",
    communityHub: "engineers",
    likes: 64,
    commentsCount: 29,
    isLiked: true,
    isBookmarked: true,
    createdAt: Date.now() - 7200000,
    comments: [],
  },

  // -------------------------------------------------------------
  // 5. UI/UX & PRODUCT DESIGNERS (designers)
  // -------------------------------------------------------------
  {
    id: "post_des_01",
    authorId: "user_aisha",
    authorName: "Aisha Bello",
    authorRole: "Designer",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    location: "Abuja, Nigeria",
    timeAgo: "3h ago",
    title: "Design System Architecture in Figma 2026: Design Tokens & Variables",
    content:
      "Sharing our open UI token system used for high-contrast mobile applications. Includes typography scales, dark mode variables, and accessible touch target grids.",
    tags: ["Figma", "DesignSystem", "Tokens", "UI"],
    category: "discussions",
    communityHub: "designers",
    likes: 49,
    commentsCount: 16,
    isLiked: false,
    isBookmarked: true,
    createdAt: Date.now() - 10800000,
    comments: [],
  },

  // -------------------------------------------------------------
  // 6. NOVA ACADEMY LEARNERS (learners)
  // -------------------------------------------------------------
  {
    id: "post_lrn_01",
    authorId: "user_emmanuel",
    authorName: "Emmanuel Chinedu",
    authorRole: "Full Stack Developer",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    location: "Enugu, Nigeria",
    timeAgo: "5h ago",
    title: "From Junior Dev to Paid Builder: 5 tips from my Nova Academy journey",
    content:
      "1. Ship small projects daily. 2. Understand state management before adding complex libraries. 3. Read documentation directly. 4. Contribute to open PRs. 5. Connect with mentors!",
    tags: ["Academy", "Career", "Learning", "JuniorDev"],
    category: "mentorship",
    communityHub: "learners",
    likes: 71,
    commentsCount: 34,
    isLiked: true,
    isBookmarked: true,
    createdAt: Date.now() - 18000000,
    comments: [],
  },
];

const TOP_MEMBERS = [
  {
    id: "m1",
    name: "Yunusa Lukman",
    role: "Backend Developer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    isOnline: true,
  },
  {
    id: "m2",
    name: "Aisha Bello",
    role: "UI/UX Designer",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    isOnline: true,
  },
  {
    id: "m3",
    name: "David Okafor",
    role: "Frontend Developer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    isOnline: true,
  },
  {
    id: "m4",
    name: "Fatima Yusuf",
    role: "Product Manager",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    isOnline: true,
  },
  {
    id: "m5",
    name: "Emmanuel Chinedu",
    role: "Full Stack Developer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    isOnline: true,
  },
];

const INITIAL_EVENTS = [
  {
    id: "e1",
    title: "Community Hangout",
    dateStr: "Sat, Sep 20 • 7:00 PM",
    type: "calendar" as const,
    joined: false,
    attendeesCount: 84,
  },
  {
    id: "e2",
    title: "Build & Share Session",
    dateStr: "Wed, Sep 24 • 6:00 PM",
    type: "code" as const,
    joined: false,
    attendeesCount: 62,
  },
  {
    id: "e3",
    title: "NOVA Demo Day & Venture Showcase 2026",
    dateStr: "Fri, Oct 02 • 6:00 PM WAT",
    type: "code" as const,
    joined: false,
    attendeesCount: 142,
  },
];

export function CommunityView() {
  const { state } = useApp();
  const [hasCommunityAccess, setHasCommunityAccess] = useState<boolean>(() => {
    return (
      localStorage.getItem("nova_community_access") === "true" &&
      localStorage.getItem("nova_community_logged_in") !== "false" &&
      localStorage.getItem("nova_community_paid") === "true"
    );
  });
  const [activeCommunityHub, setActiveCommunityHub] = useState<string>(() => {
    return localStorage.getItem("nova_selected_community") || "engineers";
  });
  const [showSwitchCommunityModal, setShowSwitchCommunityModal] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [showCommunityDropdown, setShowCommunityDropdown] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    | "feed"
    | "media"
    | "communities"
    | "hub"
    | "health"
    | "studio"
    | "missions"
    | "events"
    | "opportunities"
    | "projects"
    | "network"
    | "profile"
  >("feed");
  const [showCreateCommunityModal, setShowCreateCommunityModal] = useState<boolean>(false);

  const currentCommunity =
    AVAILABLE_COMMUNITIES.find((c) => c.id === activeCommunityHub) || AVAILABLE_COMMUNITIES[0];
  const CurrentCommunityIcon = currentCommunity.icon;

  const handleSelectCommunityHub = (hubId: string) => {
    setActiveCommunityHub(hubId);
    localStorage.setItem("nova_selected_community", hubId);
    setShowSwitchCommunityModal(false);
  };

  // Community-specific logout (Leaves dashboard session active!)
  const handleLogoutCommunity = () => {
    localStorage.setItem("nova_community_logged_in", "false");
    setHasCommunityAccess(false);
  };

  const [posts, setPosts] = useState<CommunityPost[]>(INITIAL_POSTS);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [activeSort, setActiveSort] = useState<string>("latest");
  const [composerText, setComposerText] = useState("");
  const [composerTitle, setComposerTitle] = useState("");
  const [composerCategory, setComposerCategory] = useState<"projects" | "discussions" | "announcements" | "mentorship">("discussions");
  const [isExpandedComposer, setIsExpandedComposer] = useState(false);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Attachment state for composer
  const [activeAttachment, setActiveAttachment] = useState<"none" | "image" | "link" | "poll" | "event">("none");
  const [attachedImage, setAttachedImage] = useState<string>("");
  const [attachedImageUrl, setAttachedImageUrl] = useState<string>("");
  const [attachedLinkUrl, setAttachedLinkUrl] = useState<string>("");
  const [attachedLinkTitle, setAttachedLinkTitle] = useState<string>("");
  const [pollQuestion, setPollQuestion] = useState<string>("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [eventTitle, setEventTitle] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [eventType, setEventType] = useState<"calendar" | "code">("calendar");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUserName = state.currentUser?.fullName || "Yunusa Lukman";
  const currentUserRole = state.currentUser?.registeredRole || state.userRole || "Builder";
  const currentUserAvatar =
    state.currentUser?.avatarUrl ||
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80";

  // Toggle Like
  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.isLiked;
          return {
            ...post,
            isLiked,
            likes: isLiked ? post.likes + 1 : post.likes - 1,
          };
        }
        return post;
      })
    );
  };

  // Toggle Bookmark
  const handleToggleBookmark = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return { ...post, isBookmarked: !post.isBookmarked };
        }
        return post;
      })
    );
  };

  // Vote on Poll
  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId && post.attachedPoll) {
          const poll = post.attachedPoll;
          if (poll.userVotedId === optionId) return post; // already voted for this option

          const previousVoted = poll.userVotedId;
          const newOptions = poll.options.map((opt) => {
            if (opt.id === optionId) {
              return { ...opt, votes: opt.votes + 1 };
            }
            if (previousVoted && opt.id === previousVoted) {
              return { ...opt, votes: Math.max(0, opt.votes - 1) };
            }
            return opt;
          });

          const newTotalVotes = previousVoted ? poll.totalVotes : poll.totalVotes + 1;

          return {
            ...post,
            attachedPoll: {
              ...poll,
              options: newOptions,
              totalVotes: newTotalVotes,
              userVotedId: optionId,
            },
          };
        }
        return post;
      })
    );
  };

  // Toggle Join Post Event
  const handleToggleJoinPostEvent = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId && post.attachedEvent) {
          const joined = !post.attachedEvent.joined;
          return {
            ...post,
            attachedEvent: { ...post.attachedEvent, joined },
          };
        }
        return post;
      })
    );
  };

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAttachedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Post
  const handleCreatePost = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!composerText.trim() && !attachedImage && !attachedLinkUrl && !pollQuestion && !eventTitle) {
      return;
    }

    const validPollOptions = pollOptions.filter((o) => o.trim().length > 0);

    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      authorId: state.currentUser?.userId || "current_user",
      authorName: currentUserName,
      authorRole: currentUserRole,
      authorAvatar: currentUserAvatar,
      location: "Lagos, Nigeria",
      timeAgo: "Just now",
      title:
        composerTitle.trim() ||
        (eventTitle ? `Event: ${eventTitle}` : "") ||
        (pollQuestion ? `Poll: ${pollQuestion}` : "") ||
        composerText.slice(0, 50) + (composerText.length > 50 ? "..." : ""),
      content: composerText.trim() || (pollQuestion ? pollQuestion : "Check out this community update!"),
      tags: ["Community", "Nova", currentCommunity.name.split(" ")[0]],
      category: composerCategory,
      communityHub: activeCommunityHub,
      likes: 1,
      commentsCount: 0,
      isLiked: true,
      createdAt: Date.now(),
      comments: [],
    };

    // Attach Image
    if (attachedImage) {
      newPost.attachedImage = attachedImage;
    } else if (attachedImageUrl.trim()) {
      newPost.attachedImage = attachedImageUrl.trim();
    }

    // Attach Link
    if (attachedLinkUrl.trim()) {
      newPost.attachedLink = {
        url: attachedLinkUrl.trim().startsWith("http") ? attachedLinkUrl.trim() : `https://${attachedLinkUrl.trim()}`,
        title: attachedLinkTitle.trim() || attachedLinkUrl.trim(),
      };
    }

    // Attach Poll
    if (validPollOptions.length >= 2) {
      newPost.attachedPoll = {
        question: pollQuestion.trim() || composerTitle.trim() || "Community Poll",
        options: validPollOptions.map((text, idx) => ({
          id: `opt_${Date.now()}_${idx}`,
          text: text.trim(),
          votes: 0,
        })),
        totalVotes: 0,
      };
    }

    // Attach Event
    if (eventTitle.trim()) {
      const newEventData = {
        title: eventTitle.trim(),
        dateStr: eventDate.trim() || "Upcoming Date",
        type: eventType,
        joined: true,
      };
      newPost.attachedEvent = newEventData;

      // Also add to Upcoming Events widget
      setEvents((prev) => [
        {
          id: `e_${Date.now()}`,
          title: eventTitle.trim(),
          dateStr: eventDate.trim() || "Upcoming",
          type: eventType,
          joined: true,
          attendeesCount: 1,
        },
        ...prev,
      ]);
    }

    setPosts([newPost, ...posts]);

    // Reset composer state
    setComposerText("");
    setComposerTitle("");
    setActiveAttachment("none");
    setAttachedImage("");
    setAttachedImageUrl("");
    setAttachedLinkUrl("");
    setAttachedLinkTitle("");
    setPollQuestion("");
    setPollOptions(["", ""]);
    setEventTitle("");
    setEventDate("");
    setIsExpandedComposer(false);
  };

  // Submit Comment
  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: `c_${Date.now()}`,
            authorId: state.currentUser?.userId || "current_user",
            authorName: currentUserName,
            authorRole: currentUserRole,
            authorAvatar: currentUserAvatar,
            content: text,
            createdAt: "Just now",
          };
          const existingComments = post.comments || [];
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...existingComments, newComment],
          };
        }
        return post;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  // Toggle Join Event in Right Sidebar
  const handleToggleJoinEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const joined = !ev.joined;
          return {
            ...ev,
            joined,
            attendeesCount: joined ? ev.attendeesCount + 1 : ev.attendeesCount - 1,
          };
        }
        return ev;
      })
    );
  };

  // Copy invite link
  const handleCopyInvite = () => {
    navigator.clipboard.writeText("https://nova.ai/join/community");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Filter and sort logic - isolated to active community hub
  const filteredPosts = posts
    .filter((post) => {
      // Crowd isolation: only show posts belonging to the user's selected community hub
      if (post.communityHub) {
        const isMatch =
          post.communityHub === activeCommunityHub ||
          (activeCommunityHub === "engineers" && post.communityHub === "ai") ||
          (activeCommunityHub === "creatives" && post.communityHub === "designers");
        if (!isMatch) return false;
      }
      if (activeFilter !== "all" && post.category !== activeFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          post.title.toLowerCase().includes(q) ||
          post.content.toLowerCase().includes(q) ||
          post.tags.some((t) => t.toLowerCase().includes(q)) ||
          post.authorName.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (activeSort === "top") return b.likes - a.likes;
      return b.createdAt - a.createdAt;
    });

  if (!hasCommunityAccess) {
    return (
      <CommunityGateway
        onAccessGranted={() => {
          setHasCommunityAccess(true);
          setActiveCommunityHub(localStorage.getItem("nova_selected_community") || "engineers");
        }}
      />
    );
  }

  return (
    <div className="w-full min-h-full bg-[#07090e] text-[#f9fafb] px-4 sm:px-6 lg:px-8 py-6">
      {/* Hidden file input for native image upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Search and Top Bar (Mobile / Responsive) */}
      <div className="md:hidden flex items-center gap-2 mb-5">
        <div className="flex-1 flex items-center gap-2.5 bg-[#131a26] border border-white/10 rounded-xl px-3.5 py-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search the community..."
            className="bg-transparent text-xs text-white placeholder-slate-400 focus:outline-none w-full"
          />
        </div>
      </div>

      {/* SCREEN 7 & 10: COMMUNITY SWITCHER HEADER DROPDOWN BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4 rounded-2xl bg-[#0b101b] border border-white/10 mb-6 shadow-xl backdrop-blur-xl">
        <div className="relative">
          <button
            type="button"
            id="community-switcher-dropdown-trigger"
            onClick={() => setShowCommunityDropdown(!showCommunityDropdown)}
            className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#22d3ee]/40 text-left transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#22d3ee]/15 text-[#22d3ee] flex items-center justify-center font-bold shrink-0 border border-[#22d3ee]/30 group-hover:scale-105 transition-transform">
              <CurrentCommunityIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white">
                <span>{currentCommunity.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              </div>
              <span className="text-[11px] text-[#22d3ee] font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {currentCommunity.members} • {currentCommunity.online}
              </span>
            </div>
          </button>

          {/* SCREEN 10: SWITCH COMMUNITY DROPDOWN MENU */}
          {showCommunityDropdown && (
            <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#0b101b] border border-white/15 p-2 shadow-2xl z-50 backdrop-blur-xl">
              <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-white/5 mb-1">
                Your Communities
              </div>
              <div className="space-y-1 max-h-64 overflow-y-auto">
                {AVAILABLE_COMMUNITIES.map((hub) => {
                  const Icon = hub.icon;
                  const isCurrent = activeCommunityHub === hub.id;
                  return (
                    <button
                      key={hub.id}
                      type="button"
                      onClick={() => {
                        handleSelectCommunityHub(hub.id);
                        setShowCommunityDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                        isCurrent
                          ? "bg-[#22d3ee]/15 text-[#22d3ee] font-bold border border-[#22d3ee]/30"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-[#22d3ee]" />
                        <div>
                          <p className="text-xs font-semibold">{hub.name}</p>
                          <p className="text-[10px] text-slate-400 font-normal">{hub.desc}</p>
                        </div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-[#22d3ee] shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <div className="pt-2 mt-2 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setShowCommunityDropdown(false);
                    setShowSwitchCommunityModal(true);
                  }}
                  className="w-full text-center py-1.5 text-xs text-[#22d3ee] hover:underline cursor-pointer font-semibold"
                >
                  Manage Communities
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Action Buttons: Switch Hub & Log Out */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            id="switch-community-header-btn"
            onClick={() => setShowSwitchCommunityModal(true)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#22d3ee]/40 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#22d3ee]" />
            <span className="hidden sm:inline">Switch Hub</span>
          </button>

          <button
            type="button"
            id="logout-community-header-btn"
            onClick={() => setShowLogoutModal(true)}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
            title="Log out of the Community without logging out of the dashboard"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>

          <button
            type="button"
            id="reset-community-access-btn"
            onClick={() => {
              localStorage.removeItem("nova_community_access");
              localStorage.removeItem("nova_community_paid");
              setHasCommunityAccess(false);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white text-xs flex items-center gap-1 transition-all cursor-pointer"
            title="Reset community access to test gateway & Paystack checkout flow"
          >
            <Lock className="w-3 h-3 text-[#10b981]" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 5-LAYER NOVA COMMUNITY OPERATING SYSTEM NAVIGATION BAR */}
      <div className="w-full mb-6 bg-[#0b101b] border border-white/10 rounded-2xl p-2.5 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* 1. MEDIA LAYER */}
            <div className="flex items-center bg-white/[0.03] p-1 rounded-xl border border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 px-2 hidden lg:inline">Media:</span>
              <button
                type="button"
                id="tab-feed-btn"
                onClick={() => setActiveTab("feed")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "feed"
                    ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Feed</span>
              </button>
              <button
                type="button"
                id="tab-media-btn"
                onClick={() => setActiveTab("media")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "media"
                    ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <PlaySquare className="w-3.5 h-3.5" />
                <span>Media</span>
              </button>
            </div>

            {/* 2. COMMUNITY LAYER */}
            <div className="flex items-center bg-white/[0.03] p-1 rounded-xl border border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 px-2 hidden lg:inline">Community:</span>
              <button
                type="button"
                id="tab-directory-btn"
                onClick={() => setActiveTab("communities")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "communities"
                    ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Directory</span>
              </button>
              <button
                type="button"
                id="tab-hub-btn"
                onClick={() => setActiveTab("hub")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "hub"
                    ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Hub</span>
              </button>
              <button
                type="button"
                id="tab-health-btn"
                onClick={() => setActiveTab("health")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "health"
                    ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Health</span>
              </button>
              <button
                type="button"
                id="tab-studio-btn"
                onClick={() => setActiveTab("studio")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "studio"
                    ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Studio</span>
              </button>
            </div>

            {/* 3. COORDINATION LAYER */}
            <div className="flex items-center bg-white/[0.03] p-1 rounded-xl border border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 px-2 hidden lg:inline">Coordination:</span>
              <button
                type="button"
                id="tab-missions-btn"
                onClick={() => setActiveTab("missions")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "missions"
                    ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Missions</span>
              </button>
              <button
                type="button"
                id="tab-events-btn"
                onClick={() => setActiveTab("events")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "events"
                    ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Events</span>
              </button>
              <button
                type="button"
                id="tab-opportunities-btn"
                onClick={() => setActiveTab("opportunities")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "opportunities"
                    ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                <span>Opportunities</span>
              </button>
              <button
                type="button"
                id="tab-projects-btn"
                onClick={() => setActiveTab("projects")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "projects"
                    ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Projects</span>
              </button>
            </div>

            {/* 4. IDENTITY LAYER */}
            <div className="flex items-center bg-white/[0.03] p-1 rounded-xl border border-white/5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 px-2 hidden lg:inline">Identity:</span>
              <button
                type="button"
                id="tab-network-btn"
                onClick={() => setActiveTab("network")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "network"
                    ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Share2 className="w-3.5 h-3.5 text-[#a78bfa]" />
                <span>Orbit</span>
              </button>
              <button
                type="button"
                id="tab-profile-btn"
                onClick={() => setActiveTab("profile")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "profile"
                    ? "bg-[#22d3ee] text-[#07090e] shadow-md shadow-[#22d3ee]/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Profile</span>
              </button>
            </div>
          </div>

          {/* Quick Action: + Create Community (Screen 13) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="create-community-header-btn"
              onClick={() => setShowCreateCommunityModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#22d3ee]/20 to-[#38bdf8]/20 hover:from-[#22d3ee]/30 hover:to-[#38bdf8]/30 border border-[#22d3ee]/40 text-[#22d3ee] text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Create Community</span>
            </button>
          </div>
        </div>
      </div>

      {activeTab === "feed" && (
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Feed Column (Left / Center) */}
        <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 space-y-6">
          {/* Hero Banner (Faithful to sample design with system colors) */}
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-[#0d1624] via-[#111c2e] to-[#0c1420] p-6 sm:p-8 shadow-2xl">
            {/* Ambient Lighting with system cyan */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#22d3ee]/15 via-[#38bdf8]/10 to-transparent rounded-full blur-3xl pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22d3ee]/10 border border-[#22d3ee]/30 text-[#22d3ee] text-[11px] font-bold tracking-widest uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {currentCommunity.name.toUpperCase()}
                    {localStorage.getItem("nova_community_role") && (
                      <span className="ml-1 text-white bg-white/10 px-2 py-0.5 rounded-md font-mono text-[10px] lowercase">
                        • {localStorage.getItem("nova_community_role")}
                      </span>
                    )}
                    {localStorage.getItem("nova_community_plan_name") && (
                      <span className="ml-1 text-[#22d3ee] bg-[#22d3ee]/15 border border-[#22d3ee]/30 px-2 py-0.5 rounded-md font-mono text-[10px] normal-case">
                        • {localStorage.getItem("nova_community_plan_name")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-['Space_Grotesk'] text-white tracking-tight leading-tight">
                Real People. Real Skills.
                <br />
                <span className="text-[#22d3ee] bg-gradient-to-r from-[#22d3ee] to-[#60a5fa] bg-clip-text text-transparent">
                  Real Opportunities.
                </span>
              </h1>

              <p className="text-slate-300 text-xs sm:text-sm mt-3 max-w-xl leading-relaxed">
                Connect, collaborate and build with a global network of builders, founders, and innovators.
              </p>

              {/* Members Social Stack & CTA */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5 overflow-hidden">
                    {TOP_MEMBERS.slice(0, 4).map((member, i) => (
                      <img
                        key={i}
                        className="inline-block h-8 w-8 rounded-full ring-2 ring-[#111c2e] object-cover"
                        src={member.avatar}
                        alt={member.name}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-slate-300">
                    Join <strong className="text-white font-bold">12,480+</strong> active members
                  </span>
                </div>

                <button
                  onClick={() => {
                    const postBox = document.getElementById("community-composer");
                    postBox?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#22d3ee]/40 bg-[#22d3ee]/10 text-[#22d3ee] text-xs font-bold hover:bg-[#22d3ee]/20 hover:border-[#22d3ee] transition-all shadow-sm cursor-pointer"
                >
                  Explore Community &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Active Community Hub Focus Card */}
          <div className="rounded-3xl border border-[#22d3ee]/30 bg-gradient-to-r from-[#0e1726] via-[#101b2d] to-[#0a121d] p-4 sm:p-5 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-[#0284c7]/20 border border-[#22d3ee]/40 flex items-center justify-center text-[#22d3ee] shadow-lg shadow-[#22d3ee]/10 shrink-0">
                  <CurrentCommunityIcon className="w-6 h-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/30">
                      Active Community Hub
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 font-mono">
                      {currentCommunity.members}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                      {currentCommunity.badge}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white font-['Space_Grotesk'] mt-1 truncate">
                    {currentCommunity.name}
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                    {currentCommunity.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                <button
                  type="button"
                  id="switch-community-btn"
                  onClick={() => setShowSwitchCommunityModal(true)}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 hover:border-[#22d3ee]/50 text-xs font-bold text-white flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#22d3ee]" />
                  <span>Switch Community</span>
                </button>

                <button
                  type="button"
                  id="logout-community-btn"
                  onClick={handleLogoutCommunity}
                  className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-xs font-semibold text-red-400 flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Log out of Community feed only (leaves dashboard session active)"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Log Out Community</span>
                  <span className="sm:hidden">Log Out</span>
                </button>
              </div>
            </div>

            {/* Crowd-free badge note */}
            <div className="mt-3.5 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#22d3ee] shrink-0" />
                <span>
                  Showing dedicated updates for <strong className="text-white font-medium">{currentCommunity.name}</strong> alone.
                </span>
              </span>
              <span className="text-slate-400 text-[11px]">
                {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"} in this hub
              </span>
            </div>
          </div>

          {/* Post Composer Card */}
          <div
            id="community-composer"
            className="bg-[#0e141f] border border-white/5 rounded-2xl p-4 shadow-lg transition-all focus-within:border-[#22d3ee]/30"
          >
            <div className="flex items-start gap-3">
              <img
                src={currentUserAvatar}
                alt={currentUserName}
                className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10 shrink-0 mt-0.5"
              />

              <div className="flex-1 min-w-0">
                {/* Posting to community target indicator */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Posting to:</span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#22d3ee]/10 text-[#22d3ee] border border-[#22d3ee]/25 text-xs font-semibold">
                    <CurrentCommunityIcon className="w-3 h-3" />
                    {currentCommunity.name}
                  </span>
                </div>
                {isExpandedComposer && (
                  <input
                    type="text"
                    value={composerTitle}
                    onChange={(e) => setComposerTitle(e.target.value)}
                    placeholder="Post title or headline..."
                    className="w-full bg-transparent text-sm font-semibold text-white placeholder-slate-500 focus:outline-none mb-2 border-b border-white/5 pb-1"
                  />
                )}

                <textarea
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  onFocus={() => setIsExpandedComposer(true)}
                  placeholder="Share something with the community..."
                  rows={isExpandedComposer ? 3 : 1}
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none resize-none leading-relaxed"
                />

                {/* Interactive Attachment Drawers */}
                <AnimatePresence>
                  {/* Image Attachment Drawer */}
                  {activeAttachment === "image" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-3.5 rounded-xl bg-[#131a26] border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <ImageIcon className="w-3.5 h-3.5 text-[#22d3ee]" /> Attach Image
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveAttachment("none");
                            setAttachedImage("");
                            setAttachedImageUrl("");
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {attachedImage || attachedImageUrl ? (
                        <div className="relative rounded-xl overflow-hidden border border-[#22d3ee]/40 max-h-48 group">
                          <img
                            src={attachedImage || attachedImageUrl}
                            alt="Attached preview"
                            className="w-full h-44 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setAttachedImage("");
                              setAttachedImageUrl("");
                            }}
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-2.5">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={attachedImageUrl}
                              onChange={(e) => setAttachedImageUrl(e.target.value)}
                              placeholder="Paste image URL (https://...)"
                              className="flex-1 bg-[#0a0f16] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]/50"
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 border border-white/10 flex items-center gap-1.5 transition-colors"
                            >
                              <Upload className="w-3.5 h-3.5 text-[#22d3ee]" /> Upload
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-medium">Quick presets:</span>
                            {[
                              { label: "Fintech UI", url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80" },
                              { label: "AI Neural", url: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80" },
                              { label: "Modern Web", url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80" },
                            ].map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setAttachedImageUrl(preset.url)}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 hover:bg-[#22d3ee]/20 text-slate-300 hover:text-[#22d3ee] transition-colors"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Link Attachment Drawer */}
                  {activeAttachment === "link" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-3.5 rounded-xl bg-[#131a26] border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <LinkIcon className="w-3.5 h-3.5 text-[#22d3ee]" /> Attach Link
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveAttachment("none");
                            setAttachedLinkUrl("");
                            setAttachedLinkTitle("");
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <input
                          type="text"
                          value={attachedLinkUrl}
                          onChange={(e) => setAttachedLinkUrl(e.target.value)}
                          placeholder="Target URL (e.g., https://github.com/nova-ai/project)"
                          className="w-full bg-[#0a0f16] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]/50"
                        />
                        <input
                          type="text"
                          value={attachedLinkTitle}
                          onChange={(e) => setAttachedLinkTitle(e.target.value)}
                          placeholder="Link display title (e.g., Nova Open Source Core)"
                          className="w-full bg-[#0a0f16] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]/50"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Poll Attachment Drawer */}
                  {activeAttachment === "poll" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-3.5 rounded-xl bg-[#131a26] border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <BarChart2 className="w-3.5 h-3.5 text-[#22d3ee]" /> Create Community Poll
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveAttachment("none");
                            setPollQuestion("");
                            setPollOptions(["", ""]);
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="text"
                        value={pollQuestion}
                        onChange={(e) => setPollQuestion(e.target.value)}
                        placeholder="Poll question (e.g., Which stack are you using?)"
                        className="w-full bg-[#0a0f16] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]/50 font-medium"
                      />

                      <div className="space-y-2">
                        {pollOptions.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400 font-bold w-4">{idx + 1}.</span>
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const newOpts = [...pollOptions];
                                newOpts[idx] = e.target.value;
                                setPollOptions(newOpts);
                              }}
                              placeholder={`Option ${idx + 1}`}
                              className="flex-1 bg-[#0a0f16] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]/50"
                            />
                            {pollOptions.length > 2 && (
                              <button
                                type="button"
                                onClick={() => setPollOptions(pollOptions.filter((_, i) => i !== idx))}
                                className="text-slate-400 hover:text-red-400 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {pollOptions.length < 5 && (
                        <button
                          type="button"
                          onClick={() => setPollOptions([...pollOptions, ""])}
                          className="text-xs font-semibold text-[#22d3ee] flex items-center gap-1 hover:underline pt-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Option
                        </button>
                      )}
                    </motion.div>
                  )}

                  {/* Event Attachment Drawer */}
                  {activeAttachment === "event" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 p-3.5 rounded-xl bg-[#131a26] border border-white/10 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#22d3ee]" /> Create Community Event
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveAttachment("none");
                            setEventTitle("");
                            setEventDate("");
                          }}
                          className="text-slate-400 hover:text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <input
                          type="text"
                          value={eventTitle}
                          onChange={(e) => setEventTitle(e.target.value)}
                          placeholder="Event Title (e.g. AI Hackathon & Pitch)"
                          className="w-full bg-[#0a0f16] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]/50"
                        />
                        <input
                          type="text"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          placeholder="Date & Time (e.g. Sat, Oct 10 • 7:00 PM)"
                          className="w-full bg-[#0a0f16] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#22d3ee]/50"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <span className="text-[11px] text-slate-400">Event Category:</span>
                        <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer">
                          <input
                            type="radio"
                            name="evType"
                            checked={eventType === "calendar"}
                            onChange={() => setEventType("calendar")}
                            className="accent-[#22d3ee]"
                          />
                          Meetup / Hangout
                        </label>
                        <label className="flex items-center gap-1.5 text-xs text-slate-200 cursor-pointer">
                          <input
                            type="radio"
                            name="evType"
                            checked={eventType === "code"}
                            onChange={() => setEventType("code")}
                            className="accent-[#22d3ee]"
                          />
                          Code Lab / Hackathon
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Composer Actions Row */}
                <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={handleCreatePost}
                      disabled={!composerText.trim() && !attachedImage && !attachedImageUrl && !pollQuestion && !eventTitle}
                      className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                        composerText.trim() || attachedImage || attachedImageUrl || pollQuestion || eventTitle
                          ? "bg-[#22d3ee] text-[#0a101d] hover:bg-[#22d3ee]/90 cursor-pointer"
                          : "bg-[#22d3ee]/40 text-[#0a101d]/60 cursor-not-allowed"
                      }`}
                    >
                      <Send className="w-3.5 h-3.5" />
                      Post
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsExpandedComposer(true);
                        setActiveAttachment(activeAttachment === "image" ? "none" : "image");
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        activeAttachment === "image" || attachedImage || attachedImageUrl
                          ? "bg-[#22d3ee]/20 text-[#22d3ee] border border-[#22d3ee]/40 font-semibold"
                          : "bg-white/5 hover:bg-white/10 text-slate-300"
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#22d3ee]" />
                      <span className="hidden sm:inline">Image</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsExpandedComposer(true);
                        setActiveAttachment(activeAttachment === "link" ? "none" : "link");
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        activeAttachment === "link" || attachedLinkUrl
                          ? "bg-[#22d3ee]/20 text-[#22d3ee] border border-[#22d3ee]/40 font-semibold"
                          : "bg-white/5 hover:bg-white/10 text-slate-300"
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5 text-[#22d3ee]" />
                      <span className="hidden sm:inline">Link</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsExpandedComposer(true);
                        setActiveAttachment(activeAttachment === "poll" ? "none" : "poll");
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        activeAttachment === "poll" || pollQuestion
                          ? "bg-[#22d3ee]/20 text-[#22d3ee] border border-[#22d3ee]/40 font-semibold"
                          : "bg-white/5 hover:bg-white/10 text-slate-300"
                      }`}
                    >
                      <BarChart2 className="w-3.5 h-3.5 text-[#22d3ee]" />
                      <span className="hidden sm:inline">Poll</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsExpandedComposer(true);
                        setActiveAttachment(activeAttachment === "event" ? "none" : "event");
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        activeAttachment === "event" || eventTitle
                          ? "bg-[#22d3ee]/20 text-[#22d3ee] border border-[#22d3ee]/40 font-semibold"
                          : "bg-white/5 hover:bg-white/10 text-slate-300"
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#22d3ee]" />
                      <span className="hidden sm:inline">Event</span>
                    </button>
                  </div>

                  {isExpandedComposer && (
                    <div className="flex items-center gap-2">
                      <select
                        value={composerCategory}
                        onChange={(e) => setComposerCategory(e.target.value as any)}
                        className="bg-[#131a26] text-[11px] text-[#22d3ee] border border-white/10 rounded-lg px-2 py-1 focus:outline-none"
                      >
                        <option value="discussions">Discussion</option>
                        <option value="projects">Project</option>
                        <option value="announcements">Announcement</option>
                        <option value="mentorship">Mentorship</option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          setIsExpandedComposer(false);
                          setActiveAttachment("none");
                          setComposerText("");
                          setComposerTitle("");
                        }}
                        className="text-slate-400 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Filter Pills and Sort Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {[
                { id: "all", label: "All Posts" },
                { id: "discussions", label: "Discussions" },
                { id: "projects", label: "Projects" },
                { id: "announcements", label: "Announcements" },
                { id: "mentorship", label: "Mentorship" },
              ].map((pill) => {
                const isActive = activeFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setActiveFilter(pill.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#131a26] text-[#22d3ee] border border-[#22d3ee]/40 shadow-sm"
                        : "bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-transparent"
                    }`}
                  >
                    {pill.label}
                  </button>
                );
              })}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#0e141f] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300">
              <span className="text-slate-400 text-[11px]">Sort:</span>
              <select
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value)}
                className="bg-transparent text-[#22d3ee] font-medium focus:outline-none cursor-pointer"
              >
                <option value="latest" className="bg-[#0e141f] text-white">
                  Latest
                </option>
                <option value="top" className="bg-[#0e141f] text-white">
                  Top Liked
                </option>
              </select>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center bg-[#0e141f] border border-white/5 rounded-2xl">
                <CurrentCommunityIcon className="w-10 h-10 text-[#22d3ee]/60 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-white">No posts yet in {currentCommunity.name}</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Be the first to share an opportunity, code update, or start a discussion in this hub!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const postBox = document.getElementById("community-composer");
                    postBox?.scrollIntoView({ behavior: "smooth" });
                    setIsExpandedComposer(true);
                  }}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#22d3ee] text-[#0a101d] text-xs font-bold hover:bg-[#22d3ee]/90 transition-all cursor-pointer"
                >
                  Create First Post &rarr;
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => {
                const isExpandedComments = expandedCommentsPostId === post.id;
                const postComments = post.comments || [];

                return (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-[#0e141f] border border-white/5 hover:border-white/10 rounded-2xl p-4 sm:p-5 transition-all shadow-md"
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-white/10"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white font-['Space_Grotesk']">
                              {post.authorName}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                post.authorRole === "Builder"
                                  ? "bg-[#131a26] text-[#22d3ee] border-[#22d3ee]/30"
                                  : post.authorRole === "Designer"
                                    ? "bg-[#182333] text-[#38bdf8] border-[#38bdf8]/30"
                                    : "bg-[#1e293b] text-[#60a5fa] border-[#60a5fa]/30"
                              }`}
                            >
                              {post.authorRole}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            {post.timeAgo} • {post.location}
                          </p>
                        </div>
                      </div>

                      <button className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Post Content */}
                    <div className="mt-3.5">
                      <h2 className="text-sm sm:text-base font-bold text-white font-['Space_Grotesk'] leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-[#131a26] text-[#22d3ee] border border-white/5 hover:border-[#22d3ee]/30 cursor-pointer transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Attached Image Display */}
                    {post.attachedImage && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-[#0a0f16] group">
                        <img
                          src={post.attachedImage}
                          alt={post.title}
                          className="w-full max-h-96 object-cover hover:scale-[1.01] transition-transform duration-300"
                        />
                      </div>
                    )}

                    {/* Attached Link Display */}
                    {post.attachedLink && (
                      <a
                        href={post.attachedLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 p-3.5 rounded-xl bg-[#111927] border border-white/10 hover:border-[#22d3ee]/40 transition-all flex items-center justify-between group block"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee] shrink-0">
                            <LinkIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate group-hover:text-[#22d3ee] transition-colors">
                              {post.attachedLink.title || "External Resource"}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {post.attachedLink.url}
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#22d3ee] transition-colors shrink-0 ml-3" />
                      </a>
                    )}

                    {/* Attached Poll Display */}
                    {post.attachedPoll && (
                      <div className="mt-4 p-4 rounded-2xl bg-[#111927] border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BarChart2 className="w-4 h-4 text-[#22d3ee]" />
                            <h4 className="text-xs font-bold text-white font-['Space_Grotesk']">
                              {post.attachedPoll.question || "Community Poll"}
                            </h4>
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {post.attachedPoll.totalVotes} {post.attachedPoll.totalVotes === 1 ? "vote" : "votes"}
                          </span>
                        </div>

                        <div className="space-y-2 pt-1">
                          {post.attachedPoll.options.map((option) => {
                            const isSelected = post.attachedPoll?.userVotedId === option.id;
                            const total = post.attachedPoll?.totalVotes || 0;
                            const percent = total > 0 ? Math.round((option.votes / total) * 100) : 0;

                            return (
                              <button
                                key={option.id}
                                onClick={() => handleVotePoll(post.id, option.id)}
                                className={`w-full relative overflow-hidden rounded-xl p-3 text-left border transition-all flex items-center justify-between group ${
                                  isSelected
                                    ? "border-[#22d3ee] bg-[#22d3ee]/10"
                                    : "border-white/5 bg-[#141e2e]/60 hover:border-white/15"
                                }`}
                              >
                                {/* Percentage fill bar */}
                                <div
                                  className={`absolute left-0 top-0 bottom-0 transition-all duration-500 rounded-xl ${
                                    isSelected ? "bg-[#22d3ee]/20" : "bg-white/[0.04]"
                                  }`}
                                  style={{ width: `${percent}%` }}
                                />

                                <div className="relative z-10 flex items-center gap-2.5">
                                  <span
                                    className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                                      isSelected
                                        ? "border-[#22d3ee] bg-[#22d3ee] text-[#0a101d]"
                                        : "border-slate-500 group-hover:border-white"
                                    }`}
                                  >
                                    {isSelected && "✓"}
                                  </span>
                                  <span className={`text-xs font-medium ${isSelected ? "text-white font-semibold" : "text-slate-200"}`}>
                                    {option.text}
                                  </span>
                                </div>

                                <span className="relative z-10 text-xs font-bold text-[#22d3ee]">
                                  {percent}%
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Attached Event Display */}
                    {post.attachedEvent && (
                      <div className="mt-4 p-4 rounded-2xl bg-[#111927] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee] shrink-0">
                            {post.attachedEvent.type === "calendar" ? (
                              <Calendar className="w-5 h-5" />
                            ) : (
                              <Code className="w-5 h-5" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white font-['Space_Grotesk']">
                              {post.attachedEvent.title}
                            </h4>
                            <p className="text-[11px] text-[#22d3ee] font-medium mt-0.5">
                              {post.attachedEvent.dateStr}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleToggleJoinPostEvent(post.id)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                            post.attachedEvent.joined
                              ? "bg-[#22d3ee]/20 text-[#22d3ee] border border-[#22d3ee]/40"
                              : "bg-[#22d3ee] hover:bg-[#22d3ee]/90 text-[#0a101d]"
                          }`}
                        >
                          {post.attachedEvent.joined ? "Joined ✓" : "Join Event"}
                        </button>
                      </div>
                    )}

                    {/* Rich Attachment Preview (fintech / fashion / ai) */}
                    {post.previewType && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-[#0a0f16] relative group">
                        {post.previewType === "fintech" && (
                          <div className="p-4 bg-gradient-to-br from-[#0e1824] via-[#101e2e] to-[#0a121c] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee]">
                                <Smartphone className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white font-['Space_Grotesk']">
                                  {post.previewTitle}
                                </h4>
                                <p className="text-[11px] text-slate-400">{post.previewSubtitle}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/30 flex items-center gap-1">
                              Figma Project <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                        )}

                        {post.previewType === "fashion" && (
                          <div className="p-4 bg-gradient-to-br from-[#121a28] via-[#111d2e] to-[#0c1422] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#38bdf8]/10 border border-[#38bdf8]/30 flex items-center justify-center text-[#38bdf8]">
                                <ShoppingBag className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white font-['Space_Grotesk']">
                                  {post.previewTitle}
                                </h4>
                                <p className="text-[11px] text-slate-400">{post.previewSubtitle}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#38bdf8]/15 text-[#38bdf8] border border-[#38bdf8]/30 flex items-center gap-1">
                              Client Brief <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                        )}

                        {post.previewType === "ai" && (
                          <div className="p-4 bg-gradient-to-br from-[#0f1725] via-[#121f33] to-[#0a121d] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-[#22d3ee]/10 border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee]">
                                <Cpu className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-white font-['Space_Grotesk']">
                                  {post.previewTitle}
                                </h4>
                                <p className="text-[11px] text-slate-400">{post.previewSubtitle}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#22d3ee]/15 text-[#22d3ee] border border-[#22d3ee]/30 flex items-center gap-1">
                              GitHub Repo <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Interaction Bar */}
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-4">
                        {/* Like Button */}
                        <button
                          onClick={() => handleToggleLike(post.id)}
                          className={`flex items-center gap-1.5 font-medium transition-colors ${
                            post.isLiked
                              ? "text-[#22d3ee]"
                              : "hover:text-[#22d3ee]"
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 transition-transform ${
                              post.isLiked ? "fill-[#22d3ee] scale-110" : ""
                            }`}
                          />
                          <span>{post.likes}</span>
                        </button>

                        {/* Comment Button */}
                        <button
                          onClick={() =>
                            setExpandedCommentsPostId(
                              isExpandedComments ? null : post.id
                            )
                          }
                          className="flex items-center gap-1.5 font-medium hover:text-[#22d3ee] transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.commentsCount}</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Share Button */}
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            alert("Post link copied to clipboard!");
                          }}
                          className="p-1.5 rounded-lg hover:text-white hover:bg-white/5 transition-colors"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>

                        {/* Bookmark Button */}
                        <button
                          onClick={() => handleToggleBookmark(post.id)}
                          className={`p-1.5 rounded-lg hover:bg-white/5 transition-colors ${
                            post.isBookmarked
                              ? "text-[#22d3ee]"
                              : "hover:text-white"
                          }`}
                          title="Bookmark"
                        >
                          <Bookmark
                            className={`w-4 h-4 ${
                              post.isBookmarked ? "fill-[#22d3ee]" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Comments Section (Expandable) */}
                    <AnimatePresence>
                      {isExpandedComments && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-white/5 space-y-3"
                        >
                          {/* Existing Comments List */}
                          {postComments.map((c) => (
                            <div
                              key={c.id}
                              className="flex items-start gap-2.5 bg-white/[0.02] p-2.5 rounded-xl border border-white/5"
                            >
                              <img
                                src={c.authorAvatar}
                                alt={c.authorName}
                                className="w-7 h-7 rounded-full object-cover mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-white font-['Space_Grotesk']">
                                    {c.authorName}
                                  </span>
                                  <span className="text-[9px] text-[#22d3ee] font-medium">
                                    • {c.authorRole}
                                  </span>
                                  <span className="text-[9px] text-slate-500 ml-auto">
                                    {c.createdAt}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                                  {c.content}
                                </p>
                              </div>
                            </div>
                          ))}

                          {/* New Comment Input */}
                          <div className="flex items-center gap-2 pt-1">
                            <input
                              type="text"
                              value={commentInputs[post.id] || ""}
                              onChange={(e) =>
                                setCommentInputs({
                                  ...commentInputs,
                                  [post.id]: e.target.value,
                                } as any)
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleAddComment(post.id);
                              }}
                              placeholder="Write a comment..."
                              className="flex-1 bg-[#131a26] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#22d3ee]/50"
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              className="px-3 py-1.5 rounded-xl bg-[#22d3ee] text-[#0a101d] font-bold text-xs hover:bg-[#22d3ee]/90 transition-colors"
                            >
                              Reply
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Sidebar Widgets Column */}
        <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3 space-y-6">
          {/* Widget 1: NOVA Community Info Card */}
          <div className="bg-[#0e141f] border border-white/5 rounded-2xl p-5 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0a0a0a] border border-[#22d3ee]/30 p-1 flex items-center justify-center shrink-0">
                <img
                  src="/Picsart_26-04-10_14-37-41-214.png"
                  alt="NOVA Community"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-['Space_Grotesk']">
                  NOVA Community
                </h3>
                <p className="text-[11px] text-[#22d3ee] font-medium">
                  Builders • Founders • Innovators
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              A focused community for Africa&apos;s builders and global partners. Here you&apos;ll find opportunities, collaborate on projects, share knowledge and build real solutions.
            </p>

            <div className="mt-4 flex items-center gap-2.5 pt-1">
              <div className="flex -space-x-2 overflow-hidden">
                {TOP_MEMBERS.slice(0, 4).map((m, i) => (
                  <img
                    key={i}
                    src={m.avatar}
                    alt={m.name}
                    className="w-7 h-7 rounded-full ring-2 ring-[#0e141f] object-cover"
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-slate-300">
                <strong className="text-white font-bold">12,480+</strong> members
              </span>
            </div>

            <button
              onClick={() => setInviteModalOpen(true)}
              className="mt-4 w-full py-2.5 rounded-xl bg-[#22d3ee] hover:bg-[#22d3ee]/90 text-[#0a101d] text-xs font-bold transition-all shadow-md shadow-[#22d3ee]/15 flex items-center justify-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5" />
              + Invite Friends
            </button>

            <div className="mt-2.5 text-center">
              <button
                type="button"
                onClick={() => {
                  localStorage.removeItem("nova_community_access");
                  setHasCommunityAccess(false);
                }}
                className="text-[10px] text-slate-500 hover:text-[#22d3ee] transition-colors"
                title="Reset membership to test Gateway and Paystack again"
              >
                ↻ Re-test Community Gateway & Paystack
              </button>
            </div>
          </div>

          {/* Widget 2: Community Rules */}
          <div className="bg-[#0e141f] border border-white/5 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 pb-3 border-b border-white/5">
              <Shield className="w-4 h-4 text-[#22d3ee]" />
              <h3 className="text-xs font-bold text-white font-['Space_Grotesk'] tracking-wide uppercase">
                Community Rules
              </h3>
            </div>

            <ul className="mt-3 space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-[#22d3ee] font-bold mt-0.5">&rarr;</span>
                <span>Be respectful and inclusive</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22d3ee] font-bold mt-0.5">&rarr;</span>
                <span>No spam or irrelevant posts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22d3ee] font-bold mt-0.5">&rarr;</span>
                <span>Keep discussions professional</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#22d3ee] font-bold mt-0.5">&rarr;</span>
                <span>Support and help each other</span>
              </li>
            </ul>

            <button
              onClick={() => alert("Guidelines: 1. Maintain constructive feedback 2. Credit original code & designs 3. Transparent project scopes.")}
              className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-[#22d3ee] hover:underline"
            >
              Read full guidelines &rarr;
            </button>
          </div>

          {/* Widget 3: Top Members */}
          <div className="bg-[#0e141f] border border-white/5 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-xs font-bold text-white font-['Space_Grotesk'] tracking-wide uppercase">
                Top Members
              </h3>
              <button
                onClick={() => setActiveFilter("all")}
                className="text-[11px] font-semibold text-[#22d3ee] hover:underline"
              >
                View all
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {TOP_MEMBERS.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-3 group cursor-pointer"
                  onClick={() => setSearchQuery(member.name)}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-white/10"
                      />
                      {member.isOnline && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#22d3ee] ring-2 ring-[#0e141f]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white font-['Space_Grotesk'] truncate group-hover:text-[#22d3ee] transition-colors">
                        {member.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">{member.role}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-medium text-[#22d3ee] flex items-center gap-1 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22d3ee]" />
                    Online
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Widget 4: Upcoming Community Events */}
          <div className="bg-[#0e141f] border border-white/5 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-xs font-bold text-white font-['Space_Grotesk'] tracking-wide uppercase">
                Upcoming Community Events
              </h3>
              <button className="text-[11px] font-semibold text-[#22d3ee] hover:underline">
                View all
              </button>
            </div>

            <div className="mt-3 space-y-3.5">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#131a26] border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee] shrink-0">
                      {ev.type === "calendar" ? (
                        <Calendar className="w-4 h-4" />
                      ) : (
                        <Code className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white font-['Space_Grotesk'] truncate">
                        {ev.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 truncate">{ev.dateStr}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleJoinEvent(ev.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                      ev.joined
                        ? "bg-[#22d3ee]/20 text-[#22d3ee] border border-[#22d3ee]/40"
                        : "bg-[#22d3ee] hover:bg-[#22d3ee]/90 text-[#0a101d]"
                    }`}
                  >
                    {ev.joined ? "Joined ✓" : "Join"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* SCREEN 8: MEDIA LAYER (FEED / VIDEO / STORIES / LIVE) */}
      {activeTab === "media" && (
        <CommunityMediaView onNavigateTab={(tab) => setActiveTab(tab as any)} />
      )}

      {/* SCREEN 6: COMMUNITIES DIRECTORY & DISCOVERY */}
      {activeTab === "communities" && (
        <CommunitiesDirectoryView
          activeCommunityHub={activeCommunityHub}
          onSelectCommunity={(id) => {
            handleSelectCommunityHub(id);
            setActiveTab("hub");
          }}
          onCreateCommunityClick={() => setShowCreateCommunityModal(true)}
        />
      )}

      {/* SCREEN 7: COMMUNITY HUB PAGE (AI BUILDERS HUB) */}
      {activeTab === "hub" && (
        <CommunityHubPageView onNavigateTab={(tab) => setActiveTab(tab as any)} />
      )}

      {/* SCREEN 15: COMMUNITY HEALTH SCORECARD & VITALITY */}
      {activeTab === "health" && <CommunityHealthView />}

      {/* SCREEN 14: COMMUNITY STUDIO & ECONOMIC LAYER */}
      {activeTab === "studio" && <CommunityStudioView />}

      {/* SCREEN 9: MISSIONS & BOUNTIES BOARD */}
      {activeTab === "missions" && (
        <CommunityMissionsView onNavigateTab={(tab) => setActiveTab(tab as any)} />
      )}

      {/* SCREEN 10: EVENTS, MASTERCLASSES & DEMO DAYS */}
      {activeTab === "events" && <CommunityEventsView />}

      {/* SCREEN 11: OPPORTUNITIES MARKETPLACE */}
      {activeTab === "opportunities" && <CommunityOpportunitiesView />}

      {/* SCREEN 12: PROJECTS & ASSET MARKETPLACE */}
      {activeTab === "projects" && <CommunityProjectsMarketplaceView />}

      {/* SCREEN 17: MY NETWORK ORBIT (TOPOLOGY GRAPH) */}
      {activeTab === "network" && <MyNetworkOrbitView />}

      {/* SCREEN 16: MEMBER PROFILE & REPUTATION (SYSTEMS TRUST ARCHITECT) */}
      {activeTab === "profile" && <MemberProfileView />}

      {/* Invite Friends Modal */}
      <AnimatePresence>
        {inviteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#0e141f] border border-white/10 rounded-2xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setInviteModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#131a26] border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                    Invite Friends to NOVA
                  </h3>
                  <p className="text-xs text-slate-400">Share your exclusive invite link</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Bring fellow builders, designers, and founders into NOVA Community. Build projects and form teams together.
              </p>

              <div className="flex items-center gap-2 bg-[#0a0f16] border border-white/10 rounded-xl p-2 mb-4">
                <input
                  type="text"
                  readOnly
                  value="https://nova.ai/join/community"
                  className="bg-transparent text-xs text-slate-300 px-2 focus:outline-none flex-1 truncate"
                />
                <button
                  onClick={handleCopyInvite}
                  className="px-3 py-1.5 rounded-lg bg-[#22d3ee] text-[#0a101d] font-bold text-xs flex items-center gap-1 hover:bg-[#22d3ee]/90 transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Switch Community Modal */}
      <AnimatePresence>
        {showSwitchCommunityModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xl bg-[#0e141f] border border-[#22d3ee]/30 rounded-3xl p-6 sm:p-7 shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#0284c7]/20 border border-[#22d3ee]/30 flex items-center justify-center text-[#22d3ee] shrink-0">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                      What community do you want to join?
                    </h3>
                    <p className="text-xs text-slate-300">
                      Select an available community to browse posts for that hub alone.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="close-switch-modal-btn"
                  onClick={() => setShowSwitchCommunityModal(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Notice Banner */}
              <div className="py-2 px-3 rounded-xl bg-[#22d3ee]/10 border border-[#22d3ee]/20 text-[11px] text-[#22d3ee] flex items-center gap-2 mb-4">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>Because of the crowd, switching communities lets you focus on content tailored to you.</span>
              </div>

              {/* Hub Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-2 overflow-y-auto pr-1 flex-1 max-h-[420px]">
                {AVAILABLE_COMMUNITIES.map((hub) => {
                  const Icon = hub.icon;
                  const isCurrent = activeCommunityHub === hub.id;
                  return (
                    <button
                      key={hub.id}
                      type="button"
                      id={`switch-hub-btn-${hub.id}`}
                      onClick={() => handleSelectCommunityHub(hub.id)}
                      className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between group ${
                        isCurrent
                          ? "bg-[#0284c7]/25 border-[#22d3ee] text-white shadow-lg shadow-[#22d3ee]/15 ring-1 ring-[#22d3ee]/50"
                          : "bg-[#080d14] border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isCurrent ? "bg-[#22d3ee] text-[#07090e]" : "bg-white/5 text-[#22d3ee] group-hover:bg-[#22d3ee]/20"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold ${isCurrent ? "text-white" : "text-slate-200"}`}>
                              {hub.name}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {hub.members}
                            </span>
                          </div>
                        </div>
                        {isCurrent && (
                          <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#22d3ee]/20 text-[#22d3ee] font-bold border border-[#22d3ee]/40">
                            Active
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5 line-clamp-2">
                        {hub.desc}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {hub.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`text-[9px] px-1.5 py-0.5 rounded-md font-mono ${
                              isCurrent ? "bg-white/10 text-white" : "bg-white/5 text-slate-400"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10">
                <span className="text-[11px] text-slate-400">
                  Currently viewing: <strong className="text-white font-semibold">{currentCommunity.name}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setShowSwitchCommunityModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* SCREEN 11: LOGOUT OF COMMUNITY MODAL */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-sm rounded-3xl bg-[#0b101b] border border-white/10 p-6 shadow-2xl text-center relative"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Logout Circular Icon */}
              <div className="w-16 h-16 rounded-full bg-[#10b981]/15 border border-[#10b981]/30 flex items-center justify-center text-[#10b981] mx-auto mb-4 shadow-lg shadow-[#10b981]/15">
                <LogOut className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-white font-['Space_Grotesk'] mb-2">
                Log out of Community?
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                You will be logged out of {currentCommunity.name} and returned to the community selection page. Your NOVA dashboard session will remain active.
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  id="confirm-community-logout-btn"
                  onClick={() => {
                    setShowLogoutModal(false);
                    handleLogoutCommunity();
                  }}
                  className="w-full py-3.5 rounded-full bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs transition-all shadow-lg shadow-[#10b981]/25 cursor-pointer active:scale-[0.99]"
                >
                  Log Out of Community
                </button>

                <button
                  type="button"
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SCREEN 13: CREATE COMMUNITY MODAL (WIZARD) */}
      <CreateCommunityModal
        isOpen={showCreateCommunityModal}
        onClose={() => setShowCreateCommunityModal(false)}
      />

      {/* SCREEN 18: RESPONSIVE MOBILE NAVIGATION & BOTTOM CREATE ACTION SHEET */}
      <MobileCreateSheet
        activeTab={activeTab}
        onTabSelect={(tab) => setActiveTab(tab as any)}
        onOpenCreateCommunity={() => setShowCreateCommunityModal(true)}
      />
    </div>
  );
}
