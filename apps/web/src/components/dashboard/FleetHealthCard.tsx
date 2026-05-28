interface FleetHealthCardProps {
  title: string;
  value: number;
  unit?: string;
  total?: number;
  status?: 'active' | 'maintenance' | 'inactive' | 'critical' | 'healthy' | 'warning' | 'good';
}

export default function FleetHealthCard({
  title,
  value,
  unit = '',
  total,
  status = 'healthy',
}: FleetHealthCardProps) {
  const statusColors = {
    active: 'bg-green-900 border-green-700',
    maintenance: 'bg-yellow-900 border-yellow-700',
    inactive: 'bg-gray-800 border-gray-700',
    critical: 'bg-red-900 border-red-700',
    healthy: 'bg-green-900 border-green-700',
    warning: 'bg-yellow-900 border-yellow-700',
    good: 'bg-green-900 border-green-700',
  };

  return (
    <div className={`rounded-lg p-6 border ${statusColors[status] || statusColors.healthy}`}>
      <p className="text-sm text-slate-300 mb-2">{title}</p>
      <p className="text-3xl font-bold">
        {value}{unit}
      </p>
      {total !== undefined && (
        <p className="text-xs text-slate-400 mt-2">of {total} total</p>
      )}
    </div>
  );
}
