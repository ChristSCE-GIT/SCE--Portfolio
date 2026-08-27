import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  GitBranch,
  Mail,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
  Menu,
  X,
  Sigma,
  Brain,
  Cpu,
  GraduationCap,
  Sparkles,
  Copy,
  Check,
  Terminal,
  BarChart3,
  Dices,
  ChevronDown,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

/* ------------------------------------------------------------------ */
/* Data — dérivé du profil GitHub réel de ChristSCE-GIT                */
/* ------------------------------------------------------------------ */

const NAV_LINKS = [
  { id: "accueil", label: "Accueil" },
  { id: "apropos", label: "À propos" },
  { id: "competences", label: "Compétences" },
  { id: "projets", label: "Projets" },
  { id: "parcours", label: "Parcours" },
  { id: "contact", label: "Contact" },
];

const ROLES = [
  "Futur Ingénieur IA",
  "Élève Terminale · Spé Maths / NSI",
  "Développeur Python",
  "Passionné de Data & Machine Learning",
];

const SKILLS_RADAR = [
  { subject: "Python", value: 82 },
  { subject: "Mathématiques", value: 90 },
  { subject: "Algo. (NSI)", value: 78 },
  { subject: "Data & Stats", value: 72 },
  { subject: "Machine Learning", value: 42 },
  { subject: "Git / GitHub", value: 68 },
];

const SKILL_GROUPS = [
  {
    title: "Langages & Dév.",
    icon: Terminal,
    items: ["Python", "Algorithmique (NSI)", "Git & GitHub", "HTML/CSS (bases)"],
  },
  {
    title: "Mathématiques appliquées",
    icon: Sigma,
    items: ["Probabilités & statistiques", "Étude de fonctions", "Suites & analyse", "Algèbre linéaire (bases)"],
  },
  {
    title: "Data & IA",
    icon: Brain,
    items: ["NumPy", "Matplotlib", "Lecture / traitement CSV", "Notions de Machine Learning"],
  },
  {
    title: "En apprentissage",
    icon: Sparkles,
    items: ["Pandas", "Scikit-learn", "Deep Learning (bases)", "Anglais technique"],
  },
];

const PROJECTS = [
  {
    key: "math",
    title: "MathVisualizer",
    tagline: "Visualiseur de fonctions mathématiques",
    description:
      "Outil Python qui trace des fonctions (affine, second degré, exponentielle, sinus, inverse, logarithme, racine carrée), calcule des images, repère les racines et l'intersection avec l'axe des ordonnées.",
    tech: ["Python", "NumPy", "Matplotlib"],
    href: "https://github.com/ChristSCE-GIT/MathVisualizer",
    illustration: "curve",
  },
  {
    key: "proba",
    title: "ProbabilityLab",
    tagline: "Simulation de la loi des grands nombres",
    description:
      "Simulation de lancers de dé comparant fréquence expérimentale et probabilité théorique, avec étude de la convergence de l'écart selon une loi en 1/√n sur jusqu'à 1 000 000 de lancers.",
    tech: ["Python", "NumPy", "Matplotlib", "random"],
    href: "https://github.com/ChristSCE-GIT/ProbabilityLab",
    illustration: "dice",
  },
  {
    key: "foot",
    title: "Football DataAnalyzer",
    tagline: "Analyse statistique de matchs de football",
    description:
      "Analyse de résultats de matchs à partir d'un fichier CSV : victoires/nuls/défaites, buts marqués et encaissés, meilleures performances offensive/défensive, comparatif domicile / extérieur.",
    tech: ["Python", "CSV", "Matplotlib"],
    href: "https://github.com/ChristSCE-GIT/Football_DataAnalyzer",
    illustration: "football",
  },
];

const TIMELINE = [
  {
    period: "Aujourd'hui",
    title: "Terminale générale — Spécialités Mathématiques & NSI",
    text: "Approfondissement des mathématiques (analyse, probabilités) et des sciences numériques : algorithmique, programmation Python, bases de données, réseaux.",
    active: true,
  },
  {
    period: "Prochaine étape",
    title: "Études supérieures — filière ingénieur",
    text: "Poursuite vers une formation d'ingénieur (prépa, licence informatique-mathématiques ou école d'ingénieur) pour construire des bases solides en algorithmique, data et IA.",
    active: false,
  },
  {
    period: "Objectif",
    title: "Ingénieur en Intelligence Artificielle",
    text: "Concevoir et déployer des modèles de machine learning et des systèmes intelligents au service de problèmes concrets — data, vision, ou traitement du langage.",
    active: false,
  },
];

/* ------------------------------------------------------------------ */
/* Hooks utilitaires                                                   */
/* ------------------------------------------------------------------ */

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useTypedRoles(roles, speed = 55, pause = 1400) {
  const [text, setText] = useState("");
  const [idx, setIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = roles[idx % roles.length];
    let timeout;
    if (!deleting && text.length < current.length) {
      timeout = setTimeout(() => setText(current.slice(0, text.length + 1)), speed);
    } else if (!deleting && text.length === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text.length > 0) {
      timeout = setTimeout(() => setText(current.slice(0, text.length - 1)), speed / 1.6);
    } else if (deleting && text.length === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % roles.length);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, roles, speed, pause]);

  return text;
}

function useCountUp(target, trigger) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let raf;
    const start = performance.now();
    const duration = 1200;
    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [trigger, target]);
  return value;
}

function useInView(threshold = 0.4) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.unobserve(node);
        }
      },
      { threshold }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ------------------------------------------------------------------ */
/* Petits composants                                                   */
/* ------------------------------------------------------------------ */

function Logo({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect width="48" height="48" rx="12" className="logo-bg" />
      <circle cx="14" cy="30" r="3" className="logo-node" />
      <circle cx="24" cy="16" r="3" className="logo-node logo-node-delay1" />
      <circle cx="35" cy="26" r="3" className="logo-node logo-node-delay2" />
      <path d="M14 30 L24 16 L35 26" className="logo-link" fill="none" strokeWidth="1.6" />
      <path
        d="M9 34 C 14 22, 19 12, 24 24 C 28 33, 33 20, 39 14"
        className="logo-curve"
        fill="none"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function Stat({ label, value, suffix = "" }) {
  const [ref, inView] = useInView(0.6);
  const count = useCountUp(value, inView);
  return (
    <div ref={ref} className="stat">
      <div className="stat-value">
        {count}
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function CopyEmail({ email }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      /* clipboard may be unavailable — no-op */
    }
  };
  return (
    <button className="copy-btn" onClick={onCopy} aria-label="Copier l'adresse email">
      {copied ? <Check size={15} /> : <Copy size={15} />}
      <span>{copied ? "Copié !" : "Copier"}</span>
    </button>
  );
}

/* --- Illustrations SVG des projets --- */

function ProjectArt({ type }) {
  if (type === "curve") {
    return (
      <svg viewBox="0 0 300 170" className="art">
        <line x1="20" y1="140" x2="280" y2="140" className="art-axis" />
        <line x1="40" y1="20" x2="40" y2="160" className="art-axis" />
        <path
          d="M40,110 C80,10 110,170 150,90 C190,10 220,150 260,40"
          className="art-line art-line-1"
          fill="none"
        />
        <circle cx="150" cy="90" r="3.5" className="art-dot" />
        <circle cx="260" cy="40" r="3.5" className="art-dot art-dot-2" />
        <text x="252" y="132" className="art-label">x</text>
        <text x="30" y="30" className="art-label">f(x)</text>
      </svg>
    );
  }
  if (type === "dice") {
    return (
      <svg viewBox="0 0 300 170" className="art">
        <g className="art-die art-die-1">
          <rect x="30" y="30" width="46" height="46" rx="8" />
          <circle cx="53" cy="53" r="4" className="pip" />
        </g>
        <g className="art-die art-die-2">
          <rect x="100" y="70" width="46" height="46" rx="8" />
          <circle cx="112" cy="82" r="3.5" className="pip" />
          <circle cx="134" cy="82" r="3.5" className="pip" />
          <circle cx="112" cy="104" r="3.5" className="pip" />
          <circle cx="134" cy="104" r="3.5" className="pip" />
        </g>
        <g className="art-bars">
          <rect x="180" y="110" width="16" height="30" className="art-bar" />
          <rect x="205" y="85" width="16" height="55" className="art-bar art-bar-2" />
          <rect x="230" y="60" width="16" height="80" className="art-bar art-bar-3" />
          <rect x="255" y="95" width="16" height="45" className="art-bar art-bar-4" />
        </g>
        <line x1="20" y1="140" x2="280" y2="140" className="art-axis" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 300 170" className="art">
      <rect x="20" y="30" width="260" height="110" rx="10" className="pitch" />
      <line x1="150" y1="30" x2="150" y2="140" className="art-axis" />
      <circle cx="150" cy="85" r="20" className="art-axis" fill="none" />
      <g className="art-bars">
        <rect x="45" y="105" width="14" height="35" className="art-bar" />
        <rect x="68" y="80" width="14" height="60" className="art-bar art-bar-2" />
        <rect x="200" y="90" width="14" height="50" className="art-bar art-bar-3" />
        <rect x="223" y="65" width="14" height="75" className="art-bar art-bar-4" />
      </g>
    </svg>
  );
}

const ART_ICONS = { curve: Sigma, dice: Dices, football: BarChart3 };

/* ------------------------------------------------------------------ */
/* Hero animation — courbe + graphe de nœuds                          */
/* ------------------------------------------------------------------ */

function HeroArt() {
  return (
    <div className="hero-art">
      <svg viewBox="0 0 480 420" className="hero-svg" aria-hidden="true">
        <line x1="40" y1="360" x2="440" y2="360" className="hero-axis" />
        <line x1="60" y1="30" x2="60" y2="380" className="hero-axis" />
        <path
          d="M60,300 C120,60 160,340 220,180 C270,50 320,320 380,120 C400,70 420,90 440,60"
          className="hero-curve"
          fill="none"
        />
        <g className="hero-nodes">
          <circle cx="150" cy="120" r="6" className="hnode n1" />
          <circle cx="260" cy="80" r="6" className="hnode n2" />
          <circle cx="330" cy="180" r="6" className="hnode n3" />
          <circle cx="230" cy="230" r="6" className="hnode n4" />
          <circle cx="380" cy="240" r="6" className="hnode n5" />
          <line x1="150" y1="120" x2="260" y2="80" className="hlink l1" />
          <line x1="260" y1="80" x2="330" y2="180" className="hlink l2" />
          <line x1="330" y1="180" x2="230" y2="230" className="hlink l3" />
          <line x1="230" y1="230" x2="380" y2="240" className="hlink l4" />
          <line x1="150" y1="120" x2="230" y2="230" className="hlink l5" />
        </g>
      </svg>
      <span className="float-token t1">f(x)</span>
      <span className="float-token t2">Σ</span>
      <span className="float-token t3">σ(x)</span>
      <span className="float-token t4">∇</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* App principale                                                      */
/* ------------------------------------------------------------------ */

export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("accueil");
  const [scrolled, setScrolled] = useState(false);
  const role = useTypedRoles(ROLES);
  useReveal();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const scrollTo = useCallback((id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="site">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');

        :root {
          --bg: #0a1120;
          --bg-alt: #0e1830;
          --surface: #121d38;
          --surface-2: #16213f;
          --border: rgba(148,163,196,0.14);
          --border-strong: rgba(148,163,196,0.26);
          --text: #eaf0fb;
          --text-dim: #93a0be;
          --text-mute: #5e6b8a;
          --accent: #4fd8c4;
          --accent-soft: rgba(79,216,196,0.14);
          --accent-2: #f2a65a;
          --accent-2-soft: rgba(242,166,90,0.14);
          --accent-3: #8b7cf6;
          --radius: 16px;
        }
        * { box-sizing: border-box; }
        .site {
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow-x: hidden;
          min-height: 100vh;
        }
        .site::before {
          content: "";
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(circle at 1px 1px, rgba(148,163,196,0.14) 1px, transparent 1px);
          background-size: 34px 34px;
          animation: gridPan 26s linear infinite;
          pointer-events: none;
          z-index: 0;
          opacity: .5;
        }
        .glow {
          position: fixed;
          width: 620px; height: 620px;
          border-radius: 50%;
          filter: blur(120px);
          opacity: .18;
          pointer-events: none;
          z-index: 0;
        }
        .glow-1 { background: var(--accent); top: -160px; right: -160px; }
        .glow-2 { background: var(--accent-3); bottom: 10%; left: -220px; opacity: .12; }

        h1, h2, h3, .display { font-family: 'Sora', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }

        section { position: relative; z-index: 1; }

        @keyframes gridPan { from { background-position: 0 0; } to { background-position: 34px 34px; } }
        @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes pulseNode { 0%,100% { opacity:.55; transform: scale(1);} 50% { opacity:1; transform: scale(1.25);} }
        @keyframes drawPath { to { stroke-dashoffset: 0; } }
        @keyframes blink { 0%,100% { opacity: 1;} 50% { opacity: 0;} }
        @keyframes spin-slow { to { transform: rotate(360deg); } }

        [data-reveal] { opacity: 0; transform: translateY(28px); transition: opacity .7s cubic-bezier(.2,.7,.2,1), transform .7s cubic-bezier(.2,.7,.2,1); }
        [data-reveal].in-view { opacity: 1; transform: translateY(0); }
        [data-reveal="stagger"] > * { opacity: 0; transform: translateY(22px); transition: opacity .6s ease, transform .6s ease; }
        [data-reveal="stagger"].in-view > * { opacity: 1; transform: translateY(0); }
        [data-reveal="stagger"].in-view > *:nth-child(1) { transition-delay: .02s; }
        [data-reveal="stagger"].in-view > *:nth-child(2) { transition-delay: .12s; }
        [data-reveal="stagger"].in-view > *:nth-child(3) { transition-delay: .22s; }
        [data-reveal="stagger"].in-view > *:nth-child(4) { transition-delay: .32s; }

        /* ---------- NAV ---------- */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 6vw;
          transition: background .3s ease, border-color .3s ease, padding .3s ease;
          border-bottom: 1px solid transparent;
        }
        .nav.scrolled {
          background: rgba(10,17,32,0.82);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid var(--border);
          padding: 12px 6vw;
        }
        .nav-left { display: flex; align-items: center; gap: 12px; }
        .nav-name { font-weight: 600; font-size: 15px; letter-spacing: .2px; }
        .nav-name span { color: var(--text-dim); font-weight: 400; display: block; font-size: 11px; }
        .nav-links { display: flex; gap: 6px; align-items: center; }
        .nav-link {
          background: none; border: none; color: var(--text-dim); font-size: 14px;
          padding: 8px 14px; border-radius: 999px; cursor: pointer; transition: all .25s ease;
          font-family: 'Inter', sans-serif;
        }
        .nav-link:hover { color: var(--text); }
        .nav-link.active { color: var(--bg); background: var(--accent); }
        .nav-cta {
          display: flex; align-items: center; gap: 8px;
          background: var(--surface); border: 1px solid var(--border-strong);
          color: var(--text); padding: 9px 16px; border-radius: 999px; font-size: 13.5px;
          cursor: pointer; transition: all .25s ease; text-decoration: none;
        }
        .nav-cta:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-1px); }
        .nav-burger { display: none; background: none; border: none; color: var(--text); cursor: pointer; }
        .mobile-menu {
          position: fixed; inset: 0; z-index: 49; background: rgba(9,14,27,0.98);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 26px;
          transform: translateY(-100%); transition: transform .4s cubic-bezier(.2,.8,.2,1);
        }
        .mobile-menu.open { transform: translateY(0); }
        .mobile-menu button { background: none; border: none; color: var(--text); font-size: 22px; font-family: 'Sora', sans-serif; }

        /* ---------- LOGO ---------- */
        .logo-bg { fill: url(#logoGrad); }
        .logo-node { fill: var(--accent); opacity: 0; animation: nodeIn .5s ease forwards; }
        .logo-node-delay1 { animation-delay: .15s; }
        .logo-node-delay2 { animation-delay: .3s; }
        @keyframes nodeIn { to { opacity: 1; } }
        .logo-link { stroke: rgba(234,240,251,0.55); }
        .logo-curve { stroke: var(--accent-2); }

        /* ---------- HERO ---------- */
        .hero {
          min-height: 100vh;
          display: flex; align-items: center;
          padding: 120px 6vw 60px;
          gap: 40px;
        }
        .hero-inner { display: grid; grid-template-columns: 1.05fr .95fr; gap: 40px; align-items: center; width: 100%; }
        .eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: var(--accent);
          background: var(--accent-soft); border: 1px solid rgba(79,216,196,0.3);
          padding: 6px 14px; border-radius: 999px; margin-bottom: 22px;
        }
        .hero h1 {
          font-size: clamp(2.4rem, 5vw, 3.9rem);
          line-height: 1.05; font-weight: 700; margin: 0 0 18px;
          letter-spacing: -0.02em;
        }
        .hero h1 .accent-text { color: var(--accent); }
        .role-line {
          font-family: 'JetBrains Mono', monospace; font-size: clamp(15px, 1.6vw, 19px);
          color: var(--text-dim); margin-bottom: 26px; min-height: 26px;
        }
        .role-line .cursor { display: inline-block; width: 2px; height: 1em; background: var(--accent); margin-left: 3px; animation: blink 1s step-start infinite; vertical-align: -2px; }
        .hero p.lead { color: var(--text-dim); font-size: 16.5px; max-width: 520px; line-height: 1.7; margin-bottom: 34px; }
        .hero-ctas { display: flex; gap: 14px; flex-wrap: wrap; margin-bottom: 46px; }
        .btn {
          display: inline-flex; align-items: center; gap: 9px; padding: 13px 24px; border-radius: 12px;
          font-size: 14.5px; font-weight: 600; text-decoration: none; cursor: pointer; border: 1px solid transparent;
          transition: all .25s ease; font-family: 'Inter', sans-serif;
        }
        .btn-primary { background: var(--accent); color: #04140f; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px -10px rgba(79,216,196,.55); }
        .btn-ghost { background: transparent; border-color: var(--border-strong); color: var(--text); }
        .btn-ghost:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }

        .hero-stats { display: flex; gap: 34px; flex-wrap: wrap; }
        .stat-value { font-family: 'Sora', sans-serif; font-size: 26px; font-weight: 700; color: var(--text); }
        .stat-label { font-size: 12.5px; color: var(--text-mute); margin-top: 2px; }

        .hero-art { position: relative; }
        .hero-svg { width: 100%; height: auto; }
        .hero-axis { stroke: var(--border-strong); stroke-width: 1; }
        .hero-curve {
          stroke: var(--accent); stroke-width: 2.4; stroke-linecap: round;
          stroke-dasharray: 900; stroke-dashoffset: 900;
          animation: drawPath 2.6s 0.3s cubic-bezier(.2,.7,.2,1) forwards;
          filter: drop-shadow(0 0 6px rgba(79,216,196,.45));
        }
        .hnode { fill: var(--accent-3); opacity: 0; animation: nodeAppear .5s ease forwards, pulseNode 2.6s ease-in-out infinite; }
        .n1 { animation-delay: .6s, 2.6s; } .n2 { animation-delay: .8s, 2.8s; } .n3 { animation-delay: 1s, 3s; }
        .n4 { animation-delay: 1.2s, 3.2s; } .n5 { animation-delay: 1.4s, 3.4s; }
        @keyframes nodeAppear { to { opacity: .9; } }
        .hlink { stroke: rgba(139,124,246,0.35); stroke-width: 1.2; stroke-dasharray: 6; opacity: 0; animation: linkIn .6s ease forwards; }
        .l1{animation-delay:.9s;} .l2{animation-delay:1.05s;} .l3{animation-delay:1.2s;} .l4{animation-delay:1.35s;} .l5{animation-delay:1.5s;}
        @keyframes linkIn { to { opacity: 1; } }
        .float-token {
          position: absolute; font-family: 'JetBrains Mono', monospace; color: var(--text-mute);
          font-size: 15px; animation: floatY 5s ease-in-out infinite;
        }
        .t1 { top: 8%; right: 6%; animation-delay: 0s; color: var(--accent-2); }
        .t2 { top: 42%; left: 0%; animation-delay: .8s; }
        .t3 { bottom: 18%; right: 20%; animation-delay: 1.6s; color: var(--accent); }
        .t4 { bottom: 6%; left: 30%; animation-delay: 2.2s; color: var(--accent-3); }

        .scroll-hint {
          position: absolute; bottom: 26px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 6px;
          color: var(--text-mute); font-size: 11px; font-family: 'JetBrains Mono', monospace;
          animation: floatY 2.4s ease-in-out infinite;
        }

        /* ---------- SECTION SHELL ---------- */
        .container { max-width: 1180px; margin: 0 auto; padding: 0 6vw; }
        .section-pad { padding: 120px 0; }
        .kicker {
          font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: var(--accent);
          text-transform: uppercase; letter-spacing: .12em; margin-bottom: 14px; display:block;
        }
        .section-title { font-size: clamp(1.8rem, 3.2vw, 2.6rem); font-weight: 700; margin: 0 0 16px; letter-spacing: -0.01em; }
        .section-sub { color: var(--text-dim); font-size: 16px; max-width: 640px; line-height: 1.7; margin-bottom: 56px; }

        /* ---------- ABOUT ---------- */
        .about-grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: 56px; align-items: center; }
        .avatar-wrap { position: relative; width: 260px; height: 260px; margin: 0 auto; }
        .avatar-ring { position: absolute; inset: 0; border-radius: 50%; border: 1px dashed var(--border-strong); animation: spin-slow 40s linear infinite; }
        .avatar-core {
          position: absolute; inset: 18px; border-radius: 50%;
          background: linear-gradient(155deg, var(--surface), var(--bg-alt));
          border: 1px solid var(--border-strong);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 60px -10px rgba(79,216,196,.25) inset;
        }
        .avatar-mono { font-family: 'Sora', sans-serif; font-size: 64px; font-weight: 800; color: var(--accent); }
        .about-facts { list-style: none; padding: 0; margin: 26px 0 0; display: flex; flex-direction: column; gap: 12px; }
        .about-facts li { display: flex; gap: 10px; align-items: flex-start; color: var(--text-dim); font-size: 14.5px; }
        .about-facts svg { color: var(--accent); flex-shrink: 0; margin-top: 2px; }
        .about-text p { color: var(--text-dim); font-size: 16px; line-height: 1.85; margin-bottom: 18px; }
        .about-text strong { color: var(--text); font-weight: 600; }

        /* ---------- SKILLS ---------- */
        .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 44px; align-items: start; }
        .radar-card {
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
          padding: 20px; height: 340px;
        }
        .skill-groups { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .skill-card {
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
          padding: 22px; transition: border-color .3s ease, transform .3s ease;
        }
        .skill-card:hover { border-color: var(--accent); transform: translateY(-3px); }
        .skill-card-head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
        .skill-card-head svg { color: var(--accent); }
        .skill-card-head h4 { margin: 0; font-size: 14.5px; font-weight: 600; }
        .skill-card ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
        .skill-card li { font-size: 13.5px; color: var(--text-dim); display: flex; align-items: center; gap: 8px; }
        .skill-card li::before { content: ""; width: 5px; height: 5px; border-radius: 50%; background: var(--accent-2); flex-shrink: 0; }

        /* ---------- PROJECTS ---------- */
        .projects-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 26px; }
        .project-card {
          background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
          overflow: hidden; display: flex; flex-direction: column; transition: transform .35s ease, border-color .35s ease, box-shadow .35s ease;
          position: relative;
        }
        .project-card:hover { transform: translateY(-6px); border-color: var(--accent); box-shadow: 0 24px 40px -20px rgba(0,0,0,.55); }
        .project-art-wrap {
          background: linear-gradient(160deg, var(--bg-alt), var(--surface-2));
          padding: 18px 18px 0; position: relative; overflow: hidden;
        }
        .art { width: 100%; height: 150px; }
        .art-axis { stroke: var(--border-strong); stroke-width: 1; }
        .art-line { stroke: var(--accent); stroke-width: 2.2; stroke-linecap: round; stroke-dasharray: 500; stroke-dashoffset: 500; }
        .project-card:hover .art-line { animation: drawPath 1.3s ease forwards; }
        .art-dot { fill: var(--accent-2); }
        .art-label { fill: var(--text-mute); font-size: 10px; font-family: 'JetBrains Mono', monospace; }
        .art-die rect { fill: var(--surface); stroke: var(--border-strong); }
        .pip { fill: var(--accent); }
        .art-die-1 { animation: floatY 3.4s ease-in-out infinite; transform-origin: 53px 53px; }
        .art-die-2 { animation: floatY 3.8s ease-in-out infinite .4s; transform-origin: 123px 93px; }
        .art-bar { fill: var(--accent-3); opacity: .85; }
        .art-bar-2 { fill: var(--accent); }
        .art-bar-3 { fill: var(--accent-2); }
        .art-bar-4 { fill: var(--accent-3); }
        .pitch { fill: none; stroke: var(--border-strong); stroke-width: 1; }
        .project-icon-badge {
          position: absolute; top: 14px; right: 14px; width: 34px; height: 34px; border-radius: 10px;
          background: rgba(10,17,32,0.7); border: 1px solid var(--border-strong);
          display: flex; align-items: center; justify-content: center; color: var(--accent);
        }
        .project-body { padding: 22px; display: flex; flex-direction: column; gap: 10px; flex: 1; }
        .project-body h3 { margin: 0; font-size: 19px; font-weight: 700; }
        .project-tagline { color: var(--accent-2); font-size: 12.5px; font-family: 'JetBrains Mono', monospace; }
        .project-body p.desc { color: var(--text-dim); font-size: 14px; line-height: 1.65; margin: 4px 0 8px; flex: 1; }
        .tech-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
        .tech-tag { font-size: 11px; font-family: 'JetBrains Mono', monospace; color: var(--text-dim); background: var(--surface-2); border: 1px solid var(--border); padding: 4px 9px; border-radius: 999px; }
        .project-link { display: inline-flex; align-items: center; gap: 7px; color: var(--text); font-size: 13.5px; font-weight: 600; text-decoration: none; }
        .project-link svg { transition: transform .25s ease; }
        .project-link:hover { color: var(--accent); }
        .project-link:hover svg { transform: translate(2px,-2px); }

        .more-projects { text-align: center; margin-top: 40px; }

        /* ---------- TIMELINE ---------- */
        .timeline { position: relative; padding-left: 34px; }
        .timeline::before { content:""; position: absolute; left: 6px; top: 6px; bottom: 6px; width: 1px; background: var(--border-strong); }
        .tl-item { position: relative; padding-bottom: 44px; }
        .tl-item:last-child { padding-bottom: 0; }
        .tl-dot { position: absolute; left: -34px; top: 4px; width: 13px; height: 13px; border-radius: 50%; background: var(--bg); border: 2px solid var(--border-strong); }
        .tl-item.active .tl-dot { border-color: var(--accent); background: var(--accent); box-shadow: 0 0 0 5px var(--accent-soft); }
        .tl-period { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--accent); text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px; display:block; }
        .tl-item h4 { margin: 0 0 8px; font-size: 18px; font-weight: 600; }
        .tl-item p { margin: 0; color: var(--text-dim); font-size: 14.5px; line-height: 1.7; max-width: 620px; }

        /* ---------- CONTACT ---------- */
        .contact-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: 40px; align-items: stretch; }
        .contact-panel {
          background: linear-gradient(155deg, var(--surface), var(--bg-alt));
          border: 1px solid var(--border); border-radius: 20px; padding: 44px;
          position: relative; overflow: hidden;
        }
        .contact-panel h3 { font-size: 26px; margin: 0 0 12px; }
        .contact-panel p { color: var(--text-dim); font-size: 15px; line-height: 1.7; max-width: 460px; margin-bottom: 30px; }
        .contact-rows { display: flex; flex-direction: column; gap: 14px; }
        .contact-row {
          display: flex; align-items: center; justify-content: space-between; gap: 14px;
          background: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 14px 16px;
        }
        .contact-row-left { display: flex; align-items: center; gap: 12px; color: var(--text); font-size: 14px; }
        .contact-row-left svg { color: var(--accent); }
        .copy-btn { display: flex; align-items: center; gap: 6px; background: none; border: 1px solid var(--border-strong); color: var(--text-dim); font-size: 12.5px; padding: 7px 12px; border-radius: 999px; cursor: pointer; transition: all .2s ease; }
        .copy-btn:hover { color: var(--accent); border-color: var(--accent); }
        .contact-side {
          border: 1px solid var(--border); border-radius: 20px; padding: 34px;
          display: flex; flex-direction: column; justify-content: center; gap: 18px;
          background: var(--surface);
        }
        .contact-side h4 { margin: 0; font-size: 15px; color: var(--text-dim); font-weight: 500; }
        .availability { display: flex; align-items: center; gap: 8px; font-size: 13.5px; color: var(--accent); }
        .dot-live { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); animation: pulseNode 1.6s ease-in-out infinite; }

        footer { border-top: 1px solid var(--border); padding: 30px 6vw; display: flex; align-items: center; justify-content: space-between; color: var(--text-mute); font-size: 12.5px; flex-wrap: wrap; gap: 12px; }
        footer a { color: var(--text-dim); text-decoration: none; }
        footer a:hover { color: var(--accent); }

        @media (max-width: 900px) {
          .nav-links { display: none; }
          .nav-cta { display: none; }
          .nav-burger { display: block; }
          .hero-inner { grid-template-columns: 1fr; }
          .hero-art { order: -1; max-width: 380px; margin: 0 auto; }
          .about-grid, .skills-grid, .contact-grid { grid-template-columns: 1fr; }
          .skill-groups { grid-template-columns: 1fr 1fr; }
          .projects-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .skill-groups { grid-template-columns: 1fr; }
          .hero-stats { gap: 20px; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; }
        }
      `}</style>

      <svg width="0" height="0">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#16213f" />
            <stop offset="100%" stopColor="#0a1120" />
          </linearGradient>
        </defs>
      </svg>

      <div className="glow glow-1" />
      <div className="glow glow-2" />

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-left">
          <Logo />
          <div className="nav-name">
            Christ E. Safré
            <span>Aspirant Ingénieur IA</span>
          </div>
        </div>
        <div className="nav-links">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              className={`nav-link ${active === l.id ? "active" : ""}`}
              onClick={() => scrollTo(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
        <a className="nav-cta" href="mailto:christemmanuelzte330@gmail.com">
          <Mail size={15} /> Me contacter
        </a>
        <button className="nav-burger" onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu">
          <Menu size={24} />
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <button onClick={() => setMenuOpen(false)} style={{ position: "absolute", top: 24, right: 28 }} aria-label="Fermer le menu">
          <X size={26} />
        </button>
        {NAV_LINKS.map((l) => (
          <button key={l.id} onClick={() => scrollTo(l.id)}>
            {l.label}
          </button>
        ))}
      </div>

      {/* HERO */}
      <section id="accueil" className="hero">
        <div className="hero-inner">
          <div>
            <span className="eyebrow"><Sparkles size={13} /> Disponible pour stages & projets</span>
            <h1>
              Christ Emmanuel <span className="accent-text">Safré</span>
            </h1>
            <div className="role-line">
              {role}
              <span className="cursor" />
            </div>
            <p className="lead">
              Élève en Terminale, spécialités <strong style={{ color: "var(--text)" }}>Mathématiques</strong> et{" "}
              <strong style={{ color: "var(--text)" }}>NSI</strong>. Je construis, projet après projet, les bases
              d'un futur ingénieur en Intelligence Artificielle — entre rigueur mathématique et code Python.
            </p>
            <div className="hero-ctas">
              <button className="btn btn-primary" onClick={() => scrollTo("projets")}>
                Voir mes projets <ArrowRight size={16} />
              </button>
              <a className="btn btn-ghost" href="https://github.com/ChristSCE-GIT" target="_blank" rel="noreferrer">
                <GitBranch size={24} /> Github
              </a>
            </div>
            <div className="hero-stats">
              <Stat label="Projets Python publiés" value={3} />
              <Stat label="Spécialités au bac" value={2} />
              <Stat label="Domaine visé" value={1} suffix="ᵉ — l'IA" />
            </div>
          </div>
          <HeroArt />
        </div>
        <div className="scroll-hint">
          <span>SCROLL</span>
          <ChevronDown size={16} />
        </div>
      </section>

      {/* A PROPOS */}
      <section id="apropos" className="section-pad">
        <div className="container about-grid">
          <div data-reveal>
            <div className="avatar-wrap">
              <div className="avatar-ring" />
              <div className="avatar-core">
                <span className="avatar-mono">CS</span>
              </div>
            </div>
            <ul className="about-facts">
              <li><GraduationCap size={16} /> Terminale générale — Spé Mathématiques &amp; NSI</li>
              <li><Cpu size={16} /> Autodidacte en Python, data &amp; IA</li>
              <li><GitBranch size={16} /> github.com/ChristSCE-GIT</li>
            </ul>
          </div>
          <div data-reveal>
            <span className="kicker">// À propos</span>
            <h2 className="section-title">De la salle de classe aux modèles d'IA</h2>
            <div className="about-text">
              <p>
                Je m'appelle <strong>Christ Emmanuel Safré</strong>, élève en Terminale avec les spécialités{" "}
                <strong>Mathématiques</strong> et <strong>Numérique &amp; Sciences Informatiques</strong>. Ce
                double socle — logique mathématique et pensée algorithmique — est le terrain sur lequel je
                construis mon projet d'orientation : devenir <strong>ingénieur en Intelligence Artificielle</strong>.
              </p>
              <p>
                En dehors des cours, je code en <strong>Python</strong> et je publie mes projets sur GitHub :
                visualisation de fonctions mathématiques, simulations probabilistes, analyse de données sportives.
                Chaque projet est une occasion d'aller un peu plus loin dans la manipulation de données, la
                visualisation et, à terme, le machine learning.
              </p>
              <p>
                Mon objectif : rejoindre une formation d'ingénieur exigeante pour transformer cette curiosité en
                expertise, et contribuer un jour à concevoir des systèmes intelligents utiles et bien pensés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPETENCES */}
      <section id="competences" className="section-pad" style={{ background: "var(--bg-alt)" }}>
        <div className="container">
          <span className="kicker" data-reveal>// Compétences</span>
          <h2 className="section-title" data-reveal>Ce que je maîtrise, ce que je construis</h2>
          <p className="section-sub" data-reveal>
            Une base mathématique solide, des compétences Python déjà appliquées à des projets concrets, et une
            montée en compétence active vers les outils du machine learning.
          </p>
          <div className="skills-grid">
            <div className="radar-card" data-reveal>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={SKILLS_RADAR} outerRadius="72%">
                  <PolarGrid stroke="rgba(148,163,196,0.18)" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#93a0be", fontSize: 12, fontFamily: "Inter" }}
                  />
                  <Radar
                    dataKey="value"
                    stroke="#4fd8c4"
                    fill="#4fd8c4"
                    fillOpacity={0.28}
                    strokeWidth={2}
                    animationDuration={1400}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="skill-groups" data-reveal="stagger">
              {SKILL_GROUPS.map((g) => (
                <div className="skill-card" key={g.title}>
                  <div className="skill-card-head">
                    <g.icon size={17} />
                    <h4>{g.title}</h4>
                  </div>
                  <ul>
                    {g.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJETS */}
      <section id="projets" className="section-pad">
        <div className="container">
          <span className="kicker" data-reveal>// Projets</span>
          <h2 className="section-title" data-reveal>Mes projets, directement depuis GitHub</h2>
          <p className="section-sub" data-reveal>
            Trois projets Python publiés sur mon profil GitHub, allant de la visualisation mathématique à
            l'analyse statistique de données réelles.
          </p>
          <div className="projects-grid" data-reveal="stagger">
            {PROJECTS.map((p) => {
              const Icon = ART_ICONS[p.illustration];
              return (
                <div className="project-card" key={p.key}>
                  <div className="project-art-wrap">
                    <div className="project-icon-badge">
                      <Icon size={16} />
                    </div>
                    <ProjectArt type={p.illustration} />
                  </div>
                  <div className="project-body">
                    <span className="project-tagline">{p.tagline}</span>
                    <h3>{p.title}</h3>
                    <p className="desc">{p.description}</p>
                    <div className="tech-tags">
                      {p.tech.map((t) => (
                        <span className="tech-tag" key={t}>{t}</span>
                      ))}
                    </div>
                    <a className="project-link" href={p.href} target="_blank" rel="noreferrer">
                      Voir le code <ArrowUpRight size={15} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="more-projects" data-reveal>
            <a className="btn btn-ghost" href="https://github.com/ChristSCE-GIT?tab=repositories" target="_blank" rel="noreferrer">
              Voir tous mes repositories <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </section>

      {/* PARCOURS */}
      <section id="parcours" className="section-pad" style={{ background: "var(--bg-alt)" }}>
        <div className="container">
          <span className="kicker" data-reveal>// Parcours</span>
          <h2 className="section-title" data-reveal>De la Terminale à l'ingénierie IA</h2>
          <p className="section-sub" data-reveal>Ma trajectoire, étape par étape.</p>
          <div className="timeline" data-reveal="stagger">
            {TIMELINE.map((t) => (
              <div className={`tl-item ${t.active ? "active" : ""}`} key={t.title}>
                <div className="tl-dot" />
                <span className="tl-period">{t.period}</span>
                <h4>{t.title}</h4>
                <p>{t.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section-pad">
        <div className="container contact-grid">
          <div className="contact-panel" data-reveal>
            <h3>Discutons de votre école ou de votre équipe.</h3>
            <p>
              Recruteur, professeur ou responsable admission — je suis ouvert à toute opportunité de stage, de
              mentorat ou d'échange autour de l'IA, de la data ou des mathématiques appliquées.
            </p>
            <div className="contact-rows">
              <div className="contact-row">
                <div className="contact-row-left">
                  <Mail size={16} /> christemmanuelzte330@gmail.com
                </div>
                <CopyEmail email="christemmanuelzte330@gmail.com" />
              </div>
              <div className="contact-row">
                <div className="contact-row-left">
                  <GitBranch size={24} /> github.com/ChristSCE-GIT
                </div>
                <a className="copy-btn" href="https://github.com/ChristSCE-GIT" target="_blank" rel="noreferrer">
                  <ExternalLink size={14} /> Ouvrir
                </a>
              </div>
            </div>
          </div>
          <div className="contact-side" data-reveal>
            <div className="availability">
              <span className="dot-live" /> Ouvert aux échanges
            </div>
            <h4>Réponse généralement sous 48h.</h4>
            <a className="btn btn-primary" href="mailto:christemmanuelzte330@gmail.com" style={{ justifyContent: "center" }}>
              <Mail size={16} /> Envoyer un email
            </a>
          </div>
        </div>
      </section>

      <footer>
        <span>© {new Date().getFullYear()} Christ Emmanuel Safré — Conçu avec React</span>
        <div style={{ display: "flex", gap: 18 }}>
          <a href="mailto:christemmanuelzte330@gmail.com">Email</a>
          <a href="https://github.com/ChristSCE-GIT" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
}
