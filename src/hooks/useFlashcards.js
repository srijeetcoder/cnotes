// Spaced Repetition Flashcards Hook
// Manages card boxes (levels 1-5) and next due schedules
import { useState, useEffect } from 'react';

const DEFAULT_CARDS = [
  { id: "fc1", topicId: "history", q: "Who created C and when?", a: "Dennis Ritchie in 1972 at Bell Labs.", box: 1, nextDue: null },
  { id: "fc2", topicId: "history", q: "What macro check signals successful program completion in main?", a: "return 0;", box: 1, nextDue: null },
  { id: "fc3", topicId: "variables-datatypes", q: "What is the size of a float variable in C?", a: "4 bytes.", box: 1, nextDue: null },
  { id: "fc4", topicId: "variables-datatypes", q: "Can a C variable start with a digit?", a: "No, it must start with a letter or underscore.", box: 1, nextDue: null },
  { id: "fc5", topicId: "io-basics", q: "What is the format specifier for printing double precision variables?", a: "%lf (long float).", box: 1, nextDue: null },
  { id: "fc6", topicId: "operators-types", q: "Why can't modulus (%) be used on floats?", a: "Because it computes integer remainders and is mathematically restricted to whole numbers.", box: 1, nextDue: null },
  { id: "fc7", topicId: "precedence-rules", q: "What is the associativity of assignment operators?", a: "Right-to-Left.", box: 1, nextDue: null },
  { id: "fc8", topicId: "conditionals", q: "What is switch fall-through and how is it prevented?", a: "Execution falls into subsequent cases if break is missing. Prevent with 'break;' statement.", box: 1, nextDue: null },
  { id: "fc9", topicId: "loops", q: "Which loop guarantees execution of the block at least once?", a: "do-while loop.", box: 1, nextDue: null },
  { id: "fc10", topicId: "arg-passing", q: "Does C support true call-by-reference?", a: "No, it is simulated by passing pointer addresses by value.", box: 1, nextDue: null },
  { id: "fc11", topicId: "recursion", q: "What is stack overflow in recursion?", a: "Running out of call stack memory because base case is missing or not reached.", box: 1, nextDue: null },
  { id: "fc12", topicId: "pointers-basics", q: "What is a dangling pointer?", a: "A pointer pointing to a memory address that has been freed/deallocated.", box: 1, nextDue: null },
  { id: "fc13", topicId: "pointers-basics", q: "What is a wild pointer?", a: "An uninitialized pointer pointing to a random garbage address.", box: 1, nextDue: null },
  { id: "fc14", topicId: "dma-heap", q: "What is the difference in arguments between malloc and calloc?", a: "malloc takes 1 argument (total bytes); calloc takes 2 (item count, element size).", box: 1, nextDue: null },
  { id: "fc15", topicId: "dma-heap", q: "What is a memory leak?", a: "Allocating memory dynamically in the heap and losing pointer references without calling free().", box: 1, nextDue: null },
  { id: "fc16", topicId: "unions-enums", q: "What is the memory size of a union?", a: "Equal to the size of its largest member.", box: 1, nextDue: null },
  { id: "fc17", topicId: "file-ops", q: "What is the value of EOF in stdio.h?", a: "-1", box: 1, nextDue: null },
  { id: "fc18", topicId: "file-traversal", q: "What does rewind(fp) do?", a: "Instantly moves the cursor back to the start of the file.", box: 1, nextDue: null },
  { id: "fc19", topicId: "storage-classes", q: "Why can't you write &regVar for a register variable?", a: "Because register variables are stored inside CPU registers which do not have RAM addresses.", box: 1, nextDue: null }
];

export function useFlashcards() {
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("c_master_flashcards");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_CARDS;
  });

  useEffect(() => {
    localStorage.setItem("c_master_flashcards", JSON.stringify(cards));
  }, [cards]);

  const recordReview = (cardId, isCorrect) => {
    setCards(prev => prev.map(card => {
      if (card.id !== cardId) return card;
      
      let newBox = card.box;
      if (isCorrect) {
        newBox = Math.min(newBox + 1, 5);
      } else {
        newBox = Math.max(newBox - 1, 1);
      }

      // Spaced repetition schedule based on box level
      // Box 1: 1 day, Box 2: 2 days, Box 3: 4 days, Box 4: 7 days, Box 5: 14 days
      const daysToAdd = [1, 2, 4, 7, 14][newBox - 1];
      const nextDue = new Date();
      nextDue.setDate(nextDue.getDate() + daysToAdd);

      return {
        ...card,
        box: newBox,
        nextDue: nextDue.toISOString()
      };
    }));
  };

  const getDueCards = () => {
    const now = new Date();
    return cards.filter(card => {
      if (!card.nextDue) return true; // Never reviewed cards are due
      return new Date(card.nextDue) <= now;
    });
  };

  return {
    cards,
    recordReview,
    getDueCards,
    totalCards: cards.length
  };
}
