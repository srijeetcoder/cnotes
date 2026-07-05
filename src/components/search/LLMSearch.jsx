import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Navigation, AlertCircle, Trophy, BookOpen, Terminal } from 'lucide-react';

const KNOWLEDGE_BASE = {
  pointers: {
    title: 'Pointers & RAM Address References',
    summary: 'Pointers in C are variables that store the memory address of another variable. By dereferencing a pointer using the asterisk (*), you can directly manipulate the data stored at that address.',
    links: [
      { label: 'Open Study Lesson: Variables & Data Types', page: 'study', chapter: 0, section: 1 },
      { label: 'Open Compiler Memory visualizer', page: 'compiler' }
    ]
  },
  malloc: {
    title: 'Dynamic Heap Memory Allocation (malloc & free)',
    summary: 'malloc() dynamically allocates a contiguous block of memory on the Heap at runtime. It returns a void pointer to the first cell. Memory allocated by malloc must be released using free() to prevent leaks.',
    links: [
      { label: 'Open Study Lesson: Variables & Data Types', page: 'study', chapter: 0, section: 1 },
      { label: 'Launch Online Compiler', page: 'compiler' }
    ]
  },
  scanf: {
    title: 'Interactive User Stdin inputs (scanf)',
    summary: 'scanf() reads formatted input values from the standard input stream (stdin). It requires address references (&) to write directly into variable containers.',
    links: [
      { label: 'Open Study Lesson: Input & Output Basics', page: 'study', chapter: 0, section: 2 },
      { label: 'Launch Online Compiler', page: 'compiler' }
    ]
  },
  sorting: {
    title: 'Sorting Algorithms (Bubble, Selection, Merge, Quick)',
    summary: 'Sorting arranges elements in ascending/descending order. Bubble sort swaps adjacent cells, while Quick sort uses pivots and partitioning.',
    links: [
      { label: 'Launch 2D Simulators Dashboard', page: 'visualizers' }
    ]
  },
  matrix: {
    title: '2D Arrays and Transpose Matrix Operations',
    summary: 'Matrix structures store data in rows and columns. Transposing swaps rows with columns, transforming cell matrix[i][j] into transpose[j][i].',
    links: [
      { label: 'Open Study Lesson: MAKAUT Lab Programs', page: 'study', chapter: 0, section: 0 },
      { label: 'Launch 2D Simulators Dashboard', page: 'visualizers' }
    ]
  },
  makaut: {
    title: 'MAKAUT Syllabus & Placement Questions',
    summary: 'MAKAUT examinations emphasize structured algorithms, pointer arithmetic, DMA memory leaks, and linked list structures.',
    links: [
      { label: 'Launch Exam Preparation Mode', page: 'prep' }
    ]
  }
};

export default function LLMSearch({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResult(null);
    }
  }, [isOpen]);

  // Command + K / Ctrl + K hotkey listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    // Simulate LLM Search Engine response delay
    setTimeout(() => {
      const qLower = query.toLowerCase();
      let matchedKey = null;

      Object.keys(KNOWLEDGE_BASE).forEach(key => {
        if (qLower.includes(key)) {
          matchedKey = key;
        }
      });

      if (matchedKey) {
        setResult(KNOWLEDGE_BASE[matchedKey]);
      } else {
        // Fallback generic intelligent LLM answer
        setResult({
          title: `C-Notes Search: "${query}"`,
          summary: `Our C Learning Index suggests verifying structure blueprints. In standard C programs, logic paths include preprocessors, main entry scopes, and variable blocks. Refer to our compiler visualizers to inspect pointer steps.`,
          links: [
            { label: 'Open Interactive Syllabus Study Guide', page: 'study' },
            { label: 'Open Online Compiler', page: 'compiler' }
          ]
        });
      }
      setLoading(false);
    }, 850);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 10000,
      background: 'rgba(5, 8, 16, 0.75)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }} onClick={onClose}>
      
      {/* Modal Card */}
      <div 
        className="glass-panel" 
        style={{
          width: '100%',
          maxWidth: '650px',
          borderRadius: '16px',
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--glass-border)',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'fadeUp 0.25s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search header bar */}
        <form onSubmit={handleSearchSubmit} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--glass-border)',
          background: 'rgba(0, 0, 0, 0.15)'
        }}>
          <Search size={20} color="var(--color-primary)" />
          <input
            ref={inputRef}
            placeholder="Search variables, compiler errors, MAKAUT questions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '1rem',
              outline: 'none',
              fontFamily: 'Inter, sans-serif'
            }}
          />
          <button 
            type="submit"
            className="btn btn-primary"
            style={{ borderRadius: '8px', padding: '0.4rem 1rem', fontSize: '0.75rem' }}
          >
            Ask LLM
          </button>
        </form>

        {/* Content results area */}
        <div style={{ padding: '1.5rem', maxHeight: '380px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', padding: '2rem 0' }}>
              <div className="spinner" style={{ width: '24px', height: '24px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Synthesizing knowledge engine references...</div>
            </div>
          )}

          {!loading && !result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Suggested Queries:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['pointers', 'malloc', 'scanf', 'sorting methods', 'makaut exams'].map(suggest => (
                  <button
                    key={suggest}
                    onClick={() => { setQuery(suggest); setTimeout(() => handleSearchSubmit(), 50); }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      padding: '0.4rem 0.85rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.target.style.borderColor = 'var(--color-primary)'}
                    onMouseLeave={(e) => e.target.style.borderColor = 'var(--glass-border)'}
                  >
                    "{suggest}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {!loading && result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', animation: 'fadeUp 0.15s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Sparkles size={16} color="var(--color-secondary)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>AI Search Synthesis</span>
              </div>

              <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                {result.title}
              </div>

              <p style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-muted)', margin: 0 }}>
                {result.summary}
              </p>

              {/* Navigation Action Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Direct Portal Links:</div>
                {result.links.map((lnk, lIdx) => (
                  <button
                    key={lIdx}
                    onClick={() => {
                      onNavigate(lnk.page, lnk.chapter, lnk.section);
                      onClose();
                    }}
                    className="btn btn-outline"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.8rem',
                      padding: '0.5rem 0.85rem',
                      textAlign: 'left',
                      justifyContent: 'flex-start',
                      background: 'rgba(255,255,255,0.01)'
                    }}
                  >
                    <Navigation size={12} color="var(--color-primary)" />
                    {lnk.label}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Command footer bar */}
        <div style={{
          padding: '0.75rem 1.5rem',
          background: 'rgba(0, 0, 0, 0.25)',
          borderTop: '1px solid var(--glass-border)',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.7rem',
          color: 'var(--text-muted)'
        }}>
          <span>Press <strong>ESC</strong> or click outside to dismiss</span>
          <span>Powered by C-Notes LLM Engine</span>
        </div>

      </div>

    </div>
  );
}
