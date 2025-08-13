export interface StatItem {
  value: string | number;
  label: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo' | 'yellow';
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}

export default function StatsGrid({
  stats,
  columns = 4,
  className = ''
}: StatsGridProps) {
  const getColorClasses = (color: StatItem['color'] = 'blue') => {
    const colorMap = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
      indigo: 'text-indigo-600',
      yellow: 'text-yellow-600'
    };
    return colorMap[color];
  };

  const gridClasses = `grid grid-cols-1 md:grid-cols-${columns} gap-6 mb-12`;

  return (
    <div className={`${gridClasses} ${className}`}>
      {stats.map((stat, index) => (
        <div 
          key={index}
          className="bg-white rounded-lg shadow-lg p-6 text-center"
        >
          <div className={`text-3xl font-bold ${getColorClasses(stat.color)} mb-2`}>
            {stat.value}
          </div>
          <div className="text-sm text-gray-600">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
