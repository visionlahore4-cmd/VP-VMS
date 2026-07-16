import React from 'react';

interface VisionPackagingLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  light?: boolean; // If true, optimizes for light backgrounds. If false, optimizes for dark backgrounds.
  showText?: boolean;
  layout?: 'vertical' | 'horizontal';
  showAddress?: boolean;
}

export const VisionPackagingLogo: React.FC<VisionPackagingLogoProps> = ({
  className = '',
  size = 'md',
  light = false,
  showText = true,
  layout = 'vertical',
  showAddress = false,
}) => {
  // Size mapping
  const sizeClasses = {
    sm: { icon: 'h-8 w-8', textTitle: 'text-xs', textTag: 'text-[7px]' },
    md: { icon: 'h-11 w-11', textTitle: 'text-sm', textTag: 'text-[8px]' },
    lg: { icon: 'h-16 w-16', textTitle: 'text-lg', textTag: 'text-[11px]' },
    xl: { icon: 'h-24 w-24', textTitle: 'text-2xl', textTag: 'text-[14px]' },
  };

  const selectedSize = sizeClasses[size];

  // Colors based on background theme
  const titleColor = light ? 'text-slate-900' : 'text-white';
  const tagColor = 'text-rose-600';

  const isHorizontal = layout === 'horizontal';

  return (
    <div className={`flex ${isHorizontal ? 'flex-row items-center text-left gap-3.5' : 'flex-col items-center justify-center text-center'} ${className}`}>
      {/* Dynamic Red Gradient VP Logo Symbol */}
      <svg
        className={selectedSize.icon}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* V Left Dark Red Gradient */}
          <linearGradient id="vLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b91c1c" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
          {/* V Right/Fold Highlight Gradient */}
          <linearGradient id="vRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          {/* P Swooshes Gradient */}
          <linearGradient id="pSwooshGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>

        {/* --- Stylized "V" Component --- */}
        {/* Left thick block of V */}
        <path
          d="M 35 40 L 78 150 L 98 150 L 55 40 Z"
          fill="url(#vLeftGrad)"
        />
        {/* Right folding block of V with bright gradient and overlapping depth */}
        <path
          d="M 78 150 L 115 65 L 128 65 L 86 150 Z"
          fill="url(#vRightGrad)"
          opacity="0.9"
        />

        {/* --- Stylized "P" Component --- */}
        {/* Vertical straight stem of P */}
        <path
          d="M 112 65 L 112 150 L 126 150 L 126 65 Z"
          fill="#b91c1c"
        />

        {/* Swooping curved arc 1 (Outer arch) */}
        <path
          d="M 112 65 C 145 65, 175 80, 175 105 C 175 130, 145 145, 126 145 M 126 145 C 132 140, 138 130, 138 120"
          stroke="url(#pSwooshGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />

        {/* Swooping curved arc 2 (Middle swoosh) */}
        <path
          d="M 112 85 C 135 85, 155 95, 155 110 C 155 125, 135 135, 126 135"
          stroke="url(#vRightGrad)"
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
        />

        {/* Swooping curved arc 3 (Inner swoosh) */}
        <path
          d="M 112 105 C 125 105, 135 110, 135 118 C 135 126, 125 130, 120 130"
          stroke="#ef4444"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Brand Text */}
      {showText && (
        <div className={`${isHorizontal ? 'text-left' : 'mt-2'} select-none`}>
          <h2 className={`font-display font-extrabold uppercase tracking-tight leading-none ${titleColor} ${selectedSize.textTitle}`}>
            Vision Packaging
          </h2>
          <p className={`font-sans font-bold uppercase tracking-[0.25em] leading-none mt-1 ${tagColor} ${selectedSize.textTag}`}>
            Safe Inside
          </p>
          {showAddress && (
            <p className={`font-sans text-[9px] ${light ? 'text-slate-500' : 'text-slate-400'} mt-1.5 leading-relaxed font-medium ${isHorizontal ? 'max-w-[220px]' : 'max-w-[220px] mx-auto text-center'}`}>
              Plot 363,364 & 366 Sundar Industrial Estate, Raiwind Road, Lahore
            </p>
          )}
        </div>
      )}
    </div>
  );
};
