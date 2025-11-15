import { create, all } from 'mathjs'

const math = create(all)

/**
 * Compares two mathematical expressions for equivalence
 * Handles various formats: fractions, exponentials, variables, etc.
 */
export function compareExpressions(userAnswer: string, correctAnswer: string): boolean {
  try {
    // Normalize expressions
    const userNorm = normalizeExpression(userAnswer)
    const correctNorm = normalizeExpression(correctAnswer)

    // Quick check: if normalized strings are identical
    if (userNorm === correctNorm) {
      return true
    }

    // Parse both expressions
    let userExpr = math.parse(userNorm)
    let correctExpr = math.parse(correctNorm)

    // Simplify expressions
    userExpr = math.simplify(userExpr)
    correctExpr = math.simplify(correctExpr)

    // Check if simplified forms are equal
    if (userExpr.toString() === correctExpr.toString()) {
      return true
    }

    // Extract variables from both expressions
    const userVars = extractVariables(userExpr)
    const correctVars = extractVariables(correctExpr)
    const allVars = Array.from(new Set([...userVars, ...correctVars]))

    // If no variables, compare numeric values
    if (allVars.length === 0) {
      try {
        const userValue = userExpr.evaluate()
        const correctValue = correctExpr.evaluate()
        return areNumbersEqual(userValue, correctValue)
      } catch (e) {
        return false
      }
    }

    // For expressions with variables, test at multiple random points
    return testExpressionsAtRandomPoints(userExpr, correctExpr, allVars)
  } catch (error) {
    console.error('Error comparing expressions:', error)
    return false
  }
}

/**
 * Normalizes a mathematical expression to a standard format
 */
function normalizeExpression(expr: string): string {
  let normalized = expr
    .toLowerCase()
    .trim()
    // Remove spaces around operators
    .replace(/\s+/g, '')
    // Convert e^ to exp() - handle both e^(...) and e^x formats
    // This matches: e^(expression), e^-number, e^-variable, e^number, e^variable
    .replace(/e\^(\([^)]+\)|-?[\d.]+|-?[a-z]\w*)/gi, (match, exponent) => {
      // If already has parentheses, use as-is
      if (exponent.startsWith('(')) {
        return `exp${exponent}`
      }
      // Otherwise, wrap in parentheses
      return `exp(${exponent})`
    })
    // Convert S_0 to S0, w_1 to w1, etc.
    .replace(/([a-z])_(\d+)/gi, '$1$2')
    // Handle implicit multiplication: 2x -> 2*x
    .replace(/(\d)([a-z])/gi, '$1*$2')
    // Handle 2(x+1) -> 2*(x+1)
    .replace(/(\d)\(/g, '$1*(')
    // Handle x(2) -> x*(2)
    .replace(/([a-z])\(/gi, '$1*(')
    // Normalize division
    .replace(/\//g, '/')
    // Remove "does not exist" type answers - handle separately
    .replace(/doesnotexist/g, 'DNE')
    .replace(/undefined/g, 'DNE')

  return normalized
}

/**
 * Extracts variable names from an expression
 */
function extractVariables(expr: any): string[] {
  const vars = new Set<string>()

  expr.traverse((node: any) => {
    if (node.isSymbolNode && !isMathConstant(node.name)) {
      vars.add(node.name)
    }
  })

  return Array.from(vars)
}

/**
 * Checks if a name is a math constant (e, pi, i, etc.)
 */
function isMathConstant(name: string): boolean {
  const constants = ['e', 'pi', 'i', 'true', 'false', 'exp', 'ln', 'log', 'sqrt', 'sin', 'cos', 'tan']
  return constants.includes(name.toLowerCase())
}

/**
 * Tests if two expressions are equal at multiple random points
 */
function testExpressionsAtRandomPoints(
  expr1: any,
  expr2: any,
  variables: string[],
  numTests: number = 5
): boolean {
  for (let i = 0; i < numTests; i++) {
    const scope: Record<string, number> = {}

    // Generate random values for each variable
    for (const varName of variables) {
      // Use different ranges for different variable types
      if (varName.match(/^[ST]0?$/i)) {
        // Stock prices: 50-150
        scope[varName] = 50 + Math.random() * 100
      } else if (varName.match(/^K$/i)) {
        // Strike: 50-150
        scope[varName] = 50 + Math.random() * 100
      } else if (varName.match(/^[rt]$/i)) {
        // Interest rate, time: 0.01-0.5
        scope[varName] = 0.01 + Math.random() * 0.49
      } else if (varName.match(/sigma/i)) {
        // Volatility: 0.1-0.5
        scope[varName] = 0.1 + Math.random() * 0.4
      } else if (varName.match(/lambda/i)) {
        // Lambda: -5 to 5
        scope[varName] = -5 + Math.random() * 10
      } else if (varName.match(/^w\d*$/i)) {
        // Weights: 0-1
        scope[varName] = Math.random()
      } else if (varName.match(/^[xyz]$/i)) {
        // General variables: -10 to 10
        scope[varName] = -10 + Math.random() * 20
      } else {
        // Default: -10 to 10
        scope[varName] = -10 + Math.random() * 20
      }
    }

    try {
      const val1 = expr1.evaluate(scope)
      const val2 = expr2.evaluate(scope)

      if (!areNumbersEqual(val1, val2)) {
        return false
      }
    } catch (e) {
      // If evaluation fails, skip this test
      continue
    }
  }

  return true
}

/**
 * Compares two numbers with tolerance for floating point errors
 */
function areNumbersEqual(a: number, b: number, tolerance: number = 1e-9): boolean {
  if (isNaN(a) || isNaN(b)) {
    return false
  }

  if (!isFinite(a) || !isFinite(b)) {
    return a === b
  }

  // Relative tolerance for large numbers
  const maxAbs = Math.max(Math.abs(a), Math.abs(b))
  if (maxAbs > 1) {
    return Math.abs(a - b) / maxAbs < tolerance
  }

  // Absolute tolerance for small numbers
  return Math.abs(a - b) < tolerance
}

/**
 * Handles special text answers like "no", "yes", "does not exist"
 */
export function compareTextAnswers(userAnswer: string, correctAnswer: string): boolean {
  const userNorm = userAnswer.toLowerCase().trim().replace(/\s+/g, '')
  const correctNorm = correctAnswer.toLowerCase().trim().replace(/\s+/g, '')

  // Direct match
  if (userNorm === correctNorm) {
    return true
  }

  // Handle "does not exist" variations
  const dneVariations = ['doesnotexist', 'dne', 'undefined', 'notexist', 'noexist']
  if (dneVariations.includes(correctNorm)) {
    return dneVariations.includes(userNorm)
  }

  // Handle yes/no variations
  if (correctNorm === 'yes' || correctNorm === 'no') {
    return userNorm === correctNorm
  }

  return false
}

/**
 * Main comparison function that handles both math and text answers
 */
export function compareAnswers(userAnswer: string, correctAnswer: string): boolean {
  // Handle empty answers
  if (!userAnswer.trim() || !correctAnswer.trim()) {
    return false
  }

  // Check if answers are text-based (yes/no/does not exist)
  const textPattern = /^(yes|no|doesnotexist|dne|undefined)$/i
  if (textPattern.test(correctAnswer.replace(/\s+/g, ''))) {
    return compareTextAnswers(userAnswer, correctAnswer)
  }

  // Try mathematical comparison
  try {
    return compareExpressions(userAnswer, correctAnswer)
  } catch (error) {
    // Fallback to text comparison
    return compareTextAnswers(userAnswer, correctAnswer)
  }
}
