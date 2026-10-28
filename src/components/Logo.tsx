import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className="flex items-center gap-3 select-none group cursor-pointer">
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <img
          src="/logo.svg"
          alt="SkillHub Diablo Arlequín"
          className="w-full h-full object-contain rounded-md shadow-xs group-hover:scale-105 transition-transform"
        />
      </div>
      <div className="flex flex-col">
        <span
          className={`font-headline font-extrabold tracking-tight ${titleSizes[size]} text-[#0f172a] dark:text-white leading-none transition-colors`}
        >
          Skill<span className="text-[#d9251d] dark:text-[#ffb4a9]">Hub</span>
        </span>
      </div>
    </div>
  );
};
