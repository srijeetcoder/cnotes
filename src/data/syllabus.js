// C Master MAKAUT Syllabus Database
// Single source of truth for the curriculum compiled from uploaded files

export const chapters = [
  {
    id: "ch1",
    title: "Chapter 1: Introduction to C",
    description: "Learn the fundamentals of C, program structure, and basic Input/Output operations.",
    difficulty: "Easy",
    pyqFrequency: 82, // Frequency % based on typical MAKAUT exams
    importance: "High",
    objectives: [
      "Understand the history and design of the C language.",
      "Identify components of a standard C program structure.",
      "Explain the concept of Tokens, Variables, and Data Types.",
      "Implement basic user input/output using scanf and printf."
    ],
    sections: [
      {
        id: "history",
        title: "1.1 History and Structure of C",
        content: `
C was developed by Dennis Ritchie in 1972 at Bell Labs. It was designed to build the UNIX operating system, combining low-level machine access with high-level readability.

### Structure of a C Program:
Every C program follows a standard blueprint:
1. **Preprocessor Directives**: e.g., \`#include <stdio.h>\` tells the compiler to copy-paste the Standard Input/Output library.
2. **Main Function**: \`int main()\` is the entry point. Execution starts here.
3. **Variable Declarations**: Reserving memory blocks before using them.
4. **Statements & Expressions**: The logical operations of the program.
5. **Return Statement**: \`return 0;\` signals successful execution.
        `,
        analogy: "Think of a C program like a kitchen recipe. Preprocessor directives are pulling out your blender and pots (libraries). The `main` function is the main cooking process. Variables are your bowls storing ingredients, and `return 0` means the dish is cooked successfully and ready to serve!",
        codeSample: `
#include <stdio.h> // Library inclusion

int main() { // Entry point
    // Variable Declaration & Initialization
    int age = 18; 
    
    // Output statement
    printf("Welcome to C Master! Your age is: %d\\n", age);
    
    return 0; // Exit status code
}
        `,
        mistakes: [
          "Forgetting the semicolon (;) at the end of statements. In C, semicolons act like periods in a sentence.",
          "Case sensitivity mismatch: writing 'Printf' or 'PRINTF' instead of 'printf'. C is case-sensitive."
        ],
        examTip: "MAKAUT examiners love to ask: 'Explain the structure of a C program with a neat diagram.' Always draw the Preprocessor -> Main -> Declarations -> Logic flow.",
        interviewQuestion: {
          q: "Why is C called a middle-level language?",
          a: "Because it bridges the gap between low-level assembly language (direct hardware/memory manipulation via pointers) and high-level programming languages (user-friendly abstractions like variables and structures)."
        }
      },
      {
        id: "variables-datatypes",
        title: "1.2 Variables, Constants, and Data Types",
        content: `
A **Variable** is a named memory location that stores data whose value can change during execution.

### Rules for Naming Variables:
1. Must start with a letter (\`a-z\`, \`A-Z\`) or underscore (\`_\`). Cannot start with a digit.
2. No special characters allowed except underscore. Spaces are prohibited.
3. Cannot be a reserved keyword (like \`int\`, \`return\`, \`float\`).
4. Case-sensitive: \`age\` and \`Age\` are different storage boxes.

### Core Data Types in C:
* **int**: Stores integers. Occupies **4 bytes (32 bits)** on modern systems. Range is from \`-2^31\` to \`2^31 - 1\`.
* **char**: Stores single characters. Occupies **1 byte (8 bits)**. It stores numerical ASCII values (e.g., 'A' is stored as 65).
* **float**: Stores single-precision decimal values. Occupies **4 bytes** with 8 decimal places accuracy.
* **double**: Stores double-precision decimals. Occupies **8 bytes** with 15 decimal places accuracy.
        `,
        analogy: "Variables are labeled container boxes. An 'int' box is shaped to hold whole numbers like apples. A 'float' box holds fluids (fractions). You can't fit a whole apple in a fluid tube without converting it (typecasting)!",
        codeSample: `
#include <stdio.h>

int main() {
    int rollNumber = 42; // Integer variable
    char grade = 'A';    // Character variable (in single quotes)
    float marks = 94.5f;  // Float variable (note the 'f' suffix)
    
    printf("Roll %d got grade %c with %2.1f%% marks.\\n", rollNumber, grade, marks);
    return 0;
}
        `,
        mistakes: [
          "Forgetting to put single quotes around a char literal (e.g. char g = A; instead of char g = 'A';). This will cause the compiler to look for a variable named A.",
          "Using a hyphen in variable names (e.g. int roll-no;) instead of snake_case (int roll_no;) or camelCase (int rollNo;)."
        ],
        examTip: "MAKAUT exams often test variable ranges and ASCII. Remember that 'a' is 97, 'A' is 65, and '0' is 48 in ASCII.",
        interviewQuestion: {
          q: "What is the difference between char a = '5' and int b = 5?",
          a: "char a = '5' stores the ASCII value of character '5', which is 53 in decimal. int b = 5 stores the actual numerical value 5. They occupy different memory lengths (1 byte vs 4 bytes)."
        }
      },
      {
        id: "io-basics",
        title: "1.3 Variable Input and Output",
        content: `
Input and output operations allow programs to interact with users.

### Output with \`printf()\`:
Format specifiers tell the computer what type of value to print:
* \`%d\` : integer
* \`%c\` : character
* \`%f\` : float
* \`%lf\` : double (long float)
* \`%s\` : string

### Input with \`scanf()\`:
Syntax: \`scanf(\"format\", &variable_name);\`
The ampersand (\`&\`) is the **address-of operator**. It directs \`scanf\` to the exact memory address where the user's input should be stored.
        `,
        analogy: "Writing code without scanf is like reading a pre-written book. scanf turns your program into a 'choose-your-own-adventure' game where the user inputs the direction!",
        codeSample: `
#include <stdio.h>

int main() {
    int age;
    printf("Enter your age: ");
    scanf("%d", &age); // &age sends the input to age's memory block
    
    printf("Next year you will be: %d\\n", age + 1);
    return 0;
}
        `,
        mistakes: [
          "Forgetting the '&' operator in scanf. If you write 'scanf(\"%d\", age);', the compiler will treat the current value inside 'age' as a memory address, leading to a Segmentation Fault/Crash.",
          "Adding a newline '\\n' inside scanf format string. E.g., 'scanf(\"%d\\n\", &age);' forces the user to press Enter twice before the input is accepted."
        ],
        examTip: "If you receive a prompt asking to take multiple inputs in a single line, you can do it like this: 'scanf(\"%d/%d/%d\", &day, &month, &year);'. This requires inputs to be separated by slashes.",
        interviewQuestion: {
          q: "What does printf() return?",
          a: "It returns the total number of characters successfully printed to the screen. For example, printf(\"Hi\") returns 2."
        }
      }
    ],
    quizzes: [
      {
        type: "mcq",
        q: "What is the size of an int data type on a standard 32-bit/64-bit compiler?",
        options: ["1 Byte", "2 Bytes", "4 Bytes", "8 Bytes"],
        answer: 2,
        difficulty: "Easy"
      },
      {
        type: "fill",
        q: "In C, the ________ operator represents the 'address-of' operation, which is commonly used in scanf().",
        answer: "&",
        difficulty: "Easy"
      },
      {
        type: "debug",
        q: "Find and fix the error in this code:\nint main() {\n    float score = 89.2;\n    scanf(\"%f\", score);\n    return 0;\n}",
        answer: "scanf(\"%f\", &score);",
        difficulty: "Medium"
      }
    ],
    flashcards: [
      { q: "What preprocessor directive is used for basic console printing?", a: "#include <stdio.h>" },
      { q: "What is the ASCII value of character 'A'?", a: "65" },
      { q: "Why does scanf require the '&' symbol?", a: "To pass the memory address of the variable so the input can be stored directly inside it." }
    ]
  },
  {
    id: "ch2",
    title: "Chapter 2: Operators & Expressions",
    description: "Understand operators, precedence, arithmetic calculations, and binary logical structures.",
    difficulty: "Easy",
    pyqFrequency: 91,
    importance: "High",
    objectives: [
      "Understand all C operators: Arithmetic, Relational, Logical, and Bitwise.",
      "Understand Precedence and Associativity of operators.",
      "Examine increment/decrement prefix and postfix differences.",
      "Implement condition checks with the Ternary operator."
    ],
    sections: [
      {
        id: "operators-types",
        title: "2.1 Classification of Operators",
        content: `
Operators are symbols that command the compiler to perform mathematical or logical manipulations.

### Key Types of Operators:
1. **Arithmetic**: \`+\`, \`-\`, \`*\`, \`/\`, \`%\` (Modulus). Note: \`%\` returns the remainder of integer division and **cannot** be used on floats/decimals.
2. **Relational**: Used for comparison. E.g., \`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`. Returns \`1\` (true) or \`0\` (false).
3. **Logical**: Connect expressions. \`&&\` (AND), \`||\` (OR), \`!\` (NOT).
4. **Assignment**: Assign values. E.g., \`=\`, \`+=\`, \`-=\`, \`*=\`, \`/=\`. E.g., \`x += 5\` means \`x = x + 5\`.
5. **Bitwise**: Operates directly on binary representation of values. \`&\` (AND), \`|\` (OR), \`^\` (XOR), \`~\` (NOT), \`<<\` (left shift), \`>>\` (right shift).
6. **Increment/Decrement**: \`++\` (add 1), \`--\` (subtract 1).
   - **Prefix (\`++x\`)**: Increments the variable first, then uses it in the expression.
   - **Postfix (\`x++\`)**: Uses the current variable value first, then increments it.
        `,
        analogy: "Arithmetic operators are like calculators. Logical operators are like security guards: AND requires BOTH IDs (conditions) to be valid to let you pass, while OR lets you in if EITHER ID is valid.",
        codeSample: `
#include <stdio.h>

int main() {
    int a = 10, b = 3;
    printf("a %% b = %d\\n", a % b); // Prints 1 (remainder of 10/3)
    
    int x = 5;
    printf("Postfix: %d\\n", x++); // Prints 5, then x becomes 6
    printf("Prefix: %d\\n", ++x);  // x becomes 7, then prints 7
    return 0;
}
        `,
        mistakes: [
          "Using a single '=' instead of '==' for equality checks. E.g. 'if (x = 5)' assigns 5 to x (which is evaluated as true) instead of checking if x is equal to 5.",
          "Using the '%' (modulus) operator on float numbers. E.g., '5.5 % 2' triggers a compile-time error."
        ],
        examTip: "Postfix/Prefix increment differences are the single most repeated MCQ trick in MAKAUT. Carefully trace when the value changes!",
        interviewQuestion: {
          q: "What is the result of 5 & 3 in C?",
          a: "It does a bitwise AND. 5 in binary is 0101, 3 is 0011. 0101 & 0011 = 0001 (which is 1 in decimal)."
        }
      },
      {
        id: "precedence-rules",
        title: "2.2 Operator Precedence and Associativity",
        content: `
When multiple operators appear in a single expression, the compiler resolves them according to **Precedence** (order of operation) and **Associativity** (direction of evaluation when precedence is tied).

### Top Rules of Precedence (High to Low):
1. Parentheses \`()\`, Brackets \`[]\`, Arrow \`->\`, Dot \`.\`
2. Unary \`++\`, \`--\`, \`!\`, \`~\`, pointer dereference \`*\`, address-of \`&\`, \`sizeof\`
3. Multiplicative \`*\`, \`/\`, \`%\`
4. Additive \`+\`, \`-\`
5. Shift \`<<\`, \`>>\`
6. Relational \`<\`, \`<=\`, \`>\`, \`>=\`
7. Equality \`==\`, \`!=\`
8. Bitwise AND \`&\`, XOR \`^\`, OR \`|\`
9. Logical AND \`&&\`, OR \`||\`
10. Ternary \`? :\`
11. Assignment \`=\`, \`+=\`, \`-=\` etc.
12. Comma \`,\`
        `,
        analogy: "Precedence is like BODMAS in math. Multiplication comes before addition. Associativity decides whether you calculate Left-to-Right or Right-to-Left when you have operators of the same level (like '+' and '-').",
        codeSample: `
#include <stdio.h>

int main() {
    int result = 5 + 3 * 2; // Precedence makes it 5 + (3 * 2) = 11
    int a = 10, b = 20, c = 30;
    
    // Assignment has right-to-left associativity
    a = b = c; // c is assigned to b, then b is assigned to a. All become 30.
    
    printf("result = %d, a = %d\\n", result, a);
    return 0;
}
        `,
        mistakes: [
          "Assuming logical AND (&&) and logical OR (||) are evaluated fully when the outcome is already known. This is called 'Short-Circuiting'. E.g. in 'A && B', if A is false, B is never evaluated."
        ],
        examTip: "Make sure you memorize that postfix ++ has higher precedence than prefix *. E.g., '*ptr++' increments the pointer address, not the value it points to!",
        interviewQuestion: {
          q: "What is the difference between precedence and associativity?",
          a: "Precedence determines which operator is evaluated first when they are different. Associativity determines the direction of evaluation (Left-to-Right or Right-to-Left) when operators have equal precedence."
        }
      }
    ],
    quizzes: [
      {
        type: "mcq",
        q: "What will be the output of: x = 5; printf(\"%d\", x++); ?",
        options: ["5", "6", "Compile Error", "Undefined"],
        answer: 0,
        difficulty: "Easy"
      },
      {
        type: "mcq",
        q: "Which operator has the lowest precedence in C?",
        options: ["+", "&&", "=", ","],
        answer: 3,
        difficulty: "Medium"
      },
      {
        type: "fill",
        q: "The modulus operator (%) cannot be applied to ________ data types.",
        answer: "float",
        difficulty: "Easy"
      }
    ],
    flashcards: [
      { q: "What is the associativity of assignment (=) operators?", a: "Right to Left" },
      { q: "What does the expression 'a = 10, 20, 30;' evaluate a to?", a: "10 (due to precedence: assignment '=' is higher than comma ',')" },
      { q: "What is the output of '5 > 3 && 2 < 1'?", a: "0 (False)" }
    ]
  },
  {
    id: "ch3",
    title: "Chapter 3: Control Statements",
    description: "Master conditional execution (if-else, switch) and loop iterations (for, while).",
    difficulty: "Medium",
    pyqFrequency: 88,
    importance: "High",
    objectives: [
      "Implement conditional branches using if, else if, and switch-case.",
      "Understand the mechanics of while, do-while, and for loops.",
      "Control loop behavior using break and continue.",
      "Recognize the structure of nested loops."
    ],
    sections: [
      {
        id: "conditionals",
        title: "3.1 Conditionals (if, else, switch)",
        content: `
Conditionals allow a program to make decisions based on inputs.

### The \`if-else\` Ladder:
Evaluates conditions sequentially. If a condition is true, its block runs, and the rest are ignored.

### The \`switch-case\` Statement:
Used when a single variable is tested against constant values.
- Crucial: Every case must end with a \`break\` statement. If omitted, execution **falls through** to the next case automatically!
- The switch variable must evaluate to an **integer** or **character** constant. Floats are prohibited!
        `,
        analogy: "if-else is like choosing paths at a fork in the road: you can only go down one. switch-case is like a multi-floor elevator: if you don't press 'stop' (break) at your floor, you slide down to all floors below it!",
        codeSample: `
#include <stdio.h>

int main() {
    char grade = 'B';
    switch (grade) {
        case 'A':
            printf("Excellent!\\n");
            break;
        case 'B':
            printf("Well done!\\n");
            break; // Omit this and case 'C' will also run!
        case 'C':
            printf("Passed.\\n");
            break;
        default:
            printf("Invalid grade\\n");
    }
    return 0;
}
        `,
        mistakes: [
          "Forgetting the break statement in switch cases, causing fall-through bugs.",
          "Writing 'switch(marks)' where marks is a float variable. This is illegal in C."
        ],
        examTip: "Always look out for missing breaks in switch questions on paper. It's a classic trick to make you write combined outputs.",
        interviewQuestion: {
          q: "What is the difference between if-else and switch-case?",
          a: "if-else evaluates relational or logical expressions of any datatype. switch-case matches integer/char values directly and is often faster as the compiler optimization can build a jump table."
        }
      },
      {
        id: "loops",
        title: "3.2 Loops (for, while, do-while)",
        content: `
Loops repeat code statements as long as a condition is satisfied.

### The Three Loops:
1. **while**: Entry-controlled loop. Checks condition first, then executes block. If initially false, runs 0 times.
2. **for**: Entry-controlled loop. Integrates initialization, condition, and increment/update in one line.
3. **do-while**: Exit-controlled loop. Executes block first, then checks condition. **Guaranteed to run at least once!**

### Jump Statements:
- **break**: Instantly exits the loop.
- **continue**: Skips the remaining code in current iteration and moves directly to the next loop update/condition.
        `,
        analogy: "while loop is like getting on a roller coaster: they check your ticket (condition) before you get on. do-while is like a gym entry: you work out first, and they check your membership card on your way out!",
        codeSample: `
#include <stdio.h>

int main() {
    // Print numbers 1 to 5 using a for loop
    for (int i = 1; i <= 5; ++i) {
        if (i == 3) continue; // Skip 3
        printf("%d ", i);
    }
    // Output will be: 1 2 4 5
    return 0;
}
        `,
        mistakes: [
          "Creating infinite loops by forgetting to update the loop counter variable inside while loop block.",
          "Putting a semicolon right after the loop statement, e.g., 'for(int i=0; i<10; i++);'. This makes the loop execute an empty statement 10 times, doing nothing."
        ],
        examTip: "Explain differences between entry-controlled and exit-controlled loops. Support your answer with syntax and diagrams of while and do-while loops.",
        interviewQuestion: {
          q: "Is it mandatory to write all three sections inside a for loop statement?",
          a: "No, all sections (initialization, condition, increment) are optional. E.g., 'for(;;)' creates an infinite loop."
        }
      }
    ],
    quizzes: [
      {
        type: "mcq",
        q: "Which loop is guaranteed to run at least once?",
        options: ["for", "while", "do-while", "None of these"],
        answer: 2,
        difficulty: "Easy"
      },
      {
        type: "debug",
        q: "Fix the loop condition to print 1 to 10:\nint i = 1;\nwhile(i < 10) {\n    printf(\"%d\", i);\n    i++;\n}",
        answer: "while(i <= 10)",
        difficulty: "Easy"
      }
    ],
    flashcards: [
      { q: "What does the 'continue' keyword do?", a: "Skips the rest of the current loop iteration and moves to the next cycle." },
      { q: "Can float variables be evaluated in a switch condition?", a: "No, only integers and characters are allowed." },
      { q: "What is an exit-controlled loop?", a: "A loop that tests the condition at the end of the block (e.g. do-while)." }
    ]
  },
  {
    id: "ch4",
    title: "Chapter 4: Functions & Recursion",
    description: "Deconstruct programs into modular functions and understand call stack recursion.",
    difficulty: "Medium",
    pyqFrequency: 94,
    importance: "High",
    objectives: [
      "Understand the roles of Function Declaration, Definition, and Call.",
      "Understand how arguments are passed (Value vs Reference).",
      "Trace the stack frame and execution flow of recursive functions.",
      "Formulate base cases to prevent recursion stack overflows."
    ],
    sections: [
      {
        id: "functions-basics",
        title: "4.1 Anatomy of a Function",
        content: `
A **Function** is a self-contained named block of code that executes a specific task. It prevents code repetition.

### Three Pillars of a Function:
1. **Declaration (Prototype)**: Tells the compiler the return type, name, and parameter types before use. E.g., \`int add(int, int);\`.
2. **Definition**: Contains the actual body of the function.
3. **Call**: Invokes the function. E.g., \`add(5, 3);\`.

### Parameters vs Arguments:
- **Parameters (Formal Arguments)**: Variables declared in the function definition (e.g., \`int a\` in \`void printVal(int a)\`).
- **Arguments (Actual Arguments)**: Values sent during the function call (e.g., \`10\` in \`printVal(10)\`).
        `,
        analogy: "A function declaration is like a job listing: it states what is needed (arguments) and what will be returned. A definition is the actual employee performing the job when called!",
        codeSample: `
#include <stdio.h>

// 1. Function Declaration
int square(int num);

int main() {
    // 3. Function Call
    int res = square(5); 
    printf("Square: %d\\n", res);
    return 0;
}

// 2. Function Definition
int square(int num) {
    return num * num;
}
        `,
        mistakes: [
          "Calling a function before declaring it when its definition is below main(). The compiler won't recognize the function and will throw an error.",
          "Returning a value from a function whose return type is declared as void."
        ],
        examTip: "Always declare prototypes at the top. Case-I: if definition is before main(), no prototype is needed. Case-II: if definition is after main(), prototype is mandatory.",
        interviewQuestion: {
          q: "What is a function prototype?",
          a: "It is a statement declaring the return type, name, and parameters of a function. It tells the compiler how to structure and type-check function calls."
        }
      },
      {
        id: "arg-passing",
        title: "4.2 Argument Passing: Value vs Reference",
        content: `
C passes parameters in two ways:

1. **Call by Value**: 
   - A copy of the actual argument is sent to the formal parameter.
   - Modifying parameters inside the function **does not** change the original variables in main.
   - Default mechanism in C.

2. **Call by Reference (Simulated via Pointers)**:
   - The memory address of the actual argument is passed.
   - The function dereferences the pointers to work directly with the original variables.
   - Modifying formal parameters **does** change the original variables in main.
        `,
        analogy: "Call by value is like sending someone a photocopy of your homework: they can write notes on it, but your original copy remains unchanged. Call by reference is like giving them the key to your document safe: any changes they make directly alter the original file!",
        codeSample: `
#include <stdio.h>

// Value vs Reference demo
void modifyValue(int val) {
    val = 100; // Changes copy
}

void modifyReference(int *ptr) {
    *ptr = 100; // Changes original variable value at address ptr
}

int main() {
    int x = 5, y = 5;
    modifyValue(x);
    modifyReference(&y);
    printf("x = %d, y = %d\\n", x, y); // x is 5 (no change), y is 100
    return 0;
}
        `,
        mistakes: [
          "Forgetting to pass the address (&var) in call-by-reference calls.",
          "Forgetting the '*' dereference operator inside the function when editing pointer parameters, resulting in editing the pointer address itself instead of the target value."
        ],
        examTip: "Write a code segment to swap two numbers using Call by Reference. This is one of the most common programming tasks in MAKAUT exams.",
        interviewQuestion: {
          q: "Does C support true call-by-reference?",
          a: "No. C strictly uses Call by Value. Call by reference in C is simulated by passing pointer addresses by value."
        }
      },
      {
        id: "recursion",
        title: "4.3 Recursion",
        content: `
**Recursion** is a programming design where a function calls itself, directly or indirectly, to solve a problem.

### Two Critical Components:
1. **Base Case**: The condition that terminates recursion and returns control. Without a base case, recursion runs infinitely, leading to a **Stack Overflow** (running out of call stack memory).
2. **Recursive Case**: The logic where the function calls itself with a reduced parameter/problem size.
        `,
        analogy: "Recursion is like Russian nesting dolls: you open a big doll to find a smaller one inside. You keep opening them until you reach the smallest solid doll (Base Case), then you stop and close them all back up in reverse order!",
        codeSample: `
#include <stdio.h>

// Factorial of n: n! = n * (n-1)!
int factorial(int n) {
    if (n <= 1) return 1; // Base Case
    return n * factorial(n - 1); // Recursive Case
}

int main() {
    printf("Factorial of 5: %d\\n", factorial(5));
    return 0;
}
        `,
        mistakes: [
          "Forgetting the base case, leading to infinite loop execution and 'Stack Overflow' crash.",
          "Not reducing the parameter size in recursive calls (e.g. calling factorial(n) inside factorial(n))."
        ],
        examTip: "Always trace recursion step-by-step using a Call Stack diagram. Draw a stack frame containing values at each level. Examiners award high marks for stack visualizations.",
        interviewQuestion: {
          q: "What are the limitations of recursion?",
          a: "Recursion consumes significant call-stack memory (pushing frames for every nested call) and is generally slower due to function call overhead. It can lead to Stack Overflow if nesting depth is too large."
        }
      }
    ],
    quizzes: [
      {
        type: "mcq",
        q: "What error occurs if a recursive function does not reach its base case?",
        options: ["Syntax Error", "Stack Overflow", "Division by zero", "Segmentation Leak"],
        answer: 1,
        difficulty: "Easy"
      },
      {
        type: "debug",
        q: "Fix the base case in this factorial code to prevent infinite recursion:\nint fact(int n) {\n    return n * fact(n-1);\n}",
        answer: "int fact(int n) {\n    if (n <= 1) return 1;\n    return n * fact(n-1);\n}",
        difficulty: "Medium"
      }
    ],
    flashcards: [
      { q: "What is formal parameter?", a: "The variable declared in the function's signature." },
      { q: "What is actual parameter?", a: "The value passed to the function in the function call." },
      { q: "What standard library contains functions like exit() or malloc()?", a: "<stdlib.h>" }
    ]
  },
  {
    id: "ch5",
    title: "Chapter 5: Arrays & Strings",
    description: "Explore linear contiguous memory structures, indices, string functions, and multidimensional arrays.",
    difficulty: "Medium",
    pyqFrequency: 96,
    importance: "High",
    objectives: [
      "Declare, initialize, and manipulate 1D and 2D arrays.",
      "Understand contiguous memory alignment and pointer arithmetic.",
      "Differentiate between character arrays and string literals.",
      "Apply standard library functions from string.h."
    ],
    sections: [
      {
        id: "arrays-basics",
        title: "5.1 Introduction to Arrays",
        content: `
An **Array** is a fixed-size, sequenced collection of variables of the **same data type** stored in **contiguous (side-by-side) memory locations**.

### Key Rules:
- Array indexing starts at **0** and ends at \`size - 1\`.
- Elements are stored next to each other. If \`arr[0]\` is at address \`1000\`, and size of integer is 4 bytes, \`arr[1]\` is at \`1004\`, \`arr[2]\` is at \`1008\`, etc.
- An array name behaves like a pointer pointing to the address of the **first element** (\`arr\` is equivalent to \`&arr[0]\`).

### Accessing elements:
You can access array elements using bracket notation:
- Standard: \`a = arr[index];\`
- Pointer Arithmetic: \`a = *(arr + index);\`
- Lesser Known Fact: \`a = index[arr];\` also works! Since compiler evaluates both \`arr[index]\` and \`index[arr]\` to \`*(arr + index)\`.
        `,
        analogy: "An array is like a hotel corridor. Rooms are ordered sequentially (0, 1, 2...). Rooms are all the same size and contain the same class of furniture (data type). Room index tells you exactly how many steps to walk from the lobby to reach it!",
        codeSample: `
#include <stdio.h>

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    
    // Accessing using pointers
    printf("Value at index 2: %d\\n", *(arr + 2)); 
    
    // Accessing using lesser-known index[arr] notation
    printf("Value at index 2: %d\\n", 2[arr]); 
    return 0;
}
        `,
        mistakes: [
          "Out of Bounds Error: Accessing an index outside the declared size (e.g. accessing arr[5] in an array of size 5, which only has indexes 0 to 4). This accesses raw garbage data or causes program crashes.",
          "Trying to copy an array via simple assignment (e.g. arr2 = arr1;). You must copy arrays element-by-element using loops."
        ],
        examTip: "Be prepared for array memory location calculations. Formula: Address of \`arr[i] = Base Address + i * size_of_data_type\`.",
        interviewQuestion: {
          q: "Why is array index 0-based in C?",
          a: "Because the index represents the memory offset (distance) from the starting address. The first element is at distance '0' from the base address, so it is arr[0]."
        }
      },
      {
        id: "strings-basics",
        title: "5.2 Strings & Input/Output Scan Patterns",
        content: `
In C, a **String** is a character array terminated by a special null character (\`\\0\`).
- A string literal is wrapped in double quotes: \`"Hello"\`. It automatically appends \`\\0\` at the end (occupying 6 bytes).
- A char literal is in single quotes: \`'a'\` (occupies 1 byte).

### Special Input Methods:
* \`scanf(\"%s\", str)\`: Stops reading at the first whitespace character (space, tab, newline). Cannot read complete sentences.
* **Scanset pattern (\`%[^\\n]\`)**: Tells \`scanf\` to read characters until a newline is hit. E.g., \`scanf(\"%[^\\n]\", str);\`.
* **Scanset filters**: 
  - \`scanf(\"%[A-Za-z]\", str)\` reads only alphabets.
  - \`scanf(\"%[^,.]\", str)\` reads until a comma or period is encountered.
* \`fgets(str, size, stdin)\`: Reads a complete line including whitespaces safely. Prevents buffer overflows.
        `,
        analogy: "A C string is like a train where passengers are letters. The null terminator \`\\0\` is the red caboose at the very end. The station Master (compiler) looks for this caboose to know where the train ends!",
        codeSample: `
#include <stdio.h>

int main() {
    char name[100];
    printf("Enter your full name: ");
    
    // Reads spaces until enter is pressed
    scanf("%[^\\n]", name); 
    
    printf("Hello, %s!\\n", name);
    return 0;
}
        `,
        mistakes: [
          "Not declaring enough array size to hold the null terminator. A string of length 5 needs an array of size at least 6.",
          "Using scanf(\"%s\", &str) instead of scanf(\"%s\", str). Since string names are already pointer addresses, the '&' is unnecessary."
        ],
        examTip: "Scanset pattern details frequently appear in MAKAUT output analysis questions. Remember that %[^\n] reads everything until enter is pressed.",
        interviewQuestion: {
          q: "What is the difference between char str[] = \"Hello\" and char *str = \"Hello\"?",
          a: "char str[] = \"Hello\" creates a modifiable character array on the stack. char *str = \"Hello\" creates a pointer to a read-only string literal located in the read-only data segment. Modifying *str will crash the program."
        }
      },
      {
        id: "string-functions",
        title: "5.3 String Library Functions",
        content: `
The standard header \`<string.h>\` provides core utility functions for string operations:

1. **\`strlen(str)\`**: Returns string length (excluding \`\\0\`).
2. **\`strcpy(dest, src)\`**: Copies the source string into the destination array.
3. **\`strcat(dest, src)\`**: Concatenates (appends) source string to the end of destination string.
4. **\`strcmp(str1, str2)\`**: Lexicographically compares two strings. Returns:
   - \`0\` if they are identical.
   - Positive ASCII difference of first differing character if \`str1 > str2\`.
   - Negative ASCII difference if \`str1 < str2\`.
        `,
        analogy: "strcpy is copy-paste. strcat is appending files together. strcmp is sorting names alphabetically in a phone book.",
        codeSample: `
#include <stdio.h>
#include <string.h>

int main() {
    char s1[20] = "abc";
    char s2[20] = "abd";
    
    int diff = strcmp(s1, s2); // compares 'c' (99) and 'd' (100)
    printf("strcmp difference: %d\\n", diff); // prints -1
    return 0;
}
        `,
        mistakes: [
          "Assuming strcmp returns 1 if strings are equal. It returns 0 when they match!",
          "Using strcpy on a destination array that is too small to hold the source string, corrupting adjacent stack memory."
        ],
        examTip: "Always mention string.h header when using strcmp/strlen in program writing tasks, otherwise the examiner will deduct marks.",
        interviewQuestion: {
          q: "How does strcmp calculate differences?",
          a: "It compares characters index by index. At the first mismatch, it subtracts the ASCII value of the mismatching char in str2 from that in str1 and returns the difference."
        }
      }
    ],
    quizzes: [
      {
        type: "mcq",
        q: "If int arr[5]; is declared at address 2000, what is the address of arr[3]? (Assume 4-byte integers)",
        options: ["2003", "2006", "2012", "2016"],
        answer: 2,
        difficulty: "Medium"
      },
      {
        type: "mcq",
        q: "What does strcmp('cat', 'car') return?",
        options: ["0", "2", "Positive value", "Negative value"],
        answer: 3,
        difficulty: "Medium"
      },
      {
        type: "fill",
        q: "The standard C string must end with the ________ character.",
        answer: "\\0",
        difficulty: "Easy"
      }
    ],
    flashcards: [
      { q: "What does strlen do?", a: "Returns the length of string excluding the null character." },
      { q: "What is the equivalent pointer notation for arr[i]?", a: "*(arr + i)" },
      { q: "Which scanf format reads a line containing spaces?", a: "%[^\\n]" }
    ]
  },
  {
    id: "ch6",
    title: "Chapter 6: Pointers & Dynamic Memory",
    description: "Demystify pointers, addresses, dereferencing, and memory allocations in heap workspace.",
    difficulty: "Hard",
    pyqFrequency: 98,
    importance: "High",
    objectives: [
      "Understand the roles of pointers, addresses, and dereferencing.",
      "Manipulate variables using pointers and pointer arithmetic.",
      "Use malloc, calloc, realloc, and free for Heap allocations.",
      "Prevent memory leaks, dangling pointers, and NULL dereferencing."
    ],
    sections: [
      {
        id: "pointers-basics",
        title: "6.1 Pointers Concept & Syntax",
        content: `
A **Pointer** is a variable that stores the memory address of another variable, rather than storing a value directly.

### Syntax:
- **Declaration**: \`data_type *ptr_name;\` (The \`*\` indicates this variable is a pointer).
- **Address-of Operator (\`&\`)**: Fetches the memory address of a variable. \`ptr = &var;\` stores var's address in ptr.
- **Dereference Operator (\`*\`)**: Fetches the value stored at the address pointed to by the pointer. \`a = *ptr;\` copies the value at address ptr into a.

### Common Pointer Anomalies:
* **Void Pointer (\`void *ptr\`)**: A generic pointer that can store any address type. Cannot be dereferenced directly without explicit typecasting.
* **Null Pointer**: Points to address \`0\` or \`NULL\`. Used to represent empty/unassigned pointers.
* **Dangling Pointer**: A pointer pointing to a memory address that has already been deallocated (freed).
* **Wild Pointer**: An uninitialized pointer pointing to a random garbage memory address. Dangerous to dereference!
        `,
        analogy: "A variable is like a house containing guests (values). A pointer is an envelope containing the street address of that house. Dereferencing is like driving to that address and ringing the doorbell to see who is inside!",
        codeSample: `
#include <stdio.h>

int main() {
    int x = 42;
    int *ptr = &x; // ptr stores address of x
    
    printf("Address of x: %p\\n", (void*)&x);
    printf("Value stored in ptr: %p\\n", (void*)ptr);
    printf("Dereferenced value: %d\\n", *ptr); // Prints 42
    
    *ptr = 100; // Directly changes x
    printf("New value of x: %d\\n", x); // Prints 100
    return 0;
}
        `,
        mistakes: [
          "Dereferencing a wild or uninitialized pointer. E.g. 'int *p; *p = 5;'. This can corrupt system memory and crash the application.",
          "Mixing data types: assigning a float variable's address to an integer pointer (e.g. int *ptr = &floatVar;)."
        ],
        examTip: "Always identify pointer target values in code trace questions. Draw boxes with memory values and arrows showing pointer relationships.",
        interviewQuestion: {
          q: "What is a dangling pointer and how do we prevent it?",
          a: "A dangling pointer points to a memory address that has been freed. Prevent it by setting the pointer to NULL immediately after freeing it: 'free(ptr); ptr = NULL;'."
        }
      },
      {
        id: "dma-heap",
        title: "6.2 Dynamic Memory Allocation (DMA)",
        content: `
Dynamic Memory Allocation requests memory from the **Heap** region at runtime, instead of deciding memory allocations at compile-time on the stack.

### The Four Key Functions (in \`<stdlib.h>\`):
1. **\`malloc(size_t size)\`**:
   - Allocates a contiguous block of specified size in bytes.
   - Returns a generic pointer (\`void*\`) pointing to the block.
   - Contains garbage values initially. Returns \`NULL\` if allocation fails.
   - Modern C does **not** require explicit casting: \`int *p = malloc(sizeof(int));\`.

2. **\`calloc(size_t num, size_t size)\`**:
   - Allocates memory for an array of elements.
   - Takes 2 arguments: number of items and size of each.
   - **Initializes all allocated bytes to zero**.

3. **\`realloc(void *ptr, size_t new_size)\`**:
   - Resizes a previously allocated heap block.
   - If pointer is \`NULL\`, behaves exactly like \`malloc\`.

4. **\`free(void *ptr)\`**:
   - Releases allocated memory back to the system.
   - Failing to call \`free()\` results in a **Memory Leak** (wasting system RAM until process ends).
        `,
        analogy: "Stack memory is like renting a pre-set conference room (static arrays). Heap memory is like calling room service to request extra tables on demand (DMA). If you don't return the tables when done (free), the hotel runs out of tables (Memory Leak)!",
        codeSample: `
#include <stdio.h>
#include <stdlib.h> // Required for malloc/free

int main() {
    int *arr = malloc(5 * sizeof(int)); // Allocates array of 5 integers
    if (arr == NULL) {
        printf("Allocation failed!\\n");
        return 1;
    }
    
    for (int i = 0; i < 5; i++) {
        arr[i] = i * 10;
    }
    
    free(arr); // Deallocate block
    arr = NULL; // Prevent dangling pointer
    return 0;
}
        `,
        mistakes: [
          "Not checking if malloc returns NULL before using the pointer.",
          "Memory leak: repeatedly allocating memory in a loop without calling free.",
          "Double free: calling free(ptr) twice on the same address without reallocating it."
        ],
        examTip: "Write the comparison table between malloc() and calloc() in your exam sheet. Focus on parameters (1 vs 2) and initialization values (garbage vs zero).",
        interviewQuestion: {
          q: "What happens if you don't free dynamically allocated memory in C?",
          a: "It leads to a memory leak. The memory remains occupied and unusable by the operating system or other processes. The memory is only reclaimed when the program terminates."
        }
      }
    ],
    quizzes: [
      {
        type: "mcq",
        q: "Which function allocates memory and initializes it to zero?",
        options: ["malloc", "calloc", "realloc", "free"],
        answer: 1,
        difficulty: "Easy"
      },
      {
        type: "mcq",
        q: "What is stored in a pointer variable?",
        options: ["Integer value", "Memory address", "Floating point value", "Character constant"],
        answer: 1,
        difficulty: "Easy"
      },
      {
        type: "fill",
        q: "A pointer that points to a memory address that has been deallocated is called a ________ pointer.",
        answer: "dangling",
        difficulty: "Medium"
      }
    ],
    flashcards: [
      { q: "What header defines malloc, calloc, and free?", a: "<stdlib.h>" },
      { q: "How do you declare a pointer to a pointer?", a: "int **ptr;" },
      { q: "What does malloc return if the system runs out of memory?", a: "NULL" }
    ]
  },
  {
    id: "ch7",
    title: "Chapter 7: User Defined Datatypes",
    description: "Group heterogeneous variables together using Structures, Unions, Enums, and Typedefs.",
    difficulty: "Medium",
    pyqFrequency: 89,
    importance: "Medium",
    objectives: [
      "Define and instantiate structures to hold heterogeneous variables.",
      "Access members using the dot (.) and arrow (->) operators.",
      "Differentiate structures from unions based on memory alignment.",
      "Create custom datatypes using enum and typedef alias mappings."
    ],
    sections: [
      {
        id: "structures-basics",
        title: "7.1 Structures & Member Access",
        content: `
A **Structure** is a user-defined datatype that groups variables of **different datatypes** under a single name.

### Declaration Syntax:
\`\`\`c
struct Student {
    char name[50];
    int roll;
    float marks;
};
\`\`\`

### Instantiation and Member Access:
You can declare variables and access their members:
- On regular structure variables, use the dot (\`.\`) operator: \`s1.roll = 101;\`
- On pointer-to-structure variables, use the arrow (\`->\`) operator: \`ptr->roll = 101;\` (which is equivalent to \`(*ptr).roll = 101;\`).

*Note: You cannot initialize variables directly inside the struct template declaration.*
        `,
        analogy: "A structure is like a passport profile. It holds different fields: name (string), passport number (int), weight (float). They are all bound together under a single passport holder's name!",
        codeSample: `
#include <stdio.h>

struct Student {
    int roll;
    float marks;
};

int main() {
    struct Student s1 = {101, 88.5};
    struct Student *ptr = &s1;
    
    // Access using dot operator
    printf("Roll: %d\\n", s1.roll);
    
    // Access using arrow operator
    printf("Marks: %2.1f\\n", ptr->marks);
    return 0;
}
        `,
        mistakes: [
          "Forgetting the semicolon at the end of the structure definition template. This is a syntax error: 'struct Book { ... } ;' is mandatory.",
          "Using the dot operator on a structure pointer (e.g. ptr.roll instead of ptr->roll)."
        ],
        examTip: "Always use -> operator for pointers to structs in code writing. Show structure initialization options (e.g., struct Student s1 = {101, 85.5};) to impress examiners.",
        interviewQuestion: {
          q: "What is the difference between struct Student s1; and struct Student *ptr = &s1;?",
          a: "s1 allocates stack memory for the actual structure fields (members). ptr is a pointer variable that stores the memory address of s1, occupying 4 or 8 bytes of space depending on architecture."
        }
      },
      {
        id: "unions-enums",
        title: "7.2 Unions, Enums, and Typedef",
        content: `
### 1. Unions:
A **Union** is similar to a structure, but **all members share the same memory location**.
- The size of a union is equal to the size of its **largest member**.
- Only one member can hold a value at any given time. Editing one member overwrites the others.
- Highly memory-efficient.

### 2. Enumeration (\`enum\`):
Enums assign human-readable names to integer constants.
- Default starts at \`0\` and increments by \`1\`: \`enum State { OFF, ON };\` makes \`OFF = 0, ON = 1\`.
- You can override defaults: \`enum Status { SUCCESS = 1, FAILURE = 0, PENDING = 2 };\`.

### 3. Typedef alias:
\`typedef\` creates a custom shortcut name for an existing datatype:
- E.g., \`typedef unsigned long int ULI;\`
- Allows you to write \`ULI x;\` instead of the long type name. Excellent for simplifying struct declarations: \`typedef struct Student Student;\`.
        `,
        analogy: "A structure is like a desk with separate drawers for each item (usable together). A union is like a single lockbox: you can put a passport OR a laptop inside, but you can't fit both at the same time!",
        codeSample: `
#include <stdio.h>

union Data {
    int i;
    float f;
};

typedef struct {
    int id;
} Item; // No need to write 'struct' anymore!

int main() {
    union Data u;
    u.i = 10;
    // Changing float overwrites the integer!
    u.f = 220.5; 
    
    Item t = {5}; // Using typedef alias
    printf("Item ID: %d\\n", t.id);
    return 0;
}
        `,
        mistakes: [
          "Trying to use multiple fields of a Union simultaneously, resulting in data corruption.",
          "Assuming enum values are string names. Enums are strictly integer constants under the hood."
        ],
        examTip: "State the differences between structures and unions in a tabular format. Standard table: Memory location (separate vs shared), size (sum of sizes vs max size), usability (all at once vs one at a time).",
        interviewQuestion: {
          q: "How does the compiler size a Union?",
          a: "The size of a Union is equal to the size of its largest member, padded to align with the word size requirements of the compiler."
        }
      }
    ],
    quizzes: [
      {
        type: "mcq",
        q: "If struct Demo { char c; int i; } has size 8 (due to padding) and union DemoUnion { char c; int i; } is declared, what is the size of DemoUnion?",
        options: ["1 Byte", "4 Bytes", "5 Bytes", "8 Bytes"],
        answer: 1,
        difficulty: "Medium"
      },
      {
        type: "fill",
        q: "To create an alias name for a structure, the ________ keyword is used.",
        answer: "typedef",
        difficulty: "Easy"
      }
    ],
    flashcards: [
      { q: "What operator is used to access structure members using a structure pointer?", a: "The arrow operator (->)" },
      { q: "Do all members of a union have separate memory addresses?", a: "No, they all share the exact same starting address." },
      { q: "What is the default value of the second element in an enum if the first is set to 5?", a: "6" }
    ]
  },
  {
    id: "ch8",
    title: "Chapter 8: File Handling",
    description: "Store program data permanently using files, reading, writing, and random traversal.",
    difficulty: "Medium",
    pyqFrequency: 85,
    importance: "Medium",
    objectives: [
      "Declare and manage file streams using FILE pointers.",
      "Open and close files in text and binary modes using fopen/fclose.",
      "Perform read/write operations using fgetc, fgets, and fprintf.",
      "Move file position indicators using fseek, ftell, and rewind."
    ],
    sections: [
      {
        id: "file-ops",
        title: "8.1 File Pointers & Read/Write Operations",
        content: `
File handling enables persistent storage on hard disks, avoiding loss of data when the program terminates.

### File Pointer:
A pointer to a \`FILE\` struct template defined in \`<stdio.h>\`: \`FILE *fp;\`.

### File Operations:
1. **Opening**: \`fp = fopen(\"filename\", \"mode\");\`
   - Modes:
     - \`\"r\"\` : Open for reading (file must exist).
     - \`\"w\"\` : Open for writing (creates new or overwrites existing).
     - \`\"a\"\` : Open for appending at the end (creates or writes).
     - \`\"r+\"\`, \`\"w+\"\`, \`\"a+\"\` : Read + write modes.
     - Binary modes: append a 'b' (e.g., \`\"rb\"\`, \`\"wb\"\`).
2. **Closing**: \`fclose(fp);\` (flushes buffers and saves file).

### Reading & Writing:
- **Character**: \`fgetc(fp)\` (returns EOF when file ends) and \`fputc(char, fp)\`.
- **String**: \`fgets(str, size, fp)\` and \`fputs(str, fp)\`.
- **Formatted**: \`fscanf(fp, ...)\` and \`fprintf(fp, ...)\`.
        `,
        analogy: "Opening a file is like checking out a library book: you need a card (file pointer) and must specify if you want to read (r) or write (w). You must return the book (fclose) when finished so changes are saved!",
        codeSample: `
#include <stdio.h>

int main() {
    FILE *fp = fopen("output.txt", "w");
    if (fp == NULL) {
        printf("Error opening file!\\n");
        return 1;
    }
    
    fprintf(fp, "Welcome to C Master MAKAUT!\\n");
    fclose(fp); // File saved to disk
    return 0;
}
        `,
        mistakes: [
          "Forgetting to check if the file pointer returned by fopen is NULL before doing read/write operations.",
          "Forgetting to call fclose(), which can lead to data loss due to unflushed output buffers."
        ],
        examTip: "Always write 'if (fp == NULL)' error checks. MAKAUT grading sheets allocate marks for robust error checking in file codes.",
        interviewQuestion: {
          q: "What does EOF stand for and what is its standard value?",
          a: "EOF stands for End of File. It is a macro constant defined in stdio.h, internally mapped to -1, which signals that the end of file stream has been reached."
        }
      },
      {
        id: "file-traversal",
        title: "8.2 File Traversal & Cursor Control",
        content: `
When you read or write files, the operating system slides a **file position indicator** (cursor) forward.

### Cursor Commands:
1. **\`ftell(fp)\`**: Returns the current byte offset (position) of the cursor. Returns \`-1L\` if an error is encountered.
2. **\`fseek(fp, offset, whence)\`**: Moves the cursor to a specific byte location.
   - \`offset\`: Number of bytes to move (positive or negative).
   - \`whence\`: Starting point indicator:
     - \`SEEK_SET\` : Move relative to the beginning of the file.
     - \`SEEK_CUR\` : Move relative to current cursor location.
     - \`SEEK_END\` : Move relative to the end of the file.
3. **\`rewind(fp)\`**: Instantly moves the cursor back to the beginning of the file (equivalent to \`fseek(fp, 0L, SEEK_SET)\`).
        `,
        analogy: "File cursor control is like skipping scenes in a movie tape: ftell tells you the current timestamp, fseek lets you skip forward/backward relative to start, end, or current scene, and rewind rewinds the tape to the beginning!",
        codeSample: `
#include <stdio.h>

int main() {
    FILE *fp = fopen("data.txt", "w+");
    fputs("ABCDE", fp);
    
    // Move cursor to 2nd byte relative to start
    fseek(fp, 2, SEEK_SET); 
    
    int ch = fgetc(fp); // Reads character at position 2
    printf("Char: %c\\n", ch); // Prints 'C' (offset: 0->A, 1->B, 2->C)
    
    fclose(fp);
    return 0;
}
        `,
        mistakes: [
          "Passing positive offsets with SEEK_END or negative offsets with SEEK_SET, which pushes the cursor out of file limits."
        ],
        examTip: "Define SEEK_SET, SEEK_CUR, and SEEK_END with constants. Write the equivalent code of rewind(fp) using fseek().",
        interviewQuestion: {
          q: "What is the difference between text and binary mode in file opening?",
          a: "In text mode, system-specific character conversions take place (like translating '\\n' to carriage return '\\r\\n' on Windows). In binary mode, bytes are read and written exactly as they are without any modifications."
        }
      }
    ],
    quizzes: [
      {
        type: "mcq",
        q: "Which function resets the file position indicator to the beginning of the file?",
        options: ["fseek", "ftell", "rewind", "fclose"],
        answer: 2,
        difficulty: "Easy"
      },
      {
        type: "fill",
        q: "To open a file for reading in binary format, the mode string must be ________.",
        answer: "rb",
        difficulty: "Medium"
      }
    ],
    flashcards: [
      { q: "What does ftell return on success?", a: "The current byte position offset of the file indicator." },
      { q: "What are the three values of whence in fseek?", a: "SEEK_SET, SEEK_CUR, SEEK_END" },
      { q: "What does fclose do?", a: "Saves remaining buffers, closes the stream connection, and releases system resource locks." }
    ]
  },
  {
    id: "ch9",
    title: "Chapter 9: Advanced Concepts",
    description: "Understand Preprocessors, Storage Classes, Scope, Lifetime, and Command Line Arguments.",
    difficulty: "Hard",
    pyqFrequency: 84,
    importance: "Medium",
    objectives: [
      "Distinguish between preprocessor commands and runtime code.",
      "Analyze the scope, lifetime, and default storage values of variables.",
      "Understand the mechanics of auto, register, static, and extern storage classes.",
      "Read values passed into main via Command Line Arguments."
    ],
    sections: [
      {
        id: "storage-classes",
        title: "9.1 Storage Classes",
        content: `
A variable's **Storage Class** determines its **Scope** (where it can be accessed) and **Lifetime** (how long it stays in memory).

There are four storage classes in C:
1. **auto**:
   - Default for local variables inside a block.
   - Stored in stack memory. Contains garbage value initially.
   - Lifetime: limited to the block execution.
2. **register**:
   - Requests compiler to store variable in CPU register (instead of RAM) for super-fast access.
   - Fallback is auto. **Cannot take address-of (&) of a register variable**.
3. **static**:
   - Retains its value between function calls.
   - Initialized **only once** at compilation (default value is \`0\`).
   - Lifetime: Spans the entire program execution, but scope remains local to the block.
4. **extern**:
   - Used to declare a variable that is defined in another source file.
   - Scope is global. Lifetime spans the entire program.
        `,
        analogy: "auto variable is like a whiteboard in a temporary meeting room: cleaned when meeting ends. static variable is like a scoreboard: it remembers the points from the previous match even if the players leave!",
        codeSample: `
#include <stdio.h>

void counter() {
    static int count = 0; // Initialized once
    count++;
    printf("%d ", count);
}

int main() {
    counter(); // Prints 1
    counter(); // Prints 2
    counter(); // Prints 3
    return 0;
}
        `,
        mistakes: [
          "Trying to fetch the address (&var) of a register variable. CPU registers do not have RAM addresses.",
          "Assuming static variables are reset every time the function is called. They retain their old values!"
        ],
        examTip: "MAKAUT exams regularly feature code traces containing static counters. Trace them carefully: local changes persist across calls!",
        interviewQuestion: {
          q: "What is the difference between static and global variables?",
          a: "Both retain values throughout the program. However, a global variable is accessible by any function in the file (or external files), while a static variable inside a function is only accessible within that specific function block."
        }
      },
      {
        id: "preprocessor-args",
        title: "9.2 Preprocessors & Command Line Arguments",
        content: `
### 1. Preprocessor Directives:
Lines beginning with \`#\` are instructions processed before compilation starts.
- **\`#define PI 3.14\`**: Creates a macro. The preprocessor copy-pastes \`3.14\` wherever it sees \`PI\` in the code.
- **\`#include <stdio.h>\`**: Imports library files.
- **Conditional Compilation (\`#ifdef\`, \`#ifndef\`, \`#endif\`)**: Compiles specific blocks of code depending on definitions.

### 2. Command Line Arguments:
You can pass parameters to the main function when running the program from the terminal.
\`\`\`c
int main(int argc, char *argv[])
\`\`\`
- **\`argc\`** (Argument Count): Number of arguments passed (including the program executable name itself).
- **\`argv\`** (Argument Vector): An array of strings representing the inputs. \`argv[0]\` is always the program path.
        `,
        analogy: "Preprocessors are like find-and-replace text editors: they swap codes before the compiler runs. Command line arguments are like inputting values before entering a theatre, setting parameters for the show!",
        codeSample: `
#include <stdio.h>

#define LIMIT 5 // Macro definition

int main(int argc, char *argv[]) {
    printf("Total arguments: %d\\n", argc);
    printf("Executable name: %s\\n", argv[0]);
    printf("Macro limit: %d\\n", LIMIT);
    return 0;
}
        `,
        mistakes: [
          "Putting a semicolon at the end of a macro definition, e.g., '#define PI 3.14;'. This will insert the semicolon inside your mathematical equations, causing syntax errors.",
          "Assuming argv[1] contains the program name. argv[0] contains the program name, while argv[1] is the first actual parameter."
        ],
        examTip: "Demonstrate write-up of command-line parser and explain argc/argv parameters with examples.",
        interviewQuestion: {
          q: "What is the difference between a macro definition (#define) and a constant variable (const int)?",
          a: "Macros are processed before compilation and do not occupy memory blocks or have data types. Constant variables are compiled variables, reside in memory, are strictly type-checked, and have addresses."
        }
      }
    ],
    quizzes: [
      {
        type: "mcq",
        q: "What is the default initial value of a static variable in C?",
        options: ["Garbage", "0", "1", "NULL"],
        answer: 1,
        difficulty: "Easy"
      },
      {
        type: "mcq",
        q: "Which storage class variable cannot be accessed with the '&' (address-of) operator?",
        options: ["auto", "register", "static", "extern"],
        answer: 1,
        difficulty: "Medium"
      },
      {
        type: "fill",
        q: "In main(int argc, char *argv[]), the parameter argv[0] represents the name of the ________.",
        answer: "program",
        difficulty: "Easy"
      }
    ],
    flashcards: [
      { q: "What does the preprocessor do?", a: "Performs text replacement and file inclusion before compilation begins." },
      { q: "What is the scope of an auto variable?", a: "Local to the block where it is declared." },
      { q: "What does argc represent in command line arguments?", a: "The number of arguments passed to the program." }
    ]
  }
];
