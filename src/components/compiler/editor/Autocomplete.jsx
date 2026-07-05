import React, { useState, useEffect, useRef } from 'react';

const SUGGESTIONS = [
  {
    word: 'printf',
    insertText: 'printf("$1");',
    type: 'function',
    returnType: 'int',
    doc: 'Writes formatted output to stdout.',
    params: [
      { name: 'format', desc: 'String containing text and format specifiers (%d, %f, %s, %c, etc.)' }
    ]
  },
  {
    word: 'scanf',
    insertText: 'scanf("$1", &$2);',
    type: 'function',
    returnType: 'int',
    doc: 'Reads formatted input from stdin.',
    params: [
      { name: 'format', desc: 'Format specifiers string' },
      { name: '...', desc: 'Pointers to variables where values will be stored' }
    ]
  },
  {
    word: 'malloc',
    insertText: 'malloc($1 * sizeof($2))',
    type: 'function',
    returnType: 'void*',
    doc: 'Allocates uninitialized memory on the heap.',
    params: [
      { name: 'size', desc: 'Total number of bytes to allocate' }
    ]
  },
  {
    word: 'calloc',
    insertText: 'calloc($1, sizeof($2))',
    type: 'function',
    returnType: 'void*',
    doc: 'Allocates zero-initialized contiguous memory on the heap.',
    params: [
      { name: 'num', desc: 'Number of elements' },
      { name: 'size', desc: 'Size of each element' }
    ]
  },
  {
    word: 'realloc',
    insertText: 'realloc($1, $2 * sizeof($3))',
    type: 'function',
    returnType: 'void*',
    doc: 'Resizes previously allocated memory on the heap.',
    params: [
      { name: 'ptr', desc: 'Pointer to existing heap memory block' },
      { name: 'new_size', desc: 'New size in bytes' }
    ]
  },
  {
    word: 'free',
    insertText: 'free($1);',
    type: 'function',
    returnType: 'void',
    doc: 'Deallocates memory block previously allocated by malloc/calloc/realloc.',
    params: [
      { name: 'ptr', desc: 'Pointer to heap memory' }
    ]
  },
  {
    word: 'sizeof',
    insertText: 'sizeof($1)',
    type: 'keyword',
    returnType: 'size_t',
    doc: 'Returns the size in bytes of a data type or variable.',
    params: [
      { name: 'type_or_var', desc: 'Data type (e.g. int) or variable' }
    ]
  },
  {
    word: 'strlen',
    insertText: 'strlen($1)',
    type: 'function',
    returnType: 'size_t',
    doc: 'Computes the length of a string, excluding the null terminator.',
    params: [
      { name: 'str', desc: 'Null-terminated string' }
    ]
  },
  {
    word: 'strcpy',
    insertText: 'strcpy($1, $2);',
    type: 'function',
    returnType: 'char*',
    doc: 'Copies the source string into the destination string.',
    params: [
      { name: 'dest', desc: 'Destination buffer' },
      { name: 'src', desc: 'Source string' }
    ]
  },
  {
    word: 'strcat',
    insertText: 'strcat($1, $2);',
    type: 'function',
    returnType: 'char*',
    doc: 'Appends source string to destination string.',
    params: [
      { name: 'dest', desc: 'Destination string containing string already' },
      { name: 'src', desc: 'Source string to append' }
    ]
  },
  {
    word: 'main',
    insertText: 'int main() {\n    $1\n    return 0;\n}',
    type: 'snippet',
    returnType: 'int',
    doc: 'Entrypoint function for every C program.',
    params: []
  },
  {
    word: 'return',
    insertText: 'return $1;',
    type: 'keyword',
    returnType: 'void',
    doc: 'Exits function and returns value to caller.',
    params: []
  },
  {
    word: 'for',
    insertText: 'for (int i = 0; i < $1; i++) {\n    $2\n}',
    type: 'snippet',
    returnType: 'loop',
    doc: 'Executes block of code a set number of times.',
    params: []
  },
  {
    word: 'while',
    insertText: 'while ($1) {\n    $2\n}',
    type: 'snippet',
    returnType: 'loop',
    doc: 'Executes block of code as long as condition is true.',
    params: []
  },
  {
    word: 'do',
    insertText: 'do {\n    $2\n} while ($1);',
    type: 'snippet',
    returnType: 'loop',
    doc: 'Executes block of code at least once, then repeats as long as condition is true.',
    params: []
  },
  {
    word: 'switch',
    insertText: 'switch ($1) {\n    case $2:\n        $3\n        break;\n    default:\n        break;\n}',
    type: 'snippet',
    returnType: 'control',
    doc: 'Selects one of many code blocks to execute based on expression value.',
    params: []
  },
  {
    word: 'typedef',
    insertText: 'typedef $1 $2;',
    type: 'keyword',
    returnType: 'alias',
    doc: 'Creates an alias name for another type.',
    params: []
  },
  {
    word: 'struct',
    insertText: 'struct $1 {\n    $2\n};',
    type: 'snippet',
    returnType: 'struct',
    doc: 'User-defined structure containing grouped variables.',
    params: []
  },
  {
    word: 'union',
    insertText: 'union $1 {\n    $2\n};',
    type: 'snippet',
    returnType: 'union',
    doc: 'User-defined type sharing same memory location for all members.',
    params: []
  },
  {
    word: 'enum',
    insertText: 'enum $1 { $2 };',
    type: 'snippet',
    returnType: 'enum',
    doc: 'User-defined enumeration containing integer constants.',
    params: []
  },
  {
    word: 'FILE',
    insertText: 'FILE *$1;',
    type: 'keyword',
    returnType: 'FILE*',
    doc: 'File handler type pointer for I/O operations.',
    params: []
  },
  {
    word: 'fopen',
    insertText: 'fopen("$1", "$2")',
    type: 'function',
    returnType: 'FILE*',
    doc: 'Opens file at path with given mode (r, w, a, etc.).',
    params: [
      { name: 'filename', desc: 'Path/name of file' },
      { name: 'mode', desc: 'File mode string (e.g. "r", "w", "r+")' }
    ]
  },
  {
    word: 'fclose',
    insertText: 'fclose($1);',
    type: 'function',
    returnType: 'int',
    doc: 'Closes file descriptor, flushing buffer stream.',
    params: [
      { name: 'stream', desc: 'Pointer to FILE stream object' }
    ]
  },
  {
    word: 'fprintf',
    insertText: 'fprintf($1, "$2");',
    type: 'function',
    returnType: 'int',
    doc: 'Writes formatted output to file stream.',
    params: [
      { name: 'stream', desc: 'Pointer to FILE stream object' },
      { name: 'format', desc: 'Formatting string patterns' }
    ]
  },
  {
    word: 'fscanf',
    insertText: 'fscanf($1, "$2", &$3);',
    type: 'function',
    returnType: 'int',
    doc: 'Reads formatted variables from file stream.',
    params: [
      { name: 'stream', desc: 'Pointer to FILE stream object' },
      { name: 'format', desc: 'Format specifier target' }
    ]
  }
];

export default function Autocomplete({ query, onSelect, position }) {
  const [filtered, setFiltered] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!query) {
      setFiltered([]);
      return;
    }
    const qLower = query.toLowerCase();
    const matches = SUGGESTIONS.filter(item => 
      item.word.toLowerCase().startsWith(qLower) && item.word.toLowerCase() !== qLower
    );
    setFiltered(matches.slice(0, 8));
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (filtered.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % filtered.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        onSelect(filtered[selectedIndex]);
      } else if (e.key === 'Escape') {
        setFiltered([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filtered, selectedIndex, onSelect]);

  if (filtered.length === 0) return null;

  const currentItem = filtered[selectedIndex];

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 50,
        display: 'flex',
        background: 'rgba(15, 22, 38, 0.95)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(12px)',
        overflow: 'hidden',
        minWidth: '420px',
        maxWidth: '550px',
        fontFamily: 'var(--font-code)',
        fontSize: '0.8rem',
        color: 'var(--text-primary)'
      }}
    >
      {/* Suggestions List */}
      <div style={{ flex: 2, borderRight: '1px solid rgba(255,255,255,0.08)', padding: '0.25rem' }}>
        {filtered.map((item, idx) => {
          const isSelected = idx === selectedIndex;
          return (
            <div
              key={item.word}
              onClick={() => onSelect(item)}
              onMouseEnter={() => setSelectedIndex(idx)}
              style={{
                padding: '0.4rem 0.75rem',
                borderRadius: '8px',
                background: isSelected ? 'var(--color-primary)' : 'transparent',
                color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{item.word}</span>
              <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>{item.type}</span>
            </div>
          );
        })}
      </div>

      {/* Docs / Right Details Pane */}
      {currentItem && (
        <div style={{ flex: 3, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'rgba(0,0,0,0.15)' }}>
          <div style={{ fontWeight: 'bold', color: 'var(--color-primary)', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.2rem' }}>
            {currentItem.returnType} {currentItem.word}
            {currentItem.type === 'function' && '()'}
          </div>
          <div style={{ color: 'var(--text-muted)', lineHeight: '1.4', fontSize: '0.75rem' }}>
            {currentItem.doc}
          </div>
          {currentItem.params && currentItem.params.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
              <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--color-secondary)', fontWeight: 'bold' }}>Parameters:</div>
              {currentItem.params.map(p => (
                <div key={p.name} style={{ fontSize: '0.7rem' }}>
                  <code style={{ color: 'var(--color-warning)', fontWeight: 'bold' }}>{p.name}</code>: {p.desc}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
