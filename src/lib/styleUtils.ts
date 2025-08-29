/**
 * UNIFIED STYLING UTILITIES
 * =========================
 * 
 * Consolidates styling patterns, class generation, and responsive behavior
 * used across components like UnifiedCard, SectionCard, UnifiedList, etc.
 */

// ===============================================
// SIZE SYSTEM
// ===============================================

export type SizeVariant = 'small' | 'medium' | 'large' | 'xl';

export interface SizeConfig {
  padding: string;
  text: {
    title: string;
    body: string;
    meta: string;
  };
  spacing: {
    vertical: string;
    horizontal: string;
    gap: string;
  };
  image: {
    width: string;
    height: string;
  };
}

export const SIZE_CONFIGS: Record<SizeVariant, SizeConfig> = {
  small: {
    padding: "p-3 sm:p-4",
    text: {
      title: "text-base font-semibold leading-tight",
      body: "text-sm leading-relaxed",
      meta: "text-xs"
    },
    spacing: {
      vertical: "space-y-2",
      horizontal: "space-x-2", 
      gap: "gap-2"
    },
    image: {
      width: "w-16 sm:w-20",
      height: "h-16 sm:h-20"
    }
  },
  medium: {
    padding: "p-4 sm:p-5 lg:p-6",
    text: {
      title: "text-lg font-semibold leading-tight",
      body: "text-sm leading-relaxed",
      meta: "text-sm"
    },
    spacing: {
      vertical: "space-y-3",
      horizontal: "space-x-3",
      gap: "gap-3"
    },
    image: {
      width: "w-20 sm:w-24 md:w-32",
      height: "h-20 sm:h-24 md:h-32"
    }
  },
  large: {
    padding: "p-5 sm:p-6 lg:p-8",
    text: {
      title: "text-xl font-semibold leading-tight",
      body: "text-base leading-relaxed",
      meta: "text-sm"
    },
    spacing: {
      vertical: "space-y-4",
      horizontal: "space-x-4",
      gap: "gap-4"
    },
    image: {
      width: "w-24 sm:w-32 md:w-40",
      height: "h-24 sm:h-32 md:h-40"
    }
  },
  xl: {
    padding: "p-6 sm:p-8 lg:p-10",
    text: {
      title: "text-2xl font-semibold leading-tight",
      body: "text-base leading-relaxed",
      meta: "text-base"
    },
    spacing: {
      vertical: "space-y-6",
      horizontal: "space-x-6",
      gap: "gap-6"
    },
    image: {
      width: "w-32 sm:w-40 md:w-48",
      height: "h-32 sm:h-40 md:h-48"
    }
  }
};

// ===============================================
// LAYOUT SYSTEM
// ===============================================

export type LayoutVariant = 'horizontal' | 'vertical' | 'minimal' | 'detailed';

export interface LayoutConfig {
  container: string;
  content: string;
  image: string;
  responsive: {
    base: string;
    md: string;
    lg: string;
  };
}

export const LAYOUT_CONFIGS: Record<LayoutVariant, LayoutConfig> = {
  horizontal: {
    container: "flex flex-col md:flex-row",
    content: "flex flex-col justify-between flex-1",
    image: "md:w-1/3 lg:w-1/4",
    responsive: {
      base: "min-h-40 sm:min-h-48",
      md: "md:min-h-32 md:h-auto",
      lg: "lg:min-h-36"
    }
  },
  vertical: {
    container: "flex flex-col",
    content: "flex flex-col flex-1",
    image: "w-full",
    responsive: {
      base: "min-h-48 sm:min-h-56",
      md: "md:min-h-64",
      lg: "lg:min-h-72"
    }
  },
  minimal: {
    container: "flex flex-row items-center",
    content: "flex-1 min-w-0",
    image: "flex-shrink-0",
    responsive: {
      base: "h-16 sm:h-20",
      md: "md:h-24",
      lg: "lg:h-28"
    }
  },
  detailed: {
    container: "flex flex-col",
    content: "flex flex-col flex-1",
    image: "w-full",
    responsive: {
      base: "min-h-64 sm:min-h-80",
      md: "md:min-h-96",
      lg: "lg:min-h-[28rem]"
    }
  }
};

// ===============================================
// COLOR & VARIANT SYSTEM
// ===============================================

export type ColorVariant = 'default' | 'primary' | 'secondary' | 'accent' | 'muted';

export interface ColorConfig {
  background: string;
  border: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  hover: {
    background: string;
    border: string;
  };
}

export const COLOR_CONFIGS: Record<ColorVariant, ColorConfig> = {
  default: {
    background: "bg-white",
    border: "border-gray-200",
    text: {
      primary: "text-gray-900",
      secondary: "text-gray-600",
      accent: "text-sky-600"
    },
    hover: {
      background: "hover:bg-gray-50",
      border: "hover:border-gray-300"
    }
  },
  primary: {
    background: "bg-sky-50",
    border: "border-sky-200",
    text: {
      primary: "text-sky-900",
      secondary: "text-sky-700",
      accent: "text-sky-600"
    },
    hover: {
      background: "hover:bg-sky-100",
      border: "hover:border-sky-300"
    }
  },
  secondary: {
    background: "bg-purple-50", 
    border: "border-purple-200",
    text: {
      primary: "text-purple-900",
      secondary: "text-purple-700",
      accent: "text-purple-600"
    },
    hover: {
      background: "hover:bg-purple-100",
      border: "hover:border-purple-300"
    }
  },
  accent: {
    background: "bg-green-50",
    border: "border-green-200", 
    text: {
      primary: "text-green-900",
      secondary: "text-green-700",
      accent: "text-green-600"
    },
    hover: {
      background: "hover:bg-green-100",
      border: "hover:border-green-300"
    }
  },
  muted: {
    background: "bg-gray-50",
    border: "border-gray-100",
    text: {
      primary: "text-gray-800",
      secondary: "text-gray-500", 
      accent: "text-gray-600"
    },
    hover: {
      background: "hover:bg-gray-100",
      border: "hover:border-gray-200"
    }
  }
};

// ===============================================
// UTILITY FUNCTIONS  
// ===============================================

export function getSizeConfig(size: SizeVariant): SizeConfig {
  return SIZE_CONFIGS[size];
}

export function getLayoutConfig(layout: LayoutVariant): LayoutConfig {
  return LAYOUT_CONFIGS[layout];
}

export function getColorConfig(variant: ColorVariant): ColorConfig {
  return COLOR_CONFIGS[variant];
}

export function buildCardClasses(
  size: SizeVariant = 'medium',
  layout: LayoutVariant = 'horizontal', 
  variant: ColorVariant = 'default',
  interactive: boolean = false,
  className: string = ''
): string {
  const sizeConfig = getSizeConfig(size);
  const layoutConfig = getLayoutConfig(layout);
  const colorConfig = getColorConfig(variant);

  const baseClasses = [
    // Base card structure
    "unified-card",
    "rounded-lg shadow-md overflow-hidden transition-shadow",
    
    // Color scheme
    colorConfig.background,
    colorConfig.border,
    "border",
    
    // Layout configuration
    layoutConfig.container,
    
    // Size-based responsive behavior
    layoutConfig.responsive.base,
    layoutConfig.responsive.md,
    layoutConfig.responsive.lg,
    
    // Interactive states
    interactive ? "cursor-pointer hover:shadow-lg" : "",
    interactive ? colorConfig.hover.background : "",
    
    // Touch optimization
    "touch-manipulation",
    
    // Custom classes
    className
  ];

  return baseClasses.filter(Boolean).join(' ');
}

export function buildContentClasses(
  size: SizeVariant = 'medium',
  layout: LayoutVariant = 'horizontal'
): string {
  const sizeConfig = getSizeConfig(size);
  const layoutConfig = getLayoutConfig(layout);

  return [
    layoutConfig.content,
    sizeConfig.padding
  ].join(' ');
}

export function buildImageClasses(
  size: SizeVariant = 'medium',
  layout: LayoutVariant = 'horizontal',
  position: 'left' | 'right' | 'top' | 'background' = 'left'
): string {
  const sizeConfig = getSizeConfig(size);
  const layoutConfig = getLayoutConfig(layout);

  const baseClasses = [
    "flex-shrink-0 overflow-hidden"
  ];

  // Layout-specific classes
  if (layout === 'horizontal') {
    baseClasses.push(
      position === 'right' ? 'order-last' : '',
      layoutConfig.image
    );
  } else if (layout === 'vertical') {
    baseClasses.push(layoutConfig.image);
  } else if (layout === 'minimal') {
    baseClasses.push(
      sizeConfig.image.width,
      sizeConfig.image.height,
      "rounded-md"
    );
  }

  return baseClasses.filter(Boolean).join(' ');
}

export function buildTextClasses(
  textType: 'title' | 'body' | 'meta',
  size: SizeVariant = 'medium',
  variant: ColorVariant = 'default'
): string {
  const sizeConfig = getSizeConfig(size);
  const colorConfig = getColorConfig(variant);

  const baseClasses = [sizeConfig.text[textType]];

  // Add color based on text type
  switch (textType) {
    case 'title':
      baseClasses.push(colorConfig.text.primary);
      break;
    case 'body':
      baseClasses.push(colorConfig.text.secondary);
      break;
    case 'meta':
      baseClasses.push(colorConfig.text.accent);
      break;
  }

  return baseClasses.join(' ');
}

export function buildSpacingClasses(
  direction: 'vertical' | 'horizontal' | 'gap',
  size: SizeVariant = 'medium'
): string {
  const sizeConfig = getSizeConfig(size);
  return sizeConfig.spacing[direction];
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

export function getResponsiveImageSizes(layout: LayoutVariant): string {
  switch (layout) {
    case 'horizontal':
      return '(max-width: 768px) 100vw, 33vw';
    case 'vertical':
      return '(max-width: 768px) 100vw, 50vw';
    case 'minimal':
      return '96px';
    case 'detailed':
      return '100vw';
    default:
      return '50vw';
  }
}
