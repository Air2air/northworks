import { NavigationItem } from '@/types/content';
import Link from 'next/link';

interface NavigationProps {
  items: NavigationItem[];
}

export default function Navigation({ items }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-sky-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-sky-900">
                NorthWorks
              </Link>
            </div>
          </div>
          <div className="flex space-x-8">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  item.active
                    ? 'border-sky-500 text-sky-900'
                    : 'border-transparent text-sky-500 hover:text-sky-700 hover:border-sky-300'
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
