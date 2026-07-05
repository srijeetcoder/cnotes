// Redesigned Dashboard Component with Apple Fitness progress rings and floating glass widgets
import React from 'react';
import { Award, Zap, CheckCircle2, BookOpen, Star, NotepadText, BrainCircuit, Trophy, ArrowRight } from 'lucide-react';
import { chapters } from '../../data/syllabus';

export default function DashboardView({ user, achievementsList, totalFlashcardsDue = 0, onNavigate }) {
  const completedCount = Object.keys(user.completedLessons).length;
  const totalLessons = chapters.reduce((acc, curr) => acc + curr.sections.length, 0);
  const completionPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  
  // Progress Ring variables
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  
  // Calculate offsets for progress rings
  const syllabusOffset = circumference - (completionPercentage / 100) * circumference;
  
  const maxStreakTarget = 7; // Weekly target
  const streakOffset = circumference - (Math.min(user.streak, maxStreakTarget) / maxStreakTarget) * circumference;
  
  const avgQuizAccuracy = Object.keys(user.quizAccuracy).length > 0 
    ? Math.round(Object.values(user.quizAccuracy).reduce((a, b) => a + b, 0) / Object.keys(user.quizAccuracy).length)
    : 0;
  const quizOffset = circumference - (avgQuizAccuracy / 100) * circumference;

  let suggestedLesson = null;
  for (let ch of chapters) {
    for (let sec of ch.sections) {
      if (!user.completedLessons[sec.id]) {
        suggestedLesson = { chapter: ch, section: sec };
        break;
      }
    }
    if (suggestedLesson) break;
  }
  
  if (!suggestedLesson && chapters.length > 0) {
    suggestedLesson = { chapter: chapters[0], section: chapters[0].sections[0] };
  }

  // Simulated leaderboard data
  const leaderboard = [
    { rank: 1, name: "Subhadip Sen", college: "MAKAUT main campus", xp: 1850 },
    { rank: 2, name: "Srinjoy Dutta", college: "MAKAUT main campus", xp: 1620 },
    { rank: 3, name: user.username ? `${user.username} (You)` : "You", college: "MAKAUT main campus", xp: user.xp, active: true },
    { rank: 4, name: "Rounak Roy", college: "MAKAUT main campus", xp: 520 },
    { rank: 5, name: "Ananya Ghosh", college: "MAKAUT main campus", xp: 480 }
  ].sort((a, b) => b.xp - a.xp);

  leaderboard.forEach((item, index) => {
    item.rank = index + 1;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }} className="animate-fade">
      
      {/* Immersive Welcome Banner */}
      <div className="glass-panel" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        background: 'transparent',
        padding: '2.5rem',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.12)'
      }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '-0.04em' }}>
            Welcome back, {user.username || 'Developer'}!
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Prepare comprehensively for your upcoming B.Tech C Programming examinations.
          </p>
        </div>

        {suggestedLesson && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>UP NEXT</span>
            <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{suggestedLesson.section.title}</span>
            <button 
              className="btn btn-primary"
              onClick={() => onNavigate('study')}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem', borderRadius: '9999px' }}
            >
              Continue <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Fitness Progress Rings Section */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Activity Progress Rings</h3>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', justifyContent: 'center', padding: '1rem 0' }}>
          
          {/* Ring 1: Syllabus completion */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <svg width="90" height="90">
              <circle cx="45" cy="45" r={radius} stroke="rgba(59, 130, 246, 0.1)" strokeWidth="8" fill="transparent" />
              <circle 
                cx="45" cy="45" r={radius} 
                stroke="var(--color-primary)" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={circumference}
                strokeDashoffset={syllabusOffset}
                strokeLinecap="round"
                className="progress-ring-circle"
              />
            </svg>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{completionPercentage}%</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Syllabus Completed</span>
            </div>
          </div>



          {/* Ring 3: Quiz accuracy */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <svg width="90" height="90">
              <circle cx="45" cy="45" r={radius} stroke="rgba(139, 92, 246, 0.1)" strokeWidth="8" fill="transparent" />
              <circle 
                cx="45" cy="45" r={radius} 
                stroke="var(--color-secondary)" 
                strokeWidth="8" 
                fill="transparent" 
                strokeDasharray={circumference}
                strokeDashoffset={quizOffset}
                strokeLinecap="round"
                className="progress-ring-circle"
              />
            </svg>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{avgQuizAccuracy}%</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Quiz Score</span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
        
        {/* Left pane details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Details widgets row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BrainCircuit size={16} color="var(--color-secondary)" /> Daily Task List
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <span>Flashcards Due:</span>
                  <span className={`badge ${totalFlashcardsDue > 0 ? 'badge-warning' : 'badge-success'}`}>{totalFlashcardsDue}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <span>Custom Notes Saved:</span>
                  <span className="badge badge-primary">{Object.keys(user.notes).length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <span>Bookmarks:</span>
                  <span className="badge badge-secondary">{user.bookmarks.length}</span>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Trophy size={16} color="var(--color-warning)" /> Exam Prep Checkpoints
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <input type="checkbox" checked={completedCount > 0} readOnly />
                  <span>Basics & Contiguous Array Shifts</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <input type="checkbox" checked={completedCount > 2} readOnly />
                  <span>Heap DMA & Malloc pointers tracing</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <input type="checkbox" checked={completedCount > 4} readOnly />
                  <span>Row/Col Major address mapping formulas</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                  <input type="checkbox" checked={completedCount > 6} readOnly />
                  <span>Sorting algorithms dry-runs</span>
                </div>
              </div>
            </div>

          </div>

          {/* Badges / Achievements list */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="var(--color-primary)" /> Achievements Catalog
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {achievementsList.map(ach => {
                const isUnlocked = user.achievements.includes(ach.id);
                return (
                  <div 
                    key={ach.id}
                    className="glass-panel"
                    style={{
                      padding: '1rem',
                      background: isUnlocked ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                      opacity: isUnlocked ? 1 : 0.35,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      border: '1px solid var(--glass-border)'
                    }}
                  >
                    <div className="flex-center" style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isUnlocked ? 'var(--primary-glow)' : 'transparent',
                      color: isUnlocked ? 'var(--color-primary)' : 'var(--text-muted)'
                    }}>
                      <Award size={16} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{ach.title}</h4>
                      <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{ach.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
