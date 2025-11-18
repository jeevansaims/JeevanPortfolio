"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Plus, Pencil, Trash2, Search, Filter, X, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import Link from "next/link"
import { createClient } from '@/lib/supabase/client'

interface RoadmapNode {
  id: string
  slug: string
  title: string
  category: string
  subcategory: string | null
  description: string | null
  difficulty: string
  tracks: string[]
  is_core: boolean
  order_index: number
  resources: Array<{ name: string; link: string }> | null
  created_at: string
  updated_at: string
}

type FormData = Omit<RoadmapNode, 'id' | 'created_at' | 'updated_at'>

const CATEGORIES = ['math', 'coding', 'finance', 'execution']
const DIFFICULTIES = ['foundation', 'core', 'advanced', 'frontier']
const TRACKS = ['trader', 'researcher', 'dev']

const DIFFICULTY_COLORS = {
  foundation: 'bg-green-500/20 text-green-400 border-green-500/30',
  core: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  advanced: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  frontier: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
}

const CATEGORY_COLORS = {
  math: 'bg-phthalo-500/20 text-phthalo-400 border-phthalo-500/30',
  coding: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  finance: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  execution: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
}

export default function RoadmapNodesPage() {
  const [nodes, setNodes] = useState<RoadmapNode[]>([])
  const [filteredNodes, setFilteredNodes] = useState<RoadmapNode[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [isEditing, setIsEditing] = useState(false)
  const [editingNode, setEditingNode] = useState<RoadmapNode | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    slug: '',
    title: '',
    category: 'math',
    subcategory: null,
    description: null,
    difficulty: 'foundation',
    tracks: ['trader', 'researcher', 'dev'],
    is_core: true,
    order_index: 0,
    resources: [],
  })

  useEffect(() => {
    loadNodes()
  }, [])

  useEffect(() => {
    filterNodes()
  }, [nodes, searchQuery, categoryFilter, difficultyFilter])

  const loadNodes = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('roadmap_nodes')
        .select('*')
        .order('order_index', { ascending: true })

      if (error) throw error
      setNodes(data || [])
    } catch (error) {
      console.error('Error loading nodes:', error)
      toast.error('Failed to load roadmap nodes')
    } finally {
      setLoading(false)
    }
  }

  const filterNodes = () => {
    let filtered = [...nodes]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(node =>
        node.title.toLowerCase().includes(query) ||
        node.slug.toLowerCase().includes(query) ||
        node.subcategory?.toLowerCase().includes(query)
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(node => node.category === categoryFilter)
    }

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(node => node.difficulty === difficultyFilter)
    }

    setFilteredNodes(filtered)
  }

  const handleEdit = (node: RoadmapNode) => {
    setEditingNode(node)
    setFormData({
      slug: node.slug,
      title: node.title,
      category: node.category,
      subcategory: node.subcategory,
      description: node.description,
      difficulty: node.difficulty,
      tracks: node.tracks,
      is_core: node.is_core,
      order_index: node.order_index,
      resources: node.resources || [],
    })
    setIsEditing(true)
  }

  const handleDelete = async (node: RoadmapNode) => {
    if (!confirm(`Are you sure you want to delete "${node.title}"?`)) return

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('roadmap_nodes')
        .delete()
        .eq('id', node.id)

      if (error) throw error

      toast.success('Node deleted successfully')
      loadNodes()
    } catch (error) {
      console.error('Error deleting node:', error)
      toast.error('Failed to delete node')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()

      if (editingNode) {
        // Update existing node
        const { error } = await supabase
          .from('roadmap_nodes')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingNode.id)

        if (error) throw error
        toast.success('Node updated successfully')
      } else {
        // Create new node
        const { error } = await supabase
          .from('roadmap_nodes')
          .insert([formData])

        if (error) throw error
        toast.success('Node created successfully')
      }

      // Reset form and reload
      resetForm()
      loadNodes()
    } catch (error) {
      console.error('Error saving node:', error)
      toast.error('Failed to save node')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsEditing(false)
    setEditingNode(null)
    setFormData({
      slug: '',
      title: '',
      category: 'math',
      subcategory: null,
      description: null,
      difficulty: 'foundation',
      tracks: ['trader', 'researcher', 'dev'],
      is_core: true,
      order_index: 0,
      resources: [],
    })
  }

  const handleTrackToggle = (track: string) => {
    setFormData(prev => ({
      ...prev,
      tracks: prev.tracks.includes(track)
        ? prev.tracks.filter(t => t !== track)
        : [...prev.tracks, track]
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-900 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm" className="mb-4 text-zinc-400 hover:text-phthalo-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-phthalo-400 to-phthalo-600">
                Roadmap Nodes
              </h1>
              <p className="text-zinc-400">Manage learning path nodes for personalized roadmaps</p>
            </div>
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Node
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-zinc-900/50 border-zinc-800 p-6 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by title, slug, or subcategory..."
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {(categoryFilter !== 'all' || difficultyFilter !== 'all') && (
                <Badge className="ml-2 bg-phthalo-500">Active</Badge>
              )}
            </Button>

            {/* Stats */}
            <div className="text-sm text-zinc-400">
              Showing <span className="text-white font-semibold">{filteredNodes.length}</span> of{' '}
              <span className="text-white font-semibold">{nodes.length}</span> nodes
            </div>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-zinc-800">
                  {/* Category Filter */}
                  <div>
                    <Label className="text-white mb-2 block">Category</Label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-phthalo-500"
                    >
                      <option value="all">All Categories</option>
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <Label className="text-white mb-2 block">Difficulty</Label>
                    <select
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value)}
                      className="w-full px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-phthalo-500"
                    >
                      <option value="all">All Difficulties</option>
                      {DIFFICULTIES.map(diff => (
                        <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Nodes Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-phthalo-400 animate-spin" />
          </div>
        ) : (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-800/50 border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Subcategory</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Difficulty</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tracks</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Core</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Order</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filteredNodes.map((node) => (
                    <tr key={node.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <div className="font-medium text-white">{node.title}</div>
                          <div className="text-xs text-zinc-500">{node.slug}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={CATEGORY_COLORS[node.category as keyof typeof CATEGORY_COLORS]}>
                          {node.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-400">
                        {node.subcategory || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={DIFFICULTY_COLORS[node.difficulty as keyof typeof DIFFICULTY_COLORS]}>
                          {node.difficulty}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {node.tracks.map(track => (
                            <span key={track} className="text-xs px-2 py-0.5 rounded bg-zinc-700 text-zinc-300">
                              {track}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {node.is_core ? (
                          <span className="text-green-400 text-xs">✓ Core</span>
                        ) : (
                          <span className="text-zinc-500 text-xs">Optional</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-zinc-400">
                        {node.order_index}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(node)}
                            className="text-zinc-400 hover:text-phthalo-400 hover:bg-phthalo-500/10"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(node)}
                            className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredNodes.length === 0 && (
              <div className="text-center py-12 text-zinc-400">
                No nodes found matching your filters
              </div>
            )}
          </div>
        )}

        {/* Edit/Add Modal */}
        <AnimatePresence>
          {isEditing && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={resetForm}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              />

              {/* Modal Container - Centered */}
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
                >
                  <Card className="bg-zinc-900 border-zinc-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">
                      {editingNode ? 'Edit Node' : 'Add New Node'}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetForm}
                      className="text-zinc-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Slug */}
                    <div>
                      <Label className="text-white mb-2 block">Slug *</Label>
                      <Input
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="e.g., math-linear-algebra-fundamentals"
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                      <p className="text-xs text-zinc-500 mt-1">Unique identifier (kebab-case)</p>
                    </div>

                    {/* Title */}
                    <div>
                      <Label className="text-white mb-2 block">Title *</Label>
                      <Input
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Linear Algebra Fundamentals"
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>

                    {/* Category & Difficulty */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white mb-2 block">Category *</Label>
                        <select
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-phthalo-500"
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label className="text-white mb-2 block">Difficulty *</Label>
                        <select
                          required
                          value={formData.difficulty}
                          onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                          className="w-full px-4 py-2 rounded-md bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-phthalo-500"
                        >
                          {DIFFICULTIES.map(diff => (
                            <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Subcategory */}
                    <div>
                      <Label className="text-white mb-2 block">Subcategory</Label>
                      <Input
                        value={formData.subcategory || ''}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value || null })}
                        placeholder="e.g., linear-algebra, portfolio-theory"
                        className="bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <Label className="text-white mb-2 block">Description</Label>
                      <Textarea
                        value={formData.description || ''}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
                        placeholder="Short description for UI tooltips"
                        className="min-h-[80px] bg-zinc-800 border-zinc-700 text-white"
                      />
                    </div>

                    {/* Tracks */}
                    <div>
                      <Label className="text-white mb-2 block">Tracks *</Label>
                      <div className="flex gap-3">
                        {TRACKS.map(track => (
                          <label key={track} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.tracks.includes(track)}
                              onChange={() => handleTrackToggle(track)}
                              className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-phthalo-600 focus:ring-phthalo-500 focus:ring-offset-zinc-900"
                            />
                            <span className="text-white capitalize">{track}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Is Core & Order Index */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.is_core}
                            onChange={(e) => setFormData({ ...formData, is_core: e.target.checked })}
                            className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-phthalo-600 focus:ring-phthalo-500 focus:ring-offset-zinc-900"
                          />
                          <span className="text-white">Core/Essential Node</span>
                        </label>
                      </div>

                      <div>
                        <Label className="text-white mb-2 block">Order Index *</Label>
                        <Input
                          required
                          type="number"
                          value={formData.order_index}
                          onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                          placeholder="e.g., 100, 200, 300"
                          className="bg-zinc-800 border-zinc-700 text-white"
                        />
                      </div>
                    </div>

                    {/* Resources */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="text-white">Resources (Optional)</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              resources: [...(formData.resources || []), { name: '', link: '' }]
                            })
                          }}
                          className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:text-phthalo-400 hover:border-zinc-600 hover:bg-zinc-700"
                        >
                          <Plus className="w-3 h-3 mr-2" />
                          Add Resource
                        </Button>
                      </div>

                      {formData.resources && formData.resources.length > 0 ? (
                        <div className="space-y-3 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                          {formData.resources.map((resource, index) => (
                            <div key={index} className="flex gap-2 items-start">
                              <div className="flex-1 grid grid-cols-2 gap-2">
                                <Input
                                  value={resource.name}
                                  onChange={(e) => {
                                    const newResources = [...(formData.resources || [])]
                                    newResources[index] = { ...newResources[index], name: e.target.value }
                                    setFormData({ ...formData, resources: newResources })
                                  }}
                                  placeholder="Resource name"
                                  className="bg-zinc-800 border-zinc-700 text-white text-sm"
                                />
                                <Input
                                  value={resource.link}
                                  onChange={(e) => {
                                    const newResources = [...(formData.resources || [])]
                                    newResources[index] = { ...newResources[index], link: e.target.value }
                                    setFormData({ ...formData, resources: newResources })
                                  }}
                                  placeholder="https://..."
                                  className="bg-zinc-800 border-zinc-700 text-white text-sm"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newResources = formData.resources?.filter((_, i) => i !== index) || []
                                  setFormData({ ...formData, resources: newResources })
                                }}
                                className="text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-500 py-2">
                          No resources added yet. Click "Add Resource" to include learning materials.
                        </p>
                      )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            {editingNode ? 'Update Node' : 'Create Node'}
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Card>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
