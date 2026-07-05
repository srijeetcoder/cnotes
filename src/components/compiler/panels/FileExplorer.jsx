import React, { useState, useEffect } from 'react';
import { FileCode, Plus, Folder, Star, Clock, Download, Upload, Cpu, Award } from 'lucide-react';

const SNIPPETS = [
  {
    name: 'Hello World',
    code: `// standard output hello world
#include <stdio.h>

int main() {
    printf("Hello World\\n");
    return 0;
}`
  },
  {
    name: 'Calculator',
    code: `// basic switch statement calculator
#include <stdio.h>

int main() {
    char op = '+';
    int a = 12, b = 4;
    
    printf("Simple Calculator Operations:\\n");
    switch(op) {
        case '+': printf("%d + %d = %d\\n", a, b, a + b); break;
        case '-': printf("%d - %d = %d\\n", a, b, a - b); break;
        case '*': printf("%d * %d = %d\\n", a, b, a * b); break;
        case '/': printf("%d / %d = %d\\n", a, b, a / b); break;
    }
    return 0;
}`
  },
  {
    name: 'Prime Numbers',
    code: `// prime number checker
#include <stdio.h>

int main() {
    int num = 29, isPrime = 1;
    for(int i = 2; i <= num/2; i++) {
        if(num % i == 0) {
            isPrime = 0;
            break;
        }
    }
    if(isPrime) printf("%d is a Prime Number\\n", num);
    else printf("%d is NOT a Prime Number\\n", num);
    return 0;
}`
  },
  {
    name: 'Dynamic Array Allocation',
    code: `// dynamic heap malloc allocations
#include <stdio.h>
#include <stdlib.h>

int main() {
    int size = 5;
    int *arr = malloc(size * sizeof(int));
    
    if(arr != NULL) {
        for(int i=0; i<size; i++) {
            arr[i] = i * 10;
            printf("arr[%d] stored at heap: %d\\n", i, arr[i]);
        }
        free(arr);
    }
    return 0;
}`
  },
  {
    name: 'Pointers Swap',
    code: `// swapping variables via call by reference pointers
#include <stdio.h>

void swap(int *x, int *y) {
    int temp = *x;
    *x = *y;
    *y = temp;
}

int main() {
    int a = 50, b = 100;
    printf("Before swap: a=%d, b=%d\\n", a, b);
    swap(&a, &b);
    printf("After swap: a=%d, b=%d\\n", a, b);
    return 0;
}`
  }
];

const LAB_PROGRAMS = [
  {
    name: 'Lab 1: Row Major Matrix Transpose',
    code: `// MAKAUT Lab: Matrix Transpose Simulation
#include <stdio.h>

int main() {
    int r = 2, c = 2;
    int matrix[2][2] = {{1, 2}, {3, 4}};
    int transpose[2][2];
    
    // Transpose operations
    for(int i=0; i<r; ++i) {
        for(int j=0; j<c; ++j) {
            transpose[j][i] = matrix[i][j];
        }
    }
    
    printf("Transposed Matrix Result:\\n");
    for(int i=0; i<c; ++i) {
        for(int j=0; j<r; ++j) {
            printf("%d ", transpose[i][j]);
        }
        printf("\\n");
    }
    return 0;
}`
  },
  {
    name: 'Lab 2: Singly Linked List Node Swap',
    code: `// MAKAUT Lab: Linked List nodes and malloc struct pointer
#include <stdio.h>
#include <stdlib.h>

struct Node {
    int val;
    struct Node* next;
};

int main() {
    struct Node* head = malloc(sizeof(struct Node));
    if(head != NULL) {
        head->val = 99;
        head->next = NULL;
        printf("Node created on stack pointing to Heap address value: %d\\n", head->val);
        free(head);
    }
    return 0;
}`
  }
];

export default function FileExplorer({ currentCode, onSelectFile, onNewFile }) {
  const [recentFiles, setRecentFiles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeFolder, setActiveFolder] = useState('snippets'); // snippets | lab | recents | favorites

  useEffect(() => {
    // Load recents & favorites from LocalStorage
    const recents = JSON.parse(localStorage.getItem('ide_recent_files') || '[]');
    const favs = JSON.parse(localStorage.getItem('ide_favorite_files') || '[]');
    setRecentFiles(recents);
    setFavorites(favs);
  }, []);

  const handleSnippetClick = (snippet) => {
    // Add to recents list
    let updated = [snippet.name, ...recentFiles.filter(f => f !== snippet.name)].slice(0, 5);
    setRecentFiles(updated);
    localStorage.setItem('ide_recent_files', JSON.stringify(updated));
    onSelectFile(snippet.code);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'program.c';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        onSelectFile(evt.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleToggleFavorite = () => {
    // Favorites current program
    const favName = `Saved Program ${favorites.length + 1}`;
    const newFav = { name: favName, code: currentCode };
    const updated = [...favorites, newFav];
    setFavorites(updated);
    localStorage.setItem('ide_favorite_files', JSON.stringify(updated));
    alert('Added current code to Favorites!');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.15)',
      borderRight: '1px solid var(--glass-border)',
      color: 'var(--text-primary)',
      overflowY: 'auto'
    }}>
      
      {/* Top action row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Explorer</span>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button 
            onClick={onNewFile} 
            title="New File"
            style={{ padding: '0.3rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
          >
            <Plus size={13} />
          </button>
          <button 
            onClick={handleDownload} 
            title="Download .c"
            style={{ padding: '0.3rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
          >
            <Download size={13} />
          </button>
          <label 
            title="Upload File"
            style={{ padding: '0.3rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center' }}
          >
            <Upload size={13} />
            <input type="file" onChange={handleUpload} style={{ display: 'none' }} />
          </label>
          <button 
            onClick={handleToggleFavorite} 
            title="Add to Favorites"
            style={{ padding: '0.3rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: 'none', cursor: 'pointer', color: 'var(--color-warning)' }}
          >
            <Star size={13} />
          </button>
        </div>
      </div>

      {/* Folders navigation list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', padding: '0.5rem' }}>
        
        {/* Snippets folder */}
        <div>
          <button 
            onClick={() => setActiveFolder(activeFolder === 'snippets' ? '' : 'snippets')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              background: activeFolder === 'snippets' ? 'rgba(255,255,255,0.03)' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <Folder size={14} color="var(--color-primary)" />
            <span style={{ fontWeight: 'bold' }}>Sample Snippets</span>
          </button>
          
          {activeFolder === 'snippets' && (
            <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '1.5rem', gap: '0.25rem', marginTop: '0.25rem' }}>
              {SNIPPETS.map(snip => (
                <button
                  key={snip.name}
                  onClick={() => handleSnippetClick(snip)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    padding: '0.3rem 0.5rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                >
                  <FileCode size={12} />
                  {snip.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* MAKAUT Labs folder */}
        <div>
          <button 
            onClick={() => setActiveFolder(activeFolder === 'labs' ? '' : 'labs')}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem',
              background: activeFolder === 'labs' ? 'rgba(255,255,255,0.03)' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              color: 'var(--text-primary)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <Award size={14} color="var(--color-secondary)" />
            <span style={{ fontWeight: 'bold' }}>MAKAUT Lab Programs</span>
          </button>
          
          {activeFolder === 'labs' && (
            <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '1.5rem', gap: '0.25rem', marginTop: '0.25rem' }}>
              {LAB_PROGRAMS.map(lab => (
                <button
                  key={lab.name}
                  onClick={() => handleSnippetClick(lab)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    padding: '0.3rem 0.5rem',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                  onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                  onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                >
                  <Cpu size={12} />
                  {lab.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Favorites folder */}
        {favorites.length > 0 && (
          <div>
            <button 
              onClick={() => setActiveFolder(activeFolder === 'favorites' ? '' : 'favorites')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                background: activeFolder === 'favorites' ? 'rgba(255,255,255,0.03)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Star size={14} color="var(--color-warning)" />
              <span style={{ fontWeight: 'bold' }}>Favorites ({favorites.length})</span>
            </button>
            
            {activeFolder === 'favorites' && (
              <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '1.5rem', gap: '0.25rem', marginTop: '0.25rem' }}>
                {favorites.map(fav => (
                  <button
                    key={fav.name}
                    onClick={() => onSelectFile(fav.code)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      padding: '0.3rem 0.5rem',
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                  >
                    <FileCode size={12} />
                    {fav.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Recent folder */}
        {recentFiles.length > 0 && (
          <div>
            <button 
              onClick={() => setActiveFolder(activeFolder === 'recents' ? '' : 'recents')}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                background: activeFolder === 'recents' ? 'rgba(255,255,255,0.03)' : 'transparent',
                border: 'none',
                borderRadius: '6px',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <Clock size={14} color="var(--text-muted)" />
              <span style={{ fontWeight: 'bold' }}>Recently Opened</span>
            </button>
            
            {activeFolder === 'recents' && (
              <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '1.5rem', gap: '0.25rem', marginTop: '0.25rem' }}>
                {recentFiles.map(file => (
                  <div
                    key={file}
                    style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      padding: '0.3rem 0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem'
                    }}
                  >
                    <Clock size={10} />
                    {file}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
