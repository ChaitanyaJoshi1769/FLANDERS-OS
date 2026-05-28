'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface TrendDataPoint {
  timestamp: string;
  averageUtilization: number;
  averageFuelConsumption: string;
  averageTemperature: string;
}

interface UtilizationChartProps {
  data: TrendDataPoint[];
}

export default function UtilizationChart({ data }: UtilizationChartProps) {
  const chartData = data.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    utilization: point.averageUtilization,
    temperature: parseFloat(point.averageTemperature),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
        <XAxis
          dataKey="time"
          stroke="#94a3b8"
          style={{ fontSize: '12px' }}
        />
        <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '8px',
          }}
          labelStyle={{ color: '#e2e8f0' }}
        />
        <Line
          type="monotone"
          dataKey="utilization"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          name="Utilization %"
        />
        <Line
          type="monotone"
          dataKey="temperature"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={false}
          name="Temperature °C"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
