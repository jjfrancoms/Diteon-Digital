import React, { useRef, useEffect } from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  theme?: 'light' | 'dark';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeId,
  onChange,
  theme = 'dark',
  className = '',
}) => {
  const tabListRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = index;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabs.length - 1;
    } else {
      return;
    }

    e.preventDefault();
    onChange(tabs[nextIndex].id);
    const buttons = tabListRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    buttons?.[nextIndex]?.focus();
  };

  return (
    <div 
      ref={tabListRef}
      role="tablist"
      aria-label="Soluciones DITEON"
      className={`flex items-center gap-1.5 p-1.5 rounded-xl overflow-x-auto no-scrollbar ${
        isDark 
          ? 'bg-white/5 border border-white/10' 
          : 'bg-[#14142B]/5 border border-[#14142B]/10'
      } ${className}`}
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.id === activeId;
        const tabId = `tab-${tab.id}`;
        const panelId = `tabpanel-${tab.id}`;

        return (
          <button
            key={tab.id}
            id={tabId}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls={panelId}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer select-none font-['Inter'] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C6FE0] ${
              isActive
                ? 'bg-[#1C6FE0] text-white shadow-xs'
                : isDark
                  ? 'text-white/70 hover:text-white hover:bg-white/5'
                  : 'text-[#14142B]/70 hover:text-[#14142B] hover:bg-[#14142B]/5'
            }`}
          >
            {tab.icon && (
              <span className="material-symbols-outlined text-[20px] shrink-0 flex items-center justify-center" aria-hidden="true">
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                isActive ? 'bg-white/20 text-white' : isDark ? 'bg-white/10 text-white/70' : 'bg-[#14142B]/10 text-[#14142B]/70'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
