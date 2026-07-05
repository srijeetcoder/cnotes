// App State Management hook for tracking student statistics, streaks, progress, and gamification metrics
import { useState, useEffect } from 'react';

const DEFAULT_USER = {
  isLoggedIn: false,
  username: "",
  email: "",
  streak: 0,
  lastActive: null,
  xp: 0,
  level: 1,
  coins: 0,
  completedLessons: {}, // topicId -> boolean
  quizAccuracy: {}, // topicId -> score %
  completedChallenges: [], // challengeId[]
  notes: {}, // topicId -> string
  bookmarks: [], // cardId[] / topicId[]
  achievements: [],
  joinedAt: null
};

const ACHIEVEMENTS_LIST = [
  { id: "first_steps", title: "First Code", description: "Complete your first lesson", xpReward: 50, icon: "Code" },
  { id: "quiz_master", title: "Quiz Master", description: "Score 100% on any quiz", xpReward: 100, icon: "Award" },
  { id: "compiler_run", title: "Console Runner", description: "Execute program successfully in compiler", xpReward: 50, icon: "Terminal" },
  { id: "streak_3", title: "Consistent Cader", description: "Maintain a 3-day learning streak", xpReward: 150, icon: "Zap" },
  { id: "dma_wiz", title: "Heap Allocator", description: "Complete Pointer and Dynamic Memory visualizers", xpReward: 200, icon: "Cpu" },
  { id: "pyq_solver", title: "Exam Ready", description: "Solve a Previous Year Question (PYQ) mock test", xpReward: 200, icon: "BookOpen" }
];

export function useAppState() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("c_master_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // error parsing
      }
    }
    return { ...DEFAULT_USER };
  });

  useEffect(() => {
    localStorage.setItem("c_master_user", JSON.stringify(user));
  }, [user]);

  // Handle Streak Calculations
  const updateStreak = () => {
    if (!user.isLoggedIn) return;
    
    const today = new Date().toDateString();
    const lastActiveDate = user.lastActive ? new Date(user.lastActive).toDateString() : null;
    
    if (lastActiveDate === today) return; // Already active today
    
    let newStreak = user.streak;
    if (lastActiveDate) {
      const diffTime = Math.abs(new Date(today) - new Date(lastActiveDate));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1; // Reset streak
      }
    } else {
      newStreak = 1;
    }

    // Award streak achievements
    let updatedAchievements = [...user.achievements];
    if (newStreak >= 3 && !updatedAchievements.includes("streak_3")) {
      updatedAchievements.push("streak_3");
      addXp(150);
    }

    setUser(prev => ({
      ...prev,
      streak: newStreak,
      lastActive: new Date().toISOString(),
      achievements: updatedAchievements
    }));
  };

  const login = (username, email) => {
    setUser({
      ...DEFAULT_USER,
      isLoggedIn: true,
      username,
      email,
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      streak: 1
    });
  };

  const logout = () => {
    setUser({ ...DEFAULT_USER });
  };

  const addXp = (amount) => {
    setUser(prev => {
      const newXp = prev.xp + amount;
      const nextLevelThreshold = prev.level * 200;
      let newLevel = prev.level;
      let newCoins = prev.coins + Math.floor(amount / 2); // 1 coin for every 2 XP
      
      if (newXp >= nextLevelThreshold) {
        newLevel += 1;
        newCoins += 100; // Level up bonus coins
      }
      
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        coins: newCoins
      };
    });
  };

  const completeLesson = (topicId) => {
    setUser(prev => {
      if (prev.completedLessons[topicId]) return prev;
      
      let updatedAchievements = [...prev.achievements];
      if (!updatedAchievements.includes("first_steps")) {
        updatedAchievements.push("first_steps");
      }

      const completed = { ...prev.completedLessons, [topicId]: true };
      
      // Check if DMA/Pointers is completed
      if (completed["pointers-basics"] && completed["dma-heap"] && !updatedAchievements.includes("dma_wiz")) {
        updatedAchievements.push("dma_wiz");
      }

      return {
        ...prev,
        completedLessons: completed,
        achievements: updatedAchievements
      };
    });
    addXp(30);
  };

  const saveQuizScore = (topicId, scorePercentage) => {
    setUser(prev => {
      let updatedAchievements = [...prev.achievements];
      if (scorePercentage === 100 && !updatedAchievements.includes("quiz_master")) {
        updatedAchievements.push("quiz_master");
      }

      return {
        ...prev,
        quizAccuracy: { ...prev.quizAccuracy, [topicId]: Math.max(prev.quizAccuracy[topicId] || 0, scorePercentage) },
        achievements: updatedAchievements
      };
    });
    addXp(Math.round(scorePercentage * 0.5)); // Up to 50 XP
  };

  const completeChallenge = (challengeId) => {
    setUser(prev => {
      if (prev.completedChallenges.includes(challengeId)) return prev;
      return {
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId]
      };
    });
    addXp(100);
  };

  const saveNote = (topicId, text) => {
    setUser(prev => ({
      ...prev,
      notes: { ...prev.notes, [topicId]: text }
    }));
  };

  const toggleBookmark = (id) => {
    setUser(prev => {
      const isBookmarked = prev.bookmarks.includes(id);
      return {
        ...prev,
        bookmarks: isBookmarked ? prev.bookmarks.filter(b => b !== id) : [...prev.bookmarks, id]
      };
    });
  };

  const awardAchievement = (id) => {
    setUser(prev => {
      if (prev.achievements.includes(id)) return prev;
      const ach = ACHIEVEMENTS_LIST.find(a => a.id === id);
      const reward = ach ? ach.xpReward : 50;
      
      setTimeout(() => addXp(reward), 10);
      return {
        ...prev,
        achievements: [...prev.achievements, id]
      };
    });
  };

  return {
    user,
    login,
    logout,
    updateStreak,
    completeLesson,
    saveQuizScore,
    completeChallenge,
    saveNote,
    toggleBookmark,
    awardAchievement,
    achievementsList: ACHIEVEMENTS_LIST
  };
}
