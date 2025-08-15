import { cleanTitle } from '@/lib/pathUtils';

interface PageTitleProps {
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function PageTitle({
  title,
  description,
  align = 'center',
  size = 'large',
  className = ''
}: PageTitleProps) {
  const getAlignmentClasses = (align: string) => {
    const alignmentMap = {
      left: 'text-left flex flex-col justify-center',
      center: 'text-center',
      right: 'text-right'
    };
    return alignmentMap[align as keyof typeof alignmentMap];
  };

  const getSizeClasses = (size: string) => {
    const sizeMap = {
      small: {
        container: 'mb-8',
        title: 'text-3xl',
        description: 'text-lg'
      },
      medium: {
        container: 'mb-10',
        title: 'text-4xl',
        description: 'text-xl'
      },
      large: {
        container: 'mb-12',
        title: 'text-3xl',
        description: 'text-xl'
      }
    };
    return sizeMap[size as keyof typeof sizeMap];
  };

  const alignment = getAlignmentClasses(align);
  const sizes = getSizeClasses(size);
  const cleanedTitle = cleanTitle(title);

  return (
    <div className={`${alignment} ${sizes.container} ${className} ${align === 'left' ? 'min-h-[200px]' : ''}`}>
      <div className={align === 'left' ? 'flex flex-col justify-center h-full' : ''}>
        <h1 className={`${sizes.title} font-bold text-gray-900 mb-6`}>
          {cleanedTitle}
        </h1>
        {description && (
          <p className={`${sizes.description} text-gray-600 max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
