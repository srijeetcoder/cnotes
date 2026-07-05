// Redesigned Study Portal with iOS Settings style capsules, 3D flip Wallet flashcards, and single-card quiz animations
import React, { useState } from 'react';
import { BookOpen, CheckCircle, Lock, Star, ChevronDown, ChevronUp, BrainCircuit, ArrowLeft, ArrowRight, Eye } from 'lucide-react';
import { chapters } from '../../data/syllabus';
import { pyqs } from '../../data/pyqs';
import OnlineCompiler from '../compiler/OnlineCompiler';

export default function StudyView({ 
  user, 
  activeChapterIndex, 
  activeSectionIndex, 
  setActiveChapterIndex, 
  setActiveSectionIndex, 
  onCompleteLesson, 
  onSaveQuizScore, 
  onSaveNote, 
  onToggleBookmark 
}) {
  const [activeTab, setActiveTab] = useState('theory'); // theory | playground | quiz | pyqs | flashcards
  const [expandedChapter, setExpandedChapter] = useState(0); // iOS settings group index

  // Quiz interactive state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [quizAnswerSelected, setQuizAnswerSelected] = useState(null);
  const [quizTextAnswer, setQuizTextAnswer] = useState('');
  const [shakeCard, setShakeCard] = useState(false);
  const [correctGlow, setCorrectGlow] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);

  // Flashcards state
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Notes state
  const [noteText, setNoteText] = useState('');

  const currentChapter = chapters[activeChapterIndex];
  const currentSection = currentChapter.sections[activeSectionIndex];
  const quizzes = currentChapter.quizzes || [];

  const handleSectionSelect = (chIdx, secIdx) => {
    setActiveChapterIndex(chIdx);
    setActiveSectionIndex(secIdx);
    setActiveTab('theory');
    setCurrentQuizIndex(0);
    setQuizAnswerSelected(null);
    setQuizTextAnswer('');
    setQuizPassed(false);
    setFlashcardIndex(0);
    setIsFlipped(false);
    setNoteText(user.notes[currentSection.id] || '');
  };

  // Single-card quiz logic
  const handleQuizAnswer = (optionIdx) => {
    if (quizAnswerSelected !== null) return;
    setQuizAnswerSelected(optionIdx);
    const q = quizzes[currentQuizIndex];
    
    if (optionIdx === q.answer) {
      setCorrectGlow(true);
      setTimeout(() => {
        setCorrectGlow(false);
        setQuizAnswerSelected(null);
        if (currentQuizIndex < quizzes.length - 1) {
          setCurrentQuizIndex(prev => prev + 1);
        } else {
          setQuizPassed(true);
          onCompleteLesson(currentSection.id);
          onSaveQuizScore(currentSection.id, 100);
        }
      }, 1000);
    } else {
      setShakeCard(true);
      setTimeout(() => {
        setShakeCard(false);
        setQuizAnswerSelected(null);
      }, 500);
    }
  };

  // Text quiz handler
  const handleTextQuizSubmit = () => {
    const q = quizzes[currentQuizIndex];
    const userAns = quizTextAnswer.trim().replace(/\s+/g, '').toLowerCase();
    const expectedAns = q.answer.replace(/\s+/g, '').toLowerCase();

    if (userAns === expectedAns) {
      setCorrectGlow(true);
      setTimeout(() => {
        setCorrectGlow(false);
        setQuizTextAnswer('');
        if (currentQuizIndex < quizzes.length - 1) {
          setCurrentQuizIndex(prev => prev + 1);
        } else {
          setQuizPassed(true);
          onCompleteLesson(currentSection.id);
          onSaveQuizScore(currentSection.id, 100);
        }
      }, 1000);
    } else {
      setShakeCard(true);
      setTimeout(() => {
        setShakeCard(false);
      }, 500);
    }
  };

  // Related PYQs
  const relatedPyqs = pyqs.filter(p => p.syllabusTopic.toLowerCase().includes(currentChapter.title.split(":")[0].toLowerCase().trim()));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }} className="animate-fade">
        
        {/* Core Lesson Panel */}
        <div className="glass-panel" style={{ padding: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{currentChapter.title}</span>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginTop: '0.25rem', letterSpacing: '-0.02em' }}>{currentSection.title}</h2>
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-outline" onClick={() => onToggleBookmark(currentSection.id)} style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
              <Star size={13} fill={user.bookmarks.includes(currentSection.id) ? 'var(--color-warning)' : 'transparent'} color={user.bookmarks.includes(currentSection.id) ? 'var(--color-warning)' : 'currentColor'} /> Star
            </button>
            {user.completedLessons[currentSection.id] && (
              <span className="badge badge-success">✓ Complete</span>
            )}
          </div>
        </div>

        {/* Tab switch navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.25rem', borderRadius: '10px', width: 'fit-content' }}>
          {[
            { id: 'theory', label: 'Theory Explain' },
            { id: 'playground', label: 'Playground Compiler' },
            { id: 'quiz', label: 'Practice Quiz' },
            { id: 'flashcards', label: '3D Flashcards' },
            { id: 'pyqs', label: `Topic PYQs (${relatedPyqs.length})` }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'var(--color-primary)' : 'transparent',
                border: 'none',
                color: activeTab === tab.id ? '#FFFFFF' : 'var(--text-muted)',
                padding: '0.45rem 1rem',
                fontSize: '0.8rem',
                fontWeight: '600',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Details */}
        <div style={{ flex: 1 }}>
          
          {/* TAB 1: THEORY */}
           {activeTab === 'theory' && (
             <div style={{ 
               display: 'flex', 
               flexDirection: 'column', 
               gap: '3rem', 
               maxWidth: '850px', 
               margin: '0 auto', 
               padding: '1.5rem 0',
               fontFamily: 'Inter, sans-serif'
             }}>
               
               {/* 1. Learning Objectives Card */}
               <div className="glass-panel" style={{
                 padding: '2rem',
                 borderRadius: '16px',
                 background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)',
                 border: '1px solid rgba(255, 255, 255, 0.1)',
                 boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
                 display: 'flex',
                 flexDirection: 'column',
                 gap: '1.25rem'
               }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                   <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Learning Dashboard Checkpoint</span>
                   <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.7rem' }}>
                     <span className="badge badge-primary" style={{ padding: '0.25rem 0.6rem' }}>Difficulty: {currentChapter.difficulty || 'Medium'}</span>
                     <span className="badge badge-outline" style={{ padding: '0.25rem 0.6rem' }}>⚡ 6 mins read</span>
                   </div>
                 </div>

                 <h3 style={{ fontSize: '1.375rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Today you'll learn:</h3>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.25rem' }}>
                   {(currentChapter.objectives || ['History of C', 'Structure of a C Program', 'Main Function', 'Compilation']).map((obj, oIdx) => (
                     <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                       <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>✓</span>
                       <span>{obj}</span>
                     </div>
                   ))}
                 </div>
               </div>

               {/* 2. Introduction */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 <div style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--color-primary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Introduction</div>
                 <p style={{
                   fontSize: '1.125rem',
                   lineHeight: '1.8',
                   color: 'var(--text-muted)',
                   fontWeight: '400',
                   margin: 0
                 }}>
                   Welcome to this interactive guide. We will explore the absolute core design of the C programming language, layout structure standards, and memory mechanics required for your MAKAUT academic curriculum and job placement preparation.
                 </p>
               </div>

               {/* 3. Concept Cards / Explanation Blocks */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                 {(() => {
                   const parseInlineStyles = (txt) => {
                     const parts = txt.split(/(`[^`]+`)/g);
                     return parts.map((part, idx) => {
                       if (part.startsWith('`') && part.endsWith('`')) {
                         return (
                           <code 
                             key={idx} 
                             style={{ 
                               background: 'rgba(255, 255, 255, 0.05)', 
                               border: '1px solid var(--glass-border)',
                               borderRadius: '6px',
                               padding: '0.2rem 0.45rem',
                               fontSize: '0.8rem',
                               color: 'var(--color-secondary)',
                               fontFamily: 'var(--font-code)',
                               margin: '0 0.15rem'
                             }}
                           >
                             {part.slice(1, -1)}
                           </code>
                         );
                       }
                       
                       const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
                       return boldParts.map((bPart, bIdx) => {
                         if (bPart.startsWith('**') && bPart.endsWith('**')) {
                           return (
                             <strong 
                               key={bIdx} 
                               style={{ 
                                 color: 'var(--text-primary)', 
                                 fontWeight: '700' 
                               }}
                             >
                               {bPart.slice(2, -2)}
                             </strong>
                           );
                         }
                         return bPart;
                       });
                     });
                   };

                   return currentSection.content.split('\n\n').map((para, i) => {
                     if (!para.trim()) return null;
                     
                     if (para.startsWith('###')) {
                       return (
                         <h3 
                           key={i} 
                           style={{ 
                             fontSize: '1.375rem', 
                             fontWeight: '800',
                             color: 'var(--text-primary)', 
                             marginTop: '1.5rem',
                             marginBottom: '0.5rem',
                             borderLeft: '4px solid var(--color-primary)',
                             paddingLeft: '0.75rem'
                           }}
                         >
                           {para.replace('###', '').trim()}
                         </h3>
                       );
                     }
                     if (para.startsWith('*') || para.startsWith('-')) {
                       return (
                         <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.85rem' }}>
                           {para.split('\n').map((li, idx) => {
                             const cleanLi = li.replace(/^[\*\-\s]+/, '').trim();
                             if (!cleanLi) return null;
                             return (
                               <div 
                                 key={idx} 
                                 className="glass-panel"
                                 style={{ 
                                   padding: '1.25rem 1.5rem', 
                                   borderRadius: '12px',
                                   border: '1px solid var(--glass-border)',
                                   background: 'rgba(255, 255, 255, 0.02)',
                                   fontSize: '0.95rem',
                                   lineHeight: '1.7',
                                   color: 'var(--text-muted)',
                                   display: 'flex',
                                   gap: '0.75rem',
                                   alignItems: 'flex-start'
                                 }}
                               >
                                 <span style={{ color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '-0.1rem' }}>✦</span>
                                 <div>{parseInlineStyles(cleanLi)}</div>
                               </div>
                             );
                           })}
                         </div>
                       );
                     }
                     return (
                       <p 
                         key={i} 
                         style={{ 
                           color: 'var(--text-muted)', 
                           fontSize: '1rem', 
                           lineHeight: '1.8', 
                           letterSpacing: '0.01em',
                           margin: 0
                         }}
                       >
                         {parseInlineStyles(para)}
                       </p>
                     );
                   });
                 })()}
               </div>

               {/* 4. Styled Callout Blocks */}
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {/* Tip Box */}
                 <div className="glass-panel" style={{
                   padding: '1.25rem 1.5rem',
                   borderRadius: '12px',
                   border: '1px solid rgba(16, 185, 129, 0.2)',
                   background: 'rgba(16, 185, 129, 0.02)',
                   display: 'flex',
                   gap: '1rem',
                   alignItems: 'flex-start'
                 }}>
                   <div style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', fontSize: '0.75rem', fontWeight: 'bold' }}>TIP</div>
                   <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
                     <strong>Memory Trick:</strong> Always verify block pointers in arrays. Contiguous blocks can be accessed cleanly using index calculations: <code>arr + i</code>.
                   </div>
                 </div>

                 {/* Important Box */}
                 <div className="glass-panel" style={{
                   padding: '1.25rem 1.5rem',
                   borderRadius: '12px',
                   border: '1px solid rgba(139, 92, 246, 0.2)',
                   background: 'rgba(139, 92, 246, 0.02)',
                   display: 'flex',
                   gap: '1rem',
                   alignItems: 'flex-start'
                 }}>
                   <div style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.1)', color: '#8B5CF6', fontSize: '0.75rem', fontWeight: 'bold' }}>IMPORTANT</div>
                   <div style={{ fontSize: '0.9rem', lineHeight: '1.6', color: 'var(--text-muted)' }}>
                     Ensure header libraries are specified inside preprocessors. Standard libraries like <code>&lt;stdlib.h&gt;</code> are needed for heap allocation functions.
                   </div>
                 </div>
               </div>

               {/* 5. Real World Analogy (Illustration Spotlight) */}
               {currentSection.analogy && (
                 <div className="glass-panel" style={{ 
                   padding: '2rem', 
                   background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.04) 0%, rgba(251, 191, 36, 0.04) 100%)', 
                   borderColor: 'rgba(245, 158, 11, 0.18)',
                   borderRadius: '16px',
                   display: 'flex',
                   flexDirection: 'column',
                   gap: '0.75rem',
                   boxShadow: '0 8px 24px rgba(245, 158, 11, 0.03)'
                 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#F59E0B', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Concept Analogy</span>
                   </div>
                   <p style={{ fontSize: '1rem', fontStyle: 'italic', lineHeight: '1.7', color: 'var(--text-muted)', margin: 0 }}>
                     "{currentSection.analogy}"
                   </p>
                 </div>
               )}

               {/* 6. Code block with hover annotations */}
               {currentSection.codeSample && (
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interactive Program Scaffold</span>
                     <button 
                       className="btn btn-outline" 
                       onClick={() => { navigator.clipboard.writeText(currentSection.codeSample.trim()); alert('Copied scaffold code to clipboard!'); }}
                       style={{ padding: '0.35rem 0.75rem', fontSize: '0.7rem' }}
                     >
                       Copy Code
                     </button>
                   </div>

                   <pre style={{
                     background: 'rgba(0, 0, 0, 0.25)',
                     padding: '1.5rem',
                     borderRadius: '14px',
                     fontFamily: 'var(--font-code)',
                     fontSize: '0.85rem',
                     lineHeight: '1.6',
                     color: '#E6EDF0',
                     overflowX: 'auto',
                     border: '1px solid var(--glass-border)',
                     backdropFilter: 'blur(5px)',
                     position: 'relative'
                   }}>
                     {currentSection.codeSample.trim()}
                   </pre>

                   {/* Line by line annotation explainer */}
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
                     <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Line-by-Line Mechanics:</div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                       {currentSection.codeSample.trim().split('\n').map((line, idx) => {
                         if (!line.trim()) return null;
                         let explanation = 'Initializes memory variables, registers function arguments, or exits scopes.';
                         if (line.includes('#include')) explanation = 'Preprocessor directive linking standard helper libraries.';
                         if (line.includes('int main')) explanation = 'Entry point function required for program startup.';
                         if (line.includes('printf')) explanation = 'Prints formatted data values to stdout output console.';
                         if (line.includes('return 0')) explanation = 'Exits program back to operating system with exit code 0.';
                         if (line.includes('malloc')) explanation = 'Dynamically requests heap memory blocks.';
                         
                         return (
                           <div 
                             key={idx} 
                             className="glass-panel" 
                             style={{ 
                               padding: '0.75rem 1rem', 
                               borderRadius: '8px', 
                               border: '1px solid var(--glass-border)', 
                               fontSize: '0.8rem',
                               display: 'flex',
                               justifyContent: 'space-between',
                               alignItems: 'center',
                               gap: '1rem',
                               background: 'rgba(255,255,255,0.01)'
                             }}
                             onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                             onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                           >
                             <code style={{ color: 'var(--color-secondary)' }}>{line.trim().slice(0, 35)}</code>
                             <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'right' }}>{explanation}</span>
                           </div>
                         );
                       })}
                     </div>
                   </div>
                 </div>
               )}

               {/* 7. Exam Focus Badges */}
               <div className="glass-panel" style={{
                 padding: '1.5rem',
                 borderRadius: '14px',
                 border: '1px solid rgba(239, 68, 68, 0.2)',
                 background: 'rgba(239, 68, 68, 0.01)',
                 display: 'flex',
                 flexDirection: 'column',
                 gap: '0.85rem'
               }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-error)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>🔥 MAKAUT Exam Analytics</span>
                 </div>
                 
                 <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                   <div>
                     <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Relevance Index</div>
                     <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>High (Asked 5+ Years)</div>
                   </div>
                   <div>
                     <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Expected Weight</div>
                     <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>5 to 10 Marks</div>
                   </div>
                   <div>
                     <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Typical Topic Qs</div>
                     <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.15rem' }}>"Explain preprocessors vs compilers with logic..."</div>
                   </div>
                 </div>
               </div>

               {/* 8. Common Pitfalls Card */}
               {currentSection.mistakes && (
                 <div className="glass-panel" style={{ 
                   padding: '1.5rem', 
                   background: 'rgba(239, 68, 68, 0.02)', 
                   borderColor: 'rgba(239, 68, 68, 0.15)',
                   borderRadius: '14px',
                   display: 'flex',
                   flexDirection: 'column',
                   gap: '0.75rem'
                 }}>
                   <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-error)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Common Mistakes / Pitfalls</span>
                   <ul style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: 0 }}>
                     {currentSection.mistakes.map((m, i) => (
                       <li key={i} style={{ lineHeight: '1.6' }}>{m}</li>
                     ))}
                   </ul>
                 </div>
               )}

               {/* 9. Interactive Checkpoint */}
               <div className="glass-panel" style={{
                 padding: '2rem',
                 borderRadius: '16px',
                 border: '1px solid rgba(139, 92, 246, 0.25)',
                 background: 'rgba(139, 92, 246, 0.02)',
                 display: 'flex',
                 flexDirection: 'column',
                 gap: '1rem',
                 boxShadow: '0 8px 32px 0 rgba(139, 92, 246, 0.08)'
               }}>
                 <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-secondary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Checkpoint Challenge</span>
                 <h4 style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Quick check: What is the main entry point function name of any standard C execution?</h4>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                   {[
                     { label: 'A. startup()', correct: false },
                     { label: 'B. main()', correct: true },
                     { label: 'C. print()', correct: false },
                     { label: 'D. stdio()', correct: false }
                   ].map((ans, idx) => (
                     <button
                       key={idx}
                       onClick={() => alert(ans.correct ? 'Correct! main() is the entrypoint.' : 'Try again! main() starts execution.')}
                       className="btn btn-outline"
                       style={{ 
                         padding: '0.6rem', 
                         fontSize: '0.8rem', 
                         justifyContent: 'center',
                         background: 'rgba(255,255,255,0.01)'
                       }}
                     >
                       {ans.label}
                     </button>
                   ))}
                 </div>
               </div>

               {/* 10. Summary Card */}
               <div className="glass-panel" style={{
                 padding: '1.5rem',
                 borderRadius: '14px',
                 border: '1px solid var(--glass-border)',
                 background: 'rgba(255, 255, 255, 0.01)',
                 display: 'flex',
                 flexDirection: 'column',
                 gap: '0.5rem'
               }}>
                 <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--color-primary)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Summary Revision</span>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6', margin: 0 }}>
                   Always include appropriate headers, maintain lowercase keywords, and free up heap blocks before exits. 
                 </p>
               </div>

               {/* Note editor pad */}
               <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '14px' }}>
                 <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Notebook</h4>
                 <textarea
                   placeholder="Record your thoughts here..."
                   value={noteText}
                   onChange={(e) => setNoteText(e.target.value)}
                   style={{
                     width: '100%',
                     height: '90px',
                     background: 'rgba(255,255,255,0.01)',
                     border: '1px solid var(--glass-border)',
                     borderRadius: '8px',
                     padding: '0.75rem',
                     color: 'var(--text-primary)',
                     fontFamily: 'var(--font-body)',
                     fontSize: '0.85rem',
                     resize: 'none',
                     outline: 'none',
                     marginBottom: '0.75rem'
                   }}
                 />
                 <button className="btn btn-outline" onClick={() => { onSaveNote(currentSection.id, noteText); alert('Note saved!'); }} style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
                   Save Notes
                 </button>
               </div>

             </div>
           )}

          {/* TAB 2: PLAYGROUND COMPILER */}
          {activeTab === 'playground' && (
            <OnlineCompiler 
              initialCode={currentSection.codeSample ? currentSection.codeSample.trim() : null}
              onExecuteSuccess={() => {
                onCompleteLesson(currentSection.id);
                alert('Success: Compiler compiled code with no runtime failures.');
              }}
            />
          )}

          {/* TAB 3: QUIZ (SINGLE CARD ANIME FORMAT) */}
          {activeTab === 'quiz' && (
            <div className="flex-center" style={{ minHeight: '300px' }}>
              
              {quizzes.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>No quizzes for this section.</p>
              ) : quizPassed ? (
                <div className="glass-panel text-center" style={{ padding: '2.5rem', textAlign: 'center', width: '100%', maxWidth: '450px' }}>
                  <CheckCircle size={40} color="var(--color-success)" style={{ margin: '0 auto 1rem auto' }} />
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Section Checkpoint Completed!</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1rem' }}>
                    You solved all quizzes correctly. XP rewarded.
                  </p>
                  <button className="btn btn-primary" onClick={() => { setQuizPassed(false); setCurrentQuizIndex(0); }}>
                    Retake Quiz
                  </button>
                </div>
              ) : (
                <div 
                  className={`glass-panel quiz-card ${shakeCard ? 'quiz-card-shake' : ''} ${correctGlow ? 'quiz-correct-glow' : ''}`}
                  style={{
                    padding: '2.5rem',
                    width: '100%',
                    maxWidth: '480px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                    <span>CHAPTER QUIZ</span>
                    <span>Q {currentQuizIndex + 1} / {quizzes.length}</span>
                  </div>

                  <h4 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1.5rem', lineHeight: '1.5' }}>
                    {quizzes[currentQuizIndex].q}
                  </h4>

                  {quizzes[currentQuizIndex].type === 'mcq' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {quizzes[currentQuizIndex].options.map((opt, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleQuizAnswer(idx)}
                          style={{
                            padding: '0.75rem 1rem',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {opt}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <textarea
                        value={quizTextAnswer}
                        onChange={(e) => setQuizTextAnswer(e.target.value)}
                        placeholder="Type answer here..."
                        style={{
                          width: '100%',
                          height: '80px',
                          background: 'rgba(0,0,0,0.2)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          fontFamily: 'var(--font-code)',
                          fontSize: '0.85rem',
                          padding: '0.75rem',
                          resize: 'none',
                          outline: 'none'
                        }}
                      />
                      <button className="btn btn-primary" onClick={handleTextQuizSubmit} style={{ alignSelf: 'flex-start' }}>
                        Verify Solution
                      </button>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 4: 3D WALLET FLASHCARDS */}
          {activeTab === 'flashcards' && (
            <div className="flex-center" style={{ flexDirection: 'column', gap: '2rem', minHeight: '320px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Wallet Spaced Repetition (Click card to flip 3D)</span>
              
              <div className="wallet-card-stack" style={{ maxWidth: '400px' }}>
                {currentChapter.flashcards && currentChapter.flashcards.length > 0 && (
                  <div 
                    className={`wallet-card ${isFlipped ? 'flipped' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                  >
                    <div className="wallet-card-inner">
                      
                      {/* Front Card */}
                      <div className="wallet-card-front">
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-primary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem' }}>Question</span>
                        <p style={{ fontSize: '1rem', fontWeight: 'bold', lineHeight: '1.5', margin: 'auto 0' }}>
                          {currentChapter.flashcards[flashcardIndex].q}
                        </p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'auto', textAlign: 'center' }}>Click card to reveal answer</span>
                      </div>

                      {/* Back Card */}
                      <div className="wallet-card-back">
                        <span style={{ fontSize: '0.7rem', color: 'var(--color-secondary)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem' }}>Answer</span>
                        <p style={{ fontSize: '0.95rem', fontWeight: '500', lineHeight: '1.6', margin: 'auto 0', color: 'var(--text-primary)' }}>
                          {currentChapter.flashcards[flashcardIndex].a}
                        </p>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'auto', textAlign: 'center' }}>Click card to flip back</span>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {currentChapter.flashcards && currentChapter.flashcards.length > 0 && (
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => { setFlashcardIndex(prev => Math.max(0, prev - 1)); setIsFlipped(false); }}
                    disabled={flashcardIndex === 0}
                    style={{ padding: '0.4rem 1rem' }}
                  >
                    Prev
                  </button>
                  <span style={{ fontSize: '0.85rem' }}>{flashcardIndex + 1} / {currentChapter.flashcards.length}</span>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => { setFlashcardIndex(prev => Math.min(currentChapter.flashcards.length - 1, prev + 1)); setIsFlipped(false); }}
                    disabled={flashcardIndex === currentChapter.flashcards.length - 1}
                    style={{ padding: '0.4rem 1rem' }}
                  >
                    Next
                  </button>
                </div>
              )}

            </div>
          )}

          {/* TAB 5: TOPIC PYQS */}
          {activeTab === 'pyqs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {relatedPyqs.length === 0 ? (
                <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', padding: '1rem' }}>No PYQs related specifically to this syllabus topic.</p>
              ) : (
                relatedPyqs.map(pyq => (
                  <div key={pyq.id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{pyq.year} - {pyq.semester}</span>
                      <span style={{ color: 'var(--text-muted)' }}>Marks: {pyq.marks} | Difficulty: {pyq.difficulty}</span>
                    </div>

                    <p style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Q: {pyq.question}</p>

                    <details style={{ cursor: 'pointer' }}>
                      <summary style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', fontWeight: 'bold' }}>
                        View Exam Solution & Tips
                      </summary>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem', cursor: 'auto' }}>
                        <pre style={{
                          background: 'transparent',
                          padding: '1rem',
                          borderRadius: '6px',
                          fontFamily: 'var(--font-code)',
                          fontSize: '0.8rem',
                          color: '#C9D1D9',
                          overflowX: 'auto'
                        }}>{pyq.solution.trim()}</pre>
                        
                        <div style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.03)', borderLeft: '3px solid var(--color-error)', borderRadius: '4px', fontSize: '0.8rem' }}>
                          <strong>Pitfalls:</strong> {pyq.commonMistakes}
                        </div>
                        
                        <div style={{ padding: '0.5rem', background: 'rgba(34, 197, 94, 0.03)', borderLeft: '3px solid var(--color-success)', borderRadius: '4px', fontSize: '0.8rem' }}>
                          <strong>Recommended Writing Style:</strong> {pyq.writingStyle}
                        </div>
                      </div>
                    </details>
                  </div>
                ))
              )}
            </div>
          )}

        </div>
    </div>
  );
}
