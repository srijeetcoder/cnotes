// Interactive C Program Simulator and Interpreter in the Browser
// Parses and executes standard C code blocks (variables, loops, conditional branches, pointers, structures, arrays, malloc/free)
// Returns detailed step-by-step trace of console outputs and memory addresses

export function executeCCode(code, inputStr = "") {
  let output = [];
  let errors = [];
  let ram = {}; // Address -> { name, type, value, segment: 'stack'|'heap', size }
  let varAddresses = {}; // Name -> Address
  let heapAllocations = []; // Array of allocated ranges { startAddress, size, freed: boolean }
  let steps = []; // Detailed step trace for animation [{ statement, log, ramState }]
  let waitingForInput = false;
  
  let stackBase = 0x7ffe00;
  let heapBase = 0x55d000;
  
  const addLog = (msg) => output.push(msg);
  const addError = (msg) => errors.push(msg);
  
  // Clean comments
  let cleanCode = code
    .replace(/\/\*[\s\S]*?\*\//g, "") // remove block comments
    .replace(/\/\/.*/g, ""); // remove line comments

  // Split inputs
  let inputs = inputStr.trim().split(/\s+/).filter(Boolean);
  let inputIdx = 0;

  // Basic syntax preprocessing check
  let bracesCount = (cleanCode.match(/{/g) || []).length;
  let closeBracesCount = (cleanCode.match(/}/g) || []).length;
  if (bracesCount !== closeBracesCount) {
    addError(`Compilation Error: Unmatched curly braces. Open: ${bracesCount}, Close: ${closeBracesCount}`);
    return { output: output.join(""), errors, ram, steps };
  }

  // Find int main() body
  let mainMatch = cleanCode.match(/(?:int|void)\s+main\s*\([^)]*\)\s*\{([\s\S]*)\}/);
  if (!mainMatch) {
    addError("Linker Error: main() function is not defined.");
    return { output: output.join(""), errors, ram, steps };
  }
  
  let mainBody = mainMatch[1];

  // Helpers to assign address
  const allocateStack = (name, type, value, size = 4) => {
    let addrStr = "0x" + (stackBase).toString(16);
    stackBase -= size;
    varAddresses[name] = addrStr;
    ram[addrStr] = { name, type, value, segment: "stack", size };
    return addrStr;
  };
  
  const allocateHeap = (size) => {
    let addrStr = "0x" + (heapBase).toString(16);
    heapBase += size;
    heapAllocations.push({ startAddress: addrStr, size, freed: false });
    // Initialize heap cells
    for (let i = 0; i < size; i += 4) {
      let cellAddr = "0x" + (parseInt(addrStr) + i).toString(16);
      ram[cellAddr] = { name: `heap_${cellAddr}`, type: "void*", value: "garbage", segment: "heap", size: 4 };
    }
    return addrStr;
  };

  // Helper to resolve address of any expression (variables, ptr deref, array, struct member)
  const resolveAddress = (expr) => {
    let clean = expr.trim();
    
    // Strip external parentheses
    if (clean.startsWith('(') && clean.endsWith(')')) {
      clean = clean.substring(1, clean.length - 1).trim();
    }

    // Pointer dereference *ptr
    if (clean.startsWith("*")) {
      let targetExpr = clean.substring(1).trim();
      let val = evaluateValue(targetExpr);
      return val; 
    }

    // Structure pointer member access ptr->member
    if (clean.includes("->")) {
      let parts = clean.split("->");
      let ptrName = parts[0].trim();
      let memberName = parts[1].trim();
      let ptrAddr = varAddresses[ptrName];
      if (ptrAddr) {
        let targetAddr = ram[ptrAddr].value;
        if (ram[targetAddr]) {
          let baseVar = ram[targetAddr].name;
          let compositeName = `${baseVar}_${memberName}`;
          return varAddresses[compositeName];
        }
      }
    }

    // Structure member access obj.member
    if (clean.includes(".")) {
      let parts = clean.split(".");
      let objName = parts[0].trim();
      let memberName = parts[1].trim();
      let compositeName = `${objName}_${memberName}`;
      return varAddresses[compositeName];
    }

    // Array lookup arr[idx] or double bracket matrix[i][j]
    if (clean.endsWith("]")) {
      let depth = 1;
      let openIdx = -1;
      for (let k = clean.length - 2; k >= 0; k--) {
        if (clean[k] === ']') depth++;
        else if (clean[k] === '[') {
          depth--;
          if (depth === 0) {
            openIdx = k;
            break;
          }
        }
      }
      if (openIdx !== -1) {
        let baseExpr = clean.substring(0, openIdx).trim();
        let indexExpr = clean.substring(openIdx + 1, clean.length - 1).trim();
        
        let baseAddrStr = resolveAddress(baseExpr);
        if (baseAddrStr) {
          let idxVal = evaluateValue(indexExpr);
          let baseAddrInt = parseInt(baseAddrStr);
          
          let baseVal = ram[baseAddrStr] ? ram[baseAddrStr].value : baseAddrInt;
          
          let cellAddr;
          if (typeof baseVal === 'string' && baseVal.startsWith('0x')) {
            let targetAddrInt = parseInt(baseVal);
            if (targetAddrInt >= 0x55d000 && targetAddrInt < 0x7ffe00) {
              cellAddr = "0x" + (targetAddrInt + idxVal * 4).toString(16);
            } else {
              cellAddr = "0x" + (targetAddrInt - idxVal * 4).toString(16);
            }
          } else {
            if (baseAddrInt >= 0x55d000 && baseAddrInt < 0x7ffe00) {
              cellAddr = "0x" + (baseAddrInt + idxVal * 4).toString(16);
            } else {
              cellAddr = "0x" + (baseAddrInt - idxVal * 4).toString(16);
            }
          }
          return cellAddr;
        }
      }
    }

    return varAddresses[clean];
  };

  // Evaluate simple expression
  const evaluateValue = (expr) => {
    let clean = expr.trim();
    if (/^-?\d+$/.test(clean)) return parseInt(clean);
    if (/^-?\d+\.\d+$/.test(clean)) return parseFloat(clean);
    if (/^'.*'$/.test(clean)) return clean.charCodeAt(1); 
    if (clean === "NULL") return 0;
    
    // Address-of &expr
    if (clean.startsWith("&")) {
      let targetExpr = clean.substring(1).trim();
      return resolveAddress(targetExpr) || "NULL";
    }

    // Try resolving address and getting its value
    let addr = resolveAddress(clean);
    if (addr && ram[addr]) {
      return ram[addr].value;
    }

    // Fallback math / variables replacement
    try {
      let replaced = clean;
      // Replace sizeof(type) with numeric byte sizes
      replaced = replaced.replace(/sizeof\s*\(([^)]+)\)/g, (match, type) => {
        let t = type.trim();
        if (t === 'char') return '1';
        if (t === 'double') return '8';
        return '4';
      });
      
      for (let varName in varAddresses) {
        let addr = varAddresses[varName];
        let val = ram[addr].value;
        // Escape special regex characters in the variable name
        let escapedVarName = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        replaced = replaced.replace(new RegExp(`\\b${escapedVarName}\\b`, 'g'), val);
      }
      if (/^[0-9.+\-*/()\s<>=!&|]+$/.test(replaced)) {
        return Function(`return (${replaced})`)();
      }
    } catch (e) {
      // Math failed
    }

    return expr;
  };

  // --- Parser Section ---
  function parseStatements(codeStr) {
    let statements = [];
    let i = 0;
    
    function skipWhitespace() {
      while (i < codeStr.length && /\s/.test(codeStr[i])) {
        i++;
      }
    }
    
    while (i < codeStr.length) {
      skipWhitespace();
      if (i >= codeStr.length) break;
      
      // Block starting with '{'
      if (codeStr[i] === '{') {
        let blockContent = readBlock();
        statements.push({
          type: 'block',
          body: parseStatements(blockContent),
          raw: `{${blockContent}}`
        });
        continue;
      }
      
      // Control flow statements
      if (codeStr.startsWith('for', i) && !/[a-zA-Z0-9_]/.test(codeStr[i+3] || '')) {
        statements.push(parseForLoop());
        continue;
      }
      if (codeStr.startsWith('while', i) && !/[a-zA-Z0-9_]/.test(codeStr[i+5] || '')) {
        statements.push(parseWhileLoop());
        continue;
      }
      if (codeStr.startsWith('if', i) && !/[a-zA-Z0-9_]/.test(codeStr[i+2] || '')) {
        statements.push(parseIfStatement());
        continue;
      }
      
      // Simple statement ending in semicolon
      let stmtText = readUntilSemicolon();
      statements.push(parseSimpleStatement(stmtText));
    }
    
    return statements;
    
    function readBlock() {
      i++; // skip '{'
      let depth = 1;
      let start = i;
      while (i < codeStr.length) {
        if (codeStr[i] === '{') depth++;
        else if (codeStr[i] === '}') {
          depth--;
          if (depth === 0) {
            let content = codeStr.substring(start, i);
            i++; 
            return content;
          }
        }
        i++;
      }
      return codeStr.substring(start);
    }
    
    function readParentheses() {
      skipWhitespace();
      if (codeStr[i] !== '(') return '';
      i++; 
      let depth = 1;
      let start = i;
      while (i < codeStr.length) {
        if (codeStr[i] === '(') depth++;
        else if (codeStr[i] === ')') {
          depth--;
          if (depth === 0) {
            let content = codeStr.substring(start, i);
            i++; 
            return content;
          }
        }
        i++;
      }
      return codeStr.substring(start);
    }
    
    function readUntilSemicolon() {
      let start = i;
      while (i < codeStr.length && codeStr[i] !== ';') {
        i++;
      }
      let content = codeStr.substring(start, i);
      if (codeStr[i] === ';') i++; 
      return content.trim();
    }
    
    function parseForLoop() {
      let startIdx = i;
      i += 3; // skip 'for'
      let header = readParentheses();
      let parts = [];
      let currentPart = '';
      let pDepth = 0;
      for (let char of header) {
        if (char === '(') pDepth++;
        if (char === ')') pDepth--;
        if (char === ';' && pDepth === 0) {
          parts.push(currentPart.trim());
          currentPart = '';
        } else {
          currentPart += char;
        }
      }
      parts.push(currentPart.trim());
      
      let init = parts[0] || '';
      let cond = parts[1] || '1';
      let incr = parts[2] || '';
      
      skipWhitespace();
      let bodyStmt;
      if (codeStr[i] === '{') {
        bodyStmt = {
          type: 'block',
          body: parseStatements(readBlock()),
          raw: ''
        };
      } else {
        if (codeStr.startsWith('for', i) && !/[a-zA-Z0-9_]/.test(codeStr[i+3] || '')) {
          bodyStmt = parseForLoop();
        } else if (codeStr.startsWith('while', i) && !/[a-zA-Z0-9_]/.test(codeStr[i+5] || '')) {
          bodyStmt = parseWhileLoop();
        } else if (codeStr.startsWith('if', i) && !/[a-zA-Z0-9_]/.test(codeStr[i+2] || '')) {
          bodyStmt = parseIfStatement();
        } else {
          bodyStmt = parseSimpleStatement(readUntilSemicolon());
        }
      }
      
      return {
        type: 'for',
        init,
        cond,
        incr,
        body: bodyStmt,
        raw: codeStr.substring(startIdx, i)
      };
    }
    
    function parseWhileLoop() {
      let startIdx = i;
      i += 5; // skip 'while'
      let cond = readParentheses();
      skipWhitespace();
      let bodyStmt;
      if (codeStr[i] === '{') {
        bodyStmt = {
          type: 'block',
          body: parseStatements(readBlock()),
          raw: ''
        };
      } else {
        if (codeStr.startsWith('for', i) && !/[a-zA-Z0-9_]/.test(codeStr[i+3] || '')) {
          bodyStmt = parseForLoop();
        } else if (codeStr.startsWith('while', i) && !/[a-zA-Z0-9_]/.test(codeStr[i+5] || '')) {
          bodyStmt = parseWhileLoop();
        } else if (codeStr.startsWith('if', i) && !/[a-zA-Z0-9_]/.test(codeStr[i+2] || '')) {
          bodyStmt = parseIfStatement();
        } else {
          bodyStmt = parseSimpleStatement(readUntilSemicolon());
        }
      }
      return {
        type: 'while',
        cond,
        body: bodyStmt,
        raw: codeStr.substring(startIdx, i)
      };
    }
    
    function parseIfStatement() {
      let startIdx = i;
      i += 2; // skip 'if'
      let cond = readParentheses();
      skipWhitespace();
      let thenStmt;
      if (codeStr[i] === '{') {
        thenStmt = {
          type: 'block',
          body: parseStatements(readBlock()),
          raw: ''
        };
      } else {
        if (codeStr.startsWith('for', i) && !/[a-zA-Z0-9_]/.test(codeStr[i+3] || '')) {
          thenStmt = parseForLoop();
        } else if (codeStr.startsWith('while', i) && !/[a-zA-Z0-9_]/.test(codeStr[i+5] || '')) {
          thenStmt = parseWhileLoop();
        } else if (codeStr.startsWith('if', i) && !/[a-zA-Z0-9_]/.test(codeStr[i+2] || '')) {
          thenStmt = parseIfStatement();
        } else {
          thenStmt = parseSimpleStatement(readUntilSemicolon());
        }
      }
      
      skipWhitespace();
      let elseStmt = null;
      if (codeStr.startsWith('else', i) && !/[a-zA-Z0-9_]/.test(codeStr[i+4] || '')) {
        i += 4; 
        skipWhitespace();
        if (codeStr[i] === '{') {
          elseStmt = {
            type: 'block',
            body: parseStatements(readBlock()),
            raw: ''
          };
        } else {
          if (codeStr.startsWith('for', i) && !/[a-zA-Z0-9_]/.test(codeStr[i+3] || '')) {
            elseStmt = parseForLoop();
          } else if (codeStr.startsWith('while', i) && !/[a-zA-Z0-9_]/.test(codeStr[i+5] || '')) {
            elseStmt = parseWhileLoop();
          } else if (codeStr.startsWith('if', i) && !/[a-zA-Z0-9_]/.test(codeStr[i+2] || '')) {
            elseStmt = parseIfStatement();
          } else {
            elseStmt = parseSimpleStatement(readUntilSemicolon());
          }
        }
      }
      
      return {
        type: 'if',
        cond,
        then: thenStmt,
        else: elseStmt,
        raw: codeStr.substring(startIdx, i)
      };
    }
    
    function parseSimpleStatement(text) {
      text = text.trim();
      if (text.startsWith('printf')) {
        return { type: 'printf', raw: text };
      }
      if (text.startsWith('scanf')) {
        return { type: 'scanf', raw: text };
      }
      if (text.startsWith('free')) {
        return { type: 'free', raw: text };
      }
      if (text.startsWith('return')) {
        return { type: 'return', raw: text };
      }
      
      // Comma-separated variable declaration check
      let declTypeMatch = text.match(/^(int|float|char|double|void)\s+(.*)$/);
      if (declTypeMatch) {
        let type = declTypeMatch[1];
        let declList = declTypeMatch[2];
        if (declList.includes('[') || text.startsWith('struct')) {
          // Pass through to complex types
        } else {
          return { type: 'decl', raw: text, varType: type, declList };
        }
      }
      
      if (text.match(/^(int|char|float)\s+([a-zA-Z_]\w*)\[(\d*)\](?:\s*=\s*\{([^}]+)\})?$/)) {
        return { type: 'arrayDecl', raw: text };
      }
      if (text.match(/^(?:(?:int|float|char|void)\s*\*?\s*)?([a-zA-Z_][\w[\]*]*)\s*=\s*(?:\([^)]*\))?\s*(malloc|calloc)\((.*)\)$/)) {
        return { type: 'malloc', raw: text };
      }
      if (text.match(/^struct\s+([a-zA-Z_]\w*)\s+([a-zA-Z_]\w*)(?:\s*=\s*\{([^}]+)\})?$/)) {
        return { type: 'structDecl', raw: text };
      }
      if (text.match(/^([^*=]+)\s*=\s*(.*)$/)) {
        return { type: 'assign', raw: text };
      }
      if (text.match(/^([a-zA-Z_]\w*)\s*(\+\+|--)$/) || text.match(/^(\+\+|--)\s*([a-zA-Z_]\w*)$/)) {
        return { type: 'increment', raw: text };
      }
      
      return { type: 'unknown', raw: text };
    }
  }

  // --- Execution Engine ---
  let executionCount = 0;
  
  function executeStatement(stmt) {
    if (!stmt) return;
    executionCount++;
    if (executionCount > 10000) {
      addError("Runtime Protection: Execution limit reached (potential infinite loop).");
      throw new Error("Execution limit reached");
    }

    switch (stmt.type) {
      case 'block':
        for (let s of stmt.body) {
          executeStatement(s);
        }
        break;

      case 'for':
        // Run init
        if (stmt.init.trim()) {
          executeStatement(parseStatements(stmt.init + ";")[0]);
        }
        
        let loopSafety = 0;
        while (true) {
          loopSafety++;
          if (loopSafety > 2000) {
            addError("Runtime Warning: Max loop iterations exceeded.");
            break;
          }
          
          // Evaluate condition
          let condVal = evaluateValue(stmt.cond);
          if (condVal === false || condVal === 0) {
            break;
          }
          
          // Run body
          executeStatement(stmt.body);
          
          // Run increment
          if (stmt.incr.trim()) {
            executeStatement(parseStatements(stmt.incr + ";")[0]);
          }
        }
        break;

      case 'while':
        let whileSafety = 0;
        while (true) {
          whileSafety++;
          if (whileSafety > 2000) {
            addError("Runtime Warning: Max loop iterations exceeded.");
            break;
          }
          
          let condVal = evaluateValue(stmt.cond);
          if (condVal === false || condVal === 0) {
            break;
          }
          
          executeStatement(stmt.body);
        }
        break;

      case 'if':
        let condVal = evaluateValue(stmt.cond);
        if (condVal !== false && condVal !== 0 && condVal !== "0") {
          executeStatement(stmt.then);
        } else if (stmt.else) {
          executeStatement(stmt.else);
        }
        break;

      case 'increment':
        let incMatch = stmt.raw.match(/^([a-zA-Z_]\w*)\s*(\+\+|--)$/) || stmt.raw.match(/^(\+\+|--)\s*([a-zA-Z_]\w*)$/);
        if (incMatch) {
          let varName = incMatch[1] || incMatch[2];
          let op = incMatch[2] || incMatch[1];
          let addr = varAddresses[varName];
          if (addr && ram[addr]) {
            let oldVal = Number(ram[addr].value) || 0;
            ram[addr].value = op === '++' ? oldVal + 1 : oldVal - 1;
            steps.push({
              statement: stmt.raw + ";",
              log: `Performed ${op} on variable '${varName}' (now ${ram[addr].value})`,
              ramState: JSON.parse(JSON.stringify(ram))
            });
          }
        }
        break;

      case 'printf':
        let printMatch = stmt.raw.match(/printf\s*\(\s*"([^"]*)"\s*(?:,\s*(.*))?\)/);
        if (printMatch) {
          let formatStr = printMatch[1];
          let argsStr = printMatch[2] || "";
          let args = [];
          
          if (argsStr) {
            let currentArg = "";
            let braceDepth = 0;
            for (let char of argsStr) {
              if (char === '(') braceDepth++;
              if (char === ')') braceDepth--;
              if (char === ',' && braceDepth === 0) {
                args.push(currentArg.trim());
                currentArg = "";
              } else {
                currentArg += char;
              }
            }
            if (currentArg.trim()) args.push(currentArg.trim());
          }

          let evaluatedArgs = args.map(arg => evaluateValue(arg));
          let printOutput = formatStr;
          
          let argIdx = 0;
          printOutput = printOutput.replace(/%d|%f|%s|%c|%lf|%p/g, (match) => {
            let val = evaluatedArgs[argIdx++];
            if (val === undefined) return match;
            
            if (match === "%f" || match === "%lf") {
              return Number(val).toFixed(2);
            }
            if (match === "%c") {
              return String.fromCharCode(Number(val));
            }
            return val;
          });

          printOutput = printOutput
            .replace(/\\n/g, "\n")
            .replace(/\\t/g, "    ");
            
          addLog(printOutput);
          
          steps.push({
            statement: stmt.raw + ";",
            log: `printf() output: "${printOutput.replace(/\n/g, '\\n')}"`,
            ramState: JSON.parse(JSON.stringify(ram))
          });
        }
        break;

      case 'scanf':
        let scanfMatch = stmt.raw.match(/scanf\s*\(\s*"([^"]*)"\s*,\s*(.*)\)/);
        if (scanfMatch) {
          let varRefs = scanfMatch[2].split(",").map(v => v.trim());
          
          for (let ref of varRefs) {
            let addr = resolveAddress(ref);
            let currentInput = inputs[inputIdx++];
            if (currentInput === undefined) {
              waitingForInput = true;
              throw new Error("WAITING_FOR_INPUT");
            }
            
            // Append input visually inline
            if (output.length > 0) {
              output[output.length - 1] = output[output.length - 1] + currentInput;
            } else {
              addLog(currentInput);
            }
            
            if (addr && ram[addr]) {
              ram[addr].value = evaluateValue(currentInput);
            }
          }
          
          steps.push({
            statement: stmt.raw + ";",
            log: `scanf() captured inputs: ${inputs.slice(0, inputIdx).join(", ")}`,
            ramState: JSON.parse(JSON.stringify(ram))
          });
        }
        break;

      case 'decl':
        let parts = [];
        let current = "";
        let pDepth = 0;
        for (let char of stmt.declList) {
          if (char === '(') pDepth++;
          if (char === ')') pDepth--;
          if (char === ',' && pDepth === 0) {
            parts.push(current.trim());
            current = "";
          } else {
            current += char;
          }
        }
        if (current.trim()) parts.push(current.trim());
        
        for (let part of parts) {
          let name = part.replace(/^\*+/, '').trim();
          let isPtr = part.startsWith('*');
          let val = "garbage";
          
          if (name.includes('=')) {
            let eqIdx = name.indexOf('=');
            let rawVal = name.substring(eqIdx + 1).trim();
            name = name.substring(0, eqIdx).trim();
            val = evaluateValue(rawVal);
          }
          
          // Count total asterisks in part to build pointer level (e.g., int** for **matrix)
          let ptrLevel = (part.match(/\*/g) || []).length;
          let evalType = stmt.varType + "*".repeat(ptrLevel);
          allocateStack(name, evalType, val);
          
          steps.push({
            statement: `${stmt.varType} ${part};`,
            log: `Declared ${evalType} variable '${name}' with value ${val}`,
            ramState: JSON.parse(JSON.stringify(ram))
          });
        }
        break;

      case 'malloc':
        let mallocMatch = stmt.raw.match(/^(?:(?:int|float|char|void)\s*\*?\s*)?([a-zA-Z_][\w[\]*]*)\s*=\s*(?:\([^)]*\))?\s*(malloc|calloc)\((.*)\)$/);
        if (mallocMatch) {
          let ptrName = mallocMatch[1];
          let allocType = mallocMatch[2];
          let args = mallocMatch[3].split(",");
          
          let totalSize = 0;
          if (allocType === "malloc") {
            totalSize = evaluateValue(args[0]) || 4;
          } else { 
            let num = evaluateValue(args[0]);
            let size = evaluateValue(args[1]);
            totalSize = num * size;
          }
          
          let heapAddr = allocateHeap(totalSize);
          
          let addr = resolveAddress(ptrName);
          if (addr && ram[addr]) {
            ram[addr].value = heapAddr;
          } else {
            if (!ptrName.includes('[')) {
              allocateStack(ptrName, "void*", heapAddr);
            }
          }
          
          if (allocType === "calloc") {
            for (let i = 0; i < totalSize; i += 4) {
              let cellAddr = "0x" + (parseInt(heapAddr) + i).toString(16);
              if (ram[cellAddr]) ram[cellAddr].value = 0;
            }
          }
          
          steps.push({
            statement: stmt.raw + ";",
            log: `Dynamically allocated ${totalSize} bytes on the Heap using ${allocType}(). Block starts at ${heapAddr}`,
            ramState: JSON.parse(JSON.stringify(ram))
          });
        }
        break;

      case 'free':
        let freeMatch = stmt.raw.match(/free\s*\(\s*([a-zA-Z_]\w*)\s*\)/);
        if (freeMatch) {
          let ptrName = freeMatch[1];
          let ptrAddr = varAddresses[ptrName];
          if (ptrAddr) {
            let targetHeapAddr = ram[ptrAddr].value;
            let block = heapAllocations.find(b => b.startAddress === targetHeapAddr);
            if (block) {
              block.freed = true;
              for (let i = 0; i < block.size; i += 4) {
                let cellAddr = "0x" + (parseInt(targetHeapAddr) + i).toString(16);
                if (ram[cellAddr]) {
                  ram[cellAddr].value = "FREED/DEALLOCATED";
                  ram[cellAddr].type = "freed";
                }
              }
            }
            steps.push({
              statement: stmt.raw + ";",
              log: `Freed dynamic heap memory pointed by '${ptrName}' at ${targetHeapAddr}`,
              ramState: JSON.parse(JSON.stringify(ram))
            });
          }
        }
        break;

      case 'structDecl':
        let structDeclMatch = stmt.raw.match(/^struct\s+([a-zA-Z_]\w*)\s+([a-zA-Z_]\w*)(?:\s*=\s*\{([^}]+)\})?$/);
        if (structDeclMatch) {
          let structName = structDeclMatch[1];
          let varName = structDeclMatch[2];
          let valuesStr = structDeclMatch[3] || "";
          let values = valuesStr.split(",").map(v => v.trim()).filter(Boolean).map(v => evaluateValue(v));
          
          let fields = ["id", "val", "score"];
          if (structName.toLowerCase() === "student") {
            fields = ["roll", "marks"];
          } else if (structName.toLowerCase() === "book") {
            fields = ["id", "price"];
          } else if (structName.toLowerCase() === "point") {
            fields = ["x", "y"];
          }
          
          let baseAddr = null;
          fields.forEach((field, idx) => {
            let fieldVal = values[idx] !== undefined ? values[idx] : "garbage";
            let cellAddr = allocateStack(`${varName}_${field}`, "struct member", fieldVal);
            if (idx === 0) baseAddr = cellAddr;
          });
          
          varAddresses[varName] = baseAddr;
          
          steps.push({
            statement: stmt.raw + ";",
            log: `Declared struct '${varName}' of type 'struct ${structName}' at address ${baseAddr}`,
            ramState: JSON.parse(JSON.stringify(ram))
          });
        }
        break;

      case 'arrayDecl':
        let arrayDeclMatch = stmt.raw.match(/^(int|char|float)\s+([a-zA-Z_]\w*)\[(\d*)\](?:\s*=\s*\{([^}]+)\})?$/);
        if (arrayDeclMatch) {
          let type = arrayDeclMatch[1];
          let name = arrayDeclMatch[2];
          let size = parseInt(arrayDeclMatch[3]) || 5;
          let valuesStr = arrayDeclMatch[4] || "";
          let initialValues = valuesStr.split(",").map(v => v.trim()).filter(Boolean).map(v => evaluateValue(v));
          
          let baseAddr = null;
          for (let i = 0; i < size; i++) {
            let cellVal = initialValues[i] !== undefined ? initialValues[i] : 0;
            let cellAddr = allocateStack(`${name}[${i}]`, type, cellVal);
            if (i === 0) baseAddr = cellAddr;
          }
          
          varAddresses[name] = baseAddr;
          
          steps.push({
            statement: stmt.raw + ";",
            log: `Declared array '${name}' of size ${size} at contiguous address ${baseAddr}`,
            ramState: JSON.parse(JSON.stringify(ram))
          });
        }
        break;

      case 'assign':
        let eqIdx = stmt.raw.indexOf('=');
        if (eqIdx !== -1) {
          let left = stmt.raw.substring(0, eqIdx).trim();
          let right = stmt.raw.substring(eqIdx + 1).trim();
          
          let valueEvaluated = evaluateValue(right);
          let addr = resolveAddress(left);
          
          if (addr && ram[addr]) {
            ram[addr].value = valueEvaluated;
            steps.push({
              statement: stmt.raw + ";",
              log: `Assigned value ${valueEvaluated} to '${left}'`,
              ramState: JSON.parse(JSON.stringify(ram))
            });
          } else {
            allocateStack(left, "int", valueEvaluated);
            steps.push({
              statement: stmt.raw + ";",
              log: `Declared and assigned ${valueEvaluated} to variable '${left}' (auto-allocated)`,
              ramState: JSON.parse(JSON.stringify(ram))
            });
          }
        }
        break;

      case 'return':
        steps.push({
          statement: stmt.raw + ";",
          log: `Program execution finished (return statement reached).`,
          ramState: JSON.parse(JSON.stringify(ram))
        });
        break;

      default:
        break;
    }
  }

  // Parse C code into syntax tree
  let parsedStatements = [];
  try {
    parsedStatements = parseStatements(mainBody);
  } catch (err) {
    addError("Compilation Error: Failed to parse statements hierarchy.");
    return { output: output.join(""), errors, ram, steps };
  }

  // Execute all parsed statements
  try {
    for (let stmt of parsedStatements) {
      executeStatement(stmt);
    }
  } catch (err) {
    if (err.message === "WAITING_FOR_INPUT") {
      // Intentionally paused execution to wait for stdin from user
    } else if (err.message !== "Execution limit reached") {
      addError(`Runtime Error: ${err.message}`);
    }
  }

  // Memory Leak Check (only on clean completion, not during stdin pauses)
  if (!waitingForInput) {
    heapAllocations.forEach(block => {
      if (!block.freed) {
        let hasReference = false;
        for (let addr in ram) {
          if (ram[addr].segment === "stack" && ram[addr].value === block.startAddress) {
            hasReference = true;
            break;
          }
        }
        if (!hasReference) {
          addError(`Memory Leak Warning: Heap allocation block at ${block.startAddress} (${block.size} bytes) was lost!`);
        } else {
          addError(`Resource Warning: Heap memory block at ${block.startAddress} was never deallocated.`);
        }
      }
    });
  }

  return {
    output: output.join(""),
    errors,
    ram,
    steps,
    waitingForInput
  };
}
