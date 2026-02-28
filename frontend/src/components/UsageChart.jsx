import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function CustomTooltip({ active, payload, label }) {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-neutral-100 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-semibold text-neutral-700">{label}</p>
        <p className="text-primary">{payload[0].value} toques</p>
      </div>
    );
  }
  return null;
}

export default function UsageChart({ data, type = 'daily' }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-neutral-400 text-sm">
        Sem dados para exibir
      </div>
    );
  }

  let chartData;

  if (type === 'daily') {
    // Dados diários: { '2024-01-01': 5, ... }
    chartData = Object.entries(data)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14)
      .map(([date, count]) => ({
        name: new Date(date + 'T12:00:00').toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        }),
        toques: count,
      }));
  } else if (type === 'hourly') {
    // Dados por hora: array de 24 posições
    chartData = (Array.isArray(data) ? data : []).map((count, hour) => ({
      name: `${hour}h`,
      toques: count,
    }));
  } else if (type === 'weekly') {
    // Dados por dia da semana: array de 7 posições
    chartData = (Array.isArray(data) ? data : []).map((count, day) => ({
      name: DIAS_SEMANA[day],
      toques: count,
    }));
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#F5F7FA" />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: '#9CA3AF' }}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#EBF0FF', radius: 4 }} />
        <Bar
          dataKey="toques"
          fill="#4F7FFF"
          radius={[6, 6, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
