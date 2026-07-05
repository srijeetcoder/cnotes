// Database of MAKAUT Previous Year Questions (PYQs) for C Programming (CS201 / ESCS201)
// Years covered: 2018 - 2025

export const pyqs = [
  {
    id: "pyq1",
    year: 2024,
    semester: "Semester 2",
    marks: 15,
    topic: "Pointers & DMA",
    difficulty: "Hard",
    question: "Write a C program to allocate memory dynamically for a 2D array of size row x col using malloc(). Then take values from the user, print the array, and free the allocated memory. Detail the memory diagram.",
    syllabusTopic: "Chapter 6: Pointers & Dynamic Memory (DMA Arrays)",
    solution: `
#include <stdio.h>
#include <stdlib.h>

int main() {
    int rows, cols;
    printf("Enter rows and columns: ");
    scanf("%d %d", &rows, &cols);

    // 1. Allocate memory for array of pointers to rows
    int **arr = (int **)malloc(rows * sizeof(int *));
    if (arr == NULL) {
        printf("Memory allocation failed!\\n");
        return 1;
    }

    // 2. Allocate memory for each individual row
    for (int i = 0; i < rows; i++) {
        arr[i] = (int *)malloc(cols * sizeof(int));
        if (arr[i] == NULL) {
            printf("Memory allocation failed at row %d!\\n", i);
            return 1;
        }
    }

    // 3. Take inputs
    printf("Enter elements of the 2D array:\\n");
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            scanf("%d", &arr[i][j]);
        }
    }

    // 4. Print elements
    printf("The 2D Array is:\\n");
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            printf("%d\\t", arr[i][j]);
        }
        printf("\\n");
    }

    // 5. Free each allocated row block
    for (int i = 0; i < rows; i++) {
        free(arr[i]);
    }
    // 6. Free the primary array of pointers
    free(arr);
    arr = NULL;

    return 0;
}
    `,
    logic: "A 2D array is represented as a pointer to pointers (int **). First, we allocate a 1D array of pointers of size 'rows'. Each elements inside this array points to a separate 1D array of integers of size 'cols'. This structures a contiguous list of columns for each row in the heap.",
    commonMistakes: "Students often free the main pointer 'arr' first: 'free(arr)'. If you do that, you lose references to the individual rows ('arr[i]'), making it impossible to free them. This creates a severe memory leak. Always free from inside out (first rows, then main pointer).",
    writingStyle: "In MAKAUT, draw a box diagram showing double pointer ptr pointing to a column list of addresses, where each address block points to horizontal row blocks in RAM. Label stack and heap partitions clearly.",
    alternativeApproach: "You can allocate a single large 1D block: 'int *arr = malloc(rows * cols * sizeof(int))' and access element (i, j) using formula 'arr[i * cols + j]'. This performs a single malloc call instead of 'rows + 1' calls, improving cache efficiency.",
    timeEstimate: "25 minutes",
    probability: "85% (Very High Probability)",
    examinerPitfall: "Examiners look specifically for the NULL checking after malloc and whether the deallocation loop runs in the correct reverse order."
  },
  {
    id: "pyq2",
    year: 2023,
    semester: "Semester 1",
    marks: 5,
    topic: "Variables & Operators",
    difficulty: "Medium",
    question: "Explain the difference between prefix and postfix increment operators in C with a small code segment. Predict output: int x=5; printf('%d %d', ++x, x++);",
    syllabusTopic: "Chapter 2: Operators & Expressions (Increment / Decrement)",
    solution: `
Prefix increment (++x) increments the variable first, then returns the updated value to be evaluated in the expression.
Postfix increment (x++) evaluates the current value in the expression first, and then increments the variable in memory.

Code segment:
int a = 5;
int b = ++a; // a becomes 6, b gets 6.

int c = 5;
int d = c++; // d gets 5, then c becomes 6.

Regarding: printf("%d %d", ++x, x++);
In standard C, parameters inside a function call can be evaluated in an implementation-dependent order (usually right-to-left in GCC/Clang compilers).
If evaluated Right-to-Left:
1. x++ is evaluated: returns 5, then x becomes 6.
2. ++x is evaluated: x becomes 7, returns 7.
3. Output printed is: 7 5.
    `,
    logic: "Function arguments are pushed onto the stack from right to left in standard x86 calling conventions. Therefore, x++ evaluates before ++x in typical printf execution.",
    commonMistakes: "Writing output as '6 5' assuming strictly left-to-right evaluation. Explain that parameter evaluation order is compiler-dependent and outline both scenarios.",
    writingStyle: "Use a small table listing Prefix vs Postfix with columns: Syntax, Operation, Value returned. Then trace the steps of the printf code line-by-line.",
    alternativeApproach: "To ensure predictable behavior across all platforms, separate the increments onto individual lines instead of combining them inside printf arguments: 'x++; printf(\"%d \", x); ++x; printf(\"%d\", x);'.",
    timeEstimate: "10 minutes",
    probability: "75% (Highly repeated topic)",
    examinerPitfall: "Examiners want to see you mention the keyword 'Undefined Behavior' or 'Implementation-Dependent Argument Evaluation'."
  },
  {
    id: "pyq3",
    year: 2022,
    semester: "Semester 2",
    marks: 5,
    topic: "User Defined Datatypes",
    difficulty: "Medium",
    question: "Differentiate between Structure and Union. Find the memory size of:\nstruct A { char c; int i; double d; } and union B { char c; int i; double d; }",
    syllabusTopic: "Chapter 7: User Defined Datatypes (Structure vs Union)",
    solution: `
### Key Differences:
1. Memory allocation: Structure members occupy separate memory addresses. Union members share the same starting address.
2. Total Size: Structure size is at least equal to the sum of members' sizes (plus byte padding). Union size is equal to the size of the largest member.
3. Usability: All structure members can be used simultaneously. Only one union member can be used at any given time.

### Size Calculation:
1. struct A:
   - char c: 1 byte
   - int i: 4 bytes (requires alignment to 4-byte boundary, adding 3 padding bytes)
   - double d: 8 bytes
   - Total struct size = 1 (char) + 3 (padding) + 4 (int) + 8 (double) = 16 bytes.

2. union B:
   - Shared memory. Largest member is double d (8 bytes).
   - Total union size = 8 bytes.
    `,
    logic: "Members in structures are padded to match CPU alignment boundaries (typically 4 or 8 bytes) to optimize access performance, while unions compress everything into the space of the largest member.",
    commonMistakes: "Adding sizes of union elements directly (e.g. 1 + 4 + 8 = 13 bytes). Union is NOT the sum of sizes.",
    writingStyle: "Draw two adjacent memory layout charts: one showing variables stacked on top of each other (Structure), and another showing them overlapping starting at offset 0 (Union).",
    alternativeApproach: "Use compiler directives like '#pragma pack(1)' to enforce packing in structures, which eliminates alignment padding and reduces struct A size to 13 bytes at the cost of execution performance.",
    timeEstimate: "12 minutes",
    probability: "90% (Appears almost every year)",
    examinerPitfall: "Many students forget alignment padding. Stating struct size is 13 bytes instead of 16 will lose 2 marks."
  },
  {
    id: "pyq4",
    year: 2021,
    semester: "Semester 1",
    marks: 10,
    topic: "Recursion",
    difficulty: "Medium",
    question: "Write a recursive function to find the nth Fibonacci number. Draw the recursion tree/call stack when finding fibonacci(4).",
    syllabusTopic: "Chapter 4: Functions & Recursion (Recursive Tracing)",
    solution: `
#include <stdio.h>

int fib(int n) {
    if (n <= 0) return 0; // Base case 1
    if (n == 1) return 1; // Base case 2
    return fib(n - 1) + fib(n - 2); // Recursive step
}

int main() {
    printf("Fibonacci(4) = %d\\n", fib(4));
    return 0;
}
    `,
    logic: "Fibonacci series is defined recursively: F(n) = F(n-1) + F(n-2) for n > 1. The code calls itself twice for each non-base condition until it hits 0 or 1.",
    commonMistakes: "Forgetting the base case for n <= 0, causing negative indices or infinite call stack allocations for negative inputs.",
    writingStyle: "Draw the tree structure. Root is fib(4). Branch left to fib(3) and right to fib(2). Branch fib(3) further into fib(2) and fib(1), and so on. Show values returned at each node.",
    alternativeApproach: "Iterative approach using a simple loop. Time complexity is O(N) instead of O(2^N) for recursive version. Iterative uses O(1) space compared to O(N) recursion stack memory.",
    timeEstimate: "15 minutes",
    probability: "80% (Frequently Asked)",
    examinerPitfall: "Examiners check if you support both base cases (0 and 1) to handle the complete index scale correctly."
  },
  {
    id: "pyq5",
    year: 2020,
    semester: "Semester 2",
    marks: 15,
    topic: "File Handling",
    difficulty: "Hard",
    question: "Write a C program to copy the contents of one text file into another file. Change all lowercase letters to uppercase during copying. Implement fgetc() and fputc().",
    syllabusTopic: "Chapter 8: File Handling (File Operations)",
    solution: `
#include <stdio.h>
#include <ctype.h> // For toupper()

int main() {
    FILE *sourceFile, *destFile;
    char sourcePath[] = "source.txt";
    char destPath[] = "destination.txt";
    int ch;

    // 1. Open source file in read mode
    sourceFile = fopen(sourcePath, "r");
    if (sourceFile == NULL) {
        printf("Error opening source file!\\n");
        return 1;
    }

    // 2. Open destination file in write mode
    destFile = fopen(destPath, "w");
    if (destFile == NULL) {
        printf("Error creating destination file!\\n");
        fclose(sourceFile); // Close source before exiting
        return 1;
    }

    // 3. Read char by char and convert lowercase to uppercase
    while ((ch = fgetc(sourceFile)) != EOF) {
        if (ch >= 'a' && ch <= 'z') {
            ch = ch - 32; // Convert to uppercase (or use toupper)
        }
        fputc(ch, destFile);
    }

    printf("File copy-conversion completed successfully.\\n");

    // 4. Close both files
    fclose(sourceFile);
    fclose(destFile);
    return 0;
}
    `,
    logic: "Using fgetc(), we fetch individual characters from the source. The EOF macro signals end of file. Subtracting 32 from lowercase ASCII shifts the values directly to uppercase equivalent ASCII.",
    commonMistakes: "Using char datatype to store the character returned by fgetc(). fgetc() returns an int to accommodate the -1 value of EOF. Declaring 'char ch' might lead to compilation warnings or file checking loop failures.",
    writingStyle: "Write clean code, highlight standard file pointer declarations, fopen modes, error loops, and explicit fclose operations.",
    alternativeApproach: "Read line by line using fgets() and write using fputs(). This is faster as it reduces file read system calls, although it requires a buffer array.",
    timeEstimate: "20 minutes",
    probability: "70% (Common Practical Exam)",
    examinerPitfall: "Examiners verify if you correctly close the source file pointer if the destination pointer fails to open."
  }
];

// Topic importance ranks based on exam frequencies
export const topicImportance = [
  { name: "Pointers & Dynamic Memory", frequency: "98%", priority: "High", probability: "95%", notes: "Covers pointer arithmetic, call by reference, malloc/calloc 2D matrices, dangling pointers." },
  { name: "Arrays & Strings", frequency: "96%", priority: "High", probability: "92%", notes: "Covers 1D/2D arrays, string.h, %[^\n] scanset, custom string functions, memory calculations." },
  { name: "Functions & Recursion", frequency: "94%", priority: "High", probability: "90%", notes: "Covers prototypes, recursive call stacks, Fibonacci/Factorial trees, parameter passing differences." },
  { name: "Variables & Operators", frequency: "91%", priority: "High", probability: "88%", notes: "Covers prefix/postfix MCQs, operator precedence table, typecasting, bitwise operations." },
  { name: "User Defined Datatypes", frequency: "89%", priority: "Medium", probability: "80%", notes: "Covers Structure vs Union comparisons, struct size calculations (padding), enums, typedef alias." },
  { name: "Control Statements", frequency: "88%", priority: "Medium", probability: "78%", notes: "Covers entry/exit control loop mechanics, switch-case break fall-through rules." },
  { name: "File Handling", frequency: "85%", priority: "Medium", probability: "75%", notes: "Covers fopen modes, cursor control (fseek, SEEK_SET/SEEK_CUR/SEEK_END), copy text codes." },
  { name: "Advanced Concepts", frequency: "84%", priority: "Medium", probability: "72%", notes: "Covers storage class tables (auto/static/extern), preprocessors, command line arguments." }
];

// Examiner tricks database
export const examinerTricks = [
  {
    title: "The Semicolon After Loops Trick",
    description: "Placing a semicolon right after loop statement declarations changes execution.",
    example: "for(int i=0; i<10; i++); { printf('%d', i); }",
    explanation: "The semicolon makes the for loop statement empty. The block after it runs only ONCE after the loop terminates. If 'i' was declared inside the loop, it is out of scope inside the block, causing a compile error! If 'i' was global, it prints 10.",
    pitfallRating: "9/10"
  },
  {
    title: "Union Overwriting Error",
    description: "Using or printing multiple fields of a Union concurrently.",
    example: "union B u; u.i = 10; u.f = 2.5; printf('%d %f', u.i, u.f);",
    explanation: "Because both fields share the exact same starting memory block, setting u.f overwrites the bytes of u.i. u.i will print completely garbled data. Only u.f will print correctly.",
    pitfallRating: "8/10"
  },
  {
    title: "Size of Structure with Alignment Padding",
    description: "Summing sizes of fields to calculate total structure size on paper.",
    example: "struct Data { char a; int b; char c; }",
    explanation: "Students sum: 1 + 4 + 1 = 6 bytes. But the compiler aligns int to 4-byte boundaries. Offset table: char a at 0, 3 padding bytes, int b at 4-7, char c at 8, 3 trailing padding bytes to pad struct to 4-byte multiple. Actual size: 12 bytes!",
    pitfallRating: "9.5/10"
  },
  {
    title: "Macro Replacement Bug",
    description: "Putting semicolons or missing parentheses inside macro definitions.",
    example: "#define SQUARE(x) x * x",
    explanation: "If you call SQUARE(2 + 3), it replaces to: 2 + 3 * 2 + 3. Multiplication precedence makes it 2 + 6 + 3 = 11 instead of 25! To fix, write: #define SQUARE(x) ((x) * (x)).",
    pitfallRating: "8.5/10"
  }
];
