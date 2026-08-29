import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProblemSolution } from './components/ProblemSolution';
import { SolutionShowcase } from './components/SolutionShowcase';
import { ProcessAndWhy } from './components/ProcessAndWhy';
import { FaqAndCta } from './components/FaqAndCta';
import { Footer } from './components/Footer';
import { ContactModal, SolutionOptionValue } from './components/ContactModal';

export default function App() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<SolutionOptionValue>('otro');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = -70;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition + offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  const handleOpenContact = (solution: SolutionOptionValue = 'otro') => {
    setSelectedSolution(solution);
    setIsContactOpen(true);
  };

  const handleCloseContact = () => {
    setIsContactOpen(false);
  };

  return (
    <div id="top" className="min-h-screen bg-[#F7F7F5] text-[#14142B] selection:bg-[#1C6FE0] selection:text-white flex flex-col font-['Inter'] antialiased">
      {/* Navigation Bar */}
      <Header onScrollTo={scrollToSection} onOpenContact={() => handleOpenContact('otro')} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero: Main Proposition + Realistic SaaS Control Center */}
        <Hero onScrollTo={scrollToSection} onOpenContact={handleOpenContact} />

        {/* 2. Problem vs Solution: Traditional vs Connected Operations */}
        <ProblemSolution />

        {/* 3. Solution Showcase: Interactive CRM, POS, Inventario, ERP, Automatización, A Medida */}
        <SolutionShowcase onOpenContact={handleOpenContact} />

        {/* 4. Methodology & Why DITEON: 5 Clear Phases + Tech Stack */}
        <ProcessAndWhy />

        {/* 5. FAQ & High-Conversion Contact CTA */}
        <FaqAndCta onOpenContact={handleOpenContact} />
      </main>

      {/* Footer */}
      <Footer onScrollTo={scrollToSection} onOpenContact={handleOpenContact} />

      {/* Interactive Contact & Diagnostic Modal */}
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={handleCloseContact} 
        defaultSolution={selectedSolution}
      />
    </div>
  );
}
