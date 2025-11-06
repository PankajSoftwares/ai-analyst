import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function ChartBox({ benchmarks }) {
  const data = benchmarks.map(benchmark => ({
    metric: benchmark.metric,
    value: benchmark.value,
    sectorMedian: benchmark.sector_median,
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="metric" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#3b82f6" name="Startup Value" />
          <Bar dataKey="sectorMedian" fill="#10b981" name="Sector Median" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ChartBox;
