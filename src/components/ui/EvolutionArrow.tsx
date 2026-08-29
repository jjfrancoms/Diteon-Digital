import React from 'react';

export const EvolutionArrow: React.FC = () => {
  return (
    <div
      className="
        flex
        min-h-[48px]
        w-full
        items-center
        justify-center
      "
      aria-hidden="true"
    >
      <span
        className="
          evolution-arrow
          material-symbols-outlined
          text-[36px]
          leading-none
          text-[#1C6FE0]
        "
      >
        east
      </span>
    </div>
  );
};