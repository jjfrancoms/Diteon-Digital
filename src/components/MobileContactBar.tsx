import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { ContactHandler } from '../config/experience'
import type { SolutionOptionValue } from '../config/solutionOptions'
import { needs } from '../config/experience'
export function MobileContactBar({
  hidden,
  interest,
  onContact,
}: {
  hidden: boolean
  interest: SolutionOptionValue
  onContact: ContactHandler
}) {
  const [pastHero, setPastHero] = useState(false)
  const [nearContact, setNearContact] = useState(false)
  useEffect(() => {
    const hero = document.getElementById('inicio')
    const contact = document.getElementById('contacto')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === hero)
            setPastHero(
              !entry.isIntersecting && entry.boundingClientRect.bottom <= 80,
            )
          if (entry.target === contact) setNearContact(entry.isIntersecting)
        }
      },
      { rootMargin: '-80px 0px 0px 0px' },
    )
    if (hero) observer.observe(hero)
    if (contact) observer.observe(contact)
    return () => observer.disconnect()
  }, [])
  if (hidden || !pastHero || nearContact) return null
  return (
    <div className="mobile-contact">
      <div>
        <span>Tu siguiente paso</span>
        <b>
          {needs.find((item) => item.id === interest)?.label ??
            'Hablemos de tu proyecto'}
        </b>
      </div>
      <button
        className="button button--blue"
        onClick={() => onContact(interest)}
      >
        Hablemos <ArrowUpRight size={17} />
      </button>
    </div>
  )
}
