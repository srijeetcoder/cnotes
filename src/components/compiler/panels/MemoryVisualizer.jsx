import React from 'react';
import { Layers, Database, ArrowRight } from 'lucide-react';

export default function MemoryVisualizer({ ram = {} }) {
  const ramEntries = Object.entries(ram).sort((a, b) => parseInt(b[0]) - parseInt(a[0])); // high addresses first (stack grows down)
  
  const stackCells = ramEntries.filter(([_, block]) => block.segment === 'stack');
  const heapCells = ramEntries.filter(([_, block]) => block.segment === 'heap').sort((a, b) => parseInt(a[0]) - parseInt(b[0])); // heap grows up

  return (
    <div style={{
      display: 'flex',
      gap: '1.5rem',
      padding: '1rem',
      fontFamily: 'var(--font-code)',
      color: 'var(--text-primary)',
      height: '100%',
      overflow: 'auto',
      flexWrap: 'wrap'
    }}>
      
      {/* Stack Segment */}
      <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.4rem' }}>
          <Layers size={14} color="var(--color-primary)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Stack Segment (Local Variables)</span>
        </div>
        
        {stackCells.length === 0 ? (
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>No local variables allocated on Stack.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {stackCells.map(([addr, block]) => {
              const isPointer = block.type.includes('*');
              return (
                <div 
                  key={addr} 
                  className="glass-panel"
                  style={{
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    background: 'rgba(255, 255, 255, 0.01)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    <span>{addr}</span>
                    <span style={{ color: 'var(--color-secondary)' }}>{block.type}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.75rem' }}>{block.name}</span>
                    <span style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      {isPointer ? (
                        <>
                          <span style={{ color: 'var(--color-primary)' }}>{block.value}</span>
                          {ram[block.value] && (
                            <span style={{ fontSize: '0.65rem', color: 'var(--color-success)' }}>
                              (<ArrowRight size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> {ram[block.value].name})
                            </span>
                          )}
                        </>
                      ) : (
                        <span style={{ color: 'var(--color-success)' }}>{block.value}</span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Heap Segment */}
      <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.4rem' }}>
          <Database size={14} color="var(--color-secondary)" />
          <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Heap Segment (Dynamic Allocations)</span>
        </div>
        
        {heapCells.length === 0 ? (
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>No dynamic memory allocated on Heap.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {heapCells.map(([addr, block]) => {
              const isFreed = block.value === 'FREED/DEALLOCATED' || block.type === 'freed';
              return (
                <div 
                  key={addr} 
                  className="glass-panel"
                  style={{
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    border: `1px solid ${isFreed ? 'var(--color-error)' : 'var(--color-secondary)'}`,
                    background: 'rgba(255, 255, 255, 0.01)',
                    opacity: isFreed ? 0.6 : 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.2rem',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                    <span>{addr}</span>
                    <span style={{ color: isFreed ? 'var(--color-error)' : 'var(--color-secondary)' }}>{block.type}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.75rem', textDecoration: isFreed ? 'line-through' : 'none' }}>
                      {block.name}
                    </span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: isFreed ? 'var(--color-error)' : 'var(--color-success)',
                      fontWeight: 'bold'
                    }}>
                      {block.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
