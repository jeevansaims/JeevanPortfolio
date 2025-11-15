# Coding Standards

## Core Principles

*KISS (Keep It Simple, Stupid)* - Write lean, optimized, focused code. Avoid redundancy.

*CODE SUPER LEAN CODE* - NEVER over engineer, or over complexify. Be an insane Software Designer, you build complex software in a super simple way! It doesn't mean you should get rid of feature. Everything needs to be done following the best SWE Practices

## TypeScript Standards

- *100% TypeScript* - All files must use TypeScript with explicit typing
- *Clear Interfaces & Types* - Define interfaces for all data structures
- *No any types* - Use proper typing or unknown when necessary

## File Organization


frontend/src/features/shared/
├── components/     # Reusable UI components
├── hooks/         # Custom hooks
├── types/         # TypeScript interfaces/types
├── utils/         # Utility functions
└── actions/       # Server actions/API calls


## Component Standards

- *Feature-based structure* - Group related code by feature
- *Small, focused components* - Single responsibility principle
- *React.memo* for performance optimization
- *Proper prop interfaces* - Always define component props

typescript
interface ComponentProps {
  id: string;
  onUpdate: (data: UpdateData) => void;
}

export const Component = React.memo<ComponentProps>(({ id, onUpdate }) => {
  // implementation
});


## Error Handling

- *Clear user feedback* - Always show meaningful error messages
- *Graceful degradation* - Handle loading and error states
- *Empty states* - Design for no-data scenarios

## Testing

- *Small, focused tests* - Test one thing at a time
- *Integration over unit* - Test user workflows
- *Clear test names* - Describe what should happen

typescript
test('should update goal when user submits valid data', () => {
  // test implementation
});


## Performance

- *React.memo* for expensive components
- *useMemo/useCallback* for expensive calculations
- *Code splitting* by feature
- *Minimize re-renders* - Optimize state updates