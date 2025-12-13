// app/quantframe/problems/math/layout.tsx
import { ProblemLayoutWrapper } from '../components/problem-layout-wrapper'

export default function MathProblemsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProblemLayoutWrapper problemType="math">
      {children}
    </ProblemLayoutWrapper>
  )
}
