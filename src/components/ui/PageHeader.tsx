interface PageHeaderProps {
  title: string;
  description: string;
  gradientFrom?: string;
  gradientTo?: string;
  centerAlign?: boolean;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  gradientFrom = 'blue-500',
  gradientTo = 'purple-600',
  centerAlign = true,
  className = ''
}: PageHeaderProps) {
  const containerClasses = centerAlign 
    ? 'text-center mb-12' 
    : 'mb-12';

  const descriptionClasses = centerAlign
    ? 'text-lg text-gray-600 max-w-3xl mx-auto'
    : 'text-lg text-gray-600 max-w-3xl';

  return (
    <div className={`${containerClasses} ${className}`}>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h1>
      <div className={`w-24 h-1 bg-gradient-to-r from-${gradientFrom} to-${gradientTo} ${centerAlign ? 'mx-auto' : ''} mb-6`}></div>
      <p className={descriptionClasses}>
        {description}
      </p>
    </div>
  );
}
