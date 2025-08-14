/**
 * Enhanced Navigation Component
 * Provides easy access to all content pages and search functionality
 */

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaHome, 
  FaMusic, 
  FaNewspaper, 
  FaBriefcase, 
  FaListAlt, 
  FaSearch 
} from 'react-icons/fa';

interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
}

const navigationItems: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    description: 'Welcome to NorthWorks',
    icon: <FaHome className="w-5 h-5" />
  },
  {
    href: '/interviews',
    label: 'Interviews',
    description: 'Classical music interviews',
    icon: <FaMusic className="w-5 h-5" />,
    badge: '68'
  },
  {
    href: '/articles',
    label: 'Articles',
    description: 'Reviews and articles',
    icon: <FaNewspaper className="w-5 h-5" />,
    badge: '45+'
  },
  {
    href: '/warner-portfolio',
    label: 'Portfolio',
    description: 'Warner North professional portfolio',
    icon: <FaBriefcase className="w-5 h-5" />,
    badge: '850+'
  },
  {
    href: '/lists',
    label: 'Lists',
    description: 'Structured professional data',
    icon: <FaListAlt className="w-5 h-5" />,
    badge: '23'
  },
  {
    href: '/search',
    label: 'Search',
    description: 'Unified cross-domain search',
    icon: <FaSearch className="w-5 h-5" />
  }
];

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">Northworks</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-purple-100 text-purple-900'
                    : 'text-gray-700 hover:text-purple-900 hover:bg-purple-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 px-2 py-0.5 text-xs bg-purple-600 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    pathname === item.href
                      ? 'bg-purple-100 text-purple-900'
                      : 'text-gray-700 hover:text-purple-900 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs bg-purple-600 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Overview Banner */}
      {pathname === '/' && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Explore Our Content</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {navigationItems.slice(1).map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all"
                >
                  <div className="flex flex-col items-center text-center">
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-purple-600 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{item.description}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
