"use client";

import React, { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import {
  Sparkles,
  PlusCircle,
  CheckCircle2,
  Trash2,
  Volume2,
  Compass,
  X,
  Sun,
  Moon,
  Zap,
  Heart,
  Briefcase,
  Plane,
  Palette,
  Lightbulb,
  DollarSign,
  Send,
  RefreshCw,
  Link as LinkIcon,
  MousePointer,
  Move
} from "lucide-react";

interface VisionNode {
  id: string;
  thought: string;
  category: "Career" | "Travel" | "Health" | "Creative" | "Wealth" | "Mindfulness";
  mood: "Inspired" | "Calm" | "Energetic" | "Focused" | "Ambitious";
  manifested: boolean;
  x: number;
  y: number;
  gradient: string;
}

interface Connection {
  id: string;
  fromId: string;
  toId: string;
  label: string;
}

const DEFAULT_GRADIENTS = [
  "from-purple-600 to-indigo-600",
  "from-pink-500 to-rose-600",
  "from-emerald-500 to-teal-700",
  "from-amber-500 to-orange-600",
  "from-blue-600 to-cyan-500",
  "from-fuchsia-600 to-pink-500",
];

const INITIAL_NODES: VisionNode[] = [
  {
    id: "node-1",
    thought: "Build an AI creative tool to empower indie founders.",
    category: "Creative",
    mood: "Inspired",
    manifested: false,
    x: 100,
    y: 120,
    gradient: "from-purple-600 to-indigo-600",
  },
  {
    id: "node-2",
    thought: "Achieve financial freedom to fund creative dreams.",
    category: "Wealth",
    mood: "Ambitious",
    manifested: true,
    x: 520,
    y: 120,
    gradient: "from-emerald-500 to-teal-700",
  },
  {
    id: "node-3",
    thought: "Travel to Kyoto during cherry blossom season.",
    category: "Travel",
    mood: "Calm",
    manifested: false,
    x: 310,
    y: 360,
    gradient: "from-pink-500 to-rose-600",
  },
];

const INITIAL_CONNECTIONS: Connection[] = [
  {
    id: "conn-1",
    fromId: "node-1",
    toId: "node-2",
    label: "Generates Income",
  },
  {
    id: "conn-2",
    fromId: "node-2",
    toId: "node-3",
    label: "Funds Trip To",
  },
];

export default function DotSpaceVisionBoard() {
  const [nodes, setNodes] = useState<VisionNode[]>(INITIAL_NODES);
  const [connections, setConnections] = useState<Connection[]>(INITIAL_CONNECTIONS);

  // Interaction mode: "drag" or "connect"
  const [mode, setMode] = useState<"drag" | "connect">("drag");
  const [connectStartNodeId, setConnectStartNodeId] = useState<string | null>(null);

  // Modal / Form state for new node
  const [isPublisherOpen, setIsPublisherOpen] = useState(false);
  const [newThoughtText, setNewThoughtText] = useState("");
  const [newCategory, setNewCategory] = useState<VisionNode["category"]>("Creative");
  const [newMood, setNewMood] = useState<VisionNode["mood"]>("Inspired");
  const [selectedGradient, setSelectedGradient] = useState(DEFAULT_GRADIENTS[0]);

  // Modal for new connection label
  const [pendingConnection, setPendingConnection] = useState<{ fromId: string; toId: string } | null>(null);
  const [connectionLabel, setConnectionLabel] = useState("");

  // Canvas Dragging State
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Radial Menu States
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<"right-center" | "right-top" | "right-bottom">("right-center");
  const [menuRotation, setMenuRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light" | "cyberpunk">("dark");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [radius, setRadius] = useState(220);
  const [radialAngleSpan, setRadialAngleSpan] = useState(180);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Local storage persistence
  useEffect(() => {
    try {
      const savedNodes = localStorage.getItem("dot_space_nodes");
      const savedConns = localStorage.getItem("dot_space_connections");
      if (savedNodes) {
        Promise.resolve().then(() => setNodes(JSON.parse(savedNodes)));
      }
      if (savedConns) {
        Promise.resolve().then(() => setConnections(JSON.parse(savedConns)));
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("dot_space_nodes", JSON.stringify(nodes));
      localStorage.setItem("dot_space_connections", JSON.stringify(connections));
    } catch {
      // Ignore storage errors
    }
  }, [nodes, connections]);

  // Web Audio Synthesizer sound generator
  const playSound = (type: "click" | "publish" | "manifest" | "connect" | "open" | "close" | "spin") => {
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
      } else if (type === "publish" || type === "connect") {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(850, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === "manifest") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else if (type === "open") {
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
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
      // Ignore AudioContext errors
    }
  };

  // Node Drag Handlers
  const handleMouseDownNode = (e: React.MouseEvent, id: string) => {
    if (mode === "connect") {
      if (!connectStartNodeId) {
        setConnectStartNodeId(id);
        playSound("click");
      } else if (connectStartNodeId !== id) {
        // Create connection
        setPendingConnection({ fromId: connectStartNodeId, toId: id });
        setConnectStartNodeId(null);
        playSound("click");
      } else {
        setConnectStartNodeId(null);
      }
      return;
    }

    // Drag mode
    e.stopPropagation();
    setDraggingNodeId(id);
    const node = nodes.find((n) => n.id === id);
    if (node && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left - node.x,
        y: e.clientY - rect.top - node.y,
      });
    }
  };

  const handleMouseMoveCanvas = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = Math.max(20, Math.min(rect.width - 280, e.clientX - rect.left - dragOffset.x));
    const newY = Math.max(20, Math.min(rect.height - 180, e.clientY - rect.top - dragOffset.y));

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
    );
  };

  const handleMouseUpCanvas = () => {
    if (draggingNodeId) {
      setDraggingNodeId(null);
    }
  };

  const handleCreateConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingConnection) return;

    const newConn: Connection = {
      id: `conn-${Date.now()}`,
      fromId: pendingConnection.fromId,
      toId: pendingConnection.toId,
      label: connectionLabel.trim() || "connects to",
    };

    setConnections([...connections, newConn]);
    setPendingConnection(null);
    setConnectionLabel("");
    playSound("connect");
  };

  const handleDeleteConnection = (id: string) => {
    playSound("click");
    setConnections((prev) => prev.filter((c) => c.id !== id));
  };

  const handleDeleteNode = (id: string) => {
    playSound("click");
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setConnections((prev) => prev.filter((c) => c.fromId !== id && c.toId !== id));
  };

  const handleToggleManifested = (id: string) => {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          const nextState = !n.manifested;
          if (nextState) {
            playSound("manifest");
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.5 },
            });
          } else {
            playSound("click");
          }
          return { ...n, manifested: nextState };
        }
        return n;
      })
    );
  };

  const handlePublishThought = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThoughtText.trim()) return;

    // Place new node with random offset near top-center
    const newNode: VisionNode = {
      id: `node-${Date.now()}`,
      thought: newThoughtText.trim(),
      category: newCategory,
      mood: newMood,
      manifested: false,
      x: 180 + Math.random() * 200,
      y: 100 + Math.random() * 150,
      gradient: selectedGradient,
    };

    setNodes([...nodes, newNode]);
    setNewThoughtText("");
    setIsPublisherOpen(false);
    playSound("publish");

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
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
  const getCategoryIcon = (cat: VisionNode["category"]) => {
    switch (cat) {
      case "Career":
        return <Briefcase className="w-3.5 h-3.5" />;
      case "Travel":
        return <Plane className="w-3.5 h-3.5" />;
      case "Health":
        return <Heart className="w-3.5 h-3.5" />;
      case "Creative":
        return <Palette className="w-3.5 h-3.5" />;
      case "Wealth":
        return <DollarSign className="w-3.5 h-3.5" />;
      case "Mindfulness":
        return <Lightbulb className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  // Radial Trigonometry Calculation
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

  // Radial Menu Actions
  const menuItems = [
    {
      id: "publish",
      label: "Add Vision Node",
      icon: <PlusCircle className="w-5 h-5" />,
      description: "Place a new thought card onto the dot space canvas",
      action: () => setIsPublisherOpen(true),
    },
    {
      id: "mode_drag",
      label: "Move Mode",
      icon: <Move className="w-5 h-5" />,
      description: "Drag and position vision nodes freely across the dots",
      action: () => setMode("drag"),
    },
    {
      id: "mode_connect",
      label: "Connect Mode",
      icon: <LinkIcon className="w-5 h-5" />,
      description: "Click any two vision cards to draw labelled arrow connections",
      action: () => {
        setMode("connect");
        setConnectStartNodeId(null);
      },
    },
    {
      id: "sound_toggle",
      label: soundEnabled ? "Mute Sound" : "Enable Sound",
      icon: <Volume2 className="w-5 h-5" />,
      description: soundEnabled ? "Disable UI feedback audio" : "Enable UI feedback audio",
      action: () => setSoundEnabled(!soundEnabled),
    },
    {
      id: "spin_menu",
      label: "Spin Orbit",
      icon: <RefreshCw className="w-5 h-5" />,
      description: "Perform 360 degree rotational sweep",
      action: handleSpinMenu,
    },
  ];

  const positionClasses = {
    "right-center": "top-1/2 -translate-y-1/2 right-0",
    "right-top": "top-28 right-0",
    "right-bottom": "bottom-28 right-0",
  };

  const getThemeStyles = () => {
    switch (theme) {
      case "cyberpunk":
        return {
          bg: "bg-black text-yellow-400",
          cardBg: "bg-zinc-900/90 border border-yellow-500/40 backdrop-blur-md shadow-[0_0_15px_rgba(234,179,8,0.15)]",
          dotColor: "rgba(234, 179, 8, 0.25)",
          gradientText: "bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent",
        };
      case "light":
        return {
          bg: "bg-slate-100 text-slate-800",
          cardBg: "bg-white/95 border border-slate-200 backdrop-blur-md shadow-xl",
          dotColor: "rgba(100, 116, 139, 0.3)",
          gradientText: "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent",
        };
      case "dark":
      default:
        return {
          bg: "bg-slate-950 text-slate-100",
          cardBg: "bg-slate-900/90 border border-slate-800 backdrop-blur-lg shadow-2xl",
          dotColor: "rgba(148, 163, 184, 0.2)",
          gradientText: "bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent",
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className={`min-h-screen transition-all duration-500 flex flex-col font-sans ${themeStyles.bg} overflow-hidden relative select-none`}>

      {/* Header */}
      <header className="z-20 w-full px-6 py-4 flex items-center justify-between border-b border-slate-800/80 backdrop-blur-md bg-slate-950/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <span className={themeStyles.gradientText}>DotSpace Vision Board</span>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/20">
                Connected Mind Space
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">Place vision thoughts on a blank dot space and connect them with labeled arrows</p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
            <button
              onClick={() => { playSound("click"); setMode("drag"); }}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 font-semibold ${
                mode === "drag" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <MousePointer className="w-3.5 h-3.5" /> Move Cards
            </button>
            <button
              onClick={() => {
                playSound("click");
                setMode("connect");
                setConnectStartNodeId(null);
              }}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all flex items-center gap-1.5 font-semibold ${
                mode === "connect" ? "bg-purple-600 text-white shadow-md" : "text-slate-400 hover:text-white"
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" /> Connect Arrows
            </button>
          </div>

          <button
            onClick={() => setIsPublisherOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/20 hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Add Thought Node
          </button>

          <div className="flex gap-1">
            <button
              onClick={() => { playSound("click"); setTheme("light"); }}
              className={`p-2 rounded-lg ${theme === "light" ? "bg-purple-600 text-white" : "bg-slate-800/40 text-slate-400"}`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => { playSound("click"); setTheme("dark"); }}
              className={`p-2 rounded-lg ${theme === "dark" ? "bg-purple-600 text-white" : "bg-slate-800/40 text-slate-400"}`}
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Blank Dot Space Canvas Area */}
      <main
        ref={canvasRef}
        onMouseMove={handleMouseMoveCanvas}
        onMouseUp={handleMouseUpCanvas}
        className="flex-1 w-full h-full relative overflow-hidden"
        style={{
          backgroundImage: `radial-gradient(${themeStyles.dotColor} 1.5px, transparent 1.5px)`,
          backgroundSize: "24px 24px",
        }}
      >
        {/* Banner Instruction Overlay */}
        <div className="absolute top-4 left-6 z-10 bg-slate-900/80 border border-slate-800 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-3 text-xs text-slate-300 shadow-xl">
          <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
            {mode === "drag" ? <Move className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
          </span>
          <div>
            <p className="font-bold text-white">
              {mode === "drag" ? "Mode: Drag & Position Cards" : "Mode: Connect Vision Arrows"}
            </p>
            <p className="text-[10px] text-slate-400">
              {mode === "drag"
                ? "Click and drag any vision node to move it anywhere on the dot grid."
                : connectStartNodeId
                ? "Click second card to complete connection line."
                : "Click first vision card, then click second vision card to draw connected arrow."}
            </p>
          </div>
        </div>

        {/* SVG Arrow Connection Layer */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" />
            </marker>
          </defs>

          {connections.map((conn) => {
            const fromNode = nodes.find((n) => n.id === conn.fromId);
            const toNode = nodes.find((n) => n.id === conn.toId);
            if (!fromNode || !toNode) return null;

            // Center points of vision cards (Cards are 260px wide, ~150px tall)
            const x1 = fromNode.x + 130;
            const y1 = fromNode.y + 75;
            const x2 = toNode.x + 130;
            const y2 = toNode.y + 75;

            // Midpoint for connection label
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;

            // Curved Bezier control point offset
            const dx = x2 - x1;
            const dy = y2 - y1;
            const cx = midX - dy * 0.15;
            const cy = midY + dx * 0.15;

            return (
              <g key={conn.id} className="pointer-events-auto group">
                {/* Curved Arrow Path */}
                <path
                  d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  strokeDasharray="6 3"
                  markerEnd="url(#arrowhead)"
                  className="transition-all duration-300 hover:stroke-pink-500 hover:stroke-3"
                />

                {/* Connection Label Pill */}
                <g
                  transform={`translate(${cx}, ${cy})`}
                  className="cursor-pointer"
                  onClick={() => handleDeleteConnection(conn.id)}
                >
                  <rect
                    x="-55"
                    y="-14"
                    width="110"
                    height="28"
                    rx="14"
                    className="fill-slate-900 stroke-purple-500/60 hover:stroke-red-400 transition-all shadow-lg"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    className="fill-purple-300 text-[10px] font-bold uppercase tracking-wider group-hover:fill-red-400 transition-colors"
                  >
                    {conn.label}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Vision Nodes / Cards Layer */}
        {nodes.map((node) => {
          const isConnectSelected = connectStartNodeId === node.id;

          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleMouseDownNode(e, node.id)}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
              }}
              className={`absolute w-64 rounded-2xl overflow-hidden border transition-shadow duration-200 cursor-grab active:cursor-grabbing z-20 ${
                isConnectSelected
                  ? "ring-4 ring-pink-500 border-pink-400 shadow-2xl scale-105"
                  : node.manifested
                  ? "border-emerald-500/40 bg-slate-900/80 opacity-80"
                  : "border-slate-800 bg-slate-900/90 hover:border-purple-500/60 hover:shadow-2xl"
              }`}
            >
              {/* Header Gradient */}
              <div className={`p-3 bg-gradient-to-r ${node.gradient} text-white flex items-center justify-between`}>
                <div className="flex items-center gap-1.5">
                  <span className="p-1 rounded bg-black/20">
                    {getCategoryIcon(node.category)}
                  </span>
                  <span className="text-[10px] font-bold tracking-wider uppercase">{node.category}</span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNode(node.id);
                  }}
                  className="p-1 rounded bg-black/20 hover:bg-black/40 text-white/70 hover:text-white transition-colors"
                  title="Delete Node"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <p className={`text-xs font-medium leading-relaxed ${node.manifested ? "line-through text-slate-400" : "text-slate-100"}`}>
                  &quot;{node.thought}&quot;
                </p>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[9px] font-semibold text-purple-400 flex items-center gap-1">
                    ✨ {node.mood}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleManifested(node.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                      node.manifested
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-800 text-slate-300 hover:bg-purple-600 hover:text-white"
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {node.manifested ? "Manifested" : "Manifest"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </main>

      {/* Publisher Modal */}
      {isPublisherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className={`w-full max-w-md p-6 rounded-3xl border border-purple-500/30 ${themeStyles.cardBg} space-y-5 relative`}>
            <button
              onClick={() => setIsPublisherOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-400" /> Drop Vision Node on Dot Space
              </h3>
              <p className="text-xs text-slate-400">Publish your thought and position it freely across the dots.</p>
            </div>

            <form onSubmit={handlePublishThought} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Thought / Vision Text
                </label>
                <textarea
                  required
                  rows={3}
                  value={newThoughtText}
                  onChange={(e) => setNewThoughtText(e.target.value)}
                  placeholder="e.g. Build an indie creative studio..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as VisionNode["category"])}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Vibe
                  </label>
                  <select
                    value={newMood}
                    onChange={(e) => setNewMood(e.target.value as VisionNode["mood"])}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Card Theme
                </label>
                <div className="flex gap-2">
                  {DEFAULT_GRADIENTS.map((grad, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedGradient(grad)}
                      className={`h-7 flex-1 rounded-lg bg-gradient-to-r ${grad} border-2 ${
                        selectedGradient === grad ? "border-white scale-110" : "border-transparent opacity-60"
                      }`}
                    ></button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPublisherOpen(false)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white flex items-center gap-1.5 shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" /> Drop Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Connection Label Modal */}
      {pendingConnection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className={`w-full max-w-sm p-6 rounded-3xl border border-purple-500/30 ${themeStyles.cardBg} space-y-4`}>
            <div className="space-y-1">
              <h3 className="text-base font-bold flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-purple-400" /> Label Vision Connection Arrow
              </h3>
              <p className="text-xs text-slate-400">Describe how these two vision thoughts relate.</p>
            </div>

            <form onSubmit={handleCreateConnection} className="space-y-3">
              <input
                type="text"
                required
                placeholder="e.g. leads to, inspires, funds, enables..."
                value={connectionLabel}
                onChange={(e) => setConnectionLabel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700 text-white text-xs focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPendingConnection(null)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-purple-600 text-white shadow-lg"
                >
                  Create Arrow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CIRCULAR RADIAL MENU OVERLAY */}
      <div className={`fixed ${positionClasses[menuPosition]} z-50 transition-all duration-500`}>
        <div className="relative flex items-center justify-end">
          <div
            className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-700 ease-out"
            style={{
              opacity: isOpen ? 1 : 0,
              transform: `translateY(-50%) scale(${isOpen ? 1 : 0.4})`,
            }}
          >
            {isOpen && (
              <div
                className="absolute border border-dashed border-purple-500/30 rounded-full pointer-events-none"
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
                      ? `translate(${x - 24}px, ${y - 24}px) scale(1)`
                      : "translate(0px, -24px) scale(0)",
                    pointerEvents: isOpen ? "auto" : "none",
                    transitionDelay: isOpen ? `${idx * 40}ms` : "0ms",
                  }}
                  onMouseEnter={() => setActiveTooltip(item.id)}
                  onMouseLeave={() => setActiveTooltip(null)}
                >
                  <div className="relative group/btn">
                    <div
                      className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-xs shadow-2xl transition-all duration-300 w-44 pointer-events-none text-left z-50 ${
                        activeTooltip === item.id ? "opacity-100 scale-100" : "opacity-0 scale-95"
                      }`}
                    >
                      <div className="font-bold text-white">{item.label}</div>
                      <p className="text-[10px] text-slate-400 mt-0.5">{item.description}</p>
                    </div>

                    <button
                      onClick={() => {
                        playSound("click");
                        item.action();
                      }}
                      className="w-12 h-12 rounded-full bg-slate-900 border border-purple-500/40 text-white flex items-center justify-center hover:scale-110 hover:bg-purple-600 transition-all shadow-xl"
                    >
                      {item.icon}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              if (isOpen) {
                playSound("close");
                setIsOpen(false);
              } else {
                playSound("open");
                setIsOpen(true);
                confetti({
                  particleCount: 30,
                  spread: 45,
                  origin: { x: 0.98, y: 0.5 },
                });
              }
            }}
            className="w-16 h-16 rounded-full border-2 border-purple-500/60 bg-slate-900 text-white flex items-center justify-center shadow-2xl cursor-pointer relative z-50"
          >
            {isOpen ? (
              <X className="w-7 h-7 text-pink-400" />
            ) : (
              <div className="relative flex items-center justify-center">
                <Compass className="w-8 h-8 text-purple-400 animate-spin-slow" />
                <Zap className="w-4 h-4 text-amber-400 absolute animate-pulse" />
              </div>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
