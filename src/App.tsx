import { useCallback, useState } from 'react'
import { useSectionReveal } from './hooks/useSectionReveal'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProblemPromise } from './components/ProblemPromise'
import { Services } from './components/Services'
import { ProjectsScroll } from './components/ProjectsScroll'
import { Engineering } from './components/Engineering'
import { Process } from './components/Process'
import { Integrations } from './components/Integrations'
import { Diagnostic } from './components/Diagnostic'
import { FaqCta } from './components/FaqCta'
import { Footer } from './components/Footer'
import { ContactModal } from './components/ContactModal'
import { MobileContactBar } from './components/MobileContactBar'
import type { SolutionOptionValue } from './config/solutionOptions'

export default function App() {
  useSectionReveal()
  const [interest, setInterest] = useState<SolutionOptionValue>('otro')
  const [contact, setContact] = useState<{
    solution: SolutionOptionValue
    message: string
  } | null>(null)
  const openContact = useCallback(
    (solution?: SolutionOptionValue, message = '') => {
      const selected = solution ?? interest
      setInterest(selected)
      setContact({ solution: selected, message })
    },
    [interest],
  )
  return (
    <>
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header onContact={openContact} />
      <main id="contenido" tabIndex={-1}>
        <Hero onContact={openContact} />
        <Services onContact={openContact} onInterest={setInterest} />
        <ProblemPromise />
        <ProjectsScroll onContact={openContact} />
        <Engineering />
        <Process />
        <Integrations />
        <Diagnostic onContact={openContact} />
        <FaqCta onContact={openContact} />
      </main>
      <Footer onContact={openContact} />
      <MobileContactBar
        hidden={Boolean(contact)}
        interest={interest}
        onContact={openContact}
      />
      {contact && (
        <ContactModal
          isOpen
          onClose={() => setContact(null)}
          defaultSolution={contact.solution}
          initialMessage={contact.message}
        />
      )}
    </>
  )
}
