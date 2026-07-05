// SortingSearchingVisualizer: Comprehensive Visualizer for Sorting & Searching with Projectile Animations and C Code Templates
import React, { useState } from 'react';
import { Play, RotateCcw, Info } from 'lucide-react';

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

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const resetArray = () => {
    if (animating) return;
    setArray([45, 12, 85, 32, 70, 22, 60]);
    setActiveIdxs([]);
    setSwappingIdxs([]);
    setFoundIndex(-1);
    setLogText('Array reset. Ready.');
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

  // 5. Merge Sort
  const runMergeSort = async () => {
    setAnimating(true);
    let arr = [...array];
    setLogText('Starting Merge Sort (Divide & Conquer)');
    
    const mergeSortHelper = async (l, r) => {
      if (l < r) {
        let m = Math.floor(l + (r - l) / 2);
        await mergeSortHelper(l, m);
        await mergeSortHelper(m + 1, r);
        await merge(l, m, r);
      }
    };

    const merge = async (l, m, r) => {
      let tempArr = [];
      let i = l, j = m + 1;
      setLogText(`Merging index range [${l} to ${m}] and [${m+1} to ${r}]`);
      setActiveIdxs(Array.from({ length: r - l + 1 }, (_, k) => l + k));
      await sleep(speed);

      while (i <= m && j <= r) {
        if (arr[i] <= arr[j]) {
          tempArr.push(arr[i++]);
        } else {
          tempArr.push(arr[j++]);
        }
      }
      while (i <= m) tempArr.push(arr[i++]);
      while (j <= r) tempArr.push(arr[j++]);

      // Copy values back to array one by one with swap-up alerts
      for (let k = 0; k < tempArr.length; k++) {
        arr[l + k] = tempArr[k];
        setArray([...arr]);
        setSwappingIdxs([l + k]);
        await sleep(speed * 0.4);
      }
      setSwappingIdxs([]);
    };

    await mergeSortHelper(0, arr.length - 1);
    setActiveIdxs([]);
    setLogText('Merge Sort Complete.');
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
      // Compare pointer trajectory flight!
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
    
    // Sort array first
    setLogText('Sorting array first (Binary Search requires a sorted sequence)...');
    arr.sort((a, b) => a - b);
    setArray(arr);
    await sleep(speed * 1.5);

    let l = 0, r = arr.length - 1;
    while (l <= r) {
      let m = Math.floor(l + (r - l) / 2);
      setActiveIdxs([l, m, r]);
      setSwappingIdxs([m]); // compare projectile pointer lands on mid
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

  // Simple compiler C code syntax highlight helper
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
              height: '250px',
              background: 'rgba(0,0,0,0.15)',
              border: '1px solid rgba(255,255,255,0.04)',
              borderRadius: '12px',
              padding: '2rem',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '1.5rem',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {array.map((val, idx) => {
                const isActive = activeIdxs.includes(idx);
                const isSwapping = swappingIdxs.includes(idx);
                const isFound = foundIndex === idx;
                
                let transformStyle = 'translate(0, 0)';
                if (isSwapping) {
                  if (selectedAlgo === 'linear' || selectedAlgo === 'binary') {
                    // Search projectile arrow comparing: arch pointer
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
              })}
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
