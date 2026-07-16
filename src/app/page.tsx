"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import {
  LayoutDashboard,
  BarChart3,
  Activity,
  Image as ImageIcon,
  Volume2,
  Settings,
  X,
  RefreshCw,
  Sun,
  Moon,
  Info,
  Compass,
  Sparkles,
  Layers
} from "lucide-react";

export default function CircularMenuDemo() {
  // State for toggling sections
  const [sections, setSections] = useState<{ [key: string]: boolean }>({
    hero: true,
    stats: true,
    activity: true,
    gallery: true,
    sound: true,
    settings: true,
  });

  // Circular Menu States
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<"right-center" | "right-top" | "right-bottom">("right-center");
  const [menuRotation, setMenuRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [dotHovered, setDotHovered] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light" | "cyberpunk">("dark");
  const [activeTab, setActiveTab] = useState<"dashboard" | "sandbox">("dashboard");

  // Interactive sandbox states
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [customTitle, setCustomTitle] = useState("Vaporwave Lounge");
  const [selectedColor, setSelectedColor] = useState("#a855f7"); // Purple
  const [radius, setRadius] = useState(240); // radius in pixels
  const [radialAngleSpan, setRadialAngleSpan] = useState(180); // angle span (semi-circle)
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Sound effects generator
  const playSound = (type: "click" | "toggle-on" | "toggle-off" | "open" | "close" | "spin") => {
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
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === "toggle-on") {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === "toggle-off") {
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      } else if (type === "open") {
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === "close") {
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === "spin") {
        // Sci-Fi sweep sound
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(1200, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // AudioContext fails if not interacted first, ignore.
    }
  };

  const handleToggleSection = (sectionId: string) => {
    const nextState = !sections[sectionId];
    setSections((prev) => ({ ...prev, [sectionId]: nextState }));
    playSound(nextState ? "toggle-on" : "toggle-off");

    // Confetti effect on toggling a section ON
    if (nextState) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { x: 0.9, y: 0.5 },
        colors: [selectedColor, "#3b82f6", "#10b981", "#f59e0b"],
      });
    }
  };

  const handleOpenCloseMenu = () => {
    if (isOpen) {
      playSound("close");
      setIsOpen(false);
    } else {
      playSound("open");
      setIsOpen(true);
      // Trigger subtle burst of particles near the dot
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { x: 0.98, y: menuPosition === "right-center" ? 0.5 : menuPosition === "right-top" ? 0.25 : 0.75 },
        colors: [selectedColor, "#f43f5e", "#06b6d4"],
      });
    }
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

  // Define the menu items/toggles
  const menuItems: { id: string; label: string; icon: React.ReactNode; color: string; description: string }[] = [
    {
      id: "hero",
      label: "Hero Panel",
      icon: <LayoutDashboard className="w-5 h-5" />,
      color: "from-pink-500 to-rose-500",
      description: "Main header & custom title welcome card",
    },
    {
      id: "stats",
      label: "Stats & KPIs",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "from-purple-500 to-indigo-500",
      description: "Interactive key performance indicator metrics",
    },
    {
      id: "activity",
      label: "Activity Feed",
      icon: <Activity className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
      description: "Real-time updates, log entries, and timelines",
    },
    {
      id: "gallery",
      label: "Media Grid",
      icon: <ImageIcon className="w-5 h-5" />,
      color: "from-emerald-500 to-teal-500",
      description: "Stunning generative grid card layout",
    },
    {
      id: "sound",
      label: "Sound Controls",
      icon: <Volume2 className="w-5 h-5" />,
      color: "from-amber-500 to-orange-500",
      description: "Atmospheric beats and sound fx configs",
    },
    {
      id: "settings",
      label: "Settings Control",
      icon: <Settings className="w-5 h-5" />,
      color: "from-fuchsia-500 to-pink-500",
      description: "Dynamic theme choices and advanced layout options",
    },
  ];

  // Helper to calculate circular positioning coordinates
  // Position is centered on the right edge of the screen, curving outward into the viewport.
  // Angle is measured in degrees. For right-side semicircle fanning into left,
  // 90 is straight up, 180 is straight left, 270 is straight down.
  const getCoordinates = (index: number, total: number) => {
    const angleRange = radialAngleSpan; // e.g. 180 deg
    const startAngle = 180 - angleRange / 2; // centered at 180 deg (facing directly left)
    const angleStep = total > 1 ? angleRange / (total - 1) : 0;
    const angleInDegrees = startAngle + index * angleStep + menuRotation;
    const angleInRadians = (angleInDegrees * Math.PI) / 180;

    // Calculate x & y offsets based on radius
    const x = Math.cos(angleInRadians) * radius;
    const y = Math.sin(angleInRadians) * radius;

    return { x, y };
  };

  // Determine positions classes based on user preferences
  const positionClasses = {
    "right-center": "top-1/2 -translate-y-1/2 right-0",
    "right-top": "top-24 right-0",
    "right-bottom": "bottom-24 right-0",
  };

  // Dynamic colors & styles based on chosen theme
  const getThemeStyles = () => {
    switch (theme) {
      case "cyberpunk":
        return {
          bg: "bg-zinc-950 text-yellow-400 border-yellow-500/30",
          cardBg: "bg-zinc-900/90 border border-yellow-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.15)]",
          badgeBg: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
          accentText: "text-yellow-400",
          buttonActive: "bg-yellow-500 text-black font-semibold",
          buttonInactive: "bg-zinc-800 text-zinc-400 hover:bg-zinc-700",
          dotRing: "ring-yellow-500/50 shadow-[0_0_20px_rgba(234,179,8,0.4)]",
          dotColor: "bg-yellow-500 text-black",
          gradientText: "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent",
        };
      case "light":
        return {
          bg: "bg-slate-50 text-slate-800 border-slate-200",
          cardBg: "bg-white/95 border border-slate-200 backdrop-blur-md shadow-xl",
          badgeBg: "bg-indigo-50 text-indigo-700 border border-indigo-100",
          accentText: "text-indigo-600",
          buttonActive: "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20",
          buttonInactive: "bg-slate-200 text-slate-600 hover:bg-slate-300",
          dotRing: "ring-indigo-500/30 shadow-[0_10px_30px_rgba(99,102,241,0.2)]",
          dotColor: "bg-indigo-600 text-white",
          gradientText: "bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent",
        };
      case "dark":
      default:
        return {
          bg: "bg-slate-950 text-slate-100 border-slate-800",
          cardBg: "bg-slate-900/80 border border-slate-800 backdrop-blur-lg shadow-2xl",
          badgeBg: "bg-violet-500/10 text-violet-400 border border-violet-500/20",
          accentText: "text-violet-400",
          buttonActive: "bg-violet-600 text-white shadow-lg shadow-violet-600/30",
          buttonInactive: "bg-slate-800 text-slate-400 hover:bg-slate-700",
          dotRing: "ring-violet-500/40 shadow-[0_0_30px_rgba(139,92,246,0.25)]",
          dotColor: "bg-violet-600 text-white",
          gradientText: "bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent",
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className={`min-h-screen transition-all duration-500 flex flex-col font-sans ${theme === "cyberpunk" ? "bg-black" : theme === "light" ? "bg-slate-50" : "bg-slate-950"} overflow-x-hidden relative`}>

      {/* Decorative Gradients for background aesthetics */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className={`absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-40 transition-all duration-700 ${theme === "cyberpunk" ? "bg-yellow-500/10" : theme === "light" ? "bg-indigo-200/50" : "bg-violet-700/20"}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full blur-[120px] opacity-40 transition-all duration-700 ${theme === "cyberpunk" ? "bg-pink-500/15" : theme === "light" ? "bg-fuchsia-200/50" : "bg-indigo-800/25"}`}></div>
      </div>

      {/* Main Header / Navigation */}
      <header className={`z-10 w-full px-6 py-4 flex items-center justify-between border-b ${themeStyles.bg} transition-colors duration-500`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white shadow-lg animate-pulse">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className={themeStyles.gradientText}>RadialPortal</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">v1.1</span>
            </h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">Advanced Circular Dynamic Layout Controller</p>
          </div>
        </div>

        {/* Global Controls & Mode Selector */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex bg-slate-800/50 p-0.5 rounded-lg border border-slate-700/40">
            <button
              onClick={() => { playSound("click"); setActiveTab("dashboard"); }}
              className={`px-3 py-1.5 text-xs rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === "dashboard" ? "bg-violet-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portal Page</span>
            </button>
            <button
              onClick={() => { playSound("click"); setActiveTab("sandbox"); }}
              className={`px-3 py-1.5 text-xs rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === "sandbox" ? "bg-violet-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Radial Configurator</span>
            </button>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => { playSound("click"); setTheme("light"); }}
              className={`p-2 rounded-lg transition-colors ${theme === "light" ? "bg-indigo-600 text-white" : "bg-slate-800/40 text-slate-400 hover:text-slate-200"}`}
              title="Light Theme"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => { playSound("click"); setTheme("dark"); }}
              className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "bg-violet-600 text-white" : "bg-slate-800/40 text-slate-400 hover:text-slate-200"}`}
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

        {/* Banner with interactive guides */}
        <div className={`p-6 rounded-2xl relative overflow-hidden ${themeStyles.cardBg} transition-all duration-500`}>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <Compass className="w-48 h-48 rotate-45 text-white" />
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${themeStyles.badgeBg} inline-flex items-center gap-1.5`}>
                <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
                Next.js & Tailwind Experience
              </span>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                Unlock the <span className={themeStyles.gradientText}>Circular Portal</span> Menu
              </h2>
              <p className="text-sm text-slate-400 max-w-xl">
                On the right side of the screen sits a semi-hidden dot trigger. Click it to reveal a beautiful circular radial console. Toggle the menu choices below, or control the whole screen layout interactively!
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="text-center bg-slate-800/40 border border-slate-700/30 px-4 py-2 rounded-xl">
                <span className="block text-xl font-bold text-violet-400">
                  {Object.values(sections).filter(Boolean).length} / {Object.keys(sections).length}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Active Panels</span>
              </div>
              <button
                onClick={handleOpenCloseMenu}
                className={`px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  isOpen ? "bg-red-500 text-white hover:bg-red-600" : themeStyles.buttonActive
                }`}
              >
                {isOpen ? (
                  <>
                    <X className="w-4 h-4" /> Close Menu
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Trigger Dot Menu
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {activeTab === "dashboard" ? (
          /* ===================================
             PORTAL PAGE MODE (Main Interactive Dashboard)
             =================================== */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-500">

            {/* HERO SECTION */}
            {sections.hero ? (
              <div className={`col-span-1 md:col-span-2 lg:col-span-3 group relative overflow-hidden rounded-2xl border transition-all duration-500 ${themeStyles.cardBg} hover:shadow-2xl`}>
                <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-violet-600/10 to-transparent pointer-events-none"></div>
                <div className="p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-500 border border-pink-500/20">
                        <LayoutDashboard className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-semibold tracking-wide text-pink-500">HERO PANEL</span>
                    </div>
                    <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                      Welcome to the <span className="bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent">{customTitle}</span>
                    </h3>
                    <p className="text-slate-400 max-w-2xl text-sm sm:text-base leading-relaxed">
                      You have full command of this screen space. By clicking the radial menu items, you can toggle this panel, add new data elements, adjust sound waves, and spin the entire menu sphere. Try toggling items off and watch the page layout adapt gracefully!
                    </p>
                  </div>
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/30 flex items-center gap-4 self-stretch md:self-auto justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase">Theme Active</p>
                      <p className="text-sm font-bold text-white capitalize">{theme}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 font-bold">
                      {theme === "light" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                    </div>
                  </div>
                </div>
                {/* Visual design footer */}
                <div className="bg-slate-800/20 border-t border-slate-800/60 px-8 py-3 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Component ID: section_hero</span>
                  <button
                    onClick={() => handleToggleSection("hero")}
                    className="text-pink-400 hover:text-pink-300 flex items-center gap-1 hover:underline"
                  >
                    Hide Panel <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : null}

            {/* STATS SECTION */}
            {sections.stats ? (
              <div className={`col-span-1 lg:col-span-2 rounded-2xl p-6 border transition-all duration-500 ${themeStyles.cardBg}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                      <BarChart3 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">System Metrics</h4>
                      <p className="text-xs text-slate-400">Live system performance counters</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleSection("stats")}
                    className="p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Active Threads", val: "42", change: "+12.4%", trend: "up", col: "text-emerald-400" },
                    { label: "Memory Util", val: "64.2%", change: "-2.1%", trend: "down", col: "text-blue-400" },
                    { label: "Response Delay", val: "12ms", change: "Stable", trend: "stable", col: "text-purple-400" },
                  ].map((stat, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/20 hover:border-violet-500/30 transition-all group">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 group-hover:text-violet-400 transition-colors">{stat.label}</span>
                      <p className="text-2xl font-black mt-1">{stat.val}</p>
                      <span className={`text-[10px] font-semibold flex items-center gap-1 mt-2 ${stat.trend === "up" ? "text-emerald-400" : stat.trend === "down" ? "text-red-400" : "text-slate-400"}`}>
                        {stat.trend === "up" && "▲"} {stat.trend === "down" && "▼"} {stat.change}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Micro chart animation display */}
                <div className="mt-6 p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-end justify-between h-20 gap-1.5">
                  {[45, 60, 55, 75, 40, 30, 85, 95, 65, 55, 70, 80, 50, 60, 90].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`w-full rounded-sm bg-gradient-to-t from-purple-600 to-indigo-400 hover:brightness-125 transition-all duration-300 cursor-pointer relative`}
                      title={`Metric value: ${h}`}
                    ></div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* SOUND WAVE/ATMOSPHERE PANEL */}
            {sections.sound ? (
              <div className={`col-span-1 rounded-2xl p-6 border transition-all duration-500 ${themeStyles.cardBg} flex flex-col justify-between`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Volume2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Sound & Vibe</h4>
                        <p className="text-xs text-slate-400">Control browser audio context</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleSection("sound")}
                      className="p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400">
                    Interact with UI buttons to generate synthesised tone-sweeps dynamically. Enable/disable feedback sounds.
                  </p>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-3 rounded-xl bg-slate-800/30 border border-slate-700/20 cursor-pointer hover:bg-slate-800/50 transition-all">
                      <span className="text-xs font-semibold">Master Audio Feedback</span>
                      <input
                        type="checkbox"
                        checked={soundEnabled}
                        onChange={(e) => {
                          setSoundEnabled(e.target.checked);
                          if(e.target.checked) playSound("toggle-on");
                        }}
                        className="sr-only peer"
                      />
                      <div className="relative w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>

                    <div className="flex gap-2">
                      <button
                        onClick={() => playSound("click")}
                        className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700/40"
                      >
                        Test Click Tone
                      </button>
                      <button
                        onClick={() => playSound("spin")}
                        className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700/40"
                      >
                        Sci-Fi Sweep
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <span
                        key={i}
                        className={`w-1 h-4 rounded-full bg-amber-500 transition-all duration-300 ${soundEnabled ? "animate-bounce" : "opacity-30"}`}
                        style={{ animationDelay: `${i * 150}ms` }}
                      ></span>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Audio Web Synthesiser</span>
                </div>
              </div>
            ) : null}

            {/* ACTIVITY FEED */}
            {sections.activity ? (
              <div className={`col-span-1 rounded-2xl p-6 border transition-all duration-500 ${themeStyles.cardBg} flex flex-col justify-between`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Activity Pulse</h4>
                        <p className="text-xs text-slate-400">Recent trigger events</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleSection("activity")}
                      className="p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 mt-4">
                    {[
                      { msg: "Opened radial dashboard console", time: "Just now", badge: "PORTAL" },
                      { msg: "Modified color values to customized violet", time: "2m ago", badge: "THEME" },
                      { msg: "Toggled Hero Header component space", time: "5m ago", badge: "LAYOUT" },
                    ].map((act, i) => (
                      <div key={i} className="flex gap-3 text-xs leading-relaxed border-l-2 border-blue-500/30 pl-3 py-0.5">
                        <div className="flex-1">
                          <p className="text-slate-200 font-medium">{act.msg}</p>
                          <span className="text-[10px] text-slate-400">{act.time}</span>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 h-fit rounded bg-blue-500/10 text-blue-400 uppercase tracking-wide border border-blue-500/15">{act.badge}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Component: section_activity</span>
                  <span className="text-emerald-400 flex items-center gap-1">🟢 Connected</span>
                </div>
              </div>
            ) : null}

            {/* MEDIA GALLERY SECTION */}
            {sections.gallery ? (
              <div className={`col-span-1 md:col-span-2 rounded-2xl p-6 border transition-all duration-500 ${themeStyles.cardBg} flex flex-col justify-between`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Interactive Art Matrix</h4>
                        <p className="text-xs text-slate-400">Click to run interactive spark particles</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleSection("gallery")}
                      className="p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    {[
                      { title: "Retro Neon", gradient: "from-pink-500 via-purple-500 to-indigo-500" },
                      { title: "Sunset Waves", gradient: "from-orange-500 to-amber-400" },
                      { title: "Acid Matrix", gradient: "from-emerald-400 to-teal-600" },
                      { title: "Northern Aura", gradient: "from-blue-600 to-emerald-400" },
                    ].map((art, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          playSound("click");
                          confetti({
                            particleCount: 40,
                            angle: 60 + i * 20,
                            spread: 55,
                            origin: { x: 0.5, y: 0.5 }
                          });
                        }}
                        className="group relative h-28 rounded-xl overflow-hidden cursor-pointer border border-slate-800/80 hover:border-violet-500/50 transition-all"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${art.gradient} opacity-70 group-hover:opacity-100 transition-opacity duration-300`}></div>
                        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all"></div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <p className="text-[11px] font-bold text-white tracking-wide truncate shadow-sm drop-shadow">{art.title}</p>
                          <span className="text-[8px] text-white/80 block">Click for Confetti</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5" /> Generative Dynamic Card</span>
                  <span className="text-[10px] text-slate-500">CANVAS-CONFETTI</span>
                </div>
              </div>
            ) : null}

            {/* SETTINGS / CONFIG PANEL */}
            {sections.settings ? (
              <div className={`col-span-1 rounded-2xl p-6 border transition-all duration-500 ${themeStyles.cardBg} flex flex-col justify-between`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20">
                        <Settings className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Menu Customizer</h4>
                        <p className="text-xs text-slate-400">Modify design in real-time</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleSection("settings")}
                      className="p-1.5 rounded-lg hover:bg-slate-800/60 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3 text-xs mt-4">
                    <div>
                      <label className="block text-[11px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">Custom Header Title</label>
                      <input
                        type="text"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-800/40 rounded-lg border border-slate-700/50 text-white text-xs focus:ring-1 focus:ring-violet-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">Accent Theme Glow</label>
                      <div className="flex gap-2">
                        {[
                          { name: "Purple", hex: "#a855f7" },
                          { name: "Pink", hex: "#ec4899" },
                          { name: "Blue", hex: "#3b82f6" },
                          { name: "Emerald", hex: "#10b981" },
                          { name: "Amber", hex: "#f59e0b" },
                        ].map((col) => (
                          <button
                            key={col.hex}
                            onClick={() => {
                              setSelectedColor(col.hex);
                              playSound("click");
                            }}
                            style={{ backgroundColor: col.hex }}
                            className={`w-6 h-6 rounded-full transition-all border ${selectedColor === col.hex ? "scale-125 border-white ring-2 ring-violet-500/50" : "border-transparent opacity-60 hover:opacity-100"}`}
                            title={col.name}
                          ></button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Custom values are live compiled</span>
                  <span className="text-[10px] font-bold text-fuchsia-400">REACT STATE</span>
                </div>
              </div>
            ) : null}

          </div>
        ) : (
          /* ===================================
             SANDBOX MODE (Radial Configurator Sandbox)
             =================================== */
          <div className={`p-8 rounded-2xl border transition-all duration-500 ${themeStyles.cardBg} space-y-8`}>
            <div className="border-b border-slate-800/60 pb-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Compass className="w-5 h-5 text-violet-400" /> Radial Portal Lab Configurations
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Customize structural trigonometry of the radial menu, select display radius, fan angles, spin metrics, and positioning pivot coordinates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">

              {/* Radius Configuration */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-200">Orbit Radius (Pixels)</label>
                  <span className="px-2 py-0.5 bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs rounded font-mono font-bold">{radius}px</span>
                </div>
                <input
                  type="range"
                  min="160"
                  max="350"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Calculates absolute geometric distance offset from the right boundary trigger center point. Bigger radius spaces icons further apart.
                </p>
              </div>

              {/* Angle Span Configuration */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-200">Radial Angular Arc</label>
                  <span className="px-2 py-0.5 bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs rounded font-mono font-bold">{radialAngleSpan}°</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="270"
                  value={radialAngleSpan}
                  onChange={(e) => setRadialAngleSpan(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500"
                />
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Defines trigonometry fan range. 180° creates a gorgeous perfect semi-circle facing left. 90° is tighter. 270° wraps deeper into the viewport.
                </p>
              </div>

              {/* Pivot Position */}
              <div className="space-y-2.5">
                <label className="block font-bold text-slate-200">Trigger Pivot Location</label>
                <div className="flex gap-2">
                  {[
                    { id: "right-top", label: "Top-Right Corner" },
                    { id: "right-center", label: "Center-Right Side" },
                    { id: "right-bottom", label: "Bottom-Right Corner" },
                  ].map((pos) => (
                    <button
                      key={pos.id}
                      onClick={() => {
                        setMenuPosition(pos.id as "right-center" | "right-top" | "right-bottom");
                        playSound("click");
                      }}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                        menuPosition === pos.id
                          ? "bg-violet-600 text-white border-violet-500"
                          : "bg-slate-800/40 text-slate-400 border-slate-700/50 hover:bg-slate-800"
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Changes anchor alignment of the semi-hidden trigger dot along the right side edge of your viewport.
                </p>
              </div>

              {/* Angle Rotation Indicator */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-slate-200">Angular Spin Offset</label>
                  <span className="px-2 py-0.5 bg-violet-500/10 text-violet-400 border border-violet-500/20 text-xs rounded font-mono font-bold">{menuRotation}°</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setMenuRotation((prev) => prev - 45);
                      playSound("click");
                    }}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded text-slate-300 border border-slate-700/40"
                  >
                    -45° Rotate
                  </button>
                  <button
                    onClick={() => {
                      setMenuRotation((prev) => prev + 45);
                      playSound("click");
                    }}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded text-slate-300 border border-slate-700/40"
                  >
                    +45° Rotate
                  </button>
                  <button
                    onClick={() => {
                      setMenuRotation(0);
                      playSound("click");
                    }}
                    className="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-xs rounded text-red-400 border border-red-500/20"
                  >
                    Reset Angle
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Triggers mathematical orientation offsets. Useful for adjusting layout rotation styles dynamically!
                </p>
              </div>

              {/* Extra interactions */}
              <div className="space-y-2.5">
                <label className="block font-bold text-slate-200">Interactive Animations</label>
                <div className="flex gap-2">
                  <button
                    onClick={handleSpinMenu}
                    disabled={isSpinning}
                    className="flex-1 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSpinning ? "animate-spin" : ""}`} /> Spin Menu 360°
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Triggers full 360-degree radial rotational sweep with an integrated synth audio sound frequency.
                </p>
              </div>

              {/* Interactive Info */}
              <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 flex items-start gap-3">
                <Info className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="text-xs font-bold text-slate-200">Trigonometry Formula Used</h5>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    X = cos(angle_rad) × radius<br />
                    Y = sin(angle_rad) × radius<br />
                    All nodes are absolutely positioned relative to the screen edge dot, creating pixel perfect concentric paths!
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer information */}
      <footer className="mt-auto px-6 py-6 border-t border-slate-800/60 z-10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 bg-slate-950/60 backdrop-blur-md">
        <p className="text-center sm:text-left">
          Crafted with Next.js App Router, Tailwind CSS, and HTML5 Audio API.
        </p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Documentation</a>
          <span>•</span>
          <a href="#" className="hover:text-white transition-colors">Lab Controls</a>
          <span>•</span>
          <span className="text-violet-400 font-bold">Interactive Experience</span>
        </div>
      </footer>

      {/* =========================================================================
          CIRCULAR RADIAL MENU & SEMI-HIDDEN DOT OVERLAY ON THE RIGHT SIDE
          ========================================================================= */}

      {/* Anchor container positioned dynamically along the right edge */}
      <div className={`fixed ${positionClasses[menuPosition]} z-50 transition-all duration-500`}>

        {/* Semi-hidden dot / large trigger button */}
        {/* It is styled to sit partially hidden on the right screen boundary, pulsing to get attention */}
        <div className="relative flex items-center justify-end">

          {/* Expanded Circular Menu overlay */}
          {/* This wrapper holds absolutely positioned circular children fanning outward from the center point */}
          <div
            className={`absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 ease-out`}
            style={{
              opacity: isOpen ? 1 : 0,
              transform: `translateY(-50%) scale(${isOpen ? 1 : 0.4})`,
            }}
          >
            {/* The circular backing graphic representing the orbit path */}
            {isOpen && (
              <div
                className="absolute border border-dashed rounded-full pointer-events-none transition-all duration-500"
                style={{
                  width: `${radius * 2}px`,
                  height: `${radius * 2}px`,
                  right: `-${radius}px`,
                  top: `-${radius}px`,
                  borderColor: `${selectedColor}40`,
                  transform: `rotate(${menuRotation}deg)`,
                  transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s",
                }}
              >
                {/* Visual pulse ring inside the orbit backing path */}
                <div className="absolute inset-4 border border-slate-800/60 rounded-full"></div>
                <div className="absolute inset-16 border border-slate-800/30 rounded-full"></div>
              </div>
            )}

            {/* Menu Items fanning outward */}
            {menuItems.map((item, idx) => {
              const { x, y } = getCoordinates(idx, menuItems.length);
              const isActive = sections[item.id];

              return (
                <div
                  key={item.id}
                  className="absolute transition-all duration-700 ease-out"
                  style={{
                    transform: isOpen
                      ? `translate(${x}px, ${y - 24}px) scale(1)`
                      : "translate(0px, -24px) scale(0)",
                    pointerEvents: isOpen ? "auto" : "none",
                    // Stagger the animation of items coming in
                    transitionDelay: isOpen ? `${idx * 40}ms` : "0ms",
                    transitionProperty: "transform, opacity, scale",
                  }}
                  onMouseEnter={() => {
                    setActiveTooltip(item.id);
                  }}
                  onMouseLeave={() => {
                    setActiveTooltip(null);
                  }}
                >
                  <div className="relative group/btn">

                    {/* Tooltip description */}
                    <div
                      className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs shadow-2xl transition-all duration-300 w-52 pointer-events-none text-left z-50 ${
                        activeTooltip === item.id
                          ? "opacity-100 scale-100 translate-y-0"
                          : "opacity-0 scale-95 translate-y-1"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        <span className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-400" : "bg-red-400"}`}></span>
                        {item.label}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 leading-normal">{item.description}</p>
                      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800 text-[9px] uppercase font-bold tracking-wider">
                        <span className={isActive ? "text-emerald-400" : "text-slate-500"}>
                          {isActive ? "ON" : "OFF"}
                        </span>
                        <span className="text-slate-500">Toggle</span>
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-slate-900"></div>
                    </div>

                    {/* Circular Button */}
                    <button
                      onClick={() => handleToggleSection(item.id)}
                      style={{
                        boxShadow: isActive
                          ? `0 0 20px ${selectedColor}40, inset 0 2px 4px rgba(255,255,255,0.1)`
                          : "none",
                        borderColor: isActive ? selectedColor : "rgba(255, 255, 255, 0.08)"
                      }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all border ${
                        isActive
                          ? `bg-slate-900 text-white`
                          : "bg-slate-950 text-slate-500 hover:text-slate-300 hover:border-slate-700"
                      } relative overflow-hidden`}
                    >
                      {/* Active glowing color ring inside button */}
                      {isActive && (
                        <div
                          className="absolute inset-0 opacity-10 animate-pulse pointer-events-none"
                          style={{ backgroundColor: selectedColor }}
                        ></div>
                      )}

                      <div className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover/btn:scale-110"}`}>
                        {item.icon}
                      </div>

                      {/* Small green status dot on button if active */}
                      {isActive && (
                        <span
                          style={{ backgroundColor: selectedColor }}
                          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full animate-ping"
                        ></span>
                      )}
                    </button>

                    {/* Label hanging below the button (fade in on hover or if open) */}
                    <span className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-wider uppercase text-slate-400 group-hover/btn:text-white transition-colors pointer-events-none whitespace-nowrap bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800/40 backdrop-blur-sm">
                      {item.label.split(" ")[0]}
                    </span>

                  </div>
                </div>
              );
            })}

          </div>

          {/* LARGE SEMI-HIDDEN DOT TRIGGER BUTTON */}
          {/* This sits right on the edge of the screen.
              By default (idle), it's semi-transparent, large, and partially sticking off-screen.
              On hover, it slides out slightly and increases opacity.
              Upon click, it glows beautifully and reveals/hides the circular system. */}
          <div
            className="relative flex items-center"
            onMouseEnter={() => {
              setDotHovered(true);
              // play subtle feedback clicking sound on initial hover
              if(!dotHovered) playSound("click");
            }}
            onMouseLeave={() => setDotHovered(false)}
          >
            {/* Visual Ripple effect behind the dot when idle */}
            {!isOpen && (
              <span
                style={{ borderColor: selectedColor }}
                className="absolute right-[-15px] w-24 h-24 rounded-full border border-dashed opacity-25 animate-spin-slow pointer-events-none"
              ></span>
            )}

            {/* Pulsing trigger wave */}
            {!isOpen && (
              <span
                style={{ backgroundColor: selectedColor }}
                className="absolute right-[-10px] w-20 h-20 rounded-full opacity-10 animate-ping pointer-events-none"
              ></span>
            )}

            {/* The primary trigger button */}
            <button
              onClick={handleOpenCloseMenu}
              style={{
                boxShadow: isOpen
                  ? `0 0 35px ${selectedColor}60`
                  : dotHovered
                    ? `0 0 25px ${selectedColor}45`
                    : "none",
                backgroundColor: isOpen ? "#0f172a" : "#1e293b",
                borderColor: isOpen ? selectedColor : "rgba(255, 255, 255, 0.15)",
                transform: `translateX(${isOpen ? "-10px" : dotHovered ? "-5px" : "15px"})`, // partially offscreen when closed
              }}
              className={`w-16 h-16 rounded-full border-2 transition-all duration-300 ease-out flex items-center justify-center cursor-pointer relative z-50`}
            >
              {/* Inner animated spinning visual */}
              <div
                className={`absolute inset-1 rounded-full border border-dashed transition-all duration-700 pointer-events-none ${
                  isOpen ? "animate-spin-slow" : "opacity-30"
                }`}
                style={{ borderColor: selectedColor }}
              ></div>

              {/* Dynamic Icon Center Indicator */}
              <div className="text-white flex items-center justify-center transition-transform duration-500">
                {isOpen ? (
                  <X
                    className="w-7 h-7 text-red-400 hover:rotate-90 transition-transform duration-300"
                    style={{ color: selectedColor }}
                  />
                ) : (
                  <div className="relative flex items-center justify-center">
                    <Compass
                      className="w-8 h-8 text-slate-300 animate-spin-slow"
                      style={{ color: dotHovered ? selectedColor : "currentColor" }}
                    />
                    <Sparkles className="w-4.5 h-4.5 text-yellow-400 absolute animate-pulse" />
                  </div>
                )}
              </div>

              {/* Little dynamic indicator light on the trigger itself */}
              <span
                style={{ backgroundColor: isOpen ? selectedColor : "#ef4444" }}
                className="absolute top-1 right-1 w-3 h-3 rounded-full border border-slate-900 animate-pulse"
              ></span>
            </button>

            {/* Help Bubble overlaying next to the trigger dot to guide the user on first interaction */}
            {!isOpen && (
              <div className="absolute right-24 mr-2 bg-slate-900/95 border border-slate-800 text-white px-3.5 py-2 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce whitespace-nowrap pointer-events-none text-xs backdrop-blur-md">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
                </span>
                Click trigger dot to control dashboard!
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
}
