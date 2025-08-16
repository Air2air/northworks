interface PublicationInfoProps {
  date?: string | null;
  publication?: string;
  section?: string;
  author?: string;
  title?: string;
  className?: string;
}

export default function PublicationInfo({
  date,
  publication,
  section,
  author,
  title = "Publication Information",
  className = ''
}: PublicationInfoProps) {
  // Don't render if no data is provided
  if (!date && !publication && !section && !author) {
    return null;
  }

  return (
    <div className={`bg-blue-50 rounded-lg p-4 mb-6 ${className}`}>
      <div className="text-sm text-blue-900 space-y-1">
        {date && (
          <div>
            <span className="text-gray-400 uppercase font-bold">Date:</span> {date}
          </div>
        )}
        {publication && (
          <div>
            <span className="text-gray-400 uppercase font-bold">Publication:</span> {publication}
          </div>
        )}
        {section && (
          <div>
            <span className="text-gray-400 uppercase font-bold">Section:</span> {section}
          </div>
        )}
        {author && (
          <div>
            <span className="text-gray-400 uppercase font-bold">Author:</span> {author}
          </div>
        )}
      </div>
    </div>
  );
}
