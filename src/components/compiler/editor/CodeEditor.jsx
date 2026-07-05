import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Search, RefreshCw, AlignLeft } from 'lucide-react';
import Autocomplete from './Autocomplete';

export default function CodeEditor({ 
  code, 
  onChange, 
  errors = [], 
  fontSize = 14, 
  setFontSize,
  wordWrap = true,
  theme = 'dark'
}) {
  const [history, setHistory] = useState([code]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  // Autocomplete states
  const [acQuery, setAcQuery] = useState('');
  const [acPosition, setAcPosition] = useState({ top: 0, left: 0 });
  const [showAc, setShowAc] = useState(false);
  
  // Search & Replace states
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  
  // Cursor info
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);

  const textareaRef = useRef(null);
  const preRef = useRef(null);

  // Sync scroll
  const handleScroll = (e) => {
    if (preRef.current) {
      preRef.current.scrollTop = e.target.scrollTop;
      preRef.current.scrollLeft = e.target.scrollLeft;
    }
  };

  // Syntax highlighting helper
  const highlightCode = (rawCode) => {
    let html = rawCode
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    const keywords = ['#include', '#define', 'struct', 'union', 'enum', 'typedef', 'void', 'int', 'float', 'char', 'double', 'return', 'if', 'while', 'for', 'do', 'else', 'sizeof', 'free', 'switch', 'case', 'break', 'continue', 'FILE'];
    const functions = ['printf', 'scanf', 'malloc', 'calloc', 'realloc', 'strlen', 'strcpy', 'strcat', 'fopen', 'fclose', 'fprintf', 'fscanf', 'main'];
    
    // Replace quotes/strings
    html = html.replace(/(".*?")/g, '<span class="syntax-str">$1</span>');
    // Replace comments
    html = html.replace(/(\/\/.*)/g, '<span class="syntax-comment">$1</span>');
    html = html.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="syntax-comment">$1</span>');
    
    // Keywords
    keywords.forEach(kw => {
      html = html.replace(new RegExp(`\\b${kw}\\b`, 'g'), `<span class="syntax-kw">${kw}</span>`);
    });
    
    // Functions
    functions.forEach(fn => {
      html = html.replace(new RegExp(`\\b${fn}\\b`, 'g'), `<span class="syntax-fn">${fn}</span>`);
    });
    
    return { __html: html };
  };

  // Track history for Undo/Redo
  const updateCode = (newCode) => {
    onChange(newCode);
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, newCode]);
    setHistoryIndex(newHistory.length);
  };

  // Key handlers (Brackets, tabs, autocomplete, undo/redo)
  const handleKeyDown = (e) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;

    // Undo / Redo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevIndex = historyIndex - 1;
        setHistoryIndex(prevIndex);
        onChange(history[prevIndex]);
      }
      return;
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        onChange(history[nextIndex]);
      }
      return;
    }

    // Tab indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      if (e.shiftKey) {
        // Outdent
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        if (value.substring(lineStart, lineStart + 4) === '    ') {
          const newValue = value.substring(0, lineStart) + value.substring(lineStart + 4);
          updateCode(newValue);
          setTimeout(() => {
            textarea.selectionStart = start - 4;
            textarea.selectionEnd = end - 4;
          }, 0);
        }
      } else {
        // Indent
        const newValue = value.substring(0, start) + '    ' + value.substring(end);
        updateCode(newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        }, 0);
      }
      return;
    }

    // Step over existing closing brackets/quotes (avoid duplicates)
    const closers = [')', '}', ']', '"', "'"];
    if (closers.includes(e.key) && value[start] === e.key) {
      e.preventDefault();
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
      return;
    }

    // Auto close brackets and quotes
    const pairings = {
      '(': ')',
      '{': '}',
      '[': ']',
      '"': '"',
      "'": "'"
    };

    if (pairings[e.key]) {
      e.preventDefault();
      const pair = pairings[e.key];
      const newValue = value.substring(0, start) + e.key + pair + value.substring(end);
      updateCode(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
      return;
    }

    // Intercept autocomplete controls
    if (showAc && ['Enter', 'Tab', 'ArrowUp', 'ArrowDown', 'Escape'].includes(e.key)) {
      e.preventDefault();
      return;
    }

    // Smart auto-indent on Enter
    if (e.key === 'Enter') {
      e.preventDefault();

      // Find the current line's start and its leading whitespace
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const currentLine = value.substring(lineStart, start);
      const indentMatch = currentLine.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';

      if (value[start - 1] === '{' && value[start] === '}') {
        // Special case: cursor between { and } — create inner block with extra indent
        const innerIndent = indent + '    ';
        const newValue = value.substring(0, start) + '\n' + innerIndent + '\n' + indent + value.substring(end);
        updateCode(newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1 + innerIndent.length;
        }, 0);
      } else {
        // Standard case: carry forward the current line indentation
        // Add extra indent level if current line ends with { 
        const trimmed = currentLine.trimEnd();
        const extraIndent = trimmed.endsWith('{') ? '    ' : '';
        const newIndent = indent + extraIndent;
        const newValue = value.substring(0, start) + '\n' + newIndent + value.substring(end);
        updateCode(newValue);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1 + newIndent.length;
        }, 0);
      }
      return;
    }

    // Trigger autocomplete on typing characters
    if (/^[a-zA-Z0-9_]$/.test(e.key)) {
      // Find current word prefix
      const currentLines = value.substring(0, start).split('\n');
      const currentLineText = currentLines[currentLines.length - 1];
      const words = currentLineText.split(/[^a-zA-Z0-9_]/);
      const prefix = words[words.length - 1] + e.key;
      
      if (prefix.length >= 2) {
        // Simple approximate positioning based on row/column
        const lineCount = currentLines.length;
        const colCount = currentLineText.length;
        setAcPosition({
          top: lineCount * (fontSize * 1.6) + 40 - textarea.scrollTop,
          left: colCount * (fontSize * 0.6) + 60 - textarea.scrollLeft
        });
        setAcQuery(prefix);
        setShowAc(true);
      }
    } else {
      setShowAc(false);
    }
  };

  const handleAcSelect = (suggestion) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const value = textarea.value;

    // Calculate word prefix length dynamically
    const textBefore = value.substring(0, start);
    const match = textBefore.match(/[a-zA-Z0-9_]+$/);
    const prefixLength = match ? match[0].length : 0;
    const beforeWord = value.substring(0, start - prefixLength);

    const templateText = suggestion.insertText.replace('$1', '').replace('$2', '').replace('$3', '');
    const newValue = beforeWord + templateText + value.substring(textarea.selectionEnd);

    updateCode(newValue);
    setShowAc(false);
    
    // Focus back on editor and place cursor inside brackets/quotes if possible
    setTimeout(() => {
      textarea.focus();
      const bracketIdx = templateText.indexOf('(');
      const quoteIdx = templateText.indexOf('"');
      let newCursorPos = start - prefixLength + templateText.length;
      if (quoteIdx !== -1) {
        newCursorPos = start - prefixLength + quoteIdx + 1;
      } else if (bracketIdx !== -1) {
        newCursorPos = start - prefixLength + bracketIdx + 1;
      }
      textarea.selectionStart = textarea.selectionEnd = newCursorPos;
    }, 50);
  };

  const handleSelectionChange = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const textUpToCursor = textarea.value.substring(0, textarea.selectionStart);
    const lines = textUpToCursor.split('\n');
    setCursorLine(lines.length);
    setCursorCol(lines[lines.length - 1].length + 1);
  };

  // Find and Replace
  const handleFind = () => {
    if (!searchQuery) return;
    const index = code.indexOf(searchQuery);
    if (index !== -1) {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(index, index + searchQuery.length);
      }
    }
  };

  const handleReplace = () => {
    if (!searchQuery) return;
    const newValue = code.replace(searchQuery, replaceQuery);
    updateCode(newValue);
  };

  const lineCount = code.split('\n').length;
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflow: 'hidden' }}>
      
      {/* Search / Replace toolbar */}
      {showSearch && (
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid var(--glass-border)',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Search size={14} color="var(--text-muted)" />
          <input
            placeholder="Find text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--glass-border)',
              borderRadius: '4px',
              padding: '0.2rem 0.5rem',
              color: '#fff',
              fontSize: '0.75rem',
              outline: 'none'
            }}
          />
          <button onClick={handleFind} className="btn" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)' }}>Find</button>
          
          <RefreshCw size={14} color="var(--text-muted)" style={{ marginLeft: '1rem' }} />
          <input
            placeholder="Replace with..."
            value={replaceQuery}
            onChange={(e) => setReplaceQuery(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--glass-border)',
              borderRadius: '4px',
              padding: '0.2rem 0.5rem',
              color: '#fff',
              fontSize: '0.75rem',
              outline: 'none'
            }}
          />
          <button onClick={handleReplace} className="btn" style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem', background: 'rgba(255,255,255,0.05)' }}>Replace</button>
        </div>
      )}

      {/* Editor Main Area */}
      <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
        
        {/* Editor Gutter / Line Numbers */}
        <div style={{
          width: '50px',
          background: 'rgba(0, 0, 0, 0.15)',
          borderRight: '1px solid var(--glass-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          padding: '1.25rem 0.5rem',
          fontFamily: 'var(--font-code)',
          fontSize: `${fontSize}px`,
          lineHeight: '1.6',
          color: 'rgba(255, 255, 255, 0.3)',
          userSelect: 'none',
          overflow: 'hidden'
        }}>
          {lineNumbers.map(num => {
            const hasError = errors.some(e => e.toLowerCase().includes(`line ${num}`) || e.toLowerCase().includes(`:${num}:`));
            return (
              <div 
                key={num} 
                style={{ 
                  color: num === cursorLine ? 'var(--color-primary)' : hasError ? 'var(--color-error)' : 'inherit',
                  fontWeight: num === cursorLine || hasError ? 'bold' : 'normal',
                  position: 'relative'
                }}
              >
                {hasError && <div style={{ position: 'absolute', left: '-15px', top: '4px', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-error)' }} />}
                {num}
              </div>
            );
          })}
        </div>

        {/* Text Area and Pre Overlay */}
        <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>
          
          {/* Pre Layer for Syntax Highlight & Error squiggles */}
          <pre
            ref={preRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              margin: 0,
              padding: '1.25rem',
              fontFamily: 'var(--font-code)',
              fontSize: `${fontSize}px`,
              lineHeight: '1.6',
              color: '#D4D4D4',
              whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
              wordBreak: wordWrap ? 'break-all' : 'keep-all',
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 1,
              background: 'transparent'
            }}
            dangerouslySetInnerHTML={highlightCode(code)}
          />

          {/* Actual interactable Input Textarea */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => { onChange(e.target.value); setHistory([...history.slice(0, historyIndex + 1), e.target.value]); setHistoryIndex(historyIndex + 1); }}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            onSelect={handleSelectionChange}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              margin: 0,
              padding: '1.25rem',
              background: 'transparent',
              border: 'none',
              color: 'transparent',
              caretColor: 'var(--text-primary)',
              fontFamily: 'var(--font-code)',
              fontSize: `${fontSize}px`,
              lineHeight: '1.6',
              resize: 'none',
              outline: 'none',
              whiteSpace: wordWrap ? 'pre-wrap' : 'pre',
              wordBreak: wordWrap ? 'break-all' : 'keep-all',
              overflowY: 'auto',
              overflowX: wordWrap ? 'hidden' : 'auto',
              zIndex: 2
            }}
          />

          {/* Autocomplete trigger box */}
          {showAc && (
            <Autocomplete
              query={acQuery}
              onSelect={handleAcSelect}
              position={acPosition}
            />
          )}

        </div>

      </div>

      {/* Editor Status Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.4rem 1rem',
        background: 'rgba(0,0,0,0.2)',
        borderTop: '1px solid var(--glass-border)',
        fontSize: '0.7rem',
        fontFamily: 'var(--font-code)',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span>Line {cursorLine}, Col {cursorCol}</span>
          <button 
            onClick={() => setShowSearch(!showSearch)} 
            style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
          >
            <Search size={12} /> Find/Replace
          </button>
        </div>
        
        {/* Editor controls */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button onClick={() => setFontSize(Math.max(10, fontSize - 1))} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}><ZoomOut size={12} /></button>
            <span>{fontSize}px</span>
            <button onClick={() => setFontSize(Math.min(24, fontSize + 1))} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer' }}><ZoomIn size={12} /></button>
          </div>
          <span style={{ color: 'var(--color-primary)' }}>UTF-8</span>
          <span>C (GCC)</span>
        </div>
      </div>

    </div>
  );
}
