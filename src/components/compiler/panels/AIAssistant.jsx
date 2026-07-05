import React, { useState, useEffect } from 'react';
import { Sparkles, HelpCircle, AlertCircle, PlayCircle, BookOpen } from 'lucide-react';

export default function AIAssistant({ code, errors = [] }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');

  // Auto trigger analysis based on errors or code changes
  useEffect(() => {
    analyzeCodeAndErrors(code, errors);
  }, [code, errors]);

  const analyzeCodeAndErrors = (currentCode, currentErrors) => {
    let initialAnalysis = [];

    // Analyze compilation/runtime errors first
    if (currentErrors && currentErrors.length > 0) {
      initialAnalysis.push({
        type: 'error',
        title: 'Error Diagnostics Detected',
        desc: 'I noticed some issues with compiling or executing your program. Let\'s fix them step-by-step.',
        details: currentErrors.map((err, idx) => {
          let explanation = 'Verify that syntax rules are followed, all operators are valid, and files are correctly closed.';
          let exampleFix = '';
          
          if (err.toLowerCase().includes('semicolon') || err.toLowerCase().includes('expected \';\'')) {
            explanation = 'In C, every statement must end with a semicolon (;). It tells the compiler where a statement finishes.';
            exampleFix = 'printf("Hello") -> printf("Hello");';
          } else if (err.toLowerCase().includes('braces') || err.toLowerCase().includes('curly')) {
            explanation = 'You have unmatched curly braces. Ensure that every open brace { has a matching close brace } in the correct scope.';
          } else if (err.toLowerCase().includes('main')) {
            explanation = 'The linker is looking for int main(). C execution always begins inside the main function.';
            exampleFix = 'int main() {\n    // your code\n    return 0;\n}';
          } else if (err.toLowerCase().includes('leak') || err.toLowerCase().includes('deallocated')) {
            explanation = 'You allocated heap memory with malloc() but never called free() to release it back. This causes a Memory Leak.';
            exampleFix = 'int *ptr = malloc(4);\n// use ptr\nfree(ptr);';
          }

          return {
            msg: err,
            explanation,
            exampleFix
          };
        })
      });
    }

    // Interactive Code Quality Checks (e.g. if(a=5) assignment error)
    if (currentCode.includes('if') && currentCode.match(/if\s*\([^=]*=[^=]\)/)) {
      initialAnalysis.push({
        type: 'warning',
        title: 'Logical Assignment inside condition detected',
        desc: 'Did you mean to use == instead of =?',
        details: [{
          msg: 'Potential logic bug: if(a = 5)',
          explanation: 'Using a single equals sign (=) assigns the value 5 to variable "a". This evaluates to true and overwrites "a". To compare two values, you must use double equals (==).',
          exampleFix: 'Change if(a = 5) to if(a == 5)'
        }]
      });
    }

    // Pointers checking
    if (currentCode.includes('*') && !currentCode.includes('malloc') && currentCode.includes('&')) {
      initialAnalysis.push({
        type: 'tip',
        title: 'Learning Pointer Syntax',
        desc: 'Pointers store the address of another variable.',
        details: [{
          msg: 'Direct Pointer Assignment',
          explanation: 'When you declare int *ptr = &x;, ptr stores the hexadecimal RAM address of x. To access or change the value x via ptr, you dereference it: *ptr = 10;.',
          exampleFix: 'int x = 5;\nint *ptr = &x;\nprintf("%d", *ptr); // prints 5'
        }]
      });
    }

    // Default welcoming message if no errors/patterns found
    if (initialAnalysis.length === 0) {
      initialAnalysis.push({
        type: 'general',
        title: 'Ready for Coding Guidance',
        desc: 'I am your context-aware C Learning Assistant. Write code, and I will highlight concepts, debug issues, and guide you without spoiling solutions.',
        details: [
          { msg: 'Try writing a malloc() statement or a loop structure to see guidance.' }
        ]
      });
    }

    setMessages(initialAnalysis);
  };

  const handleAskQuestion = (questionText = null) => {
    const query = questionText || customQuestion;
    if (!query.trim()) return;

    setLoading(true);
    setCustomQuestion('');

    setTimeout(() => {
      let response = {
        type: 'ai-reply',
        title: 'Educational Hint',
        desc: `Replying to your query: "${query}"`,
        details: []
      };

      const qLower = query.toLowerCase();
      if (qLower.includes('pointer')) {
        response.details.push({
          msg: 'Pointers and Addresses',
          explanation: 'Think of memory (RAM) as a row of mailboxes. Each box has an Address (e.g. 0x7ffe00) and a Value inside it. A Pointer is a special variable that holds the Address of another mailbox. The asterisk (*) is used to dereference it (look inside the target mailbox).',
          exampleFix: 'int x = 42;\nint *p = &x; // p holds address of x\n*p = 100; // x is now 100'
        });
      } else if (qLower.includes('malloc') || qLower.includes('dma')) {
        response.details.push({
          msg: 'Dynamic Memory Allocation (DMA)',
          explanation: 'malloc(size) asks the OS for a contiguous block of memory on the Heap. The size is specified in bytes, usually using sizeof(type). It returns a pointer to the start of this block.',
          exampleFix: 'int *arr = (int*) malloc(5 * sizeof(int));\n// Always check if pointer is NULL before using!\nif (arr == NULL) return 1;\nfree(arr); // Free when done!'
        });
      } else if (qLower.includes('scanf')) {
        response.details.push({
          msg: 'Why do we use & in scanf?',
          explanation: 'scanf needs to store the typed input directly into your variable\'s location in RAM. Passing &var sends the variable\'s memory address (pointer) so scanf can write directly into it.',
          exampleFix: 'scanf("%d", &myInt); // & tells scanf where in memory to save the number'
        });
      } else {
        response.details.push({
          msg: 'Concept explanation',
          explanation: 'In C programming, remember: variables have types (int, float, char), values, and memory addresses. Always ensure arrays are within bounds and heap blocks are freed before exit.',
          exampleFix: 'Need an example or code walkthrough? Ask about "pointers", "malloc", or "scanf".'
        });
      }

      setMessages(prev => [response, ...prev]);
      setLoading(false);
    }, 600);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.15)',
      borderLeft: '1px solid var(--glass-border)',
      color: 'var(--text-primary)',
      overflowY: 'auto'
    }}>
      
      {/* Top Header banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '1rem',
        borderBottom: '1px solid var(--glass-border)',
        background: 'linear-gradient(to right, rgba(59, 130, 246, 0.08), rgba(139, 92, 246, 0.08))'
      }}>
        <Sparkles size={16} color="var(--color-primary)" />
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Learning Guide</span>
      </div>

      {/* Messages / Tips list */}
      <div style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
        
        {messages.map((m, idx) => (
          <div 
            key={idx} 
            className="glass-panel" 
            style={{ 
              padding: '1rem', 
              borderRadius: '12px',
              border: `1px solid ${
                m.type === 'error' ? 'var(--color-error)' : 
                m.type === 'warning' ? 'var(--color-warning)' : 
                m.type === 'tip' ? 'var(--color-secondary)' : 'var(--glass-border)'
              }`,
              background: 'transparent'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
              {m.type === 'error' && <AlertCircle size={14} color="var(--color-error)" />}
              {m.type === 'warning' && <AlertCircle size={14} color="var(--color-warning)" />}
              {m.type !== 'error' && m.type !== 'warning' && <BookOpen size={14} color="var(--color-primary)" />}
              <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{m.title}</span>
            </div>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '0.75rem' }}>
              {m.desc}
            </p>

            {m.details && m.details.map((detail, dIdx) => (
              <div key={dIdx} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>{detail.msg}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{detail.explanation}</div>
                {detail.exampleFix && (
                  <pre style={{
                    background: 'rgba(0,0,0,0.2)',
                    padding: '0.5rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    color: 'var(--color-success)',
                    fontFamily: 'var(--font-code)',
                    overflowX: 'auto',
                    whiteSpace: 'pre'
                  }}>
                    {detail.exampleFix}
                  </pre>
                )}
              </div>
            ))}
          </div>
        ))}

        {loading && (
          <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', padding: '1rem' }}>
            Consulting C references...
          </div>
        )}

      </div>

      {/* Suggested Guiding Questions */}
      <div style={{ padding: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', borderTop: '1px solid var(--glass-border)' }}>
        <button onClick={() => handleAskQuestion('How do pointers work?')} className="btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.65rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>Ask: How Pointers work?</button>
        <button onClick={() => handleAskQuestion('What is malloc and free?')} className="btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.65rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>Ask: What is malloc?</button>
        <button onClick={() => handleAskQuestion('Why use & in scanf?')} className="btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.65rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)' }}>Ask: Why use & in scanf?</button>
      </div>

      {/* Input box */}
      <div style={{ padding: '0.75rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.5rem' }}>
        <input 
          placeholder="Ask a question about C..."
          value={customQuestion}
          onChange={(e) => setCustomQuestion(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
          style={{
            flex: 1,
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--glass-border)',
            borderRadius: '6px',
            padding: '0.4rem 0.75rem',
            color: '#fff',
            fontSize: '0.75rem',
            outline: 'none'
          }}
        />
        <button 
          onClick={() => handleAskQuestion()}
          style={{
            background: 'var(--color-primary)',
            border: 'none',
            color: '#fff',
            borderRadius: '6px',
            padding: '0.4rem 0.75rem',
            cursor: 'pointer',
            fontSize: '0.75rem'
          }}
        >
          Ask
        </button>
      </div>

    </div>
  );
}
