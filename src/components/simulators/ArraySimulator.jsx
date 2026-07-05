// Redesigned interactive Array Simulator with premium glass blocks and neon indicators
import React, { useState } from 'react';
import { Play, RotateCcw, Search, Plus, Trash2, Edit3, Info } from 'lucide-react';

export default function ArraySimulator() {
  const [array, setArray] = useState([12, 45, 8, 23, 56, 89, 34]);
  const [capacity] = useState(10);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searchTarget, setSearchTarget] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputIndex, setInputIndex] = useState('');
  const [animating, setAnimating] = useState(false);
  const [currentStepInfo, setCurrentStepInfo] = useState('Idle. Trigger operations to start dynamic array shift visuals.');
  const [algorithm, setAlgorithm] = useState('linear'); 
  const [speed, setSpeed] = useState(600); 

  const baseAddress = 0x7ffe10;

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleTraverse = async () => {
    if (animating) return;
    setAnimating(true);
    setCurrentStepInfo('Executing array pointer traversal... Index 0 to ' + (array.length - 1));
    
    for (let i = 0; i < array.length; i++) {
      setActiveIndex(i);
      setCurrentStepInfo(`Reading element arr[${i}] = ${array[i]}. Memory Address = 0x${(baseAddress - i * 4).toString(16)}`);
      await sleep(speed);
    }
    
    setActiveIndex(-1);
    setCurrentStepInfo('Traversal finished successfully.');
    setAnimating(false);
  };

  const handleLinearSearch = async () => {
    if (animating || !searchTarget) return;
    setAnimating(true);
    const target = parseInt(searchTarget);
    setCurrentStepInfo(`Initializing Linear Search for target ${target} (O(N) Complexity)`);
    
    let found = false;
    for (let i = 0; i < array.length; i++) {
      setActiveIndex(i);
      setCurrentStepInfo(`Comparing target ${target} with element value ${array[i]} at index ${i}`);
      await sleep(speed);
      
      if (array[i] === target) {
        setCurrentStepInfo(`Success: Found target ${target} at index ${i}. Target Address = 0x${(baseAddress - i * 4).toString(16)}`);
        found = true;
        break;
      }
    }
    
    if (!found) {
      setActiveIndex(-1);
      setCurrentStepInfo(`Target element ${target} is not present in the array.`);
    }
    setAnimating(false);
  };

  const handleBinarySearch = async () => {
    if (animating || !searchTarget) return;
    
    let sorted = [...array].sort((a, b) => a - b);
    setArray(sorted);
    setAnimating(true);
    const target = parseInt(searchTarget);
    setCurrentStepInfo(`Sorted the array to perform Binary Search. Target = ${target}`);
    await sleep(speed * 1.5);

    let low = 0;
    let high = sorted.length - 1;
    let found = false;

    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      setActiveIndex(mid);
      setCurrentStepInfo(`Checking middle element at index ${mid} (${sorted[mid]}). High: ${high}, Low: ${low}`);
      await sleep(speed * 1.5);

      if (sorted[mid] === target) {
        setCurrentStepInfo(`Success: Found target ${target} at index ${mid}.`);
        found = true;
        break;
      } else if (sorted[mid] < target) {
        setCurrentStepInfo(`${sorted[mid]} < target ${target}. Shifting low pointer to ${mid + 1}`);
        low = mid + 1;
      } else {
        setCurrentStepInfo(`${sorted[mid]} > target ${target}. Shifting high pointer to ${mid - 1}`);
        high = mid - 1;
      }
      await sleep(speed);
    }

    if (!found) {
      setActiveIndex(-1);
      setCurrentStepInfo(`Target ${target} is not in the array.`);
    }
    setAnimating(false);
  };

  const handleInsert = async () => {
    if (animating || inputValue === '' || inputIndex === '') return;
    const idx = parseInt(inputIndex);
    const val = parseInt(inputValue);

    if (idx < 0 || idx > array.length) {
      setCurrentStepInfo('Error: Insertion index out of boundaries!');
      return;
    }
    if (array.length >= capacity) {
      setCurrentStepInfo('Error: Array overflow. Reallocation (realloc) is needed.');
      return;
    }

    setAnimating(true);
    setCurrentStepInfo(`Inserting element ${val} at index ${idx}.`);
    await sleep(speed);

    let tempArray = [...array];
    tempArray.push(0);

    for (let i = tempArray.length - 1; i > idx; i--) {
      setActiveIndex(i);
      setCurrentStepInfo(`Shifting elements: arr[${i}] = arr[${i-1}] (${tempArray[i-1]})`);
      tempArray[i] = tempArray[i-1];
      setArray([...tempArray]);
      await sleep(speed);
    }

    setActiveIndex(idx);
    tempArray[idx] = val;
    setArray([...tempArray]);
    setCurrentStepInfo(`Success: Inserted element ${val} at index ${idx}.`);
    await sleep(speed);

    setActiveIndex(-1);
    setAnimating(false);
  };

  const handleDelete = async () => {
    if (animating || inputIndex === '') return;
    const idx = parseInt(inputIndex);

    if (idx < 0 || idx >= array.length) {
      setCurrentStepInfo('Error: Index out of boundaries!');
      return;
    }

    setAnimating(true);
    setCurrentStepInfo(`Deleting element at index ${idx} (${array[idx]}). Shifting left...`);
    await sleep(speed);

    let tempArray = [...array];
    
    for (let i = idx; i < tempArray.length - 1; i++) {
      setActiveIndex(i);
      setCurrentStepInfo(`Shifting elements: arr[${i}] = arr[${i+1}] (${tempArray[i+1]})`);
      tempArray[i] = tempArray[i+1];
      setArray([...tempArray]);
      await sleep(speed);
    }

    tempArray.pop();
    setArray([...tempArray]);
    setCurrentStepInfo(`Deletion completed successfully.`);
    await sleep(speed);

    setActiveIndex(-1);
    setAnimating(false);
  };

  const handleUpdate = () => {
    if (animating || inputValue === '' || inputIndex === '') return;
    const idx = parseInt(inputIndex);
    const val = parseInt(inputValue);

    if (idx < 0 || idx >= array.length) {
      setCurrentStepInfo('Error: Index out of bounds!');
      return;
    }

    let temp = [...array];
    temp[idx] = val;
    setArray(temp);
    setActiveIndex(idx);
    setCurrentStepInfo(`Updated value at index ${idx} to ${val}.`);
    setTimeout(() => setActiveIndex(-1), 800);
  };

  const resetArray = () => {
    setArray([12, 45, 8, 23, 56, 89, 34]);
    setActiveIndex(-1);
    setCurrentStepInfo('Idle. Trigger operations to start dynamic array shift visuals.');
  };

  return (
    <div className="glass-panel animate-fade" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem', padding: '2rem' }}>
      
      {/* Visual Workspace */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem' }}>Contiguous Array Memory Arena</h3>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Speed:</span>
            <input 
              type="range" 
              min="200" 
              max="1500" 
              value={speed} 
              onChange={(e) => setSpeed(Number(e.target.value))}
              style={{ width: '80px', accentColor: 'var(--color-primary)' }}
              disabled={animating}
            />
          </div>
        </div>

        {/* Dynamic Blocks */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          height: '220px',
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '2rem',
          position: 'relative'
        }}>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
            {Array.from({ length: capacity }).map((_, i) => {
              const hasVal = i < array.length;
              const val = hasVal ? array[i] : null;
              const isActive = i === activeIndex;
              const addr = baseAddress - i * 4;
              
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  {/* Address block */}
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontFamily: 'var(--font-code)', 
                    color: isActive ? 'var(--color-primary)' : 'var(--text-muted)',
                    marginBottom: '0.5rem',
                    textShadow: isActive ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
                  }}>
                    0x{addr.toString(16)}
                  </span>
                  
                  {/* Glass Box */}
                  <div style={{
                    width: '56px',
                    height: '75px',
                    background: isActive ? 'rgba(59, 130, 246, 0.15)' : hasVal ? 'rgba(255,255,255,0.03)' : 'transparent',
                    border: isActive 
                      ? '2px solid var(--color-primary)' 
                      : hasVal ? '1px solid var(--glass-border)' : '1px dashed rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    boxShadow: isActive ? '0 0 20px rgba(59, 130, 246, 0.2)' : 'none'
                  }}>
                    {hasVal ? (
                      <>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: isActive ? 'var(--color-primary)' : 'var(--text-primary)' }}>
                          {val}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', position: 'absolute', bottom: '4px' }}>
                          arr[{i}]
                        </span>
                      </>
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.1)', fontStyle: 'italic' }}>
                        null
                      </span>
                    )}
                  </div>
                  
                  {/* Index */}
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    [{i}]
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Logger */}
        <div className="glass-panel" style={{ padding: '1rem', marginTop: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center', minHeight: '60px' }}>
          <Info size={15} color="var(--color-primary)" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{currentStepInfo}</p>
        </div>
      </div>

      {/* Sidebar Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.5rem' }}>
        <div>
          <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Traversal</h4>
          <button className="btn btn-outline" onClick={handleTraverse} disabled={animating} style={{ width: '100%', borderRadius: '9999px' }}>
            Traverse Array
          </button>
        </div>

        <div>
          <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Search Target</h4>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input 
              type="number" 
              placeholder="Value"
              value={searchTarget}
              onChange={(e) => setSearchTarget(e.target.value)}
              disabled={animating}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                padding: '0.45rem',
                color: 'var(--text-primary)',
                outline: 'none',
                fontSize: '0.85rem'
              }}
            />
            <button 
              className="btn btn-primary"
              disabled={animating}
              onClick={algorithm === 'linear' ? handleLinearSearch : handleBinarySearch}
              style={{ padding: '0.45rem 1rem', borderRadius: '8px' }}
            >
              <Search size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
              <input type="radio" checked={algorithm === 'linear'} onChange={() => setAlgorithm('linear')} disabled={animating} /> Linear
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
              <input type="radio" checked={algorithm === 'binary'} onChange={() => setAlgorithm('binary')} disabled={animating} /> Binary
            </label>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Modifiers</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input 
              type="number" placeholder="Index" value={inputIndex}
              onChange={(e) => setInputIndex(e.target.value)} disabled={animating}
              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.45rem', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
            />
            <input 
              type="number" placeholder="Value" value={inputValue}
              onChange={(e) => setInputValue(e.target.value)} disabled={animating}
              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.45rem', color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none' }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button className="btn btn-outline" onClick={handleInsert} disabled={animating} style={{ padding: '0.4rem', fontSize: '0.75rem', borderRadius: '8px' }}>+ Insert</button>
              <button className="btn btn-outline" onClick={handleDelete} disabled={animating} style={{ padding: '0.4rem', fontSize: '0.75rem', borderRadius: '8px' }}>- Delete</button>
            </div>
            <button className="btn btn-outline" onClick={handleUpdate} disabled={animating} style={{ width: '100%', padding: '0.4rem', fontSize: '0.75rem', borderRadius: '8px' }}>Update Cell</button>
          </div>
        </div>

        <button className="btn btn-outline" onClick={resetArray} disabled={animating} style={{ borderStyle: 'dashed', marginTop: 'auto', borderRadius: '9999px' }}>
          <RotateCcw size={13} /> Reset Arena
        </button>
      </div>

    </div>
  );
}
