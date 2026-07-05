import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, AlertTriangle, Cpu, Terminal as TermIcon, Bug, ChevronRight } from 'lucide-react';
import MemoryVisualizer from './MemoryVisualizer';

export default function Terminal({
  consoleLogs,
  errors = [],
  metrics,
  ram,
  code,
  inputConsole,
  setInputConsole,
  onRun,
  steps = [],
  loading = false,
  waitingForInput = false
}) {
  const [activeTab, setActiveTab] = useState('terminal');
  const [debugStepIdx, setDebugStepIdx] = useState(0);
  const [isPlayingDebug, setIsPlayingDebug] = useState(false);
  const [debugInterval, setDebugInterval] = useState(null);

  const [currentInput, setCurrentInput] = useState('');
  const termEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    termEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [consoleLogs, waitingForInput]);

  // Handle Enter key on the interactive terminal input line
  const handleTerminalKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const val = currentInput;
      setCurrentInput('');

      // Append user input to the inputConsole buffer (space/newline separated)
      const nextInputConsole = inputConsole.trim() ? `${inputConsole.trim()}\n${val}` : val;
      setInputConsole(nextInputConsole);
      
      // Delay briefly to allow React state hook to apply, then compile & execute
      setTimeout(() => {
        onRun(true); // runs with isSubmit = true
      }, 50);
    }
  };

  // Click handler to focus the interactive input line
  const handleTerminalBodyClick = () => {
    if (activeTab === 'terminal' && waitingForInput) {
      inputRef.current?.focus();
    }
  };

  // Helper to render console outputs interleaved with the active input cursor
  const renderTerminalLogs = () => {
    if (!consoleLogs || consoleLogs === 'Press Compile & Run or Step Debugger to visualize.') {
      return (
        <span style={{ color: 'rgba(255,255,255,0.25)', fontStyle: 'italic' }}>
          Click ▶ Compile &amp; Run or press Ctrl+Enter to compile &amp; execute your C code...
        </span>
      );
    }

    const lines = consoleLogs.split('\n');
    
    if (waitingForInput) {
      const promptLine = lines[lines.length - 1];
      const otherLines = lines.slice(0, lines.length - 1);
      
      return (
        <>
          {otherLines.map((line, idx) => (
            <div key={idx} style={{ minHeight: '1.2rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{line}</div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', minHeight: '1.2rem' }}>
            <span style={{ whiteSpace: 'pre-wrap', color: '#E2E8F0' }}>{promptLine}</span>
            <input
              ref={inputRef}
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleTerminalKeyDown}
              autoFocus
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#34D399', // Beautiful VS Code green for user input values
                fontFamily: 'var(--font-code)',
                fontSize: '0.82rem',
                padding: 0,
                margin: 0,
                marginLeft: '0.35rem',
                flex: 1,
                minWidth: '100px',
                caretColor: '#34D399',
                boxShadow: 'none'
              }}
            />
          </div>
        </>
      );
    }

    // Normal terminal log rendering (finished execution, compilation errors, etc.)
    return lines.map((line, idx) => (
      <div 
        key={idx} 
        style={{ 
          minHeight: '1.2rem', 
          whiteSpace: 'pre-wrap', 
          wordBreak: 'break-all',
          color: line.includes('[Build Failed]') || line.includes('Error') || line.includes('Exception') ? '#F87171' :
                 line.includes('Warning') ? '#FBBF24' : '#E2E8F0'
        }}
      >
        {line}
      </div>
    ));
  };

  // Step Debugger controls
  const handleNextStep = () => steps.length > 0 && setDebugStepIdx(p => (p + 1) % steps.length);
  const handlePrevStep = () => steps.length > 0 && setDebugStepIdx(p => (p - 1 + steps.length) % steps.length);

  const handleTogglePlayDebug = () => {
    if (isPlayingDebug) {
      clearInterval(debugInterval);
      setDebugInterval(null);
      setIsPlayingDebug(false);
    } else {
      setIsPlayingDebug(true);
      const interval = setInterval(() => {
        setDebugStepIdx(prev => {
          if (prev >= steps.length - 1) {
            clearInterval(interval);
            setIsPlayingDebug(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      setDebugInterval(interval);
    }
  };

  useEffect(() => { return () => { if (debugInterval) clearInterval(debugInterval); }; }, [debugInterval]);
  const activeStep = steps[debugStepIdx];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.15)',
      borderTop: '1px solid var(--glass-border)',
      color: 'var(--text-primary)',
      overflow: 'hidden'
    }}>
      
      {/* VS Code tab headers */}
      <div style={{
        display: 'flex',
        background: 'rgba(0, 0, 0, 0.2)',
        borderBottom: '1px solid var(--glass-border)',
        padding: '0 0.5rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '0.2rem' }}>
          {[
            { id: 'terminal', label: 'Terminal', icon: <TermIcon size={12} /> },
            { id: 'problems', label: `Problems (${errors.length})`, icon: <AlertTriangle size={12} color={errors.length > 0 ? 'var(--color-error)' : 'inherit'} /> },
            { id: 'memory', label: 'Memory Sandbox', icon: <Cpu size={12} /> },
            { id: 'debug', label: 'Step Debugger', icon: <Bug size={12} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--color-primary)' : '2px solid transparent',
                color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-muted)',
                padding: '0.6rem 1rem',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          fontSize: '0.7rem',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-code)',
          paddingRight: '0.75rem'
        }}>
          <span>Build: {metrics?.time || '0.00 ms'}</span>
          <span>RAM: {metrics?.memory || '0 KB'}</span>
        </div>
      </div>

      {/* Tab body */}
      <div 
        style={{ flex: 1, overflow: 'auto', background: 'rgba(0,0,0,0.15)', cursor: waitingForInput ? 'text' : 'default' }}
        onClick={handleTerminalBodyClick}
      >

        {/* ===== UNIFIED TERMINAL TAB ===== */}
        {activeTab === 'terminal' && (
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'var(--font-code)',
            fontSize: '0.82rem',
            lineHeight: '1.6'
          }}>
            <div style={{ flex: 1, padding: '0.85rem 1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.1rem' }}>
              
              {/* Log messages & interactive input cursor */}
              {renderTerminalLogs()}

              {/* Loading spinner */}
              {loading && (
                <div style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
                  <span className="spinner" style={{ 
                    display: 'inline-block', 
                    width: '10px', 
                    height: '10px', 
                    border: '2px solid rgba(255,255,255,0.2)',
                    borderTopColor: 'var(--color-primary)',
                    borderRadius: '50%',
                    marginRight: '0.5rem'
                  }} />
                  Running binary executable...
                </div>
              )}

              <div ref={termEndRef} />
            </div>


          </div>
        )}

        {/* Problems Tab */}
        {activeTab === 'problems' && (
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {errors.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', fontWeight: 'bold' }}>✓ No problems detected in your syntax.</div>
            ) : (
              errors.map((err, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.6rem 0.85rem',
                    borderRadius: '6px',
                    background: 'rgba(239, 68, 68, 0.05)',
                    borderLeft: '4px solid var(--color-error)',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-code)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem'
                  }}
                >
                  <span style={{ fontWeight: 'bold', color: 'var(--color-error)' }}>Syntax/Linker Error:</span>
                  <span style={{ color: 'var(--text-primary)' }}>{err}</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Memory Sandbox Tab */}
        {activeTab === 'memory' && <MemoryVisualizer ram={ram} />}

        {/* Step Debugger Tab */}
        {activeTab === 'debug' && (
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
              <button onClick={handlePrevStep} disabled={steps.length <= 1} className="btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)' }}>Prev</button>
              <button onClick={handleTogglePlayDebug} disabled={steps.length <= 1} className="btn" style={{ padding: '0.3rem 0.8rem', fontSize: '0.7rem', background: isPlayingDebug ? 'var(--color-error)' : 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {isPlayingDebug ? <Pause size={10} /> : <Play size={10} />}
                {isPlayingDebug ? 'Pause' : 'Auto Play'}
              </button>
              <button onClick={handleNextStep} disabled={steps.length <= 1} className="btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)' }}>Next</button>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginLeft: '1rem' }}>
                Step {steps.length > 0 ? debugStepIdx + 1 : 0} of {steps.length}
              </span>
            </div>

            {steps.length === 0 ? (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Run compiler first to populate step traces.
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>Current Statement:</div>
                  <pre style={{ padding: '0.85rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--glass-border)', fontFamily: 'var(--font-code)', fontSize: '0.8rem', color: 'var(--color-warning)' }}>
                    {activeStep?.statement}
                  </pre>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)', marginTop: '0.5rem' }}>Step Log:</div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{activeStep?.log}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-secondary)' }}>RAM State at Step:</div>
                  <MemoryVisualizer ram={activeStep?.ramState || {}} />
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
