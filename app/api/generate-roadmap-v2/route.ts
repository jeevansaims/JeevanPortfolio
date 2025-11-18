import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  MATH_MILESTONES,
  CODING_MILESTONES,
  FINANCE_MILESTONES,
  EXECUTION_CATEGORIES
} from '@/app/quantframe/lib/roadmap-milestones'

export async function POST(req: NextRequest) {
  try {
    console.log('🚀 API Route: generate-roadmap-v2 called')

    const body = await req.json()
    console.log('📦 Request body:', JSON.stringify(body, null, 2))

    const { userId, responses } = body

    if (!userId || !responses) {
      console.error('❌ Missing required fields:', { userId: !!userId, responses: !!responses })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { track, math, coding, finance, execution } = responses
    console.log('🎯 Parsed responses:', { track, math, coding, finance, execution })

    if (!track) {
      console.error('❌ Track selection is required')
      return NextResponse.json(
        { error: 'Track selection is required' },
        { status: 400 }
      )
    }

    console.log('🔌 Creating Supabase client...')
    const supabase = await createClient()

    // Fetch ALL roadmap nodes that match the user's track
    console.log(`🔍 Fetching nodes for track: ${track}`)
    const { data: allNodes, error: nodesError } = await supabase
      .from('roadmap_nodes')
      .select('*')
      .contains('tracks', [track])
      .order('order_index', { ascending: true })

    if (nodesError) {
      console.error('❌ Error fetching nodes:', nodesError)
      throw nodesError
    }

    console.log(`✅ Found ${allNodes?.length || 0} nodes for track ${track}`)

    if (!allNodes || allNodes.length === 0) {
      console.error('❌ No nodes found for selected track')
      return NextResponse.json(
        { error: 'No nodes found for selected track' },
        { status: 404 }
      )
    }

    // Helper function to get highest order_index for a milestone
    const getHighestOrderIndex = (milestoneId: string, category: 'math' | 'coding' | 'finance') => {
      const milestonesMap = {
        math: MATH_MILESTONES,
        coding: CODING_MILESTONES,
        finance: FINANCE_MILESTONES
      }

      const milestones = milestonesMap[category]

      for (const subcat of milestones) {
        const milestone = subcat.milestones.find(m => m.id === milestoneId)
        if (milestone) {
          const node = allNodes.find(n => n.slug === milestone.highestNodeSlug)
          return node ? { orderIndex: node.order_index, subcategory: subcat.subcategory } : null
        }
      }
      return null
    }

    // Filter nodes based on knowledge
    let filteredNodes = allNodes

    // Filter Math nodes
    if (math.level === 'beginner') {
      // Show all math nodes
    } else if (math.level === 'intermediate' || math.level === 'advanced') {
      // Remove nodes based on selected milestones
      const nodesToRemove = new Set<string>()

      for (const milestoneId of math.milestones) {
        const milestoneData = getHighestOrderIndex(milestoneId, 'math')
        if (milestoneData) {
          // Remove all nodes in this subcategory with order_index <= milestone's order_index
          allNodes.forEach(node => {
            if (
              node.category === 'math' &&
              node.subcategory === milestoneData.subcategory &&
              node.order_index <= milestoneData.orderIndex
            ) {
              nodesToRemove.add(node.id)
            }
          })
        }
      }

      filteredNodes = filteredNodes.filter(node => !nodesToRemove.has(node.id))
    }

    // Filter Coding nodes
    if (coding.level === 'beginner') {
      // Show all coding nodes
    } else if (coding.level === 'intermediate' || coding.level === 'advanced') {
      const nodesToRemove = new Set<string>()

      for (const milestoneId of coding.milestones) {
        const milestoneData = getHighestOrderIndex(milestoneId, 'coding')
        if (milestoneData) {
          allNodes.forEach(node => {
            if (
              node.category === 'coding' &&
              node.subcategory === milestoneData.subcategory &&
              node.order_index <= milestoneData.orderIndex
            ) {
              nodesToRemove.add(node.id)
            }
          })
        }
      }

      filteredNodes = filteredNodes.filter(node => !nodesToRemove.has(node.id))
    }

    // Filter Finance nodes
    if (finance.level === 'beginner') {
      // Show all finance nodes
    } else if (finance.level === 'intermediate' || finance.level === 'advanced') {
      const nodesToRemove = new Set<string>()

      for (const milestoneId of finance.milestones) {
        const milestoneData = getHighestOrderIndex(milestoneId, 'finance')
        if (milestoneData) {
          allNodes.forEach(node => {
            if (
              node.category === 'finance' &&
              node.subcategory === milestoneData.subcategory &&
              node.order_index <= milestoneData.orderIndex
            ) {
              nodesToRemove.add(node.id)
            }
          })
        }
      }

      filteredNodes = filteredNodes.filter(node => !nodesToRemove.has(node.id))
    }

    // Filter Execution nodes - only show selected categories
    if (execution && execution.length > 0) {
      const selectedSubcategories = execution.map((execId: string) => {
        const cat = EXECUTION_CATEGORIES.find(c => c.id === execId)
        return cat?.subcategory
      }).filter(Boolean)

      filteredNodes = filteredNodes.filter(node => {
        if (node.category !== 'execution') return true
        return selectedSubcategories.includes(node.subcategory)
      })
    } else {
      // Remove all execution nodes if none selected
      filteredNodes = filteredNodes.filter(node => node.category !== 'execution')
    }

    // Group filtered nodes by category
    const groupedNodes = {
      math: filteredNodes.filter(n => n.category === 'math'),
      coding: filteredNodes.filter(n => n.category === 'coding'),
      finance: filteredNodes.filter(n => n.category === 'finance'),
      execution: filteredNodes.filter(n => n.category === 'execution')
    }

    // Create roadmap structure
    const roadmap = {
      track,
      phases: [
        {
          phase: 1,
          title: 'Technical Foundations',
          categories: ['math', 'coding', 'finance'],
          nodes: [
            ...groupedNodes.math,
            ...groupedNodes.coding,
            ...groupedNodes.finance
          ]
        },
        {
          phase: 2,
          title: 'Career Execution',
          categories: ['execution'],
          nodes: groupedNodes.execution
        }
      ],
      totalNodes: filteredNodes.length,
      nodesByCategory: {
        math: groupedNodes.math.length,
        coding: groupedNodes.coding.length,
        finance: groupedNodes.finance.length,
        execution: groupedNodes.execution.length
      }
    }

    // Save quiz responses
    const { error: quizError } = await supabase
      .from('roadmap_quiz_responses')
      .upsert({
        user_id: userId,
        track,
        math_level: math.level,
        math_knowledge: { subcategories: math.subcategories, milestones: math.milestones },
        coding_level: coding.level,
        coding_knowledge: { subcategories: coding.subcategories, milestones: coding.milestones },
        finance_level: finance.level,
        finance_knowledge: { subcategories: finance.subcategories, milestones: finance.milestones },
        execution_needs: execution,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (quizError) {
      console.error('❌ Error saving quiz responses:', quizError)
      throw quizError
    }

    console.log('✅ Quiz responses saved successfully')

    // Save generated roadmap
    const { error: roadmapError } = await supabase
      .from('generated_roadmaps')
      .upsert({
        user_id: userId,
        roadmap_data: roadmap,
        node_ids: filteredNodes.map(n => n.id),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })

    if (roadmapError) {
      console.error('❌ Error saving roadmap:', roadmapError)
      throw roadmapError
    }

    console.log('✅ Roadmap saved successfully:', {
      track,
      totalNodes: filteredNodes.length,
      phases: roadmap.phases.length
    })

    return NextResponse.json({
      success: true,
      roadmap,
      filteredNodeCount: filteredNodes.length,
      totalAvailableNodes: allNodes.length
    })

  } catch (error) {
    console.error('💥 FATAL ERROR generating roadmap:', error)
    console.error('Error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : 'No stack trace'
    })
    return NextResponse.json(
      {
        error: 'Failed to generate roadmap',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}
