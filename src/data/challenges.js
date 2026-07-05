// Scaffolding for C Programming coding challenges
// Includes starter templates, instructions, test cases, and solutions

export const challenges = [
  {
    id: "challenge1",
    title: "Pointer Swap",
    description: "Write a function 'swap' that swaps the values of two integers using their pointers (Call by Reference).",
    difficulty: "Easy",
    points: 50,
    starterCode: `// Write a C program to swap two numbers using pointers
#include <stdio.h>

void swap(int *a, int *b) {
    // Write your code here
    
}

int main() {
    int x = 10, y = 20;
    printf("Before: x = %d, y = %d\\n", x, y);
    swap(&x, &y);
    printf("After: x = %d, y = %d\\n", x, y);
    return 0;
}
    `,
    testCases: [
      { input: "10 20", expected: "After: x = 20, y = 10" },
      { input: "-5 99", expected: "After: x = 99, y = -5" }
    ],
    hints: [
      "Use a temporary local integer variable to hold the value of one pointer.",
      "Assign the dereferenced value of the second pointer to the first pointer: *a = *b.",
      "Assign the temporary value back to the second dereferenced pointer."
    ],
    solution: `void swap(int *a, int *b) {
    int temp = *a;
    *a = *b;
    *b = temp;
}`
  },
  {
    id: "challenge2",
    title: "Array Reversal",
    description: "Write a function to reverse the elements of a 1D array in-place. Do not use a separate array.",
    difficulty: "Medium",
    points: 100,
    starterCode: `// Reverse array in-place
#include <stdio.h>

void reverseArray(int arr[], int size) {
    // Write your logic here
    
}

int main() {
    int arr[] = {1, 2, 3, 4, 5};
    int size = 5;
    reverseArray(arr, size);
    
    for(int i = 0; i < size; i++) {
        printf("%d ", arr[i]);
    }
    return 0;
}
    `,
    testCases: [
      { input: "[1, 2, 3, 4, 5]", expected: "5 4 3 2 1" },
      { input: "[10, 20]", expected: "20 10" }
    ],
    hints: [
      "Use two indices: 'start' at 0 and 'end' at size - 1.",
      "Swap elements at arr[start] and arr[end].",
      "Increment start, decrement end, and repeat until start >= end."
    ],
    solution: `void reverseArray(int arr[], int size) {
    int start = 0;
    int end = size - 1;
    while(start < end) {
        int temp = arr[start];
        arr[start] = arr[end];
        arr[end] = temp;
        start++;
        end--;
    }
}`
  },
  {
    id: "challenge3",
    title: "Recursive Power",
    description: "Write a recursive function 'power(base, exp)' to calculate base raised to power exponent (base^exp).",
    difficulty: "Medium",
    points: 100,
    starterCode: `// Recursive base^exp
#include <stdio.h>

int power(int base, int exp) {
    // Write your recursive logic here
    
}

int main() {
    printf("2^5 = %d\\n", power(2, 5));
    return 0;
}
    `,
    testCases: [
      { input: "2 5", expected: "2^5 = 32" },
      { input: "5 3", expected: "5^3 = 125" }
    ],
    hints: [
      "Base Case: If exponent is 0, return 1.",
      "Recursive Step: return base * power(base, exp - 1)."
    ],
    solution: `int power(int base, int exp) {
    if (exp == 0) return 1;
    return base * power(base, exp - 1);
}`
  }
];
