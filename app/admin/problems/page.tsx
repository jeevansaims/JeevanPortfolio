"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Plus, Loader2, Wand2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"
import { createClient } from '@/lib/supabase/client'
import { LatexPreview } from './components/latex-preview'

type ProblemType = 'math' | 'coding' | null

interface Category {
  id: string
  name: string
  description: string
  type: 'math' | 'coding'
}

export default function AddProblemPage() {
  const router = useRouter()
  const [problemType, setProblemType] = useState<ProblemType>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFormattingProblem, setIsFormattingProblem] = useState(false)
  const [isFormattingHint, setIsFormattingHint] = useState(false)
  const [isFormattingSolution, setIsFormattingSolution] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [checkingDuplicate, setCheckingDuplicate] = useState(false)
  const [duplicateFound, setDuplicateFound] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    // Common fields
    problem: '',
    hint: '',
    solution: '',
    category: '',
    difficulty: 'beginner',
    xp: '10',

    // Math-specific
    title: '',
    answer: '',
    lesson_id: '',

    // Coding-specific
    starter_code: '',
    test_cases: '',
    problem_number: ''
  })

  // Load categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('problem_categories')
          .select('*')
          .order('name', { ascending: true })

        if (error) throw error

        setCategories(data || [])
      } catch (error) {
        console.error('Error loading categories:', error)
        toast.error('Failed to load categories')
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  // Reset category when problem type changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, category: '' }))
  }, [problemType])

  // Check for duplicate title (debounced)
  useEffect(() => {
    // Only check for math problems (coding doesn't have title field)
    if (problemType !== 'math' || !formData.title.trim()) {
      setDuplicateFound(false)
      return
    }

    const checkDuplicate = async () => {
      setCheckingDuplicate(true)
      try {
        const supabase = createClient()

        // Normalize the title: lowercase and remove all spaces
        const normalizedTitle = formData.title.toLowerCase().replace(/\s+/g, '')

        // Get all math problems
        const { data: problems, error } = await supabase
          .from('math_problems')
          .select('title')

        if (error) throw error

        // Check if any existing title matches (case-insensitive, space-insensitive)
        const isDuplicate = problems?.some(p =>
          p.title?.toLowerCase().replace(/\s+/g, '') === normalizedTitle
        ) || false

        setDuplicateFound(isDuplicate)
      } catch (error) {
        console.error('Error checking for duplicate:', error)
      } finally {
        setCheckingDuplicate(false)
      }
    }

    // Debounce the check by 500ms
    const timeoutId = setTimeout(checkDuplicate, 500)
    return () => clearTimeout(timeoutId)
  }, [formData.title, problemType])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFormatText = async (field: 'problem' | 'hint' | 'solution') => {
    const text = formData[field]

    if (!text) {
      toast.error('Please enter some text before formatting')
      return
    }

    const setLoading = field === 'problem' ? setIsFormattingProblem : field === 'hint' ? setIsFormattingHint : setIsFormattingSolution
    setLoading(true)

    try {
      const res = await fetch('/api/admin/format-math', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to format text')
      }

      const result = await res.json()
      handleInputChange(field, result.formattedText)
      const fieldName = field === 'problem' ? 'Problem' : field === 'hint' ? 'Hint' : 'Solution'
      toast.success(`${fieldName} formatted successfully!`)

    } catch (error) {
      console.error('Error formatting text:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to format text')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!problemType) {
      toast.error('Please select a problem type')
      return
    }

    // Check for duplicate title
    if (problemType === 'math' && duplicateFound) {
      toast.error('A problem with this title already exists. Please choose a different title.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch('/api/admin/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemType,
          ...formData
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to create problem')
      }

      const result = await res.json()
      toast.success('Problem created successfully!')

      // Reset form
      setFormData({
        problem: '',
        hint: '',
        solution: '',
        category: '',
        difficulty: 'beginner',
        xp: '10',
        title: '',
        answer: '',
        lesson_id: '',
        starter_code: '',
        test_cases: '',
        problem_number: ''
      })
      setProblemType(null)
      setDuplicateFound(false)

    } catch (error) {
      console.error('Error creating problem:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create problem')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm" className="mb-4 text-zinc-400 hover:text-phthalo-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
            Add New Problem
          </h1>
          <p className="text-zinc-400">Create math or coding problems for the quantframe</p>
        </div>

        {/* Problem Type Selection */}
        {!problemType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <Card
              className="group cursor-pointer bg-zinc-900/50 border-zinc-800 hover:border-phthalo-500 transition-all duration-300 p-8"
              onClick={() => setProblemType('math')}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-phthalo-500/20 border-2 border-phthalo-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">∑</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-phthalo-400 transition-colors">
                  Math Problem
                </h3>
                <p className="text-zinc-400 text-sm">
                  Questions with text input answers, hints, and solutions
                </p>
              </div>
            </Card>

            <Card
              className="group cursor-pointer bg-zinc-900/50 border-zinc-800 hover:border-phthalo-500 transition-all duration-300 p-8"
              onClick={() => setProblemType('coding')}
            >
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">&lt;/&gt;</span>
                </div>
                <h3 className="text-2xl font-bold mb-2 group-hover:text-blue-400 transition-colors">
                  Coding Problem
                </h3>
                <p className="text-zinc-400 text-sm">
                  Python problems with starter code and test cases
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Form */}
        {problemType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-zinc-900/50 border-zinc-800 p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Badge className={problemType === 'math' ? 'bg-phthalo-500' : 'bg-blue-500'}>
                    {problemType === 'math' ? 'Math Problem' : 'Coding Problem'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setProblemType(null)}
                    className="text-zinc-400 hover:text-white"
                  >
                    Change Type
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Math-specific: Title */}
                {problemType === 'math' && (
                  <div>
                    <Label htmlFor="title" className="text-white mb-2 block">
                      Title (Optional)
                    </Label>
                    <div className="relative">
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g., Polynomial Limit, Derivative at a Point"
                        className={`bg-zinc-800 border-zinc-700 text-white ${
                          duplicateFound ? 'border-red-500 focus:ring-red-500' : ''
                        }`}
                      />
                      {checkingDuplicate && formData.title.trim() && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Loader2 className="w-4 h-4 text-zinc-400 animate-spin" />
                        </div>
                      )}
                    </div>
                    {duplicateFound ? (
                      <div className="flex items-center gap-2 mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded-md">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <p className="text-xs text-red-400">
                          A problem with this title already exists. Please choose a different title.
                        </p>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 mt-1">
                        A short, descriptive title for the problem
                      </p>
                    )}
                  </div>
                )}

                {/* Problem Statement */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="problem" className="text-white">
                      Problem Statement *
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleFormatText('problem')}
                      disabled={isFormattingProblem || !formData.problem}
                      className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-phthalo-400 hover:border-zinc-600 hover:bg-zinc-700"
                    >
                      {isFormattingProblem ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                          Formatting...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3 h-3 mr-2" />
                          Format
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    id="problem"
                    required
                    value={formData.problem}
                    onChange={(e) => handleInputChange('problem', e.target.value)}
                    placeholder="Enter the problem description. Use $...$ for inline math and $$...$$ for block math."
                    className="min-h-[150px] bg-zinc-800 border-zinc-700 text-white"
                  />
                  <p className="text-xs text-zinc-500 mt-1">
                    Supports LaTeX: Use $x^2$ for inline and $$\int_0^1 x \, dx$$ for block equations
                  </p>
                  <LatexPreview text={formData.problem} />
                </div>

                {/* Hint */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="hint" className="text-white">
                      Hint *
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleFormatText('hint')}
                      disabled={isFormattingHint || !formData.hint}
                      className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-phthalo-400 hover:border-zinc-600 hover:bg-zinc-700"
                    >
                      {isFormattingHint ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                          Formatting...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3 h-3 mr-2" />
                          Format
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    id="hint"
                    required
                    value={formData.hint}
                    onChange={(e) => handleInputChange('hint', e.target.value)}
                    placeholder="Enter a helpful hint"
                    className="min-h-[100px] bg-zinc-800 border-zinc-700 text-white"
                  />
                  <LatexPreview text={formData.hint} />
                </div>

                {/* Solution */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="solution" className="text-white">
                      Solution *
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleFormatText('solution')}
                      disabled={isFormattingSolution || !formData.solution}
                      className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-phthalo-400 hover:border-zinc-600 hover:bg-zinc-700"
                    >
                      {isFormattingSolution ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                          Formatting...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3 h-3 mr-2" />
                          Format
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    id="solution"
                    required
                    value={formData.solution}
                    onChange={(e) => handleInputChange('solution', e.target.value)}
                    placeholder="Enter the complete solution with steps"
                    className="min-h-[150px] bg-zinc-800 border-zinc-700 text-white"
                  />
                  <LatexPreview text={formData.solution} />
                </div>

                {/* Math-specific: Answer */}
                {problemType === 'math' && (
                  <div>
                    <Label htmlFor="answer" className="text-white mb-2 block">
                      Answer *
                    </Label>
                    <Input
                      id="answer"
                      required
                      value={formData.answer}
                      onChange={(e) => handleInputChange('answer', e.target.value)}
                      placeholder="e.g., 42, x^2 + 3x, does not exist"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      The expected answer. System will check mathematical equivalence.
                    </p>
                  </div>
                )}

                {/* Coding-specific: Starter Code */}
                {problemType === 'coding' && (
                  <>
                    <div>
                      <Label htmlFor="starter_code" className="text-white mb-2 block">
                        Starter Code *
                      </Label>
                      <Textarea
                        id="starter_code"
                        required
                        value={formData.starter_code}
                        onChange={(e) => handleInputChange('starter_code', e.target.value)}
                        placeholder="def solution():\n    # Your code here\n    pass"
                        className="min-h-[150px] bg-zinc-800 border-zinc-700 text-white font-mono text-sm"
                      />
                    </div>

                    <div>
                      <Label htmlFor="test_cases" className="text-white mb-2 block">
                        Test Cases (JSON) *
                      </Label>
                      <Textarea
                        id="test_cases"
                        required
                        value={formData.test_cases}
                        onChange={(e) => handleInputChange('test_cases', e.target.value)}
                        placeholder={'[\n  {\n    "input": [1, 2],\n    "expected": 3,\n    "hidden": false,\n    "description": "Basic test"\n  }\n]'}
                        className="min-h-[200px] bg-zinc-800 border-zinc-700 text-white font-mono text-sm"
                      />
                      <p className="text-xs text-zinc-500 mt-1">
                        Array of test case objects with input, expected, hidden, and optional description fields
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="problem_number" className="text-white mb-2 block">
                        Problem Number (Optional)
                      </Label>
                      <Input
                        id="problem_number"
                        type="number"
                        value={formData.problem_number}
                        onChange={(e) => handleInputChange('problem_number', e.target.value)}
                        placeholder="e.g., 1, 2, 3..."
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>
                  </>
                )}

                {/* Category */}
                <div>
                  <Label htmlFor="category" className="text-white mb-2 block">
                    Category *
                  </Label>
                  {loadingCategories ? (
                    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-400">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading categories...
                    </div>
                  ) : (
                    <select
                      id="category"
                      required
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-phthalo-500"
                    >
                      <option value="">Select a category...</option>
                      {categories
                        .filter(cat => cat.type === problemType)
                        .map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                    </select>
                  )}
                  {formData.category && categories.find(c => c.id === formData.category) && (
                    <p className="text-xs text-zinc-500 mt-1">
                      {categories.find(c => c.id === formData.category)?.description}
                    </p>
                  )}
                </div>

                {/* Difficulty */}
                <div>
                  <Label htmlFor="difficulty" className="text-white mb-2 block">
                    Difficulty *
                  </Label>
                  <select
                    id="difficulty"
                    required
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-phthalo-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                {/* XP */}
                <div>
                  <Label htmlFor="xp" className="text-white mb-2 block">
                    XP Reward *
                  </Label>
                  <Input
                    id="xp"
                    type="number"
                    required
                    min="1"
                    value={formData.xp}
                    onChange={(e) => handleInputChange('xp', e.target.value)}
                    placeholder="e.g., 10, 20, 50"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                {/* Math-specific: Lesson ID */}
                {problemType === 'math' && (
                  <div>
                    <Label htmlFor="lesson_id" className="text-white mb-2 block">
                      Lesson ID (Optional)
                    </Label>
                    <Input
                      id="lesson_id"
                      value={formData.lesson_id}
                      onChange={(e) => handleInputChange('lesson_id', e.target.value)}
                      placeholder="UUID of the lesson this problem belongs to"
                      className="bg-zinc-800 border-zinc-700 text-white"
                    />
                    <p className="text-xs text-zinc-500 mt-1">
                      Leave empty for standalone problems
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting || duplicateFound}
                    className="flex-1 bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : duplicateFound ? (
                      <>
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Duplicate Title
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Problem
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setProblemType(null)
                      setFormData({
                        problem: '',
                        hint: '',
                        solution: '',
                        category: '',
                        difficulty: 'beginner',
                        xp: '10',
                        title: '',
                        answer: '',
                        lesson_id: '',
                        starter_code: '',
                        test_cases: '',
                        problem_number: ''
                      })
                      setDuplicateFound(false)
                    }}
                    className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
