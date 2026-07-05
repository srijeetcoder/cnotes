// MatrixSimulator2D: Interactive 2D matrix array row/column-major address analyzer
import React, { useState } from 'react';
import { HelpCircle, RefreshCw } from 'lucide-react';

export default function MatrixSimulator2D() {
  const [rows] = useState(3);
  const [cols] = useState(4);
  const [baseAddress] = useState(0x55df00);
  const [selectedCell, setSelectedCell] = useState({ r: 1, c: 2 });
  const [mode, setMode] = useState('row-major'); // row-major | col-major
  const [cellSize] = useState(4); // size of int

  // Sample mock 2D data
  const matrixData = [
    [10, 20, 30, 40],
    [50, 60, 70, 80],
    [90, 100, 110, 120]
  ];

  // Address calculators
  // Row-Major: Base + (i * cols + j) * size
  // Col-Major: Base + (j * rows + i) * size
  const calculateAddress = (r, c, sortingMode) => {
    let offset = sortingMode === 'row-major' 
      ? (r * cols + c) 
      : (c * rows + r);
    return baseAddress + offset * cellSize;
  };

  const getLinearIndex = (r, c, sortingMode) => {
    return sortingMode === 'row-major' 
      ? (r * cols + c) 
      : (c * rows + r);
  };

  const activeAddress = calculateAddress(selectedCell.r, selectedCell.c, mode);
  const activeOffset = getLinearIndex(selectedCell.r, selectedCell.c, mode);

  return (
    <div className="glass-panel animate-fade" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem' }}>2D Matrix Array Arena</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Interactive Row-Major vs Column-Major Memory Mapping</span>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['row-major', 'col-major'].map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="btn"
              style={{
                padding: '0.4rem 1rem',
                fontSize: '0.8rem',
                borderRadius: '9999px',
                background: mode === m ? 'var(--color-primary)' : 'transparent',
                color: mode === m ? '#FFFFFF' : 'var(--text-muted)'
              }}
            >
              {m === 'row-major' ? 'Row-Major (C style)' : 'Column-Major (Fortran style)'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
        
        {/* Visual Grids */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* 2D Grid view */}
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>2D Logical View: arr[3][4]</span>
            <div style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${cols + 1}, 1fr)`,
              gap: '0.5rem',
              marginTop: '0.5rem',
              background: 'rgba(0,0,0,0.2)',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              {/* Header labels */}
              <div />
              {Array.from({ length: cols }).map((_, c) => (
                <div key={c} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                  Col [{c}]
                </div>
              ))}

              {Array.from({ length: rows }).map((_, r) => (
                <React.Fragment key={r}>
                  <div style={{ display: 'flex', alignItems: 'center', fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                    Row [{r}]
                  </div>
                  {Array.from({ length: cols }).map((_, c) => {
                    const isSelected = selectedCell.r === r && selectedCell.c === c;
                    return (
                      <div
                        key={c}
                        onClick={() => setSelectedCell({ r, c })}
                        style={{
                          height: '45px',
                          background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.02)',
                          border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        {matrixData[r][c]}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* 1D Physical View */}
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>1D Contiguous Physical RAM View:</span>
            
            <div style={{
              display: 'flex',
              gap: '0.25rem',
              background: 'rgba(0,0,0,0.2)',
              padding: '1rem',
              borderRadius: '8px',
              marginTop: '0.5rem',
              overflowX: 'auto'
            }}>
              {Array.from({ length: rows * cols }).map((_, idx) => {
                const isSelected = activeOffset === idx;
                const cellAddr = baseAddress + idx * cellSize;
                
                // Find r, c for this linear index based on mode
                let cellR, cellC;
                if (mode === 'row-major') {
                  cellR = Math.floor(idx / cols);
                  cellC = idx % cols;
                } else {
                  cellC = Math.floor(idx / rows);
                  cellR = idx % rows;
                }

                return (
                  <div
                    key={idx}
                    style={{
                      minWidth: '55px',
                      height: '65px',
                      background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255,255,255,0.01)',
                      border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--glass-border)',
                      borderRadius: '6px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem'
                    }}
                  >
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>0x{cellAddr.toString(16)}</span>
                    <span style={{ fontWeight: 'bold', fontSize: '0.8rem', margin: '0.1rem 0' }}>{matrixData[cellR][cellC]}</span>
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>[{cellR}][{cellC}]</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Explainers and Formulas */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>Active Address Calculation</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.85rem' }}>
                Target Cell: <strong>arr[{selectedCell.r}][{selectedCell.c}]</strong>
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                Base Address: <strong>0x{baseAddress.toString(16)}</strong>
              </div>
              <div style={{ fontSize: '0.85rem' }}>
                Data Type Size: <strong>{cellSize} Bytes (int)</strong>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.25rem', background: 'rgba(59, 130, 246, 0.03)' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 'bold' }}>
              {mode === 'row-major' ? 'Row-Major Formula' : 'Column-Major Formula'}
            </h4>
            
            {mode === 'row-major' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <pre style={{
                  background: 'transparent',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-code)',
                  fontSize: '0.75rem'
                }}>
                  Address = Base + (i * Cols + j) * Size
                </pre>
                <div style={{ fontSize: '0.8rem', lineHeight: '1.5', color: 'var(--text-muted)' }}>
                  Address = 0x{baseAddress.toString(16)} + ({selectedCell.r} * {cols} + {selectedCell.c}) * {cellSize}<br/>
                  Address = 0x{baseAddress.toString(16)} + ({selectedCell.r * cols + selectedCell.c}) * {cellSize}<br/>
                  Address = <strong>0x{activeAddress.toString(16)}</strong>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <pre style={{
                  background: 'transparent',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-code)',
                  fontSize: '0.75rem'
                }}>
                  Address = Base + (j * Rows + i) * Size
                </pre>
                <div style={{ fontSize: '0.8rem', lineHeight: '1.5', color: 'var(--text-muted)' }}>
                  Address = 0x{baseAddress.toString(16)} + ({selectedCell.c} * {rows} + {selectedCell.r}) * {cellSize}<br/>
                  Address = 0x{baseAddress.toString(16)} + ({selectedCell.c * rows + selectedCell.r}) * {cellSize}<br/>
                  Address = <strong>0x{activeAddress.toString(16)}</strong>
                </div>
              </div>
            )}
          </div>

          <div style={{ padding: '0.5rem 0.75rem', background: 'rgba(245, 158, 11, 0.05)', borderLeft: '3px solid var(--color-warning)', borderRadius: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <strong>MAKAUT Exam Tip:</strong> Examiners frequently ask you to calculate the address of `A[i][j]` when base address, dimensions, and type sizes are given. Be sure to check whether row-major or column-major is specified in the question header!
          </div>
        </div>

      </div>

    </div>
  );
}
