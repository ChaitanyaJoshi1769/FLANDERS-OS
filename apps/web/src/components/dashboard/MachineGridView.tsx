interface Machine {
  id: string;
  name: string;
  serialNumber: string;
  status: string;
  batteryLevel?: number;
  operatingHours?: number;
  locationLat?: number;
  locationLon?: number;
}

interface MachineGridViewProps {
  machines: Machine[];
}

export default function MachineGridView({ machines }: MachineGridViewProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      active: 'text-green-400',
      maintenance: 'text-yellow-400',
      inactive: 'text-gray-400',
      offline: 'text-red-400',
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {machines.map((machine) => (
        <div
          key={machine.id}
          className="bg-slate-700 rounded-lg p-4 border border-slate-600 hover:border-blue-500 transition cursor-pointer"
        >
          <h3 className="font-semibold text-white mb-2">{machine.name}</h3>
          <div className="space-y-1 text-sm text-slate-300">
            <p>Serial: {machine.serialNumber}</p>
            <p>
              Status:{' '}
              <span className={getStatusColor(machine.status)}>
                {machine.status}
              </span>
            </p>
            {machine.batteryLevel !== undefined && (
              <p>Battery: {machine.batteryLevel}%</p>
            )}
            {machine.operatingHours !== undefined && (
              <p>Hours: {machine.operatingHours}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
