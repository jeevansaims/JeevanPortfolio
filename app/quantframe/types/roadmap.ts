// app/quantframe/types/roadmap.ts

export interface RoadmapNode {
  title: string
  why_included: string
  estimated_hours: number
  prerequisites: string[]
}

export interface RoadmapPhase {
  phase: number
  title: string
  nodes: RoadmapNode[]
}

export interface GeneratedRoadmap {
  phases: RoadmapPhase[]
}

export interface GeneratedRoadmapRow {
  id: string
  user_id: string
  roadmap_json: GeneratedRoadmap
  generated_at: string
  updated_at: string
}