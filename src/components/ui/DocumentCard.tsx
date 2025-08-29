import Link from 'next/link';

export interface DocumentCardProps {
  title: string;
  href: string;
  description: string;
  actionText?: string;
}

/**
 * DocumentCard - A specialized card component for displaying document links
 * Used on collection listing pages to showcase featured documents with descriptions
 */
export default function DocumentCard({ 
  title, 
  href, 
  description, 
  actionText = "View Details" 
}: DocumentCardProps) {
  return (
    <div className="card-base card-hover p-6 border border-gray-200">
      <div className="flex-responsive">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            <Link
              href={href}
              className="link-primary"
            >
              {title}
            </Link>
          </h3>
          <p className="text-metadata">{description}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <Link
            href={href}
            className="link-action"
          >
            {actionText}
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
