// Redesigned interactive Heap dynamic memory simulator with premium borders and glowing addresses
import React, { useState } from 'react';
import { RotateCcw, AlertTriangle, HelpCircle } from 'lucide-react';

export default function HeapSimulator() {
  const [pointers, setPointers] = useState([
    { name: 'ptr1', address: '0x7ffe00', pointsTo: 'NULL' },
    { name: 'ptr2', address: '0x7ffe04', pointsTo: 'NULL' },
    { name: 'ptr3', address: '0x7ffe08', pointsTo: 'NULL' }
  ]);

  const [heap, setHeap] = useState([]);
  const [selectedPointer, setSelectedPointer] = useState('ptr1');
  const [allocSize, setAllocSize] = useState(16);
  const [allocCount, setAllocCount] = useState(4);
  const [history, setHistory] = useState(['Heap monitor initialized. Allocate heap segments to inspect registers.']);

  let heapBase = 0x55d000;

  const addLog = (msg) => {
    setHistory(prev => [msg, ...prev]);
  };

  const handleMalloc = () => {
    let offset = heap.reduce((acc, curr) => acc + curr.size, 0);
    let newAddress = "0x" + (heapBase + offset).toString(16);

    let newBlock = {
      id: `block_${Date.now()}`,
      address: newAddress,
      size: allocSize,
      type: 'malloc',
      active: true,
      label: `${allocSize} Bytes (malloc)`
    };

    setHeap(prev => [...prev, newBlock]);
    
    setPointers(prev => prev.map(p => {
      if (p.name === selectedPointer) {
        addLog(`[Success] Allocated ${allocSize} bytes at address ${newAddress}. Assigned to ${p.name}`);
        return { ...p, pointsTo: newAddress };
      }
      return p;
    }));
  };

  const handleCalloc = () => {
    let offset = heap.reduce((acc, curr) => acc + curr.size, 0);
    let newAddress = "0x" + (heapBase + offset).toString(16);
    let totalBytes = allocCount * 4; 

    let newBlock = {
      id: `block_${Date.now()}`,
      address: newAddress,
      size: totalBytes,
      type: 'calloc',
      active: true,
      label: `${allocCount} items x 4 Bytes (calloc - 0)`
    };

    setHeap(prev => [...prev, newBlock]);
    
    setPointers(prev => prev.map(p => {
      if (p.name === selectedPointer) {
        addLog(`[Success] Allocated array space of ${totalBytes} bytes at ${newAddress}. Assigned to ${p.name}`);
        return { ...p, pointsTo: newAddress };
      }
      return p;
    }));
  };

  const handleRealloc = () => {
    const targetPointer = pointers.find(p => p.name === selectedPointer);
    if (!targetPointer || targetPointer.pointsTo === 'NULL') {
      addLog(`[Error] realloc failed: ${selectedPointer} is pointing to NULL.`);
      return;
    }

    const currentAddress = targetPointer.pointsTo;
    
    setHeap(prev => prev.map(block => {
      if (block.address === currentAddress && block.active) {
        let newSize = block.size * 2;
        addLog(`[Success] Resized heap block at ${currentAddress} from ${block.size} to ${newSize} bytes.`);
        return { 
          ...block, 
          size: newSize,
          label: `${newSize} Bytes (reallocated)` 
        };
      }
      return block;
    }));
  };

  const handleFree = () => {
    const targetPointer = pointers.find(p => p.name === selectedPointer);
    if (!targetPointer || targetPointer.pointsTo === 'NULL') {
      addLog(`[Warning] free() called on NULL. Standard C allows this, doing nothing.`);
      return;
    }

    const targetAddress = targetPointer.pointsTo;
    let found = false;
    
    setHeap(prev => prev.map(block => {
      if (block.address === targetAddress && block.active) {
        found = true;
        return { ...block, active: false, label: "DEALLOCATED" };
      }
      return block;
    }));

    if (found) {
      addLog(`[Success] Freed memory block at ${targetAddress}.`);
    } else {
      addLog(`[Alert] Invalid Free! Memory at ${targetAddress} was already freed.`);
    }
  };

  const handleNullify = () => {
    setPointers(prev => prev.map(p => {
      if (p.name === selectedPointer) {
        addLog(`Nullified pointer ${p.name}.`);
        return { ...p, pointsTo: 'NULL' };
      }
      return p;
    }));
  };

  const getPointerStatus = (p) => {
    if (p.pointsTo === 'NULL') return { label: 'NULL Pointer', color: 'var(--text-muted)' };
    const block = heap.find(b => b.address === p.pointsTo);
    if (!block) return { label: 'Wild Pointer', color: 'var(--color-error)' };
    if (!block.active) return { label: 'Dangling Pointer', color: 'var(--color-warning)' };
    
    return { label: `Points to ${p.pointsTo}`, color: 'var(--color-success)' };
  };

  const leaks = heap.filter(block => {
    if (!block.active) return false;
    return !pointers.some(p => p.pointsTo === block.address);
  });

  const resetSimulator = () => {
    setPointers([
      { name: 'ptr1', address: '0x7ffe00', pointsTo: 'NULL' },
      { name: 'ptr2', address: '0x7ffe04', pointsTo: 'NULL' },
      { name: 'ptr3', address: '0x7ffe08', pointsTo: 'NULL' }
    ]);
    setHeap([]);
    setSelectedPointer('ptr1');
    setHistory(['Simulator reset.']);
  };

  return (
    <div className="glass-panel animate-fade" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', padding: '2rem' }}>
      
      {/* Visualizer segment */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.15rem' }}>Visual Heap & Stack Monitor</h3>
          {leaks.length > 0 && (
            <span className="badge badge-error">
              <AlertTriangle size={12} /> {leaks.length} Memory Leak(s) Detected
            </span>
          )}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '220px 1fr',
          gap: '1.5rem',
          minHeight: '260px',
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          
          {/* Stack variables */}
          <div style={{ borderRight: '1px dashed var(--glass-border)', paddingRight: '1rem' }}>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Stack segment</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {pointers.map(p => {
                const status = getPointerStatus(p);
                const isSelected = p.name === selectedPointer;
                return (
                  <div 
                    key={p.name}
                    onClick={() => setSelectedPointer(p.name)}
                    style={{
                      padding: '0.75rem',
                      background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255,255,255,0.02)',
                      border: isSelected ? '1px solid var(--color-primary)' : '1px solid var(--glass-border)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 'bold' }}>{p.name}</span>
                      <span style={{ fontFamily: 'var(--font-code)', color: 'var(--text-muted)' }}>{p.address}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', fontFamily: 'var(--font-code)', color: status.color }}>
                      {status.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Heap variables */}
          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase' }}>Heap segment</h4>
            
            {heap.length === 0 ? (
              <div className="flex-center" style={{ height: '160px', flexDirection: 'column', color: 'var(--text-muted)' }}>
                <HelpCircle size={32} style={{ marginBottom: '0.5rem', opacity: 0.2 }} />
                <span style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>Heap is empty</span>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem', overflowY: 'auto', maxHeight: '180px' }}>
                {heap.map(block => {
                  const references = pointers.filter(p => p.pointsTo === block.address);
                  const isLeaked = block.active && references.length === 0;
                  
                  return (
                    <div
                      key={block.id}
                      style={{
                        padding: '0.6rem',
                        borderRadius: '8px',
                        background: block.active 
                          ? isLeaked ? 'rgba(239, 68, 68, 0.08)' : 'rgba(255,255,255,0.02)'
                          : 'rgba(34, 197, 94, 0.04)',
                        border: block.active
                          ? isLeaked ? '1px solid var(--color-error)' : '1px solid var(--glass-border)'
                          : '1px dashed var(--color-success)',
                        transition: 'all 0.3s ease',
                        boxShadow: isLeaked ? '0 0 10px rgba(239, 68, 68, 0.15)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'var(--font-code)' }}>
                        <span style={{ color: block.active ? 'var(--text-primary)' : 'var(--color-success)' }}>
                          {block.address}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>{block.size}B</span>
                      </div>
                      
                      <div style={{ fontSize: '0.8rem', marginTop: '0.4rem', fontWeight: 'bold' }}>
                        {block.label}
                      </div>

                      {block.active && references.length > 0 && (
                        <div style={{ fontSize: '0.65rem', marginTop: '0.4rem', color: 'var(--color-primary)', fontFamily: 'var(--font-code)' }}>
                          Ref: {references.map(r => r.name).join(', ')}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Leaks Info panel */}
        {leaks.length > 0 && (
          <div className="glass-panel" style={{ padding: '1rem', marginTop: '1rem', background: 'rgba(239, 68, 68, 0.05)', borderColor: 'var(--color-error)', display: 'flex', gap: '0.5rem' }}>
            <AlertTriangle size={16} color="var(--color-error)" style={{ flexShrink: 0 }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Memory leaks detected: heap allocations without pointers. Call free() to release cells.
            </p>
          </div>
        )}
      </div>

      {/* Control panel */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.5rem' }}>
        <div>
          <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Active Pointer</h4>
          <select 
            value={selectedPointer}
            onChange={(e) => setSelectedPointer(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '0.5rem',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              outline: 'none'
            }}
          >
            {pointers.map(p => (
              <option key={p.name} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Allocations API</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            
            {/* malloc */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-code)' }}>malloc(size)</span>
                <input 
                  type="number" min="4" max="64" step="4" value={allocSize} 
                  onChange={(e) => setAllocSize(Math.max(4, Number(e.target.value)))}
                  style={{ width: '50px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '0.2rem', textAlign: 'center', borderRadius: '4px' }}
                />
              </div>
              <button className="btn btn-primary" onClick={handleMalloc} style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', borderRadius: '8px' }}>
                malloc
              </button>
            </div>

            {/* calloc */}
            <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--glass-border)', padding: '0.75rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-code)' }}>calloc(num, size)</span>
                <input 
                  type="number" min="1" max="10" value={allocCount} 
                  onChange={(e) => setAllocCount(Math.max(1, Number(e.target.value)))}
                  style={{ width: '40px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', padding: '0.2rem', textAlign: 'center', borderRadius: '4px' }}
                />
              </div>
              <button className="btn btn-primary" onClick={handleCalloc} style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', borderRadius: '8px' }}>
                calloc
              </button>
            </div>

            {/* realloc and free */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button className="btn btn-outline" onClick={handleRealloc} style={{ padding: '0.5rem', fontSize: '0.75rem', borderRadius: '8px' }}>
                realloc
              </button>
              <button className="btn btn-outline" onClick={handleFree} style={{ padding: '0.5rem', fontSize: '0.75rem', borderRadius: '8px', color: 'var(--color-error)', borderColor: 'var(--color-error)' }}>
                free
              </button>
            </div>

            <button className="btn btn-outline" onClick={handleNullify} style={{ padding: '0.5rem', fontSize: '0.75rem', borderRadius: '8px' }}>
              Set pointer = NULL
            </button>
          </div>
        </div>

        {/* Log list */}
        <div style={{ marginTop: 'auto' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Console Logs:</span>
          <div style={{
            height: '90px',
            overflowY: 'auto',
            background: 'rgba(0,0,0,0.2)',
            border: '1px solid var(--glass-border)',
            borderRadius: '8px',
            padding: '0.5rem',
            fontFamily: 'var(--font-code)',
            fontSize: '0.7rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.2rem'
          }}>
            {history.map((log, idx) => (
              <div key={idx} style={{ 
                color: log.includes('[Success]') 
                  ? 'var(--color-success)' 
                  : log.includes('[Error]') || log.includes('[Alert]') ? 'var(--color-error)' : 'var(--text-muted)'
              }}>
                {log}
              </div>
            ))}
          </div>
        </div>

        <button className="btn btn-outline" onClick={resetSimulator} style={{ borderStyle: 'dashed', fontSize: '0.8rem', borderRadius: '9999px' }}>
          Reset Simulator
        </button>
      </div>

    </div>
  );
}
