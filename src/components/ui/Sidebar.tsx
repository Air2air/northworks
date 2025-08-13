import { ReactNode } from 'react';
import NavigationCard, { NavigationCardProps } from './NavigationCard';
import Image from 'next/image';

interface SidebarSection {
  title: string;
  content: ReactNode;
}

interface SidebarProps {
  title?: string;
  cards?: Omit<NavigationCardProps, 'className'>[];
  sections?: SidebarSection[];
  image?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  skills?: string[];
  className?: string;
}

export default function Sidebar({
  title,
  cards = [],
  sections = [],
  image,
  skills = [],
  className = ''
}: SidebarProps) {
  return (
    <div className={`lg:col-span-1 ${className}`}>
      <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
        {title && (
          <h3 className="text-xl font-semibold text-gray-900 mb-6">{title}</h3>
        )}
        
        {/* Navigation Cards */}
        {cards.length > 0 && (
          <div className="space-y-4 mb-6">
            {cards.map((card, index) => (
              <NavigationCard
                key={index}
                title={card.title}
                description={card.description}
                href={card.href}
                icon={card.icon}
                color={card.color}
                size={card.size}
                tags={card.tags}
              />
            ))}
          </div>
        )}

        {/* Image Section */}
        {image && (
          <div className="mb-6">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="mx-auto"
            />
          </div>
        )}

        {/* Additional Sections */}
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h4 className="font-medium text-gray-900 mb-3">{section.title}</h4>
            {section.content}
          </div>
        ))}

        {/* Skills/Tags Section */}
        {skills.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Key Expertise</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span 
                  key={skill}
                  className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
