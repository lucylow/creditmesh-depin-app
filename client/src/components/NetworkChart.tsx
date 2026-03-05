import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const epochData = [
  { epoch: 50, devices: 800, rewards: 32000 },
  { epoch: 52, devices: 950, rewards: 38000 },
  { epoch: 54, devices: 1050, rewards: 41000 },
  { epoch: 56, devices: 1150, rewards: 44000 },
  { epoch: 58, devices: 1200, rewards: 45000 },
  { epoch: 60, devices: 1230, rewards: 45500 },
  { epoch: 62, devices: 1247, rewards: 45832 },
];

const deviceTypeData = [
  { type: "Sensors", count: 620, fill: "#06b6d4" },
  { type: "Gateways", count: 410, fill: "#ec4899" },
  { type: "Verifiers", count: 217, fill: "#8b5cf6" },
];

export function NetworkChart() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Growth Chart */}
      <div className="card-blueprint">
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Network Growth</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={epochData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="epoch" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
              <Line
                type="monotone"
                dataKey="devices"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: "#06b6d4", r: 5 }}
                activeDot={{ r: 7 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-600 mt-4 text-center">Active devices per epoch</p>
        </div>
      </div>

      {/* Device Type Distribution */}
      <div className="card-blueprint">
        <div className="relative z-10">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Device Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={deviceTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="type" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #475569",
                  borderRadius: "8px",
                  color: "#f1f5f9",
                }}
              />
              <Bar dataKey="count" fill="#06b6d4" isAnimationActive={true} animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-xs text-slate-600 mt-4 text-center">Devices by type</p>
        </div>
      </div>
    </div>
  );
}
