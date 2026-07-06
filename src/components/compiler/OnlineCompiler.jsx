import React, { useState, useEffect, useRef } from 'react';
import { Columns, Eye, Play, RotateCcw, AlertTriangle, HelpCircle, Expand, Maximize2, Minimize2, Search } from 'lucide-react';
import { executeCCode } from '../../interpreter/cInterpreter';

// Custom Panels
import FileExplorer from './panels/FileExplorer';
import Terminal from './panels/Terminal';
import CodeEditor from './editor/CodeEditor';

export default function OnlineCompiler({ initialCode = null, onExecuteSuccess = null }) {
  const [code, setCode] = useState(initialCode || `// Sample Program
#include <stdio.h>

int main() {
    int x = 42;
    printf("Welcome to the C IDE!\\n");
    printf("Value of x is: %d\\n", x);
    return 0;
}`);
  
  const [inputConsole, setInputConsole] = useState('');
  const [consoleLogs, setConsoleLogs] = useState('Press Compile & Run or Step Debugger to visualize.');
  const [errorsList, setErrorsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({ time: '0.00 ms', memory: '0 KB' });
  const [ramVisual, setRamVisual] = useState({});
  const [steps, setSteps] = useState([]);
  const [waitingForInput, setWaitingForInput] = useState(false);
  const [cumulativeOutput, setCumulativeOutput] = useState('');
  const inputBufferRef = useRef(''); // Holds latest stdin buffer synchronously
  const [fontSize, setFontSize] = useState(14);
  const [wordWrap, setWordWrap] = useState(true);

  // Layout sidebar toggles
  const [showExplorer, setShowExplorer] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [fullScreen, setFullScreen] = useState(false);

  // Keep input buffer ref in sync with inputConsole state
  useEffect(() => {
    inputBufferRef.current = inputConsole;
  }, [inputConsole]);

  const handleCompileAndRun = (isSubmit = false) => {
    setLoading(true);
    let currentInputs = isSubmit ? inputConsole : '';
    if (!isSubmit) {
      // Fresh run: reset state but keep user-provided stdin buffer
      // setInputConsole(''); // keep existing inputConsole
      setWaitingForInput(false);
      setCumulativeOutput('');
      // Show compilation message only on fresh run
      setConsoleLogs('Compiling main.c and resolving addresses...');
    }
    setErrorsList([]);

    setTimeout(() => {
      try {
        const result = executeCCode(code, currentInputs);
        setWaitingForInput(result.waitingForInput || false);

        // Separate real compile/runtime errors from warnings
        const hardErrors = (result.errors || []).filter(e =>
          e.includes('Error') || e.includes('Compilation') || e.includes('Syntax')
        );
        const warnings = (result.errors || []).filter(e =>
          e.includes('Warning') || e.includes('Resource')
        );

        if (hardErrors.length > 0) {
          // Genuine build failure
          setErrorsList(result.errors);
          const combined = result.output + '\n\n[Build Failed]\n' + hardErrors.join('\n');
          setCumulativeOutput(prev => prev + combined + '\n');
          setConsoleLogs(prev => prev + combined);
        } else {
          // Program ran fine (warnings shown separately)
          if (warnings.length > 0) setErrorsList(warnings);
          else setErrorsList([]);

          if (result.waitingForInput) {
            // Append output while waiting for more input
            setCumulativeOutput(prev => prev + result.output + '\n');
            setConsoleLogs(prev => prev + result.output + '\n');
          } else {
            const finalOut = result.output || 'Program exited with code 0 (no outputs).';
            setCumulativeOutput(prev => prev + finalOut + '\n');
            setConsoleLogs(prev => prev + finalOut + '\n');
            // Clear input buffer after successful run
            setInputConsole('');
            inputBufferRef.current = '';
            if (onExecuteSuccess) {
              onExecuteSuccess();
            }
          }
        }

        setRamVisual(result.ram || {});
        setSteps(result.steps || []);

        const lines = code.split('\n').length;
        const timeMs = (lines * 0.12 + Math.random() * 0.4).toFixed(2);
        const memKb = Math.floor(lines * 0.35 + Math.random() * 4);
        setMetrics({ time: `${timeMs} ms`, memory: `${memKb} KB` });

      } catch (err) {
        const errMsg = `Runtime Exception: ${err.message}`;
        setCumulativeOutput(prev => prev + errMsg + '\n');
        setConsoleLogs(prev => prev + errMsg + '\n');
      }
      setLoading(false);
    }, 500);
  };

  const handleReset = () => {
    setCode(`// Reset Program
#include <stdio.h>

int main() {
    printf("Hello World\\n");
    return 0;
}`);
    setInputConsole('');
    setConsoleLogs('Workspace reset.');
    setErrorsList([]);
    setRamVisual({});
    setSteps([]);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleShortcuts = (e) => {
      // Ctrl + Enter (Compile & Run)
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleCompileAndRun();
      }
      // Ctrl + S (Save code mock)
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        alert('File auto-saved locally in IDE cache!');
      }
    };
    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, [code, inputConsole]);

  return (
    <div 
      className="glass-panel animate-fade"
      style={fullScreen ? {
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        borderRadius: 0,
        boxShadow: 'none',
        overflow: 'hidden',
        background: '#050505',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)'
      } : {
        display: 'flex',
        flexDirection: 'column',
        height: '80vh',
        width: '100%',
        borderRadius: '24px',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 24px 60px rgba(0, 0, 0, 0.7)',
        overflow: 'hidden',
        background: '#050505',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)'
      }}
    >
      {/* IDE Top window Title bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.75rem 1.25rem',
        background: '#050505',
        borderBottom: '1px solid var(--glass-border)',
        userSelect: 'none'
      }}>
        {/* Apple Style Window Controls */}
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F56', cursor: 'pointer' }} onClick={() => setFullScreen(false)} title="Minimize" />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }} />
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27C93F', cursor: 'pointer' }} onClick={() => setFullScreen(!fullScreen)} title="Toggle Fullscreen" />
          <span style={{ fontSize: '0.75rem', fontWeight: 'bold', marginLeft: '0.5rem', fontFamily: 'var(--font-code)', color: 'var(--text-muted)' }}>C-IDE v2.0 (MAKAUT Curriculum)</span>
        </div>

        {/* Sidebar and panel visibility controls */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            onClick={() => setShowExplorer(!showExplorer)} 
            className="btn" 
            style={{ 
              padding: '0.35rem 0.6rem', 
              fontSize: '0.7rem', 
              background: showExplorer ? 'rgba(139, 0, 0, 0.15)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              borderColor: showExplorer ? 'var(--color-primary)' : 'var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: '#ffffff',
              fontWeight: '600'
            }}
          >
            <Columns size={12} /> Explorer
          </button>

          <button 
            onClick={() => setShowTerminal(!showTerminal)} 
            className="btn" 
            style={{ 
              padding: '0.35rem 0.6rem', 
              fontSize: '0.7rem', 
              background: showTerminal ? 'rgba(139, 0, 0, 0.15)' : 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              borderColor: showTerminal ? 'var(--color-primary)' : 'var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: '#ffffff',
              fontWeight: '600'
            }}
          >
            Terminal
          </button>

          <button 
            onClick={() => setFullScreen(!fullScreen)} 
            className="btn" 
            style={{ 
              padding: '0.35rem 0.6rem', 
              fontSize: '0.7rem', 
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: '#ffffff',
              fontWeight: '600'
            }}
            title={fullScreen ? "Minimize IDE" : "Maximize IDE"}
          >
            {fullScreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            {fullScreen ? 'Minimize' : 'Maximize'}
          </button>
        </div>
      </div>

      {/* Main Grid: Activity Bar | Left Sidebar | Code Editor */}
      <div className="compiler-main-layout" style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* VS Code Style Activity Bar */}
        <div style={{
          width: '48px',
          background: '#050505',
          borderRight: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0.75rem 0',
          gap: '1.25rem',
          userSelect: 'none',
          zIndex: 5
        }}>
          {/* Explorer Tab Icon */}
          <div 
            onClick={() => setShowExplorer(!showExplorer)}
            style={{
              cursor: 'pointer',
              color: showExplorer ? 'var(--color-primary)' : 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '32px',
              borderLeft: showExplorer ? '2px solid var(--color-primary)' : '2px solid transparent',
              transition: 'all 0.2s ease'
            }}
            title="Toggle Explorer"
          >
            <Columns size={18} />
          </div>

          {/* Search Shortcut Icon */}
          <div 
            onClick={() => alert('Search in project: Press Ctrl+K to trigger global LLM semantic search.')}
            style={{
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '32px',
              borderLeft: '2px solid transparent',
              transition: 'all 0.2s ease'
            }}
            title="Search Files"
          >
            <Search size={18} />
          </div>

          {/* Compile & Run Icon */}
          <div 
            onClick={() => handleCompileAndRun()}
            style={{
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '32px',
              borderLeft: '2px solid transparent',
              transition: 'all 0.2s ease'
            }}
            title="Run Code (Ctrl+Enter)"
          >
            <Play size={18} />
          </div>
        </div>

        {/* Left Sidebar (File Explorer) */}
        {showExplorer && (
          <div className="compiler-explorer-sidebar" style={{ width: '220px', minWidth: '220px', height: '100%', background: '#0A0A0A', borderRight: '1px solid var(--glass-border)' }}>
            <FileExplorer 
              currentCode={code} 
              onSelectFile={setCode} 
              onNewFile={() => setCode('// New file\n#include <stdio.h>\n\nint main() {\n    \n    return 0;\n}')} 
            />
          </div>
        )}

        {/* Center Workspace (Editor + Bottom Terminal Split) */}
        <div className="compiler-editor-workspace" style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflow: 'hidden', background: '#111111' }}>
          
          {/* VS Code Tabs Bar */}
          <div style={{
            display: 'flex',
            background: '#050505',
            borderBottom: '1px solid var(--glass-border)',
            height: '35px',
            alignItems: 'center',
            userSelect: 'none'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 1rem',
              height: '100%',
              background: '#111111',
              borderRight: '1px solid var(--glass-border)',
              borderTop: '2px solid var(--color-primary)',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-code)',
              fontWeight: '500',
              color: '#ffffff',
              gap: '0.5rem'
            }}>
              <span style={{ color: 'var(--color-primary)' }}>c</span>
              <span>main.c</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', cursor: 'pointer' }}>×</span>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 1rem',
              height: '100%',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-code)',
              color: 'var(--text-muted)',
              gap: '0.5rem',
              opacity: 0.6
            }}>
              <span>h</span>
              <span>helpers.h</span>
            </div>
          </div>

          {/* Main Code Editor Panel */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <CodeEditor
              code={code}
              onChange={setCode}
              errors={errorsList}
              fontSize={fontSize}
              setFontSize={setFontSize}
              wordWrap={wordWrap}
            />
          </div>

          {/* Bottom Console / Terminal panel */}
          {showTerminal && (
            <div className="compiler-terminal-container" style={{ height: '260px', minHeight: '260px', borderTop: '1px solid var(--glass-border)' }}>
              <Terminal
                consoleLogs={consoleLogs}
                errors={errorsList}
                metrics={metrics}
                ram={ramVisual}
                code={code}
                inputConsole={inputConsole}
                setInputConsole={setInputConsole}
                onRun={handleCompileAndRun}
                steps={steps}
                loading={loading}
                waitingForInput={waitingForInput}
              />
            </div>
          )}

        </div>

      </div>

      {/* Footer controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.6rem 1.25rem',
        background: '#050505',
        borderTop: '1px solid var(--glass-border)',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-code)'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>Ctrl+Enter to compile & execute programs</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-outline" onClick={handleReset} style={{ borderRadius: '9999px', padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
            <RotateCcw size={12} /> Reset IDE
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleCompileAndRun} 
            disabled={loading}
            style={{ borderRadius: '9999px', padding: '0.4rem 1.25rem', fontSize: '0.75rem' }}
          >
            <Play size={12} /> {loading ? 'Running...' : 'Compile & Run'}
          </button>
        </div>
      </div>

    </div>
  );
}
