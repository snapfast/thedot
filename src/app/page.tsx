"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Filter,
  BarChart2,
  Volume2,
  Settings,
  Compass,
  X,
  Sun,
  Moon,
  Zap,
  Target,
  Heart,
  Briefcase,
  Plane,
  Palette,
  Lightbulb,
  DollarSign,
  Send,
  RefreshCw,
  Flame
} from "lucide-react";

interface ThoughtItem {
  id: string;
  thought: string;
  category: "Career" | "Travel" | "Health" | "Creative" | "Wealth" | "Mindfulness";
  mood: "Inspired" | "Calm" | "Energetic" | "Focused" | "Ambitious";
  targetDate?: string;
  manifested: boolean;
  isPinned: boolean;
  gradient: string;
  createdAt: string;
}

const DEFAULT_GRADIENTS = [
  "from-purple-600 to-indigo-600",
  "from-pink-500 to-rose-600",
  "from-emerald-500 to-teal-700",
  "from-amber-500 to-orange-600",
  "from-blue-600 to-cyan-500",
  "from-fuchsia-600 to-pink-500",
];

const INITIAL_THOUGHTS: ThoughtItem[] = [
  {
    id: "1",
    thought: "Build a revolutionary AI tool that helps creators bring their wildest imagination to life.",
    category: "Creative",
    mood: "Inspired",
    targetDate: "2025-12-31",
    manifested: false,
    isPinned: true,
    gradient: "from-purple-600 to-indigo-600",
    createdAt: new Date().toLocaleDateString(),
  },
  {
    id: "2",
    thought: "Travel to Kyoto during cherry blossom season and spend a week in a traditional ryokan.",
    category: "Travel",
    mood: "Calm",
    targetDate: "2026-04-10",
    manifested: false,
    isPinned: true,
    gradient: "from-pink-500 to-rose-600",
    createdAt: new Date().toLocaleDateString(),
  },
  {
    id: "3",
    thought: "Achieve financial freedom to fund passion open-source projects without constraint.",
    category: "Wealth",
    mood: "Ambitious",
    targetDate: "2025-09-01",
    manifested: true,
    isPinned: false,
    gradient: "from-emerald-500 to-teal-700",
    createdAt: new Date().toLocaleDateString(),
  },
  {
    id: "4",
    thought: "Master morning meditation and complete a 10km marathon with high energy.",
    category: "Health",
    mood: "Energetic",
    targetDate: "2025-06-30",
    manifested: false,
    isPinned: false,
    gradient: "from-amber-500 to-orange-600",
    createdAt: new Date().toLocaleDateString(),
  },
];

export default function VisionBoardApp() {
  // Vision board thoughts state
  const [thoughts, setThoughts] = useState<ThoughtItem[]>(INITIAL_THOUGHTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"board" | "analytics" | "configurator">("board");

  // Form publisher state
  const [isPublisherOpen, setIsPublisherOpen] = useState(false);
  const [newThoughtText, setNewThoughtText] = useState("");
  const [newCategory, setNewCategory] = useState<ThoughtItem["category"]>("Creative");
  const [newMood, setNewMood] = useState<ThoughtItem["mood"]>("Inspired");
  const [newTargetDate, setNewTargetDate] = useState("");
  const [selectedGradient, setSelectedGradient] = useState(DEFAULT_GRADIENTS[0]);

  // Circular Menu States
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<"right-center" | "right-top" | "right-bottom">("right-center");
  const [menuRotation, setMenuRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [dotHovered, setDotHovered] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light" | "cyberpunk">("dark");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [radius, setRadius] = useState(240);
  const [radialAngleSpan, setRadialAngleSpan] = useState(180);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Load saved thoughts on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("vision_board_thoughts");
      if (saved) {
        Promise.resolve().then(() => {
          setThoughts(JSON.parse(saved));
        });
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save thoughts on change
  useEffect(() => {
    try {
      localStorage.setItem("vision_board_thoughts", JSON.stringify(thoughts));
    } catch {
      // Ignore localStorage errors
    }
  }, [thoughts]);

  // Web Audio Synthesizer sound generator
  const playSound = (type: "click" | "publish" | "manifest" | "open" | "close" | "spin") => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "click") {
        osc.frequency.setValueAtTime(500, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "publish") {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "manifest") {
        // High celebratory chime
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else if (type === "open") {
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "close") {
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === "spin") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // AudioContext fails if no user gesture
    }
  };

  const handlePublishThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThoughtText.trim()) return;

    const item: ThoughtItem = {
      id: Date.now().toString(),
      thought: newThoughtText.trim(),
      category: newCategory,
      mood: newMood,
      targetDate: newTargetDate || undefined,
      manifested: false,
      isPinned: false,
      gradient: selectedGradient,
      createdAt: new Date().toLocaleDateString(),
    };

    setThoughts([item, ...thoughts]);
    setNewThoughtText("");
    setIsPublisherOpen(false);
    playSound("publish");

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleToggleManifested = (id: string) => {
    setThoughts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.manifested;
          if (nextState) {
            playSound("manifest");
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.5 },
              colors: ["#a855f7", "#ec4899", "#10b981", "#f59e0b", "#3b82f6"],
            });
          } else {
            playSound("click");
          }
          return { ...item, manifested: nextState };
        }
        return item;
      })
    );
  };

  const handleTogglePin = (id: string) => {
    playSound("click");
    setThoughts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isPinned: !item.isPinned } : item))
    );
  };

  const handleDeleteThought = (id: string) => {
    playSound("click");
    setThoughts((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSpinMenu = () => {
    if (isSpinning) return;
    playSound("spin");
    setIsSpinning(true);
    setMenuRotation((prev) => prev + 360);
    setTimeout(() => {
      setIsSpinning(false);
    }, 1000);
  };

  // Category Icon Resolver
  const getCategoryIcon = (cat: ThoughtItem["category"]) => {
    switch (cat) {
      case "Career":
        return <Briefcase className="w-4 h-4" />;
      case "Travel":
        return <Plane className="w-4 h-4" />;
      case "Health":
        return <Heart className="w-4 h-4" />;
      case "Creative":
        return <Palette className="w-4 h-4" />;
      case "Wealth":
        return <DollarSign className="w-4 h-4" />;
      case "Mindfulness":
        return <Lightbulb className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  // Filtered thoughts
  const filteredThoughts = thoughts.filter((item) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "Manifested") return item.manifested;
    if (selectedCategory === "Pinned") return item.isPinned;
    return item.category === selectedCategory;
  });

  // Circular Menu Radial trigonometry calculation
  const getCoordinates = (index: number, total: number) => {
    const angleRange = radialAngleSpan;
    const startAngle = 180 - angleRange / 2;
    const angleStep = total > 1 ? angleRange / (total - 1) : 0;
    const angleInDegrees = startAngle + index * angleStep + menuRotation;
    const angleInRadians = (angleInDegrees * Math.PI) / 180;

    const x = Math.cos(angleInRadians) * radius;
    const y = Math.sin(angleInRadians) * radius;

    return { x, y };
  };

  // Radial Menu Action Items
  const menuItems = [
    {
      id: "publish",
      label: "Publish Thought",
      icon: <PlusCircle className="w-5 h-5" />,
      description: "Post a new dream or intention to your vision board",
      action: () => {
        setIsPublisherOpen(true);
        setActiveTab("board");
      },
    },
    {
      id: "filter_all",
      label: "All Thoughts",
      icon: <Filter className="w-5 h-5" />,
      description: "View all published vision board thoughts",
      action: () => {
        setSelectedCategory("All");
        setActiveTab("board");
      },
    },
    {
      id: "filter_manifested",
      label: "Manifested 🎉",
      icon: <CheckCircle2 className="w-5 h-5" />,
      description: "Show thoughts you have successfully manifested!",
      action: () => {
        setSelectedCategory("Manifested");
        setActiveTab("board");
      },
    },
    {
      id: "analytics",
      label: "Vision Insights",
      icon: <BarChart2 className="w-5 h-5" />,
      description: "View statistics & breakdown of your published thoughts",
      action: () => {
        setActiveTab("analytics");
      },
    },
    {
      id: "sound_toggle",
      label: soundEnabled ? "Mute Audio" : "Enable Audio",
      icon: <Volume2 className="w-5 h-5" />,
      description: soundEnabled ? "Disable ambient UI sounds" : "Enable ambient UI sounds",
      action: () => {
        setSoundEnabled(!soundEnabled);
      },
    },
    {
      id: "configurator",
      label: "Board Config",
      icon: <Settings className="w-5 h-5" />,
      description: "Customize radial menu geometry & interface settings",
      action: () => {
        setActiveTab("configurator");
      },
    },
  ];

  const positionClasses = {
    "right-center": "top-1/2 -translate-y-1/2 right-0",
    "right-top": "top-24 right-0",
    "right-bottom": "bottom-24 right-0",
  };

  const getThemeStyles = () => {
    switch (theme) {
      case "cyberpunk":
        return {
          bg: "bg-black text-yellow-400",
          cardBg: "bg-zinc-900/90 border border-yellow-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.15)]",
          gradientText: "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent",
          badgeBg: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
          accentColor: "#eab308",
        };
      case "light":
        return {
          bg: "bg-slate-50 text-slate-800",
          cardBg: "bg-white/95 border border-slate-200 backdrop-blur-md shadow-xl",
          gradientText: "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent",
          badgeBg: "bg-purple-50 text-purple-700 border border-purple-100",
          accentColor: "#9333ea",
        };
      case "dark":
      default:
        return {
          bg: "bg-slate-950 text-slate-100",
          cardBg: "bg-slate-900/80 border border-slate-800 backdrop-blur-lg shadow-2xl",
          gradientText: "bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent",
          badgeBg: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
          accentColor: "#a855f7",
        };
    }
  };

  const themeStyles = getThemeStyles();

  // Metrics
  const totalCount = thoughts.length;
  const manifestedCount = thoughts.filter((t) => t.manifested).length;
  const pinnedCount = thoughts.filter((t) => t.isPinned).length;
  const completionRate = totalCount > 0 ? Math.round((manifestedCount / totalCount) * 100) : 0;

  return (
    <div className={`min-h-screen transition-all duration-500 flex flex-col font-sans ${themeStyles.bg} overflow-x-hidden relative`}>

      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[140px] opacity-30 bg-purple-600"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full blur-[140px] opacity-30 bg-pink-600"></div>
      </div>

      {/* Main Header */}
      <header className="z-10 w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className={themeStyles.gradientText}>MindVision Board</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">
                Live Publisher
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">Where your thoughts & visions get published into reality</p>
          </div>
        </div>

        {/* Global Tab Controls & Theme Selector */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
            <button
              onClick={() => { playSound("click"); setActiveTab("board"); }}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 font-semibold ${
                activeTab === "board" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Vision Board</span>
            </button>
            <button
              onClick={() => { playSound("click"); setActiveTab("analytics"); }}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 font-semibold ${
                activeTab === "analytics" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Insights</span>
            </button>
            <button
              onClick={() => { playSound("click"); setActiveTab("configurator"); }}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 font-semibold ${
                activeTab === "configurator" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Config</span>
            </button>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => { playSound("click"); setTheme("light"); }}
              className={`p-2 rounded-lg transition-colors ${theme === "light" ? "bg-purple-600 text-white" : "bg-slate-800/40 text-slate-400 hover:text-slate-200"}`}
              title="Light Theme"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => { playSound("click"); setTheme("dark"); }}
              className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "bg-purple-600 text-white" : "bg-slate-800/40 text-slate-400 hover:text-slate-200"}`}
              title="Dark Theme"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => { playSound("click"); setTheme("cyberpunk"); }}
              className={`p-2 rounded-lg transition-colors text-xs font-bold ${theme === "cyberpunk" ? "bg-yellow-500 text-black" : "bg-slate-800/40 text-yellow-500 hover:bg-yellow-500/10"}`}
              title="Cyberpunk Theme"
            >
              CYBER
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 py-8 max-w-7xl w-full mx-auto z-10 flex flex-col gap-8">

        {/* Hero Banner / Publisher Trigger */}
        <div className={`p-6 sm:p-8 rounded-3xl relative overflow-hidden ${themeStyles.cardBg}`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${themeStyles.badgeBg} inline-flex items-center gap-1.5`}>
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Intentional Thought Publishing Space
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
                What are you thinking? <span className={themeStyles.gradientText}>Publish it to reality.</span>
              </h2>
              <p className="text-sm text-slate-400 max-w-xl">
                Capture your goals, creative flashes, travel aspirations, and inner thoughts. Use the circular radial menu or the quick publisher button below to manifest them!
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={() => {
                  playSound("click");
                  setIsPublisherOpen(true);
                }}
                className="px-6 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white shadow-xl shadow-purple-600/30 hover:scale-105 active:scale-95"
              >
                <PlusCircle className="w-5 h-5" /> Publish New Thought
              </button>
            </div>
          </div>
        </div>

        {/* Publisher Modal / Expanded Drawer */}
        {isPublisherOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
            <div className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-purple-500/30 shadow-2xl ${themeStyles.cardBg} space-y-6 relative`}>
              <button
                onClick={() => setIsPublisherOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" /> Publish Thought to Vision Board
                </h3>
                <p className="text-xs text-slate-400">Write down what is on your mind or what you wish to manifest.</p>
              </div>

              <form onSubmit={handlePublishThought} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Thought / Goal / Vision
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newThoughtText}
                    onChange={(e) => setNewThoughtText(e.target.value)}
                    placeholder="e.g. Launch my passion project, travel to Iceland, learn electric guitar..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Category
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as ThoughtItem["category"])}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Creative">🎨 Creative</option>
                      <option value="Career">💼 Career</option>
                      <option value="Travel">✈️ Travel</option>
                      <option value="Health">❤️ Health</option>
                      <option value="Wealth">💰 Wealth</option>
                      <option value="Mindfulness">💡 Mindfulness</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Vibe / Mood
                    </label>
                    <select
                      value={newMood}
                      onChange={(e) => setNewMood(e.target.value as ThoughtItem["mood"])}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Inspired">✨ Inspired</option>
                      <option value="Energetic">⚡ Energetic</option>
                      <option value="Ambitious">🔥 Ambitious</option>
                      <option value="Calm">🧘 Calm</option>
                      <option value="Focused">🎯 Focused</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Target Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={newTargetDate}
                    onChange={(e) => setNewTargetDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Card Visual Theme Gradient
                  </label>
                  <div className="flex gap-2">
                    {DEFAULT_GRADIENTS.map((grad, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setSelectedGradient(grad)}
                        className={`h-8 flex-1 rounded-lg bg-gradient-to-r ${grad} border-2 transition-all ${
                          selectedGradient === grad ? "border-white scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      ></button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPublisherOpen(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center gap-2 shadow-lg shadow-purple-600/20 hover:scale-105 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" /> Publish Thought
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 1: VISION BOARD PAGE */}
        {activeTab === "board" && (
          <div className="space-y-6">

            {/* Filter Pills */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                {["All", "Pinned", "Manifested", "Creative", "Career", "Travel", "Health", "Wealth", "Mindfulness"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      playSound("click");
                      setSelectedCategory(cat);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                        : "bg-slate-800/40 text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {cat === "All" && <Filter className="w-3.5 h-3.5" />}
                    {cat === "Pinned" && <Flame className="w-3.5 h-3.5 text-amber-400" />}
                    {cat === "Manifested" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    <span>{cat}</span>
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-400 font-medium">
                Showing {filteredThoughts.length} of {thoughts.length} thoughts
              </div>
            </div>

            {/* Grid of Published Vision Cards */}
            {filteredThoughts.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-800 rounded-3xl space-y-3">
                <Sparkles className="w-10 h-10 text-slate-600 mx-auto animate-bounce" />
                <h3 className="text-lg font-bold text-slate-300">No thoughts published in this category yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Click &quot;Publish New Thought&quot; or use the circular trigger dot to add your first vision to this board!
                </p>
                <button
                  onClick={() => setIsPublisherOpen(true)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 text-white shadow-lg"
                >
                  Publish Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredThoughts.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative rounded-3xl overflow-hidden border border-slate-800/80 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl flex flex-col justify-between ${
                      item.manifested ? "opacity-75 ring-1 ring-emerald-500/30" : ""
                    }`}
                  >
                    {/* Top Aesthetic Header Banner */}
                    <div className={`p-4 bg-gradient-to-r ${item.gradient} text-white flex items-center justify-between relative`}>
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-black/20 backdrop-blur-md">
                          {getCategoryIcon(item.category)}
                        </span>
                        <span className="text-xs font-bold tracking-wider uppercase">{item.category}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleTogglePin(item.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            item.isPinned ? "bg-amber-400 text-black" : "bg-black/20 text-white/70 hover:text-white"
                          }`}
                          title="Pin Thought"
                        >
                          <Flame className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteThought(item.id)}
                          className="p-1.5 rounded-lg bg-black/20 text-white/70 hover:text-red-300 hover:bg-black/40 transition-colors"
                          title="Delete Thought"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 bg-slate-900/90 backdrop-blur-md flex-1 flex flex-col justify-between space-y-4">
                      <p className={`text-base font-medium leading-relaxed ${item.manifested ? "line-through text-slate-400" : "text-slate-100"}`}>
                        &quot;{item.thought}&quot;
                      </p>

                      <div className="space-y-3 pt-2 border-t border-slate-800/60">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1 font-semibold text-purple-400">
                            ✨ {item.mood} Vibe
                          </span>
                          {item.targetDate && (
                            <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-[10px]">
                              Target: {item.targetDate}
                            </span>
                          )}
                        </div>

                        {/* Manifested Toggle Action */}
                        <button
                          onClick={() => handleToggleManifested(item.id)}
                          className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                            item.manifested
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                              : "bg-slate-800/80 text-slate-300 hover:bg-purple-600 hover:text-white border border-slate-700/50"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {item.manifested ? "Manifested! 🎉" : "Mark as Manifested"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: VISION INSIGHTS / ANALYTICS */}
        {activeTab === "analytics" && (
          <div className={`p-8 rounded-3xl border ${themeStyles.cardBg} space-y-8 animate-fadeIn`}>
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-purple-400" /> Vision Board Thought Insights
              </h3>
              <p className="text-xs text-slate-400 mt-1">Analytics on what you think about and what you manifest.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/40 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Total Published</span>
                <p className="text-3xl font-black text-white">{totalCount}</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/40 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Manifested Dreams</span>
                <p className="text-3xl font-black text-emerald-400">{manifestedCount}</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/40 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Pinned Visions</span>
                <p className="text-3xl font-black text-amber-400">{pinnedCount}</p>
              </div>
              <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/40 space-y-1">
                <span className="text-xs text-slate-400 font-semibold uppercase">Manifestation Rate</span>
                <p className="text-3xl font-black text-purple-400">{completionRate}%</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Manifestation Journey Progress</span>
                <span className="text-purple-400">{manifestedCount} / {totalCount} Completed</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RADIAL CONFIGURATOR / SANDBOX */}
        {activeTab === "configurator" && (
          <div className={`p-8 rounded-3xl border ${themeStyles.cardBg} space-y-8 animate-fadeIn`}>
            <div className="border-b border-slate-800 pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Settings className="w-5 h-5 text-purple-400" /> Circular Menu & Board Configurator
              </h3>
              <p className="text-xs text-slate-400 mt-1">Adjust trigonometry geometry, trigger positions, and orbit radius.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Radius Range */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Orbit Radius</span>
                  <span className="text-purple-400">{radius}px</span>
                </div>
                <input
                  type="range"
                  min="160"
                  max="320"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Arc Span */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Radial Fan Arc</span>
                  <span className="text-purple-400">{radialAngleSpan}°</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="270"
                  value={radialAngleSpan}
                  onChange={(e) => setRadialAngleSpan(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Pivot Position */}
              <div className="space-y-2">
                <label className="block text-xs font-bold">Trigger Anchor Pivot</label>
                <div className="flex gap-2">
                  {[
                    { id: "right-top", label: "Top" },
                    { id: "right-center", label: "Center" },
                    { id: "right-bottom", label: "Bottom" },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => {
                        setMenuPosition(pos.id as "right-center" | "right-top" | "right-bottom");
                        playSound("click");
                      }}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl border transition-all ${
                        menuPosition === pos.id
                          ? "bg-purple-600 text-white border-purple-500"
                          : "bg-slate-800/40 text-slate-400 border-slate-700/50 hover:bg-slate-800"
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={handleSpinMenu}
                disabled={isSpinning}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isSpinning ? "animate-spin" : ""}`} /> Spin Circular Menu 360°
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto px-6 py-6 border-t border-slate-800/60 z-10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 bg-slate-950/60 backdrop-blur-md">
        <p>MindVision Board — Interactive Next.js & Tailwind Experience</p>
        <div className="flex gap-4">
          <span className="text-purple-400 font-bold">Thought Publishing Active</span>
        </div>
      </footer>

      {/* =========================================================================
          CIRCULAR RADIAL MENU & SEMI-HIDDEN TRIGGER DOT OVERLAY
          ========================================================================= */}

      <div className={`fixed ${positionClasses[menuPosition]} z-50 transition-all duration-500`}>
        <div className="relative flex items-center justify-end">

          {/* Radial items fanning outward */}
          <div
            className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 ease-out"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: `translateY(-50%) scale(${isOpen ? 1 : 0.4})`,
            }}
          >
            {/* Orbit Path Guide */}
            {isOpen && (
              <div
                className="absolute border border-dashed border-purple-500/30 rounded-full pointer-events-none transition-all duration-500"
                style={{
                  width: `${radius * 2}px`,
                  height: `${radius * 2}px`,
                  right: `-${radius}px`,
                  top: `-${radius}px`,
                  transform: `rotate(${menuRotation}deg)`,
                }}
              ></div>
            )}

            {menuItems.map((item, idx) => {
              const { x, y } = getCoordinates(idx, menuItems.length);

              return (
                <div
                  key={item.id}
                  className="absolute transition-all duration-700 ease-out"
                  style={{
                    transform: isOpen
                      ? `translate(${x}px, ${y - 24}px) scale(1)`
                      : "translate(0px, -24px) scale(0)",
                    pointerEvents: isOpen ? "auto" : "none",
                    transitionDelay: isOpen ? `${idx * 40}ms` : "0ms",
                  }}
                  onMouseEnter={() => setActiveTooltip(item.id)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <div className="relative group/btn">
                    {/* Tooltip */}
                    <div
                      className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs shadow-2xl transition-all duration-300 w-48 pointer-events-none text-left z-50 ${
                        activeTooltip === item.id
                          ? "opacity-100 scale-100 translate-y-0"
                          : "opacity-0 scale-95 translate-y-1"
                      }`}
                    >
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {item.label}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-snug">{item.description}</p>
                    </div>

                    {/* Radial Button */}
                    <button
                      onClick={() => {
                        playSound("click");
                        item.action();
                      }}
                      className="w-12 h-12 rounded-full bg-slate-900 border border-purple-500/40 text-white flex items-center justify-center hover:scale-110 hover:bg-purple-600 hover:border-purple-400 transition-all shadow-xl"
                    >
                      {item.icon}
                    </button>

                    <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 text-[9px] font-bold tracking-wider uppercase text-slate-300 pointer-events-none whitespace-nowrap bg-slate-950/90 px-2 py-0.5 rounded-md border border-slate-800">
                      {item.label.split(" ")[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trigger Dot Button */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => {
              setDotHovered(true);
              if (!dotHovered) playSound("click");
            }}
            onMouseLeave={() => setDotHovered(false)}
          >
            {!isOpen && (
              <span className="absolute right-[-10px] w-20 h-20 rounded-full bg-purple-500 opacity-20 animate-ping pointer-events-none"></span>
            )}

            <button
              onClick={() => {
                if (isOpen) {
                  playSound("close");
                  setIsOpen(false);
                } else {
                  playSound("open");
                  setIsOpen(true);
                  confetti({
                    particleCount: 35,
                    spread: 50,
                    origin: { x: 0.98, y: 0.5 },
                  });
                }
              }}
              style={{
                transform: `translateX(${isOpen ? "-10px" : dotHovered ? "-5px" : "15px"})`,
              }}
              className="w-16 h-16 rounded-full border-2 border-purple-500/60 bg-slate-900 text-white transition-all duration-300 flex items-center justify-center shadow-2xl cursor-pointer relative z-50"
            >
              {isOpen ? (
                <X className="w-7 h-7 text-pink-400 hover:rotate-90 transition-transform" />
              ) : (
                <div className="relative flex items-center justify-center">
                  <Compass className="w-8 h-8 text-purple-400 animate-spin-slow" />
                  <Sparkles className="w-4 h-4 text-amber-400 absolute animate-pulse" />
                </div>
              )}
            </button>

            {!isOpen && (
              <div className="absolute right-24 mr-2 bg-slate-900/95 border border-purple-500/40 text-white px-3.5 py-2 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce whitespace-nowrap pointer-events-none text-xs backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
                Click trigger dot to control board!
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  );
}
