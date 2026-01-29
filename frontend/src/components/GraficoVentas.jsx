import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const GraficoVentas = ({ datos, titulo, subtitulo }) => {
  return (
    <div className="w-full h-80" style={{ minHeight: "320px" }}>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="dia" />
          <YAxis tickFormatter={(value) => `$${value}`} />
          <Tooltip formatter={(value) => [`$${value}`, "Ventas"]} />
          <Legend />
          <Bar dataKey="ventas" fill="#8c0315" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
