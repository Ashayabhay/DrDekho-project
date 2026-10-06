import React from 'react';
import Image from 'next/image';

export interface LogoProps {
  /**
   * 'default' for light backgrounds (Header)
   * 'inverse' for dark backgrounds (Footer)
   */
  variant?: 'default' | 'inverse';
  /**
   * Responsive size presets or override with custom className
   */
  size?: 'header' | 'footer' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  priority?: boolean;
}

export function Logo({
  variant = 'default',
  size = 'header',
  className = '',
  priority = false,
}: LogoProps) {
  const src = variant === 'inverse' ? '/logo-inverse.png' : '/logo.png';

  // Responsive size presets ensuring high-DPI sharpness and clear legibility
  let sizeClasses = '';
  switch (size) {
    case 'header':
      // Clear, crisp, and prominent across mobile, tablet, and desktop
      sizeClasses = 'h-16 sm:h-18 md:h-[82px] lg:h-[90px]';
      break;
    case 'footer':
      // Prominent, commanding footer brand identity
      sizeClasses = 'h-26 sm:h-30 md:h-36';
      break;
    case 'sm':
      sizeClasses = 'h-12 sm:h-14';
      break;
    case 'md':
      sizeClasses = 'h-16 sm:h-20';
      break;
    case 'lg':
      sizeClasses = 'h-24 sm:h-28';
      break;
    case 'xl':
      sizeClasses = 'h-32 sm:h-40';
      break;
    default:
      sizeClasses = 'h-16 sm:h-20';
  }

  return (
    <Image
      src={src}
      alt="Dr Khojo - Find. Compare. Book."
      width={849}
      height={675}
      quality={100}
      priority={priority}
      className={`${sizeClasses} w-auto object-contain select-none transition-transform duration-200 ${className}`.trim()}
      style={{
        imageRendering: 'auto',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    />
  );
}
