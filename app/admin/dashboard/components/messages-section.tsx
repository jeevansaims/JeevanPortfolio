"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { MessageSquare, Download, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Response {
  id: string
  created_at: string
  name: string
  email: string
  assigned_persona: string
  background_level: string
  main_goal: string
  topics_interest: string[]
  math_confidence: number
  coding_confidence: number
  time_investment: string
  learning_preference: string
  payment_willingness: string
  start_timeline: string
  additional_info: string
}

interface MessagesSectionProps {
  responses: Response[]
}

export function MessagesSection({ responses }: MessagesSectionProps) {
  const [personaFilter, setPersonaFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const messagesPerPage = 6 // 2x6 grid

  // Filter responses with messages
  const messagesWithInfo = useMemo(() => {
    return responses.filter(r => r.additional_info && r.additional_info.trim() !== "")
  }, [responses])

  // Apply filters
  const filteredMessages = useMemo(() => {
    let filtered = [...messagesWithInfo]

    if (personaFilter !== "all") {
      filtered = filtered.filter(r => r.assigned_persona === personaFilter)
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

    return filtered
  }, [messagesWithInfo, personaFilter, sortOrder])

  // Get unique personas
  const personas = useMemo(() => 
    Array.from(new Set(messagesWithInfo.map(r => r.assigned_persona))).filter(Boolean),
    [messagesWithInfo]
  )

  const personaLabels: Record<string, string> = {
    hustler: "🚀 Hustler",
    career_switcher: "📈 Career Switcher",
    trading_builder: "💹 Trading Builder",
    ai_quant: "🤖 AI Quant",
    math_specialist: "🧮 Math Specialist",
    code_builder: "💻 Code Builder",
    foundation_builder: "🌱 Foundation Builder",
    explorer: "🧭 Explorer"
  }

  // Pagination calculations
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage)
  const startIndex = (currentPage - 1) * messagesPerPage
  const endIndex = startIndex + messagesPerPage
  const currentMessages = filteredMessages.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [personaFilter, sortOrder])

  // Export function
  const exportMessages = () => {
    const headers = ["Name", "Email", "Message", "Date", "Persona"]
    const csvData = filteredMessages.map(r => [
      r.name,
      r.email,
      r.additional_info,
      new Date(r.created_at).toLocaleDateString(),
      r.assigned_persona
    ])

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "additional-messages.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (messagesWithInfo.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-zinc-900 border border-zinc-800 rounded-xl p-6"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-phthalo-500 to-phthalo-700 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Additional Messages</h3>
              <p className="text-sm text-zinc-400">{filteredMessages.length} people left additional context</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Select value={personaFilter} onValueChange={setPersonaFilter}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 w-[200px]">
              <SelectValue placeholder="Filter by persona" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Personas</SelectItem>
              {personas.map(persona => (
                <SelectItem key={persona} value={persona}>
                  {personaLabels[persona] || persona}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={exportMessages}
            className="bg-gradient-to-r from-phthalo-600 to-phthalo-800 hover:from-phthalo-700 hover:to-phthalo-900 ml-auto"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Messages ({filteredMessages.length})
          </Button>
        </div>

        {/* Messages Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {currentMessages.map((response, idx) => (
            <motion.div
              key={response.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 hover:border-zinc-600 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <TooltipProvider>
                  <Tooltip delayDuration={200}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 cursor-help">
                        <div className="w-8 h-8 rounded-full bg-phthalo-500/20 flex items-center justify-center">
                          <User className="w-4 h-4 text-phthalo-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{response.name}</p>
                          <p className="text-xs text-zinc-500">{response.email}</p>
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-zinc-900 border-zinc-700 p-4 max-w-xs">
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-zinc-500">Persona:</span>
                          <span className="ml-2 text-phthalo-400 font-medium">
                            {personaLabels[response.assigned_persona] || response.assigned_persona}
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Main Goal:</span>
                          <span className="ml-2 text-white">{response.main_goal.replace(/_/g, " ")}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Confidence:</span>
                          <span className="ml-2 text-white">
                            Math {response.math_confidence}/4 • Code {response.coding_confidence}/4
                          </span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Time Investment:</span>
                          <span className="ml-2 text-white">{response.time_investment.replace(/_/g, " ")}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Payment:</span>
                          <span className="ml-2 text-white">{response.payment_willingness.replace(/_/g, " ")}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500">Start Timeline:</span>
                          <span className="ml-2 text-white">{response.start_timeline}</span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs px-2 py-1 rounded-full bg-phthalo-500/10 text-phthalo-400">
                    {personaLabels[response.assigned_persona]?.split(" ")[0] || ""}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {new Date(response.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-700/50">
                <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {response.additional_info}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No results message */}
        {filteredMessages.length === 0 && (
          <div className="text-center py-8 text-zinc-500">
            No messages match your filters
          </div>
        )}

        {/* Pagination Controls */}
        {filteredMessages.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
            <div className="text-sm text-zinc-400">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredMessages.length)} of {filteredMessages.length} messages
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {/* Show page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                  // Smart pagination: show first, last, current, and adjacent pages
                  const showPage = 
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  
                  const showEllipsis = 
                    (pageNum === 2 && currentPage > 3) ||
                    (pageNum === totalPages - 1 && currentPage < totalPages - 2)
                  
                  if (showEllipsis) {
                    return <span key={pageNum} className="px-2 text-zinc-500">...</span>
                  }
                  
                  if (!showPage) return null
                  
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      className={
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-phthalo-600 to-phthalo-800 border-0 min-w-[36px]"
                          : "border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-700 min-w-[36px]"
                      }
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              
              <Button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:border-zinc-600 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}