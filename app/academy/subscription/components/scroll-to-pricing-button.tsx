'use client'

interface ScrollToPricingButtonProps {
  className?: string
  children: React.ReactNode
}

export function ScrollToPricingButton({ className, children }: ScrollToPricingButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const pricingSection = document.getElementById('pricing')
    
    if (pricingSection) {
      // Get the element's position
      const elementPosition = pricingSection.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - 400 // 100px offset for breathing room
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  return (
    <a 
      href="#pricing"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  )
}