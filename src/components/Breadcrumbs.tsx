import { Breadcrumb } from '@/types/content';
import Link from 'next/link';

interface BreadcrumbsProps {
  items: Breadcrumb[];
  maxWidth?: string; // Maximum width for truncation (e.g., '200px', '12rem')
}

export default function Breadcrumbs({ items, maxWidth = '200px' }: BreadcrumbsProps) {
  return (
    <nav className="flex px-4 py-3 text-sky-700 bg-sky-50" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 md:space-x-3 min-w-0 w-full">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={item.href} className={`flex items-center ${isLast ? 'flex-1 min-w-0' : 'flex-shrink-0'}`}>
              {index > 0 && (
                <svg
                  className="w-6 h-6 text-sky-200 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {item.active ? (
                <span 
                  className={`ml-1 md:ml-2 text-sm font-medium text-sky-900 ${isLast ? 'truncate min-w-0' : ''}`}
                  title={isLast ? item.label : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="ml-1 md:ml-2 text-sm font-medium text-sky-600 hover:text-sky-800 flex-shrink-0 no-underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
