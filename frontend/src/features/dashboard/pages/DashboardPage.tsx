import { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Clock, Zap, AlertTriangle, Users, Activity, RefreshCw, Cpu, Database } from 'lucide-react';
import { KpiCard } from '../../../components/data-display/KpiCard';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

// Mock real-time metrics time-series data
const generateTimeSeriesData = () => {
  const points = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60000);
    const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    points.push({
      time: timeStr,
      avgLatency: Math.floor(120 + Math.random() * 45),
      p95Latency: Math.floor(280 + Math.random() * 90),
      p99Latency: Math.floor(650 + Math.random() * 210),
      rps: Math.floor(1100 + Math.random() * 350),
      errors: (Math.random() * 0.8).toFixed(2),
      cpu: Math.floor(45 + Math.random() * 25),
      memory: Math.floor(60 + Math.random() * 15),
    });
  }
  return points;
};

export function DashboardPage() {
  const [data, setData] = useState(generateTimeSeriesData);

  const handleRefresh = () => {
    setData(generateTimeSeriesData());
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Performance Observatory</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time telemetry, latency percentiles, throughput metrics, and backend health
          </p>
        </div>

        <Button onClick={handleRefresh} variant="outline" size="sm" className="gap-2 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Telemetry
        </Button>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <KpiCard
          title="Avg Latency"
          value="142"
          unit="ms"
          change={-3.4}
          isPositiveGood={false}
          icon={Clock}
          subtitle="Target < 200ms"
        />
        <KpiCard
          title="P95 Latency"
          value="315"
          unit="ms"
          change={-1.2}
          isPositiveGood={false}
          icon={Clock}
          subtitle="95% under threshold"
        />
        <KpiCard
          title="P99 Latency"
          value="720"
          unit="ms"
          change={+4.1}
          isPositiveGood={false}
          icon={Clock}
          subtitle="Tail latency spike"
        />
        <KpiCard
          title="Throughput"
          value="1,248"
          unit="req/s"
          change={+8.5}
          isPositiveGood={true}
          icon={Zap}
          subtitle="Peak 1,600 RPS"
        />
        <KpiCard
          title="Error Rate"
          value="0.24"
          unit="%"
          change={-0.1}
          isPositiveGood={false}
          icon={AlertTriangle}
          subtitle="SLA 99.9% Met"
        />
        <KpiCard
          title="Active VUs"
          value="120"
          unit="users"
          change={+12.0}
          isPositiveGood={true}
          icon={Users}
          subtitle="Load Scenario active"
        />
      </div>

      {/* Charts Grid 2x2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Over Time */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Latency & Percentile Distribution (ms)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="time" stroke="#737373" fontSize={10} />
                <YAxis stroke="#737373" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line type="monotone" dataKey="avgLatency" name="Avg Latency" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="p95Latency" name="P95 Latency" stroke="#a855f7" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="p99Latency" name="P99 Latency" stroke="#f43f5e" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Throughput (RPS) */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" /> Throughput (Requests Per Second)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="time" stroke="#737373" fontSize={10} />
                <YAxis stroke="#737373" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: '12px' }} />
                <Area type="monotone" dataKey="rps" name="RPS" stroke="#10b981" fillOpacity={1} fill="url(#colorRps)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Error Rate */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> HTTP Error Rate (%)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="time" stroke="#737373" fontSize={10} />
                <YAxis stroke="#737373" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: '12px' }} />
                <Bar dataKey="errors" name="Error %" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Backend Infrastructure Health */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-400" /> Infrastructure Resource Utilization (%)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-72 pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="time" stroke="#737373" fontSize={10} />
                <YAxis stroke="#737373" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#404040', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="cpu" name="CPU Usage %" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                <Area type="monotone" dataKey="memory" name="RAM Usage %" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.2} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
