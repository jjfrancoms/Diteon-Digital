import { useState } from 'react'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { ProblemPromise } from './components/ProblemPromise'
import { Services } from './components/Services'
import { ProjectsScroll } from './components/ProjectsScroll'
import { Engineering } from './components/Engineering'
import { Process } from './components/Process'
import { Integrations } from './components/Integrations'
import { FaqCta } from './components/FaqCta'
import { Footer } from './components/Footer'
import { ContactModal, type SolutionOptionValue } from './components/ContactModal'

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [selectedSolution, setSelectedSolution] = useState<SolutionOptionValue>('otro')

  const openContact = (solution: SolutionOptionValue = 'otro') => {
    setSelectedSolution(solution)
    setIsContactOpen(true)
  }

  return (
    <>
      <Header onContact={openContact} />
      <main>
        <Hero onContact={openContact} />
        <ProblemPromise />
        <Services onContact={openContact} />
        <ProjectsScroll onContact={openContact} />
        <Engineering />
        <Process />
        <Integrations />
        <FaqCta onContact={openContact} />
      </main>
      <Footer onContact={openContact} />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        defaultSolution={selectedSolution}
      />
    </>
  )
}
