// Redesigned ExamPrepMode portal in floating glass layout with filter capsules and timed simulated testing panels
import React, { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle, AlertTriangle, Play, HelpCircle } from 'lucide-react';
import { pyqs, topicImportance, examinerTricks } from '../../data/pyqs';

export default function ExamPrepMode({ user, awardAchievement }) {
  const [activeSubTab, setActiveSubTab] = useState('pyq-db'); 
  const [filterYear, setFilterYear] = useState('all');
  const [filterMarks, setFilterMarks] = useState('all');
  const [filterTopic, setFilterTopic] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isTestActive, setIsTestActive] = useState(false);
  const [testTimeLeft, setTestTimeLeft] = useState(30 * 60); 
  const [testAnswers, setTestAnswers] = useState({});
  const [testResult, setTestResult] = useState(null);

  const filteredPyqs = pyqs.filter(p => {
    const matchYear = filterYear === 'all' || p.year.toString() === filterYear;
    const matchMarks = filterMarks === 'all' || p.marks.toString() === filterMarks;
    const matchTopic = filterTopic === 'all' || p.topic === filterTopic;
    const matchSearch = p.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        p.solution.toLowerCase().includes(searchTerm.toLowerCase());
    return matchYear && matchMarks && matchTopic && matchSearch;
  });

  const mockQuestions = [
    { id: 1, type: 'mcq', q: "What does the expression 5 / 2 return in C?", options: ["2.5", "2", "2.0", "Compile Error"], correct: 1 },
    { id: 2, type: 'mcq', q: "Which malloc allocation allocates size correctly for an array of 10 float elements?", options: ["malloc(10 * float)", "malloc(10 * sizeof(float))", "malloc(10)", "malloc(float * 10)"], correct: 1 },
    { id: 3, type: 'mcq', q: "If we store variable 'a' at 0x7ffe00 and declare int *p = &a; what is returned by *p?", options: ["Address 0x7ffe00", "Value stored inside variable 'a'", "Garbage value", "Address of pointer variable 'p'"], correct: 1 },
    { id: 4, type: 'mcq', q: "Which fopen mode is used to append data to an existing text file?", options: ["r", "w", "a", "w+"], correct: 2 },
    { id: 5, type: 'text', q: "Predict the output of the following line:\nint x = 5; int y = x++; printf(\"%d %d\", x, y);", correct: "6 5" }
  ];

  useEffect(() => {
    let timer;
    if (isTestActive && testTimeLeft > 0) {
      timer = setInterval(() => {
        setTestTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (testTimeLeft === 0 && isTestActive) {
      handleEndMockTest();
    }
    return () => clearInterval(timer);
  }, [isTestActive, testTimeLeft]);

  const handleStartMockTest = () => {
    setIsTestActive(true);
    setTestTimeLeft(30 * 60); 
    setTestAnswers({});
    setTestResult(null);
  };

  const handleEndMockTest = () => {
    setIsTestActive(false);
    let correctCount = 0;
    
    mockQuestions.forEach(q => {
      const userAns = testAnswers[q.id];
      if (q.type === 'mcq') {
        if (parseInt(userAns) === q.correct) correctCount++;
      } else {
        if ((userAns || '').trim().toLowerCase() === q.correct.toLowerCase()) correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / mockQuestions.length) * 100);
    setTestResult({
      score: scorePct,
      correct: correctCount,
      total: mockQuestions.length
    });
    awardAchievement("pyq_solver");
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }} className="animate-fade">
      
      {/* Sub tabs navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>
        {[
          { id: 'pyq-db', label: 'MAKAUT PYQ Catalog' },
          { id: 'planner', label: 'Revision Planner' },
          { id: 'mock-test', label: 'Mock Test Simulator' },
          { id: 'tricks', label: 'Examiner Pitfall Sheets' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              background: activeSubTab === tab.id ? 'var(--color-primary)' : 'transparent',
              border: 'none',
              color: activeSubTab === tab.id ? '#FFFFFF' : 'var(--text-muted)',
              padding: '0.45rem 1.25rem',
              fontSize: '0.8rem',
              fontWeight: '600',
              borderRadius: '9999px',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUBTAB: PYQ CATALOG */}
      {activeSubTab === 'pyq-db' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Filters Bar */}
          <div className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', padding: '1.25rem' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
              <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '12px' }} />
              <input 
                type="text" 
                placeholder="Search PYQ solutions..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  padding: '0.45rem 1rem 0.45rem 2.25rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { val: filterYear, setVal: setFilterYear, opt: ["All Years", "2024", "2023", "2022", "2021", "2020"] },
                { val: filterMarks, setVal: setFilterMarks, opt: ["All Marks", "5", "15"] },
                { val: filterTopic, setVal: setFilterTopic, opt: ["All Topics", "Pointers & DMA", "Variables & Operators", "User Defined Datatypes", "Recursion", "File Handling"] }
              ].map((sel, i) => (
                <select 
                  key={i} value={sel.val} onChange={(e) => sel.setVal(e.target.value)} 
                  style={{ padding: '0.45rem', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
                >
                  {sel.opt.map(o => <option key={o} value={o.includes("All") ? "all" : o}>{o}</option>)}
                </select>
              ))}
            </div>
          </div>

          {/* List filtered PYQs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredPyqs.map(p => (
              <div key={p.id} className="glass-panel animate-fade" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>{p.year} - {p.semester}</span>
                  <span>Syllabus: {p.topic} | Marks: {p.marks}</span>
                </div>
                
                <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{p.question}</h4>
                
                <div style={{ background: 'transparent', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>C Code Solution:</span>
                  <pre style={{ fontFamily: 'var(--font-code)', fontSize: '0.8rem', color: '#8BE9FD', overflowX: 'auto' }}>
                    {p.solution.trim()}
                  </pre>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', fontSize: '0.8rem' }}>
                  <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.03)', borderLeft: '3px solid var(--color-warning)', borderRadius: '6px', color: 'var(--text-muted)' }}>
                    <strong>Warning:</strong> {p.examinerPitfall}
                  </div>
                  <div style={{ padding: '0.75rem', background: 'rgba(34, 197, 94, 0.03)', borderLeft: '3px solid var(--color-success)', borderRadius: '6px', color: 'var(--text-muted)' }}>
                    <strong>Writing Style:</strong> {p.writingStyle}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* SUBTAB: PLANNER */}
      {activeSubTab === 'planner' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem' }}>Chapter Target & Priority Ranking</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {topicImportance.map((item, idx) => (
                <div key={idx} style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.95rem' }}>{item.name}</span>
                    <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>Rank #{idx + 1} Importance</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    <span>PYQ Frequency: <strong>{item.frequency}</strong></span>
                    <span>Exam Probability: <strong style={{ color: 'var(--color-success)' }}>{item.probability} (Est.)</strong></span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.notes}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Preparation Analytics</h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Syllabus Coverage:</span>
              <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', marginTop: '0.25rem', overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', background: 'var(--color-primary)' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.75rem' }}>Weak Topic Detected:</span>
              <span className="badge badge-warning" style={{ fontSize: '0.7rem', marginTop: '0.25rem' }}>Pointers & DMA (Unfinished)</span>
            </div>
            
            <div className="glass-panel" style={{ padding: '1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong>Personalized Prep Schedule:</strong>
              <ol style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Review Pointers Chapter Analogy</li>
                <li>Practice 2D array malloc template</li>
                <li>Take dynamic heap simulator tests</li>
              </ol>
            </div>
          </div>

        </div>
      )}

      {/* SUBTAB: MOCK TESTS */}
      {activeSubTab === 'mock-test' && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Simulated MAKAUT Exam</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            A 30-minute timed mock test generated from historical patterns. Covers output prediction and array functions.
          </p>

          {!isTestActive && !testResult && (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <HelpCircle size={44} color="var(--color-primary)" style={{ marginBottom: '1rem', opacity: 0.7 }} />
              <h4>Ready to begin the Mock Exam?</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Duration: 30 minutes | Questions: 5 | Target Passing Score: 60%</p>
              <button className="btn btn-primary" onClick={handleStartMockTest} style={{ borderRadius: '9999px' }}>
                <Play size={14} /> Start Mock Exam
              </button>
            </div>
          )}

          {isTestActive && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1.25rem', borderRadius: '8px', border: '1px solid var(--glass-border)', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>MAKAUT Practice Examination</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--color-error)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontFamily: 'var(--font-code)' }}>
                  <Clock size={14} /> Time Left: {formatTime(testTimeLeft)}
                </span>
              </div>

              {mockQuestions.map((q, idx) => (
                <div key={q.id} style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                    Q{idx + 1}: {q.q}
                  </h4>
                  
                  {q.type === 'mcq' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {q.options.map((opt, oIdx) => (
                        <label 
                          key={oIdx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.6rem 0.85rem',
                            background: testAnswers[q.id] === oIdx.toString() ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255,255,255,0.01)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          <input 
                            type="radio" 
                            name={`mock_${q.id}`} 
                            value={oIdx} 
                            checked={testAnswers[q.id] === oIdx.toString()} 
                            onChange={(e) => setTestAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                          />
                          {opt}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      placeholder="Type your output string" 
                      value={testAnswers[q.id] || ''}
                      onChange={(e) => setTestAnswers(prev => ({ ...prev, [q.id]: e.target.value }))}
                      style={{
                        background: 'rgba(0,0,0,0.2)',
                        border: '1px solid var(--glass-border)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-code)',
                        fontSize: '0.85rem',
                        width: '100%',
                        maxWidth: '300px',
                        outline: 'none'
                      }}
                    />
                  )}
                </div>
              ))}

              <button className="btn btn-primary" onClick={handleEndMockTest} style={{ alignSelf: 'flex-start', borderRadius: '9999px' }}>
                Submit Exam Answers
              </button>
            </div>
          )}

          {testResult && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <CheckCircle size={44} color="var(--color-success)" style={{ marginBottom: '1rem' }} />
              <h4>Mock Exam Submitted!</h4>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0.5rem 0', color: testResult.score >= 60 ? 'var(--color-success)' : 'var(--color-error)' }}>
                Your Score: {testResult.score}% ({testResult.correct}/{testResult.total} Correct)
              </p>
              <button className="btn btn-outline" onClick={handleStartMockTest} style={{ borderRadius: '9999px' }}>
                Restart Mock Test
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB: EXAMINER TRICKS */}
      {activeSubTab === 'tricks' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {examinerTricks.map((trick, i) => (
            <div key={i} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>{trick.title}</h4>
                <span className="badge badge-error" style={{ fontSize: '0.65rem' }}>Risk: {trick.pitfallRating}</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{trick.description}</p>
              
              <div style={{ background: 'transparent', padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--glass-border)', marginTop: '0.25rem' }}>
                <code style={{ fontSize: '0.75rem', color: 'var(--color-error)', display: 'block', whiteSpace: 'pre-wrap' }}>
                  {trick.example}
                </code>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                <strong>Explanation:</strong> {trick.explanation}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
