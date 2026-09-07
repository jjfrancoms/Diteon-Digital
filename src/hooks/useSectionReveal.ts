import { useEffect } from 'react'

/** Progressive enhancement: content stays visible when motion or observers are unavailable. */
export function useSectionReveal() {
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!('IntersectionObserver' in window)) return
    let observer: IntersectionObserver | undefined
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.section-heading, .connection-flow, .deliverable',
      ),
    )
    const apply = () => {
      observer?.disconnect()
      targets.forEach((target) => {
        target.classList.remove('reveal-pending')
        target.classList.add('is-revealed')
      })
      if (preference.matches) return
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries)
            if (entry.isIntersecting) {
              entry.target.classList.remove('reveal-pending')
              entry.target.classList.add('is-revealed')
              observer?.unobserve(entry.target)
            }
        },
        { threshold: 0.08 },
      )
      for (const target of targets) {
        if (target.getBoundingClientRect().top > window.innerHeight) {
          target.classList.remove('is-revealed')
          target.classList.add('reveal-pending')
          observer.observe(target)
        }
      }
    }
    apply()
    preference.addEventListener('change', apply)
    return () => {
      observer?.disconnect()
      preference.removeEventListener('change', apply)
      targets.forEach((target) => target.classList.remove('reveal-pending'))
    }
  }, [])
}
