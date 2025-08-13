import Link from 'next/link';
import { ReactNode } from 'react';

export interface NavigationCardProps {
  title: string;
  description: string;
  href: string;
  icon: string | ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'yellow';
  tags?: string[];
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function NavigationCard({
  title,
  description,
  href,
  icon,
  color = 'blue',
  tags = [],
  size = 'large',
  className = ''
}: NavigationCardProps) {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        gradient: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        hover: 'group-hover:text-blue-600',
        hoverArrow: 'group-hover:text-blue-700',
        arrow: 'text-blue-600',
        tagBg: 'bg-blue-200',
        tagText: 'text-blue-800'
      },
      green: {
        gradient: 'from-green-50 to-green-100',
        border: 'border-green-200',
        hover: 'group-hover:text-green-600',
        hoverArrow: 'group-hover:text-green-700',
        arrow: 'text-green-600',
        tagBg: 'bg-green-200',
        tagText: 'text-green-800'
      },
      purple: {
        gradient: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        hover: 'group-hover:text-purple-600',
        hoverArrow: 'group-hover:text-purple-700',
        arrow: 'text-purple-600',
        tagBg: 'bg-purple-200',
        tagText: 'text-purple-800'
      },
      orange: {
        gradient: 'from-orange-50 to-orange-100',
        border: 'border-orange-200',
        hover: 'group-hover:text-orange-600',
        hoverArrow: 'group-hover:text-orange-700',
        arrow: 'text-orange-600',
        tagBg: 'bg-orange-200',
        tagText: 'text-orange-800'
      },
      red: {
        gradient: 'from-red-50 to-red-100',
        border: 'border-red-200',
        hover: 'group-hover:text-red-600',
        hoverArrow: 'group-hover:text-red-700',
        arrow: 'text-red-600',
        tagBg: 'bg-red-200',
        tagText: 'text-red-800'
      },
      indigo: {
        gradient: 'from-indigo-50 to-indigo-100',
        border: 'border-indigo-200',
        hover: 'group-hover:text-indigo-600',
        hoverArrow: 'group-hover:text-indigo-700',
        arrow: 'text-indigo-600',
        tagBg: 'bg-indigo-200',
        tagText: 'text-indigo-800'
      },
      yellow: {
        gradient: 'from-yellow-50 to-yellow-100',
        border: 'border-yellow-200',
        hover: 'group-hover:text-yellow-600',
        hoverArrow: 'group-hover:text-yellow-700',
        arrow: 'text-yellow-600',
        tagBg: 'bg-yellow-200',
        tagText: 'text-yellow-800'
      }
    };
    return colorMap[color as keyof typeof colorMap];
  };

  const getSizeClasses = (size: string) => {
    const sizeMap = {
      small: {
        container: 'p-4',
        icon: 'text-2xl mr-3',
        title: 'text-lg',
        description: 'text-sm'
      },
      medium: {
        container: 'p-6',
        icon: 'text-3xl mr-4',
        title: 'text-xl',
        description: 'text-base'
      },
      large: {
        container: 'p-8',
        icon: 'text-4xl mr-4',
        title: 'text-2xl',
        description: 'text-base'
      }
    };
    return sizeMap[size as keyof typeof sizeMap];
  };

  const colors = getColorClasses(color);
  const sizes = getSizeClasses(size);

  // Build the complete className string to avoid template literal issues
  const cardClasses = [
    'group',
    'bg-gradient-to-br',
    colors.gradient,
    'rounded-xl',
    sizes.container,
    'hover:shadow-xl',
    'transition-all',
    'duration-300',
    'border',
    colors.border,
    'block', // Ensure it's a block element
    className
  ].filter(Boolean).join(' ');

  return (
    <Link 
      href={href}
      className={cardClasses}
    >
      <div className="flex items-center mb-4">
        <div className={`${sizes.icon} flex items-center justify-center`}>
          {typeof icon === 'string' ? (
            <span dangerouslySetInnerHTML={{ __html: icon }} />
          ) : (
            <div className="text-current">{icon}</div>
          )}
        </div>
        <h2 className={`${sizes.title} font-bold text-gray-900 ${colors.hover}`}>
          {title}
        </h2>
      </div>
      
      <p className={`text-gray-700 mb-4 ${sizes.description}`}>
        {description}
      </p>
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, index) => (
            <span 
              key={index}
              className={`px-3 py-1 ${colors.tagBg} ${colors.tagText} rounded-full text-sm`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className={`${colors.arrow} font-medium ${colors.hoverArrow}`}>
        {title.toLowerCase().includes('complete') ? 'View All' :
         title.toLowerCase().includes('index') ? 'Browse' : 
         title.toLowerCase().includes('service') ? 'Details' :
         title.toLowerCase().includes('background') ? 'About' :
         'View'} →
      </div>
    </Link>
  );
}
