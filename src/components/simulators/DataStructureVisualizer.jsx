// Redesigned dynamic data structures visualizer with glowing circular node grids
import React, { useState } from 'react';
import { RotateCcw, Plus, Trash } from 'lucide-react';

export default function DataStructureVisualizer() {
  const [activeTab, setActiveTab] = useState('stack'); 
  const [stack, setStack] = useState([15, 32, 45]);
  const [queue, setQueue] = useState([10, 20, 30, 40]);
  const [linkedList, setLinkedList] = useState([
    { val: 12, next: '0x10a' },
    { val: 99, next: '0x2b4' },
    { val: 4, next: 'NULL' }
  ]);
  const [bst, setBst] = useState([
    { val: 50, left: 30, right: 70 },
    { val: 30, left: 20, right: 40 },
    { val: 70, left: null, right: null },
    { val: 20, left: null, right: null },
    { val: 40, left: null, right: null }
  ]);
  const [hashTable, setHashTable] = useState([
    [10, 25], [11], [], [8, 18], [4]
  ]);

  const [inputVal, setInputVal] = useState('');
  const [actionLog, setActionLog] = useState('Dynamic console ready.');

  const logAction = (msg) => setActionLog(msg);

  const handlePush = () => {
    if (!inputVal) return;
    const val = parseInt(inputVal);
    setStack(prev => [...prev, val]);
    logAction(`Pushed ${val} onto Stack (O(1)).`);
    setInputVal('');
  };

  const handlePop = () => {
    if (stack.length === 0) {
      logAction("Stack Underflow!");
      return;
    }
    const val = stack[stack.length - 1];
    setStack(prev => prev.slice(0, -1));
    logAction(`Popped ${val} from Stack (O(1)).`);
  };

  const handleEnqueue = () => {
    if (!inputVal) return;
    const val = parseInt(inputVal);
    setQueue(prev => [...prev, val]);
    logAction(`Enqueued ${val} to Rear (O(1)).`);
    setInputVal('');
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      logAction("Queue Underflow!");
      return;
    }
    const val = queue[0];
    setQueue(prev => prev.slice(1));
    logAction(`Dequeued ${val} from Front (O(1)).`);
  };

  const handleAddNode = () => {
    if (!inputVal) return;
    const val = parseInt(inputVal);
    const randomHex = '0x' + Math.floor(Math.random() * 4096).toString(16);
    
    setLinkedList(prev => {
      let list = [...prev];
      if (list.length > 0) {
        list[list.length - 1].next = randomHex;
      }
      return [...list, { val, next: 'NULL' }];
    });
    logAction(`Inserted node ${val} at Tail.`);
    setInputVal('');
  };

  const handleRemoveNode = () => {
    if (linkedList.length === 0) return;
    setLinkedList(prev => {
      let list = [...prev];
      list.pop();
      if (list.length > 0) {
        list[list.length - 1].next = 'NULL';
      }
      return list;
    });
    logAction("Removed tail node.");
  };

  const handleInsertBST = () => {
    if (!inputVal) return;
    const val = parseInt(inputVal);
    if (bst.some(n => n.val === val)) return;
    setBst(prev => [...prev, { val, left: null, right: null }]);
    logAction(`Inserted node ${val} into BST tree structure (O(log N)).`);
    setInputVal('');
  };

  const handleInsertHash = () => {
    if (!inputVal) return;
    const val = parseInt(inputVal);
    const key = val % 5;
    let updated = [...hashTable];
    updated[key] = [...updated[key], val];
    setHashTable(updated);
    logAction(`Hashed ${val} at slot ${key}.`);
    setInputVal('');
  };

  const handleReset = () => {
    setStack([15, 32, 45]);
    setQueue([10, 20, 30, 40]);
    setLinkedList([
      { val: 12, next: '0x10a' },
      { val: 99, next: '0x2b4' },
      { val: 4, next: 'NULL' }
    ]);
    setBst([
      { val: 50, left: 30, right: 70 },
      { val: 30, left: 20, right: 40 },
      { val: 70, left: null, right: null }
    ]);
    setHashTable([[10, 25], [11], [], [8, 18], [4]]);
    setInputVal('');
    logAction('Reset dynamic nodes.');
  };

  return (
    <div className="glass-panel animate-fade" style={{ padding: '2rem' }}>
      
      {/* Selector tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem' }}>
        {['stack', 'queue', 'linkedlist', 'bst', 'hashtable'].map(tab => (
          <button
            key={tab}
            className="btn"
            onClick={() => { setActiveTab(tab); logAction(`Switched structures visual to ${tab.toUpperCase()}`); }}
            style={{
              padding: '0.4rem 1.25rem',
              fontSize: '0.8rem',
              borderRadius: '9999px',
              background: activeTab === tab ? 'var(--color-primary)' : 'transparent',
              color: activeTab === tab ? '#FFFFFF' : 'var(--text-muted)'
            }}
          >
            {tab === 'linkedlist' ? 'Linked List' : tab === 'bst' ? 'BST Tree' : tab === 'hashtable' ? 'Hash Table' : tab}
          </button>
        ))}
        <button className="btn btn-outline" onClick={handleReset} style={{ marginLeft: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem', borderRadius: '9999px' }}>
          <RotateCcw size={12} /> Reset
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '2rem', minHeight: '260px' }}>
        
        {/* Render Visualization */}
        <div style={{
          background: 'rgba(0,0,0,0.2)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}>
          
          {/* Stack Visualizer */}
          {activeTab === 'stack' && (
            <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '0.25rem', width: '130px', border: '3px solid var(--text-muted)', borderTop: 'none', borderBottomLeftRadius: '8px', borderBottomRightRadius: '8px', padding: '0.5rem' }}>
              {stack.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    height: '40px',
                    background: idx === stack.length - 1 ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                    border: idx === stack.length - 1 ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    boxShadow: idx === stack.length - 1 ? '0 0 15px rgba(59, 130, 246, 0.15)' : 'none'
                  }}
                >
                  {item} {idx === stack.length - 1 && <span style={{ fontSize: '0.65rem', marginLeft: '0.5rem', color: 'var(--color-primary)' }}>TOP</span>}
                </div>
              ))}
            </div>
          )}

          {/* Queue Visualizer */}
          {activeTab === 'queue' && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {queue.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    background: 'rgba(255,255,255,0.02)',
                    border: idx === 0 ? '2px solid var(--color-success)' : idx === queue.length - 1 ? '2px solid var(--color-secondary)' : '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontWeight: 'bold' }}>{item}</span>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                      {idx === 0 ? 'FRONT' : idx === queue.length - 1 ? 'REAR' : `[${idx}]`}
                    </span>
                  </div>
                  {idx < queue.length - 1 && <span style={{ color: 'var(--text-muted)' }}>→</span>}
                </div>
              ))}
            </div>
          )}

          {/* Linked List */}
          {activeTab === 'linkedlist' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', alignItems: 'center' }}>
              {linkedList.map((node, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    width: '120px',
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    textAlign: 'center'
                  }}>
                    <div style={{ padding: '0.5rem 0.25rem', borderRight: '1px solid var(--glass-border)' }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block' }}>DATA</span>
                      <span style={{ fontWeight: 'bold' }}>{node.val}</span>
                    </div>
                    <div style={{ padding: '0.5rem 0.25rem' }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', display: 'block' }}>PTR</span>
                      <span style={{ fontFamily: 'var(--font-code)', fontSize: '0.65rem', color: node.next === 'NULL' ? 'var(--color-error)' : 'var(--color-primary)' }}>{node.next}</span>
                    </div>
                  </div>
                  {idx < linkedList.length - 1 ? <span>→</span> : <span style={{ color: 'var(--color-error)' }}>⇏</span>}
                </div>
              ))}
            </div>
          )}

          {/* BST */}
          {activeTab === 'bst' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div className="flex-center" style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--color-primary)', fontWeight: 'bold', boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}>50</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>↙ ↘</span>
              <div style={{ display: 'flex', gap: '4rem' }}>
                <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', fontWeight: 'bold' }}>30</div>
                <div className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', fontWeight: 'bold' }}>70</div>
              </div>
            </div>
          )}

          {/* Hash Table */}
          {activeTab === 'hashtable' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
              {hashTable.map((slot, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.25rem' }}>
                  <div style={{ width: '80px', fontFamily: 'var(--font-code)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Slot [{index}]:
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {slot.length === 0 ? <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.05)' }}>NULL</span> : slot.map((val, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <div style={{ padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{val}</div>
                        {i < slot.length - 1 && <span>→</span>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Side Panel Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'center' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Console:</span>
            <div className="glass-panel" style={{ padding: '0.75rem', fontSize: '0.8rem', fontFamily: 'var(--font-code)', minHeight: '60px', color: 'var(--color-primary)' }}>
              {actionLog}
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Operations</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input
                type="number"
                placeholder="Element Value"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                style={{
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  padding: '0.45rem',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  width: '100%'
                }}
              />
              
              {activeTab === 'stack' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button className="btn btn-primary" onClick={handlePush} style={{ padding: '0.4rem', fontSize: '0.8rem', borderRadius: '8px' }}><Plus size={12} /> Push</button>
                  <button className="btn btn-outline" onClick={handlePop} style={{ padding: '0.4rem', fontSize: '0.8rem', borderRadius: '8px' }}><Trash size={12} /> Pop</button>
                </div>
              )}

              {activeTab === 'queue' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button className="btn btn-primary" onClick={handleEnqueue} style={{ padding: '0.4rem', fontSize: '0.8rem', borderRadius: '8px' }}><Plus size={12} /> Enqueue</button>
                  <button className="btn btn-outline" onClick={handleDequeue} style={{ padding: '0.4rem', fontSize: '0.8rem', borderRadius: '8px' }}><Trash size={12} /> Dequeue</button>
                </div>
              )}

              {activeTab === 'linkedlist' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button className="btn btn-primary" onClick={handleAddNode} style={{ padding: '0.4rem', fontSize: '0.8rem', borderRadius: '8px' }}><Plus size={12} /> Add Tail</button>
                  <button className="btn btn-outline" onClick={handleRemoveNode} style={{ padding: '0.4rem', fontSize: '0.8rem', borderRadius: '8px' }}><Trash size={12} /> Rem Tail</button>
                </div>
              )}

              {activeTab === 'bst' && (
                <button className="btn btn-primary" onClick={handleInsertBST} style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', borderRadius: '8px' }}>
                  Insert Node
                </button>
              )}

              {activeTab === 'hashtable' && (
                <button className="btn btn-primary" onClick={handleInsertHash} style={{ width: '100%', padding: '0.4rem', fontSize: '0.8rem', borderRadius: '8px' }}>
                  Hash Insert
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
