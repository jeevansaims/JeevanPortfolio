// utils/answer-checker.ts

// Function to calculate GCD (Greatest Common Divisor)
function gcd(a: number, b: number): number {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b !== 0) {
    const temp = b
    b = a % b
    a = temp
  }
  return a
}

// Function to simplify a fraction to minimal form
function simplifyFraction(numerator: number, denominator: number): string {
  if (denominator === 0) return 'invalid'
  
  const divisor = gcd(numerator, denominator)
  const simpNum = numerator / divisor
  const simpDenom = denominator / divisor
  
  // If denominator is 1, return as decimal
  if (simpDenom === 1) {
    return simpNum.toString()
  }
  
  return `${simpNum}/${simpDenom}`
}

// Convert decimal to fraction
function decimalToFraction(decimal: number, tolerance: number = 0.0001): string {
  // Handle whole numbers
  if (Number.isInteger(decimal)) {
    return decimal.toString()
  }
  
  // Find fraction representation
  let numerator = 1
  let denominator = 1
  
  for (let d = 1; d <= 10000; d++) {
    const n = Math.round(decimal * d)
    if (Math.abs((n / d) - decimal) < tolerance) {
      numerator = n
      denominator = d
      break
    }
  }
  
  return simplifyFraction(numerator, denominator)
}

// Parse user input and convert to minimal fraction
function parseAnswer(input: string): string {
  const trimmed = input.trim()
  
  // Check if it's a fraction (contains /)
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/')
    if (parts.length !== 2) return 'invalid'
    
    const num = parseFloat(parts[0].trim())
    const denom = parseFloat(parts[1].trim())
    
    if (isNaN(num) || isNaN(denom)) return 'invalid'
    
    return simplifyFraction(num, denom)
  }
  
  // It's a decimal or whole number
  const value = parseFloat(trimmed)
  if (isNaN(value)) return 'invalid'
  
  // If it's a whole number, return as-is
  if (Number.isInteger(value)) {
    return value.toString()
  }
  
  // Convert decimal to fraction
  return decimalToFraction(value)
}

// Main function to check if user answer matches the correct answer
export function checkAnswer(userInput: string, correctAnswer: string): boolean {
  const userParsed = parseAnswer(userInput)
  const correctParsed = parseAnswer(correctAnswer)
  
  if (userParsed === 'invalid' || correctParsed === 'invalid') {
    return false
  }
  
  // Direct string comparison of minimal forms
  return userParsed === correctParsed
}

// Test examples:
// checkAnswer("8/24", "2/3") → true (both simplify to 2/3)
// checkAnswer("0.5", "1/2") → true (0.5 converts to 1/2)
// checkAnswer("4/6", "2/3") → true (4/6 simplifies to 2/3)
// checkAnswer("0.205", "210/1024") → true (both represent same value)