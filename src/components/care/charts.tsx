import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { adherenceTrend, medicationAdherence, weeklyAdherence } from "@/lib/demo-data";

const axis = {
  stroke: "var(--color-muted-foreground)",
  fontSize: 12,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--color-border)",
  background: "var(--color-card)",
  boxShadow: "var(--shadow-soft)",
  fontSize: 12,
};

export function WeeklyDosesChart() {
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={weeklyAdherence} barGap={4}>
          <CartesianGrid vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="day" {...axis} />
          <YAxis domain={[0, 4]} ticks={[0, 2, 4]} {...axis} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-secondary)" }} />
          <Bar dataKey="planned" name="Planned doses" fill="var(--color-secondary)" radius={[6, 6, 0, 0]} />
          <Bar
            dataKey="taken"
            name="Acknowledged"
            fill="var(--color-primary)"
            radius={[6, 6, 0, 0]}
            animationDuration={900}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MedicationAdherenceChart() {
  const colors = ["var(--color-chart-1)", "var(--color-chart-4)", "var(--color-chart-3)"];
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={medicationAdherence} layout="vertical" margin={{ left: 12, right: 24 }}>
          <CartesianGrid horizontal={false} stroke="var(--color-border)" />
          <XAxis type="number" domain={[0, 100]} unit="%" {...axis} />
          <YAxis type="category" dataKey="medicine" width={92} {...axis} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--color-secondary)" }} formatter={(v) => `${v}%`} />
          <Bar dataKey="value" name="Adherence" radius={[0, 8, 8, 0]} animationDuration={900}>
            {medicationAdherence.map((entry, i) => (
              <Cell key={entry.medicine} fill={colors[i % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AdherenceTrendChart() {
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={adherenceTrend}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="var(--color-border)" />
          <XAxis dataKey="week" {...axis} />
          <YAxis domain={[60, 100]} unit="%" {...axis} />
          <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
          <Area
            type="monotone"
            dataKey="value"
            name="Adherence"
            stroke="var(--color-primary)"
            strokeWidth={2.5}
            fill="url(#trendFill)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
