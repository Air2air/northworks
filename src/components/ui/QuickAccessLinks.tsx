import Link from 'next/link';
import { ReactNode } from 'react';

export interface QuickAccessItem {
  title: string;
  description: string;
  href: string;
  icon: string | ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'yellow';
}

interface QuickAccessLinksProps {
  title?: string;
  items: QuickAccessItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export default function QuickAccessLinks({
  title = 'Additional Resources',
  items,
  columns = 3,
  className = ''
}: QuickAccessLinksProps) {
  const getColorClasses = (color: string = 'blue') => {
    const colorMap = {
      blue: { border: 'hover:border-blue-300', text: 'group-hover:text-blue-600' },
      green: { border: 'hover:border-green-300', text: 'group-hover:text-green-600' },
      purple: { border: 'hover:border-purple-300', text: 'group-hover:text-purple-600' },
      orange: { border: 'hover:border-orange-300', text: 'group-hover:text-orange-600' },
      red: { border: 'hover:border-red-300', text: 'group-hover:text-red-600' },
      indigo: { border: 'hover:border-indigo-300', text: 'group-hover:text-indigo-600' },
      yellow: { border: 'hover:border-yellow-300', text: 'group-hover:text-yellow-600' }
    };
    return colorMap[color as keyof typeof colorMap];
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 mb-8 ${className}`}>
      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        {title}
      </h3>
      <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-6`}>
        {items.map((item, index) => {
          const colors = getColorClasses(item.color);
          return (
            <Link 
              key={index}
              href={item.href}
              className={`group p-4 border border-gray-200 rounded-lg ${colors.border} hover:shadow-md transition-all`}
            >
              <div className="text-center">
                <div className="text-3xl mb-2 flex justify-center items-center">
                  {typeof item.icon === 'string' ? item.icon : item.icon}
                </div>
                <h4 className={`font-medium text-gray-900 mb-1 ${colors.text}`}>
                  {item.title}
                </h4>
                <p className="text-sm text-gray-600">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
