// Main App entrypoint containing 4-layer background engine, custom cursor tracking, and floating capsule navbar
import React, { useState, useEffect, useRef } from 'react';
import { useAppState } from './hooks/useAppState';
import { useAuth } from './hooks/useSupabaseAuth';
import { useFlashcards } from './hooks/useFlashcards';
import AuthPortal from './components/auth/AuthPortal';
import DashboardView from './components/dashboard/DashboardView';
import StudyView from './components/study/StudyView';
import OnlineCompiler from './components/compiler/OnlineCompiler';
import ArraySimulator from './components/simulators/ArraySimulator';
import HeapSimulator from './components/simulators/HeapSimulator';
import DataStructureVisualizer from './components/simulators/DataStructureVisualizer';
import MatrixSimulator2D from './components/simulators/MatrixSimulator2D';
import SortingSearchingVisualizer from './components/simulators/SortingSearchingVisualizer';
import ExamPrepMode from './components/prep/ExamPrepMode';
import { Sun, Moon, BookOpen, Terminal, Cpu, GraduationCap, Trophy, LogOut, Zap, LayoutDashboard, Heart, Star, ShieldAlert, Lock, ChevronDown, ChevronUp, CheckCircle, Search } from 'lucide-react';
import { chapters } from './data/syllabus';
import confetti from 'canvas-confetti';
import LLMSearch from './components/search/LLMSearch';

const BACKGROUND_SNIPPETS = [
  "printf(\"%d\", *ptr);", "malloc(sizeof(int) * 5)", "calloc(10, 4)", "realloc(arr, 20)",
  "free(ptr); ptr = NULL;", "for(int i = 0; i < n; i++)", "while(*ptr != '\\0')",
  "struct Student s1;", "int *ptr = &val;", "char str[100];", "scanf(\"%[^\\n]\", str);",
  "#include <stdio.h>", "return 0;", "typedef struct Node Node;"
];

export default function App() {
  const {
    // keep other app state functions, but remove mock user handling
    // user, // removed – Supabase provides auth user
    // login, // removed – Supabase handles login
    // logout, // removed – Supabase handles logout
    updateStreak,
    completeLesson,
    saveQuizScore,
    completeChallenge,
    saveNote,
    toggleBookmark,
    awardAchievement,
    achievementsList
  } = useAppState();
  const { user: authUser, signIn, signOut } = useAuth();

  const { cards, getDueCards } = useFlashcards();
  const [theme, setTheme] = useState('dark');
  const [activePage, setActivePage] = useState('landing'); // landing | login | dashboard | study | compiler | visualizers | prep
  const [activeVisualizerTab, setActiveVisualizerTab] = useState('array');
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [expandedChapter, setExpandedChapter] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearchNavigate = (page, chapterIdx, sectionIdx) => {
    setActivePage(page);
    if (page === 'study' && chapterIdx !== undefined && sectionIdx !== undefined) {
      setActiveChapterIndex(chapterIdx);
      setActiveSectionIndex(sectionIdx);
    }
  };

  const isChapterUnlocked = () => true;
  


  const handleLoginSuccess = async (email, password) => {
    try {
      await signIn(email, password);
      setActivePage('dashboard');
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };

  const handleLogoutClick = async () => {
    await signOut();
    setActivePage('landing');
  };  
  // Custom Cursor Tracker State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const canvasRef = useRef(null);

  // Sync cursor pos
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sync hovering elements (for cursor expand)
  useEffect(() => {
    const addHoverListeners = () => {
      const interactives = document.querySelectorAll('button, a, select, input, textarea, [role="button"], option');
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    // Attach after DOM adjustments
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    
    addHoverListeners();
    return () => observer.disconnect();
  }, [activePage, activeVisualizerTab]);

  // Global Ctrl+K to open search modal
  useEffect(() => {
    const handleSearchShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleSearchShortcut);
    return () => window.removeEventListener('keydown', handleSearchShortcut);
  }, []);

  // Layer 4 Background Particles Canvas Engine (60 FPS)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let animationFrameId;
    let particles = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        speedX: Math.random() * 0.15 - 0.075,
        speedY: Math.random() * 0.15 - 0.075,
        alpha: Math.random() * 0.5 + 0.1
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = theme === 'dark' ? 'rgba(255, 255, 255,' : 'rgba(0, 0, 0,';
      
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${ctx.fillStyle}${p.alpha})`;
        ctx.fill();
        
        // Update positions
        p.x += p.speedX;
        p.y += p.speedY;
        
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
      });
      
      animationFrameId = requestAnimationFrame(drawParticles);
    };
    drawParticles();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  // Sync user details
  useEffect(() => {
    if (authUser) {
      updateStreak();
    }
  }, [authUser]);

  // Auto redirect logged in user to dashboard if they land on login
  useEffect(() => {
    if (authUser && activePage === 'login') {
      setActivePage('dashboard');
    }
  }, [authUser, activePage]);

  // Synchronize CSS themes
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Trigger confetti for level up or success
  useEffect(() => {
    if (user.achievements.length > 0) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 }
      });
    }
  }, [user.achievements.length]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleDevBypass = () => {
    login("DevMaster", "developer@makaut.edu");
    setActivePage('dashboard');
  };

  const dueCards = getDueCards();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      
      {/* Glowing Orb Cursor */}
      <div 
        className={`glowing-cursor ${isHovering ? 'hovering' : ''}`}
        style={{ left: `${mousePos.x}px`, top: `${mousePos.y}px` }}
      />

      {/* 4-LAYER MULTI-STAGE BACKGROUND ENVIRONMENT */}
      <div className="deep-background">
        {/* Layer 1: Radial Gradients from CSS variables */}
        
        {/* Layer 2: Blurred animating neon color orbs */}
        <div className="bg-orb bg-orb-blue" />
        <div className="bg-orb bg-orb-purple" />
        <div className="bg-orb bg-orb-cyan" />
        
        {/* Layer 3: Endless Scrolling VS Code Syntax highlighted code columns */}
        <div className="bg-code-scroll-container">
          {/* Translucent Mockups of VS Code Windows */}
          <div className="vscode-bg-mockup" style={{
            position: 'absolute',
            top: '12%',
            left: '4%',
            width: '420px',
            height: '280px',
            backgroundImage: 'url(/vscode_backdrop_mockup.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.20,
            borderRadius: '8px',
            filter: 'blur(0.5px)',
            pointerEvents: 'none',
            transform: 'rotate(-4deg)'
          }} />

          <div className="vscode-bg-mockup" style={{
            position: 'absolute',
            bottom: '15%',
            right: '6%',
            width: '480px',
            height: '320px',
            backgroundImage: 'url(/vscode_backdrop_mockup.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.18,
            borderRadius: '8px',
            filter: 'blur(0.5px)',
            pointerEvents: 'none',
            transform: 'rotate(5deg)'
          }} />
          {[
            { styleClass: 'bg-code-column' },
            { styleClass: 'bg-code-column bg-code-column-reverse' },
            { styleClass: 'bg-code-column bg-code-column-fast' }
          ].map((col, cIdx) => {
            const codeScaffold = [
              "#include <stdio.h>",
              "#include <stdlib.h>",
              "",
              "// Dynamic list node structure",
              "struct Node {",
              "    int val;",
              "    struct Node* next;",
              "};",
              "",
              "// Pointers Call by Reference swap",
              "void swap(int *a, int *b) {",
              "    int temp = *a;",
              "    *a = *b;",
              "    *b = temp;",
              "}",
              "",
              "// Recursive stack function",
              "int fib(int n) {",
              "    if (n <= 1) return n;",
              "    return fib(n - 1) + fib(n - 2);",
              "}",
              "",
              "int main() {",
              "    int x = 10, y = 20;",
              "    swap(&x, &y);",
              "    ",
              "    int *arr = malloc(5 * sizeof(int));",
              "    if (arr != NULL) {",
              "        arr[0] = fib(6);",
              "        printf(\"Fib value: %d\\n\", arr[0]);",
              "        free(arr);",
              "    }",
              "    return 0;",
              "}"
            ];
            const doubleCodeList = [...codeScaffold, ...codeScaffold, ...codeScaffold];
            // Duplicate array to allow seamless scrolling loop (0 to -50%)
            const finalLines = [...doubleCodeList, ...doubleCodeList];
            
            return (
              <div key={cIdx} className={col.styleClass}>
                {finalLines.map((line, lIdx) => {
                  let formatted = [];
                  formatted.push(<span key="ln" className="syntax-ln">{String(lIdx % 35 + 1).padStart(2, '0')}</span>);
                  
                  if (line.trim().startsWith('//') || line.trim().startsWith('/*')) {
                    formatted.push(<span key="comment" className="syntax-comment">{line}</span>);
                  } else {
                    const keywords = ['#include', '#define', 'struct', 'void', 'int', 'float', 'char', 'double', 'return', 'if', 'while', 'for', 'else', 'sizeof', 'free'];
                    const functions = ['printf', 'scanf', 'malloc', 'calloc', 'realloc', 'fib', 'swap', 'main'];
                    let words = line.split(/(\s+|,|\(|\)|\{|\}|;|\*|&)/);
                    words.forEach((word, wIdx) => {
                      if (keywords.includes(word.trim())) {
                        formatted.push(<span key={wIdx} className="syntax-kw">{word}</span>);
                      } else if (functions.includes(word.trim())) {
                        formatted.push(<span key={wIdx} className="syntax-fn">{word}</span>);
                      } else if (/^\d+$/.test(word.trim())) {
                        formatted.push(<span key={wIdx} className="syntax-num">{word}</span>);
                      } else if (word.startsWith('"') && word.endsWith('"')) {
                        formatted.push(<span key={wIdx} className="syntax-str">{word}</span>);
                      } else {
                        formatted.push(word);
                      }
                    });
                  }
                  
                  return (
                    <div key={lIdx} style={{ padding: '0 0.5rem', minHeight: '1.6rem' }}>
                      {formatted}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Layer 4: Tiny glowing canvas particles */}
        <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />
      </div>

      {/* FLOATING NAVBAR CAPSULE */}
      <nav className="glass-panel" style={{ 
        position: 'sticky', 
        top: '1.25rem', 
        zIndex: 1000, 
        padding: '0.6rem 1.75rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        margin: '1.25rem 2rem',
        borderRadius: '9999px',
        boxShadow: '0 10px 40px 0 rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Logo */}
        <div 
          onClick={() => setActivePage('landing')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          <GraduationCap size={20} color="var(--color-primary)" />
          <h1 style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.06em', background: 'linear-gradient(to right, #3B82F6, #8B5CF6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            C
          </h1>
        </div>

        {/* Floating tabs capsule links */}
        {user.isLoggedIn && (
          <div style={{ display: 'flex', gap: '0.2rem', background: 'rgba(255,255,255,0.03)', padding: '0.2rem', borderRadius: '9999px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={13} /> },
              { id: 'study', label: 'Study', icon: <BookOpen size={13} /> },
              { id: 'compiler', label: 'Compiler', icon: <Terminal size={13} /> },
              { id: 'visualizers', label: 'Simulators', icon: <Cpu size={13} /> },
              { id: 'prep', label: 'Exam Prep', icon: <Trophy size={13} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePage(tab.id)}
                className="btn"
                style={{
                  padding: '0.4rem 1rem',
                  fontSize: '0.75rem',
                  borderRadius: '9999px',
                  background: activePage === tab.id ? 'var(--color-primary)' : 'transparent',
                  color: activePage === tab.id ? '#FFFFFF' : 'var(--text-muted)'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* User stats widget & Theme toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {user.isLoggedIn ? (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.75rem' }}>
              <button 
                onClick={handleLogoutClick}
                style={{ background: 'transparent', border: 'none', color: 'var(--color-error)', cursor: 'pointer', padding: '0.25rem' }}
                title="Sign Out"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className="btn btn-outline" 
                onClick={handleDevBypass}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', display: 'flex', gap: '0.25rem', borderColor: 'var(--color-secondary)' }}
              >
                <ShieldAlert size={12} color="var(--color-secondary)" /> Skip Login (Dev)
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => setActivePage('login')}
                style={{ padding: '0.4rem 1rem', fontSize: '0.75rem', borderRadius: '9999px' }}
              >
                Login
              </button>
            </div>
          )}

          {/* Search Trigger Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="btn"
            title="Search anything (Ctrl+K)"
            style={{
              padding: '0.4rem',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid var(--glass-border)',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <Search size={13} />
          </button>

          <div 
            onClick={toggleTheme}
            className="theme-switch-container"
            data-theme-active={theme}
            title="Toggle Theme"
          >
            <Sun size={11} color={theme === 'light' ? 'var(--color-primary)' : 'var(--text-muted)'} />
            <Moon size={11} color={theme === 'dark' ? 'var(--color-secondary)' : 'var(--text-muted)'} />
            <div className="theme-switch-thumb">
              {theme === 'dark' ? <Moon size={10} /> : <Sun size={10} />}
            </div>
          </div>
        </div>
      </nav>

      {/* CORE WORKSPACE PORTAL */}
      <main style={{ flex: 1, padding: '1rem 3.5rem 3.5rem 3.5rem' }}>
        
        {/* PREMIUM KEYNOTE LANDING PAGE */}
        {activePage === 'landing' && (
          <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '6rem' }}>
            
            {/* Huge WWDC Hero Section */}
            <div style={{ 
              textAlign: 'center', 
              maxWidth: '900px', 
              margin: '5rem auto 2rem auto', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '1.5rem',
              position: 'relative'
            }}>
              
              {/* Background large floating symbols behind Hero */}
              <div style={{ position: 'absolute', top: '-10%', left: '-15%', fontSize: '1.25rem', fontFamily: 'var(--font-code)', opacity: 0.05, transform: 'rotate(-15deg)' }}>
                #include &lt;stdio.h&gt;<br/>int main()
              </div>
              <div style={{ position: 'absolute', bottom: '15%', right: '-15%', fontSize: '1.25rem', fontFamily: 'var(--font-code)', opacity: 0.05, transform: 'rotate(12deg)' }}>
                void *ptr = malloc(32);<br/>free(ptr);
              </div>

              <span className="badge badge-primary" style={{ alignSelf: 'center', padding: '0.4rem 1rem', borderRadius: '9999px', fontSize: '0.8rem' }}>
                WWDC 2026 Developer Aesthetic
              </span>
              
              <h2 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.05', letterSpacing: '-0.04em' }}>
                Master C Programming from <br/>
                <span className="glow-blue" style={{ fontWeight: '900' }}>Zero</span> to <span className="glow-purple-gradient">Placement Ready</span>
              </h2>
              
              <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6', fontWeight: '400' }}>
                Learn interactively with contiguous memory visualizers, dynamic heap simulators, in-browser compiler diagnostics, and live MAKAUT exam insights.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                <button className="btn btn-primary" onClick={() => setActivePage(user.isLoggedIn ? 'dashboard' : 'login')} style={{ padding: '0.9rem 2.25rem', borderRadius: '9999px', fontSize: '0.9rem' }}>
                  {user.isLoggedIn ? 'Go to Dashboard' : 'Start Learning Free'}
                </button>
                <a href="#syllabus-explorer" className="btn btn-outline" style={{ padding: '0.9rem 2.25rem', borderRadius: '9999px', fontSize: '0.9rem' }}>
                  Explore Syllabus
                </a>
              </div>
            </div>

            {/* Transparent Glass Stacked Carousel Features */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem', width: '100%' }}>
              <h3 style={{ fontSize: '2rem', textAlign: 'center', letterSpacing: '-0.03em' }}>Futuristic Interactive Learning</h3>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                position: 'relative',
                width: '100%', 
                maxWidth: '900px',
                height: '320px'
              }}>
                {/* Left Arrow Button */}
                <button 
                  onClick={() => setActiveSlide(prev => (prev === 0 ? 2 : prev - 1))}
                  className="btn btn-outline"
                  style={{ 
                    borderRadius: '50%', 
                    width: '44px', 
                    height: '44px', 
                    padding: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'absolute',
                    left: '2rem',
                    zIndex: 10
                  }}
                >
                  &larr;
                </button>

                {/* Stack Track */}
                <div style={{ 
                  position: 'relative', 
                  width: '100%', 
                  height: '100%', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  overflow: 'hidden'
                }}>
                  {[
                    {
                      icon: <Cpu size={30} color="var(--color-primary)" />,
                      title: "3D Memory Visualizations",
                      description: "Animate malloc allocation, free block dissolution, pointer arrow addresses, and stack offsets inside live glass panels."
                    },
                    {
                      icon: <Terminal size={30} color="var(--color-secondary)" />,
                      title: "VS Code Sandboxed Editor",
                      description: "Type C syntax in a premium glass-morphic code editor. Supply inputs to standard scanfs, run tests, and check compile metrics."
                    },
                    {
                      icon: <Trophy size={30} color="var(--color-warning)" />,
                      title: "MAKAUT PYQ Analytics",
                      description: "Explore complete exam solutions (2018-2025) with expected writing patterns, and examiner warnings per syllabus chapter."
                    }
                  ].map((card, idx) => {
                    let position = idx - activeSlide;
                    if (position < -1) position += 3;
                    if (position > 1) position -= 3;
                    
                    let translateX = '0px';
                    let scale = 1;
                    let opacity = 1;
                    let zIndex = 2;
                    let filter = 'none';

                    if (position === -1) {
                      translateX = '-220px';
                      scale = 0.85;
                      opacity = 0.35;
                      zIndex = 1;
                      filter = 'blur(1px)';
                    } else if (position === 1) {
                      translateX = '220px';
                      scale = 0.85;
                      opacity = 0.35;
                      zIndex = 1;
                      filter = 'blur(1px)';
                    } else if (position === 0) {
                      translateX = '0px';
                      scale = 1.05;
                      opacity = 1;
                      zIndex = 3;
                    } else {
                      opacity = 0;
                      zIndex = 0;
                    }

                    return (
                      <div 
                        key={idx}
                        className="glass-panel"
                        style={{
                          position: 'absolute',
                          width: '380px',
                          padding: '2rem',
                          textAlign: 'center',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '1.25rem',
                          background: 'rgba(255, 255, 255, 0.01)',
                          borderColor: position === 0 ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.08)',
                          boxShadow: position === 0 
                            ? '0 25px 60px rgba(59, 130, 246, 0.15)' 
                            : '0 15px 35px rgba(0,0,0,0.3)',
                          borderRadius: '16px',
                          transform: `translateX(${translateX}) scale(${scale})`,
                          opacity: opacity,
                          zIndex: zIndex,
                          filter: filter,
                          transition: 'all 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
                          pointerEvents: position === 0 ? 'auto' : 'none'
                        }}
                      >
                        <div className="flex-center" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', color: 'var(--color-primary)' }}>
                          {card.icon}
                        </div>
                        <h4 style={{ fontSize: '1.35rem', fontWeight: '800' }}>{card.title}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                          {card.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Right Arrow Button */}
                <button 
                  onClick={() => setActiveSlide(prev => (prev === 2 ? 0 : prev + 1))}
                  className="btn btn-outline"
                  style={{ 
                    borderRadius: '50%', 
                    width: '44px', 
                    height: '44px', 
                    padding: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'absolute',
                    right: '2rem',
                    zIndex: 10
                  }}
                >
                  &rarr;
                </button>
              </div>

              {/* Dots Indicators */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '-1.5rem' }}>
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    style={{
                      width: activeSlide === idx ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '9999px',
                      background: activeSlide === idx ? 'var(--color-primary)' : 'rgba(255,255,255,0.15)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Syllabus capsules navigator */}
            <div id="syllabus-explorer">
              <h3 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2.5rem', letterSpacing: '-0.03em' }}>MAKAUT Curriculum Chapters</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', maxWidth: '850px', margin: '0 auto' }}>
                {[
                  "Introduction to C & I/O",
                  "Operators & Precedence Table",
                  "Control Branches & Loop Iterations",
                  "Functions & Call stack Recursion",
                  "1D/2D Arrays & scanset Strings",
                  "Pointer Registers & Dynamic Memory Heap",
                  "Structures, Unions & Enums",
                  "File Open Modes & Traversal Cursor",
                  "Storage Classes & Preprocessors"
                ].map((topic, i) => (
                  <div 
                    key={i} 
                    className="glass-panel"
                    style={{ 
                      padding: '0.75rem 1.5rem', 
                      borderRadius: '9999px',
                      fontSize: '0.85rem', 
                      fontWeight: '600',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    {topic}
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ */}
            <div style={{ maxWidth: '750px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '2.5rem' }}>Platform FAQ</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { q: "Is the platform aligned with standard MAKAUT parameters?", a: "Yes. Every calculation, alignment padding offset, and file modes match standard MAKAUT ESCS201 specifications." },
                  { q: "Can I use it on standard mobile browser sizes?", a: "Absolutely. Floating glass layouts scale dynamically across all screens." }
                ].map((faq, idx) => (
                  <details key={idx} style={{ padding: '1.25rem', background: 'transparent', border: '1px solid var(--glass-border)', borderRadius: '12px', cursor: 'pointer' }}>
                    <summary style={{ fontWeight: '700', fontSize: '0.95rem' }}>{faq.q}</summary>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', cursor: 'auto', lineHeight: '1.6' }}>{faq.a}</p>
                  </details>
                ))}
              </div>
            </div>

            {/* Footer */}
            <footer style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center', gap: '0.25rem', alignItems: 'center' }}>
              <span>Designed with</span> <Heart size={12} color="var(--color-error)" fill="var(--color-error)" /> <span>for B.Tech learners. C Master © 2026.</span>
            </footer>

          </div>
        )}

        {/* LOGIN / AUTH PORTAL */}
        {activePage === 'login' && !user.isLoggedIn && (
          <AuthPortal onLoginSuccess={handleLoginSuccess} onDevBypass={handleDevBypass} />
        )}

        {/* Split Grid Layout for Dashboard and Study Portals */}
        {user.isLoggedIn && (activePage === 'dashboard' || activePage === 'study') && (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem' }} className="animate-fade">
            
            {/* Persistent Chapters Sidebar on the left */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 'bold' }}>Syllabus Chapters</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {chapters.map((ch, chIdx) => {
                  const unlocked = isChapterUnlocked(chIdx);
                  const isExpanded = expandedChapter === chIdx;
                  
                  return (
                    <div 
                      key={ch.id} 
                      className="glass-panel" 
                      style={{ 
                        padding: '0.5rem', 
                        borderRadius: '12px',
                        opacity: unlocked ? 1 : 0.55
                      }}
                    >
                      <div 
                        onClick={() => unlocked && setExpandedChapter(isExpanded ? null : chIdx)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'space-between',
                          padding: '0.6rem 0.85rem',
                          cursor: unlocked ? 'pointer' : 'not-allowed'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {!unlocked && <Lock size={12} color="var(--text-muted)" />}
                          <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>
                            {ch.title.split(":")[0]}
                          </span>
                        </div>
                        {unlocked ? (isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : null}
                      </div>

                      {unlocked && isExpanded && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.25rem', borderTop: '1px solid var(--glass-border)', paddingTop: '0.4rem' }}>
                          {ch.sections.map((sec, secIdx) => {
                            const activeSec = chIdx === activeChapterIndex && secIdx === activeSectionIndex && activePage === 'study';
                            const completed = user.completedLessons[sec.id];
                            return (
                              <div
                                key={sec.id}
                                onClick={() => {
                                  setActiveChapterIndex(chIdx);
                                  setActiveSectionIndex(secIdx);
                                  setActivePage('study');
                                }}
                                style={{
                                  padding: '0.5rem 0.85rem',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontSize: '0.78rem',
                                  background: activeSec ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                                  color: activeSec ? 'var(--color-primary)' : 'var(--text-muted)',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center'
                                }}
                              >
                                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
                                  {sec.title}
                                </span>
                                {completed && <CheckCircle size={10} color="var(--color-success)" />}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Pane Details (Dashboard or Study Workspace) */}
            <div style={{ minWidth: 0 }}>
              {activePage === 'dashboard' && (
                <DashboardView 
                  user={user} 
                  achievementsList={achievementsList} 
                  totalFlashcardsDue={dueCards.length}
                  onNavigate={(page) => setActivePage(page)}
                />
              )}
              {activePage === 'study' && (
                <StudyView
                  user={user}
                  activeChapterIndex={activeChapterIndex}
                  activeSectionIndex={activeSectionIndex}
                  setActiveChapterIndex={setActiveChapterIndex}
                  setActiveSectionIndex={setActiveSectionIndex}
                  onCompleteLesson={completeLesson}
                  onSaveQuizScore={saveQuizScore}
                  onSaveNote={saveNote}
                  onToggleBookmark={toggleBookmark}
                />
              )}
            </div>

          </div>
        )}

        {/* ONLINE COMPILER CODE EDITOR VIEW */}
        {activePage === 'compiler' && user.isLoggedIn && (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <OnlineCompiler onExecuteSuccess={() => awardAchievement("compiler_run")} />
          </div>
        )}

        {/* VISUALIZERS / SIMULATORS VIEW */}
        {activePage === 'visualizers' && user.isLoggedIn && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Visualizer selector tab */}
            <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { id: 'array', label: '1D Array Arena' },
                { id: '2d_array', label: '2D Matrix Arena' },
                { id: 'sort_algos', label: 'Sorting & Searching Arena' },
                { id: 'heap', label: 'Heap DMA Simulator' },
                { id: 'ds', label: 'Data Structures Visualizer' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveVisualizerTab(tab.id)}
                  style={{
                    background: activeVisualizerTab === tab.id ? 'var(--color-primary)' : 'transparent',
                    border: 'none',
                    color: activeVisualizerTab === tab.id ? '#FFFFFF' : 'var(--text-muted)',
                    padding: '0.4rem 1.25rem',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    borderRadius: '9999px',
                    cursor: 'pointer'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeVisualizerTab === 'array' && <ArraySimulator />}
            {activeVisualizerTab === '2d_array' && <MatrixSimulator2D />}
            {activeVisualizerTab === 'sort_algos' && <SortingSearchingVisualizer />}
            {activeVisualizerTab === 'heap' && <HeapSimulator />}
            {activeVisualizerTab === 'ds' && <DataStructureVisualizer />}

          </div>
        )}

        {/* EXAM PREPARATION SECTION VIEW */}
        {activePage === 'prep' && user.isLoggedIn && (
          <ExamPrepMode user={user} awardAchievement={awardAchievement} />
        )}

      </main>

      {/* LLM Search Modal Overlay */}
      <LLMSearch
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onNavigate={handleSearchNavigate}
      />

    </div>
  );
}
