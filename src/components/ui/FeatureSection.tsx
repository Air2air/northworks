import { ReactNode } from 'react';

interface FeatureSectionProps {
  title: string;
  icon?: string | ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'yellow';
  children: ReactNode;
  className?: string;
}

export default function FeatureSection({
  title,
  icon,
  color = 'blue',
  children,
  className = ''
}: FeatureSectionProps) {
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        gradient: 'from-blue-50 to-blue-100',
        border: 'border-blue-200'
      },
      green: {
        gradient: 'from-green-50 to-green-100',
        border: 'border-green-200'
      },
      purple: {
        gradient: 'from-purple-50 to-purple-100',
        border: 'border-purple-200'
      },
      orange: {
        gradient: 'from-orange-50 to-orange-100',
        border: 'border-orange-200'
      },
      red: {
        gradient: 'from-red-50 to-red-100',
        border: 'border-red-200'
      },
      indigo: {
        gradient: 'from-indigo-50 to-indigo-100',
        border: 'border-indigo-200'
      },
      yellow: {
        gradient: 'from-yellow-50 to-yellow-100',
        border: 'border-yellow-200'
      }
    };
    return colorMap[color as keyof typeof colorMap];
  };

  const colors = getColorClasses(color);

  return (
    <div className={`bg-gradient-to-br ${colors.gradient} rounded-xl p-8 mb-8 border ${colors.border} ${className}`}>
      <div className="flex items-center mb-6">
        {icon && (
          <div className="text-4xl mr-4 flex items-center">
            {typeof icon === 'string' ? icon : icon}
          </div>
        )}
        <h2 className="text-2xl font-semibold text-gray-900">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}
