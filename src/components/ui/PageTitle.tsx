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
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    };
    return alignmentMap[align as keyof typeof alignmentMap];
  };

  const getSizeClasses = (size: string) => {
    const sizeMap = {
      medium: {
        container: 'mb-4',
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
    <div className={`flex flex-col justify-end ${alignment} ${sizes.container} ${className} min-h-[160px]`}>
      <div>
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
