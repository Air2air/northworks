import DocumentCard, { DocumentCardProps } from './DocumentCard';

export interface DocumentCardListProps {
  title: string;
  documents: DocumentCardProps[];
  className?: string;
}

/**
 * DocumentCardList - Container component for displaying a list of DocumentCards
 * Provides consistent spacing and layout for featured document sections
 */
export default function DocumentCardList({ 
  title, 
  documents, 
  className = "mb-12" 
}: DocumentCardListProps) {
  return (
    <div className={className}>
      <h2 className="section-heading">{title}</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {documents.map((doc, index) => (
          <DocumentCard
            key={index}
            title={doc.title}
            href={doc.href}
            description={doc.description}
            actionText={doc.actionText}
          />
        ))}
      </div>
    </div>
  );
}
