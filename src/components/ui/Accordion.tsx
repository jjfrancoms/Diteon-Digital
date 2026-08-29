import React, { useState } from 'react';

export interface AccordionItemData {
  id?: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItemData[];
  defaultOpenIndex?: number | null;
  allowMultiple?: boolean;
  onToggle?: (index: number, isOpen: boolean) => void;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpenIndex = 0,
  allowMultiple = false,
  onToggle,
  className = '',
}) => {
  const [openIndices, setOpenIndices] = useState<number[]>(
    defaultOpenIndex !== null && defaultOpenIndex !== undefined ? [defaultOpenIndex] : []
  );

  const handleToggle = (index: number) => {
    const isCurrentlyOpen = openIndices.includes(index);
    let nextOpen: number[];

    if (allowMultiple) {
      nextOpen = isCurrentlyOpen
        ? openIndices.filter((i) => i !== index)
        : [...openIndices, index];
    } else {
      nextOpen = isCurrentlyOpen ? [] : [index];
    }

    setOpenIndices(nextOpen);
    if (onToggle) {
      onToggle(index, !isCurrentlyOpen);
    }
  };

  return (
    <div className={`divide-y divide-[#14142B]/10 border-y border-[#14142B]/10 ${className}`}>
      {items.map((item, idx) => {
        const isOpen = openIndices.includes(idx);
        const buttonId = `accordion-btn-${idx}`;
        const panelId = `accordion-panel-${idx}`;

        return (
          <div key={item.id || idx} className="py-0">
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => handleToggle(idx)}
              className="w-full py-4 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#14142B] hover:text-[#1C6FE0] transition-colors font-['Space_Grotesk'] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C6FE0] group"
            >
              <span className="leading-snug">{item.title}</span>
              <span 
                className={`material-symbols-outlined text-[20px] text-[#14142B]/40 shrink-0 transition-transform duration-200 group-hover:text-[#1C6FE0] ${
                  isOpen ? 'rotate-180 text-[#1C6FE0]' : ''
                }`}
                aria-hidden="true"
              >
                expand_more
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-all duration-200 ease-out overflow-hidden ${
                isOpen ? 'grid-rows-[1fr] opacity-100 pb-5' : 'grid-rows-[0fr] opacity-0 pb-0'
              }`}
            >
              <div className="overflow-hidden text-xs sm:text-sm text-[#14142B]/75 leading-relaxed font-['Inter']">
                {item.content}
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};
