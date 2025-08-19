import { NavigationItem } from '@/types/content';
import Link from 'next/link';
import { FaCompass } from 'react-icons/fa';

interface NavigationProps {
  items: NavigationItem[];
}

export default function Navigation({ items }: NavigationProps) {
  return (
    <nav className="bg-sky-700 border-b border-sky-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2 text-2xl font-bold text-white no-underline">
                <FaCompass className="w-6 h-6 text-sky-300" />
                <span>NorthWorks</span>
              </Link>
            </div>
          </div>
          <div className="flex space-x-8">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 border-b-3 tex font-medium no-underline ${
                  item.active
                    ? 'border-white text-white'
                    : 'border-transparent text-sky-200 hover:text-white hover:border-sky-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
