// SortingSearchingVisualizer: Comprehensive Visualizer for Sorting & Searching with Projectile Animations and C Code Templates
import React, { useState } from 'react';
import { Play, RotateCcw, Info, Shuffle } from 'lucide-react';

const ALGO_CODE_TEMPLATES = {
  bubble: `// Bubble Sort C Implementation
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                // Swap arr[j] and arr[j+1]
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}`,
  selection: `// Selection Sort C Implementation
void selectionSort(int arr[], int n) {
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        // Swap min with current index
        int temp = arr[min_idx];
        arr[min_idx] = arr[i];
        arr[i] = temp;
    }
}`,
  insertion: `// Insertion Sort C Implementation
void insertionSort(int arr[], int n) {
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}`,
  quick: `// Quick Sort C Implementation
int partition(int arr[], int low, int high) {
    int pivot = arr[high];
    int i = (low - 1);
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            int temp = arr[i];
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }
    int temp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return (i + 1);
}

void quickSort(int arr[], int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}`,
  merge: `// Merge Sort C Implementation
void merge(int arr[], int l, int m, int r) {
    int n1 = m - l + 1;
    int n2 = r - m;
    int L[n1], R[n2];
    for (int i = 0; i < n1; i++) L[i] = arr[l + i];
    for (int j = 0; j < n2; j++) R[j] = arr[m + 1 + j];
    int i = 0, j = 0, k = l;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    while (i < n1) { arr[k] = L[i]; i++; k++; }
    while (j < n2) { arr[k] = R[j]; j++; k++; }
}

void mergeSort(int arr[], int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
  linear: `// Linear Search C Implementation
int linearSearch(int arr[], int n, int target) {
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            return i; // Element found
        }
    }
    return -1; // Element not found
}`,
  binary: `// Binary Search C Implementation (Requires Sorted Array)
int binarySearch(int arr[], int l, int r, int target) {
    while (l <= r) {
        int m = l + (r - l) / 2;
        if (arr[m] == target) return m;
        if (arr[m] < target) l = m + 1;
        else r = m - 1;
    }
    return -1;
}`
};

const PALETTES = [
  { bg: "linear-gradient(to top, #3b82f6, #60a5fa)", border: "#3b82f6", glow: "rgba(59, 130, 246, 0.4)", text: "#93c5fd" }, // Blue
  { bg: "linear-gradient(to top, #10b981, #34d399)", border: "#10b981", glow: "rgba(16, 185, 129, 0.4)", text: "#6ee7b7" }, // Emerald
  { bg: "linear-gradient(to top, #8b5cf6, #a78bfa)", border: "#8b5cf6", glow: "rgba(139, 92, 246, 0.4)", text: "#c4b5fd" }, // Violet
  { bg: "linear-gradient(to top, #ec4899, #f472b6)", border: "#ec4899", glow: "rgba(236, 72, 153, 0.4)", text: "#f9a8d4" }, // Pink
  { bg: "linear-gradient(to top, #f97316, #fb923c)", border: "#f97316", glow: "rgba(249, 115, 22, 0.4)", text: "#fdba74" }, // Orange
  { bg: "linear-gradient(to top, #06b6d4, #67e8f9)", border: "#06b6d4", glow: "rgba(6, 182, 212, 0.4)", text: "#67e8f9" }, // Cyan
  { bg: "linear-gradient(to top, #84cc16, #a3e635)", border: "#84cc16", glow: "rgba(132, 204, 22, 0.4)", text: "#d9f99d" }, // Lime
  { bg: "linear-gradient(to top, #e11d48, #fb7185)", border: "#e11d48", glow: "rgba(225, 29, 72, 0.4)", text: "#fda4af" }  // Rose
];

const getNodeTheme = (id) => {
  if (id === "0") return { bg: "linear-gradient(to top, #6366f1, #818cf8)", border: "#6366f1", glow: "rgba(99, 102, 241, 0.4)", text: "#c7d2fe" }; // root Indigo
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PALETTES.length;
  return PALETTES[index];
};

const createInitialTreeMap = (arr) => {
  if (!arr || arr.length === 0) return {};
  const map = {};
  const traverse = (l, r, depth = 0, id = "0") => {
    map[id] = {
      id,
      l,
      r,
      depth,
      values: depth === 0 ? [...arr.slice(l, r + 1)] : [],
      state: 'inactive', // 'inactive' | 'active' | 'comparing' | 'sorted'
      comparingIdxs: [],
      theme: getNodeTheme(id)
    };
    if (l < r) {
      const m = Math.floor(l + (r - l) / 2);
      traverse(l, m, depth + 1, id + "L");
      traverse(m + 1, r, depth + 1, id + "R");
    }
  };
  traverse(0, arr.length - 1);
  return map;
};

export default function SortingSearchingVisualizer() {
  const [array, setArray] = useState([45, 12, 85, 32, 70, 22, 60]);
  const [activeIdxs, setActiveIdxs] = useState([]);
  const [swappingIdxs, setSwappingIdxs] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [logText, setLogText] = useState('Select an algorithm and click play.');
  const [selectedAlgo, setSelectedAlgo] = useState('bubble'); // bubble | selection | insertion | quick | merge | linear | binary
  const [searchTarget, setSearchTarget] = useState('22');
  const [foundIndex, setFoundIndex] = useState(-1);
  const [speed] = useState(800);

  // Custom Input States
  const [customInput, setCustomInput] = useState('45, 12, 85, 32, 70, 22, 60');
  const [inputError, setInputError] = useState('');
  const [mergeTree, setMergeTree] = useState(null);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Sync tree with array / algorithm changes
  React.useEffect(() => {
    if (selectedAlgo === 'merge') {
      if (array.length > 10) {
        const sliced = array.slice(0, 10);
        setArray(sliced);
        setCustomInput(sliced.join(', '));
        setMergeTree(createInitialTreeMap(sliced));
        setLogText('Array adjusted to max 10 elements for Merge Sort recursive visual tree.');
      } else {
        setMergeTree(createInitialTreeMap(array));
      }
    } else {
      setMergeTree(null);
    }
  }, [array, selectedAlgo]);

  const resetArray = () => {
    if (animating) return;
    const defaultArray = [45, 12, 85, 32, 70, 22, 60];
    setArray(defaultArray);
    setCustomInput('45, 12, 85, 32, 70, 22, 60');
    setInputError('');
    setActiveIdxs([]);
    setSwappingIdxs([]);
    setFoundIndex(-1);
    if (selectedAlgo === 'merge') {
      setMergeTree(createInitialTreeMap(defaultArray));
    }
    setLogText('Array reset. Ready.');
  };

  const handleApplyCustomArray = () => {
    if (animating) return;
    setInputError('');
    const parsed = customInput
      .split(',')
      .map(num => num.trim())
      .filter(num => num !== '')
      .map(num => parseInt(num));
    
    if (parsed.some(isNaN)) {
      setInputError('Error: Please enter only valid integers separated by commas.');
      return;
    }
    
    const limitMin = 3;
    const limitMax = selectedAlgo === 'merge' ? 10 : 15;
    
    if (parsed.length < limitMin || parsed.length > limitMax) {
      setInputError(`Error: Array size must be between ${limitMin} and ${limitMax} elements.`);
      return;
    }

    setArray(parsed);
    setFoundIndex(-1);
    setActiveIdxs([]);
    setSwappingIdxs([]);
    setLogText('Loaded custom array. Ready.');
  };

  const handleRandomizeArray = () => {
    if (animating) return;
    setInputError('');
    const size = Math.floor(Math.random() * (selectedAlgo === 'merge' ? 6 : 9)) + 4; // 4 to 9 for merge, 4 to 12 otherwise
    const randomArr = Array.from({ length: size }, () => Math.floor(Math.random() * 85) + 10);
    setArray(randomArr);
    setCustomInput(randomArr.join(', '));
    setFoundIndex(-1);
    setActiveIdxs([]);
    setSwappingIdxs([]);
    setLogText('Generated random array. Ready.');
  };

  // 1. Bubble Sort
  const runBubbleSort = async () => {
    setAnimating(true);
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        setActiveIdxs([j, j + 1]);
        setLogText(`Comparing: arr[${j}] (${arr[j]}) & arr[${j+1}] (${arr[j+1]})`);
        await sleep(speed);
        if (arr[j] > arr[j + 1]) {
          setLogText(`Swap flight triggered: ${arr[j]} <-> ${arr[j+1]}`);
          setSwappingIdxs([j, j + 1]);
          await sleep(speed * 0.8);
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          setSwappingIdxs([]);
          await sleep(speed * 0.4);
        }
      }
    }
    setActiveIdxs([]);
    setLogText('Bubble Sort Complete.');
    setAnimating(false);
  };

  // 2. Selection Sort
  const runSelectionSort = async () => {
    setAnimating(true);
    let arr = [...array];
    for (let i = 0; i < arr.length - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        setActiveIdxs([minIdx, j]);
        setLogText(`Scanning: checking local minimum relative to arr[${j}]`);
        await sleep(speed * 0.7);
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        setLogText(`Projectile swap: arr[${i}] (${arr[i]}) <-> arr[${minIdx}] (${arr[minIdx]})`);
        setSwappingIdxs([i, minIdx]);
        await sleep(speed * 0.8);
        let temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        setArray([...arr]);
        setSwappingIdxs([]);
        await sleep(speed * 0.4);
      }
    }
    setActiveIdxs([]);
    setLogText('Selection Sort Complete.');
    setAnimating(false);
  };

  // 3. Insertion Sort
  const runInsertionSort = async () => {
    setAnimating(true);
    let arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      setActiveIdxs([i]);
      setLogText(`Evaluating key value ${key} at index ${i}`);
      await sleep(speed);
      while (j >= 0 && arr[j] > key) {
        setLogText(`Shift flight: arr[${j}] (${arr[j]}) shifted right`);
        setActiveIdxs([j, j + 1]);
        setSwappingIdxs([j, j + 1]);
        await sleep(speed * 0.7);
        arr[j + 1] = arr[j];
        setArray([...arr]);
        setSwappingIdxs([]);
        j = j - 1;
        await sleep(speed * 0.4);
      }
      arr[j + 1] = key;
      setArray([...arr]);
      await sleep(speed * 0.5);
    }
    setActiveIdxs([]);
    setLogText('Insertion Sort Complete.');
    setAnimating(false);
  };

  // 4. Quick Sort
  const runQuickSort = async () => {
    setAnimating(true);
    let arr = [...array];
    setLogText('Starting Quick Sort (Pivot: Last Element)');
    
    const quickSortHelper = async (low, high) => {
      if (low < high) {
        let pi = await partition(low, high);
        await quickSortHelper(low, pi - 1);
        await quickSortHelper(pi + 1, high);
      }
    };

    const partition = async (low, high) => {
      let pivot = arr[high];
      let i = low - 1;
      setLogText(`Partition: Selected Pivot ${pivot} at index ${high}`);
      setActiveIdxs([high]);
      await sleep(speed);

      for (let j = low; j < high; j++) {
        setActiveIdxs([j, high]);
        await sleep(speed * 0.5);
        if (arr[j] < pivot) {
          i++;
          setLogText(`arr[${j}] (${arr[j]}) < Pivot (${pivot}). Swapping index ${i} and ${j}`);
          setSwappingIdxs([i, j]);
          await sleep(speed * 0.7);
          let temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
          setArray([...arr]);
          setSwappingIdxs([]);
          await sleep(speed * 0.3);
        }
      }
      setLogText(`Placing pivot ${pivot} at sorted partition slot ${i + 1}`);
      setSwappingIdxs([i + 1, high]);
      await sleep(speed * 0.7);
      let temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;
      setArray([...arr]);
      setSwappingIdxs([]);
      await sleep(speed * 0.4);
      return i + 1;
    };

    await quickSortHelper(0, arr.length - 1);
    setActiveIdxs([]);
    setLogText('Quick Sort Complete.');
    setAnimating(false);
  };

  // 5. Merge Sort (Dividing and Conquer Visualization)
  const runMergeSort = async () => {
    setAnimating(true);
    const arr = [...array];
    const currentTree = createInitialTreeMap(arr);
    
    currentTree["0"].state = 'active';
    setMergeTree({ ...currentTree });
    setLogText('Merge Sort: Root array is ready to be divided.');
    await sleep(speed);

    const mergeSortHelper = async (l, r, id = "0") => {
      if (l >= r) {
        currentTree[id].state = 'sorted';
        setMergeTree({ ...currentTree });
        setLogText(`Reached base case at index ${l}: [${arr[l]}] is sorted.`);
        await sleep(speed * 0.8);
        return;
      }

      const m = Math.floor(l + (r - l) / 2);
      const leftId = id + "L";
      const rightId = id + "R";

      setLogText(`Dividing subarray at node ${id} [idx ${l} to ${r}] into left and right halves.`);
      currentTree[id].state = 'split';
      
      currentTree[leftId].values = arr.slice(l, m + 1);
      currentTree[leftId].state = 'active';
      
      currentTree[rightId].values = arr.slice(m + 1, r + 1);
      currentTree[rightId].state = 'active';
      
      setMergeTree({ ...currentTree });
      await sleep(speed * 1.2);

      await mergeSortHelper(l, m, leftId);
      await mergeSortHelper(m + 1, r, rightId);

      setLogText(`Merging child nodes ${leftId} and ${rightId} back into node ${id}.`);
      currentTree[id].state = 'sorting';
      currentTree[id].values = [];
      setMergeTree({ ...currentTree });
      await sleep(speed * 0.5);

      let temp = [];
      let i = 0;
      let j = 0;
      const leftVals = [...currentTree[leftId].values];
      const rightVals = [...currentTree[rightId].values];

      currentTree[leftId].state = 'comparing';
      currentTree[rightId].state = 'comparing';

      while (i < leftVals.length && j < rightVals.length) {
        currentTree[leftId].comparingIdxs = [i];
        currentTree[rightId].comparingIdxs = [j];
        setLogText(`Comparing left element ${leftVals[i]} with right element ${rightVals[j]}.`);
        setMergeTree({ ...currentTree });
        await sleep(speed * 1.2);

        if (leftVals[i] <= rightVals[j]) {
          temp.push(leftVals[i]);
          currentTree[id].values = [...temp];
          setLogText(`Taking ${leftVals[i]} from left subarray.`);
          i++;
        } else {
          temp.push(rightVals[j]);
          currentTree[id].values = [...temp];
          setLogText(`Taking ${rightVals[j]} from right subarray.`);
          j++;
        }
        setMergeTree({ ...currentTree });
        await sleep(speed * 0.8);
      }

      currentTree[leftId].comparingIdxs = [];
      currentTree[rightId].comparingIdxs = [];

      while (i < leftVals.length) {
        setLogText(`Appending remaining left element ${leftVals[i]}.`);
        temp.push(leftVals[i]);
        currentTree[id].values = [...temp];
        i++;
        setMergeTree({ ...currentTree });
        await sleep(speed * 0.5);
      }
      while (j < rightVals.length) {
        setLogText(`Appending remaining right element ${rightVals[j]}.`);
        temp.push(rightVals[j]);
        currentTree[id].values = [...temp];
        j++;
        setMergeTree({ ...currentTree });
        await sleep(speed * 0.5);
      }

      currentTree[id].state = 'sorted';
      currentTree[leftId].state = 'inactive';
      currentTree[leftId].values = [];
      currentTree[rightId].state = 'inactive';
      currentTree[rightId].values = [];

      for (let k = 0; k < temp.length; k++) {
        arr[l + k] = temp[k];
      }
      setArray([...arr]);
      setMergeTree({ ...currentTree });
      setLogText(`Merge complete for node ${id}. Subarray is now: [${temp.join(', ')}].`);
      await sleep(speed * 1.2);
    };

    await mergeSortHelper(0, arr.length - 1, "0");
    
    Object.keys(currentTree).forEach(key => {
      currentTree[key].state = 'inactive';
      currentTree[key].values = [];
    });
    currentTree["0"].values = [...arr];
    currentTree["0"].state = 'sorted';
    setMergeTree({ ...currentTree });

    setActiveIdxs([]);
    setLogText('Merge Sort Complete! Entire array is sorted.');
    setAnimating(false);
  };

  // 6. Linear Search
  const runLinearSearch = async () => {
    setAnimating(true);
    setFoundIndex(-1);
    let target = parseInt(searchTarget);
    let arr = [...array];
    setLogText(`Searching for target value ${target} via Linear Search`);
    await sleep(speed);

    for (let i = 0; i < arr.length; i++) {
      setActiveIdxs([i]);
      setSwappingIdxs([i]);
      setLogText(`Comparing: checking if arr[${i}] (${arr[i]}) == target (${target})`);
      await sleep(speed);
      setSwappingIdxs([]);

      if (arr[i] === target) {
        setFoundIndex(i);
        setLogText(`Match Found! Target ${target} located at index ${i}`);
        await sleep(speed);
        setAnimating(false);
        return;
      }
    }
    setLogText(`Linear Search Complete. Target ${target} not found.`);
    setActiveIdxs([]);
    setAnimating(false);
  };

  // 7. Binary Search
  const runBinarySearch = async () => {
    setAnimating(true);
    setFoundIndex(-1);
    let target = parseInt(searchTarget);
    let arr = [...array];
    
    setLogText('Sorting array first (Binary Search requires a sorted sequence)...');
    arr.sort((a, b) => a - b);
    setArray(arr);
    setCustomInput(arr.join(', '));
    await sleep(speed * 1.5);

    let l = 0, r = arr.length - 1;
    while (l <= r) {
      let m = Math.floor(l + (r - l) / 2);
      setActiveIdxs([l, m, r]);
      setSwappingIdxs([m]);
      setLogText(`Binary Search: L=${l}, Mid=${m}, R=${r}. Comparing mid value ${arr[m]} with target ${target}`);
      await sleep(speed * 1.2);
      setSwappingIdxs([]);

      if (arr[m] === target) {
        setFoundIndex(m);
        setLogText(`Match Found! Target ${target} located at index ${m}`);
        await sleep(speed);
        setAnimating(false);
        return;
      }
      if (arr[m] < target) {
        setLogText(`${arr[m]} < ${target}. Searching in the right half.`);
        l = m + 1;
      } else {
        setLogText(`${arr[m]} > ${target}. Searching in the left half.`);
        r = m - 1;
      }
      await sleep(speed * 0.8);
    }

    setLogText(`Binary Search Complete. Target ${target} not found.`);
    setActiveIdxs([]);
    setAnimating(false);
  };

  const handlePlay = () => {
    if (selectedAlgo === 'bubble') runBubbleSort();
    else if (selectedAlgo === 'selection') runSelectionSort();
    else if (selectedAlgo === 'insertion') runInsertionSort();
    else if (selectedAlgo === 'quick') runQuickSort();
    else if (selectedAlgo === 'merge') runMergeSort();
    else if (selectedAlgo === 'linear') runLinearSearch();
    else if (selectedAlgo === 'binary') runBinarySearch();
  };

  const highlightCProgram = (cCode) => {
    let html = cCode
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    const keywords = ['void', 'int', 'float', 'char', 'double', 'return', 'if', 'while', 'for', 'else', 'struct', 'sizeof', 'free'];
    const functions = ['bubbleSort', 'selectionSort', 'insertionSort', 'quickSort', 'mergeSort', 'partition', 'merge', 'linearSearch', 'binarySearch', 'printf'];

    html = html.replace(/(".*?")/g, '<span class="syntax-str">$1</span>');
    html = html.replace(/(\/\/.*)/g, '<span class="syntax-comment">$1</span>');

    keywords.forEach(kw => {
      html = html.replace(new RegExp(`\\b${kw}\\b`, 'g'), `<span class="syntax-kw">${kw}</span>`);
    });
    functions.forEach(fn => {
      html = html.replace(new RegExp(`\\b${fn}\\b`, 'g'), `<span class="syntax-fn">${fn}</span>`);
    });

    return { __html: html };
  };

  const renderMergeTreeNode = (node) => {
    const isNodeActive = node.state !== 'inactive' || node.values.length > 0;
    
    return (
      <div
        key={node.id}
        style={{
          width: `calc(${((node.r - node.l + 1) / array.length) * 100}% - 12px)`,
          margin: '6px',
          minHeight: '60px',
          borderRadius: '8px',
          background: isNodeActive ? 'rgba(255, 255, 255, 0.02)' : 'transparent',
          border: isNodeActive 
            ? `1px solid ${node.theme.border}` 
            : '1px dashed rgba(255,255,255,0.08)',
          padding: '0.4rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: isNodeActive ? `0 0 10px ${node.theme.glow}` : 'none'
        }}
      >
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', width: '100%', flexWrap: 'nowrap' }}>
          {isNodeActive && node.values.map((val, valIdx) => {
            const isValComparing = node.comparingIdxs.includes(valIdx);
            
            return (
              <div
                key={valIdx}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  background: isValComparing 
                    ? 'var(--color-warning)' 
                    : node.state === 'sorted' 
                      ? 'var(--color-success)' 
                      : node.theme.bg,
                  border: `1px solid ${isValComparing ? 'var(--color-warning)' : node.theme.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  transform: isValComparing ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: isValComparing ? '0 0 8px var(--color-warning)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {val}
              </div>
            );
          })}
        </div>
        <span style={{ fontSize: '0.6rem', color: isNodeActive ? node.theme.text : 'rgba(255,255,255,0.2)', marginTop: '4px', fontWeight: '500' }}>
          idx {node.l === node.r ? node.l : `${node.l}-${node.r}`}
        </span>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Visualizer header & control options */}
      <div className="glass-panel animate-fade" style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.01)', borderColor: 'rgba(255,255,255,0.06)' }}>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Algorithm Arena</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Interactive sorting and searching flights with projectile swap animations</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {Object.keys(ALGO_CODE_TEMPLATES).map(algo => (
              <button
                key={algo}
                onClick={() => {
                  if (animating) return;
                  setSelectedAlgo(algo);
                  setFoundIndex(-1);
                  setActiveIdxs([]);
                }}
                className="btn"
                style={{
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.75rem',
                  borderRadius: '9999px',
                  background: selectedAlgo === algo ? 'var(--color-primary)' : 'rgba(255,255,255,0.02)',
                  color: selectedAlgo === algo ? '#FFFFFF' : 'var(--text-muted)',
                  border: '1px solid var(--glass-border)'
                }}
              >
                {algo.charAt(0).toUpperCase() + algo.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }}>
          
          {/* Main Visual Arena */}
          <div>
            <div style={{
              height: selectedAlgo === 'merge' ? 'auto' : '250px',
              minHeight: '250px',
              background: 'rgba(0,0,0,0.15)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '12px',
              padding: '2rem',
              display: 'flex',
              alignItems: selectedAlgo === 'merge' ? 'center' : 'flex-end',
              justifyContent: 'center',
              gap: '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {selectedAlgo === 'merge' && mergeTree ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', padding: '0.5rem 0' }}>
                  {(() => {
                    const maxDepth = Math.max(...Object.values(mergeTree).map(n => n.depth));
                    const levels = [];
                    for (let d = 0; d <= maxDepth; d++) {
                      const nodes = Object.values(mergeTree)
                        .filter(n => n.depth === d)
                        .sort((a, b) => a.id.localeCompare(b.id));
                      levels.push(nodes);
                    }
                    return levels.map((levelNodes, lvlIdx) => (
                      <div key={lvlIdx} style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        {levelNodes.map(node => renderMergeTreeNode(node))}
                      </div>
                    ));
                  })()}
                </div>
              ) : (
                array.map((val, idx) => {
                  const isActive = activeIdxs.includes(idx);
                  const isSwapping = swappingIdxs.includes(idx);
                  const isFound = foundIndex === idx;
                  
                  let transformStyle = 'translate(0, 0)';
                  if (isSwapping) {
                    if (selectedAlgo === 'linear' || selectedAlgo === 'binary') {
                      transformStyle = 'translateY(-15px) scale(1.05)';
                    } else {
                      const otherIdx = swappingIdxs.find(i => i !== idx);
                      const deltaIdx = otherIdx - idx;
                      const distanceX = deltaIdx * 67;
                      transformStyle = `translate(${distanceX / 2}px, -60px) scale(1.05)`;
                    }
                  }

                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        transform: transformStyle,
                        transition: isSwapping ? 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'all 0.3s ease',
                        zIndex: isSwapping ? 100 : 1
                      }}
                    >
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 'bold', 
                        marginBottom: '0.25rem', 
                        color: isFound ? 'var(--color-success)' : isActive ? 'var(--color-primary)' : 'var(--text-muted)' 
                      }}>
                        {val}
                      </span>
                      
                      <div style={{
                        width: '42px',
                        height: `${val * 1.5}px`,
                        background: isFound
                          ? 'linear-gradient(to top, var(--color-success), rgba(34, 197, 94, 0.3))'
                          : isSwapping 
                            ? 'linear-gradient(to top, var(--color-secondary), var(--color-primary))' 
                            : isActive ? 'rgba(59, 130, 246, 0.25)' : 'rgba(255,255,255,0.01)',
                        border: isFound
                          ? '2px solid var(--color-success)'
                          : isSwapping
                            ? '2px solid var(--color-secondary)'
                            : isActive ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                        borderRadius: '6px 6px 0 0',
                        transition: 'all 0.3s'
                      }} />
                      
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        [{idx}]
                      </span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Informational flight log */}
            <div style={{ 
              padding: '0.75rem 1rem', 
              marginTop: '1rem', 
              display: 'flex', 
              gap: '0.5rem', 
              alignItems: 'center',
              background: 'rgba(255,255,255,0.01)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '8px'
            }}>
              <Info size={14} color="var(--color-primary)" />
              <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', margin: 0 }}>{logText}</p>
            </div>
          </div>

          {/* Action sidebar panel */}
          <div className="glass-panel" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255,255,255,0.01)', borderColor: 'rgba(255,255,255,0.04)' }}>
            
            {/* Custom Array Configuration */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '1rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Configure Array</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <input
                  type="text"
                  placeholder="e.g. 45, 12, 85, 32"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  disabled={animating}
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '6px',
                    padding: '0.4rem 0.6rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-code)',
                    fontSize: '0.8rem',
                    outline: 'none',
                    width: '100%'
                  }}
                />
                
                {inputError && (
                  <span style={{ fontSize: '0.65rem', color: 'var(--color-error)' }}>
                    {inputError}
                  </span>
                )}
                
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button
                    onClick={handleApplyCustomArray}
                    disabled={animating}
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.7rem', borderRadius: '6px' }}
                  >
                    Set Custom
                  </button>
                  
                  <button
                    onClick={handleRandomizeArray}
                    disabled={animating}
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '0.35rem 0.5rem', fontSize: '0.7rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem' }}
                  >
                    <Shuffle size={10} /> Random
                  </button>
                </div>
              </div>
            </div>

            {(selectedAlgo === 'linear' || selectedAlgo === 'binary') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Search Target Value:</span>
                <input 
                  type="number"
                  value={searchTarget}
                  onChange={(e) => setSearchTarget(e.target.value)}
                  style={{
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '6px',
                    padding: '0.4rem 0.6rem',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-code)',
                    fontSize: '0.8rem',
                    outline: 'none'
                  }}
                />
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: 'auto' }}>
              <button 
                className="btn btn-primary" 
                onClick={handlePlay} 
                disabled={animating}
                style={{ width: '100%', borderRadius: '8px', fontSize: '0.85rem' }}
              >
                <Play size={13} /> {animating ? 'Simulating...' : 'Play Animation'}
              </button>
              
              <button 
                className="btn btn-outline" 
                onClick={resetArray} 
                disabled={animating}
                style={{ width: '100%', borderRadius: '8px', fontSize: '0.85rem' }}
              >
                <RotateCcw size={13} /> Reset Arena
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Program C Code below visualizer inside transparent glass card */}
      <div className="glass-panel animate-fade" style={{ padding: '2rem', background: 'rgba(255, 255, 255, 0.01)', borderColor: 'rgba(255,255,255,0.06)' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem' }}>
          C Implementation: {selectedAlgo.charAt(0).toUpperCase() + selectedAlgo.slice(1)} Sort/Search
        </h4>
        
        <pre style={{
          margin: 0,
          padding: '1.25rem',
          background: 'rgba(0, 0, 0, 0.25)',
          border: '1px solid rgba(255,255,255,0.04)',
          borderRadius: '8px',
          fontFamily: 'var(--font-code)',
          fontSize: '0.85rem',
          lineHeight: '1.6',
          color: '#D4D4D4',
          overflowX: 'auto',
          whiteSpace: 'pre'
        }} dangerouslySetInnerHTML={highlightCProgram(ALGO_CODE_TEMPLATES[selectedAlgo])} />
      </div>

    </div>
  );
}
