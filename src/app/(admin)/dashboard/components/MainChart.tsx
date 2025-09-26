"use client";

import { Card } from "@/components/ui/card";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface MainChartProps {
  applicationsData: Array<{ name: string; candidatures: number }>;
  hiresData: Array<{ name: string; embauches: number }>;
  sectorsData: Array<{
    libelle: string;
    _count: { applications: number; hires: number };
  }>;
  conversionRate: number;
}

export default function MainChart({
  applicationsData,
  hiresData,
  sectorsData,
  conversionRate
}: MainChartProps) {

  // Combiner les données pour le graphique principal
  const combinedData = applicationsData.map(app => {
    const hire = hiresData.find(h => h.name === app.name);
    return {
      name: app.name,
      candidatures: app.candidatures,
      embauches: hire?.embauches || 0
    };
  });

  // Données pour le graphique en secteurs (top 5 secteurs avec des candidatures)
  const pieData = sectorsData
    .filter(sector => sector._count.applications > 0)
    .slice(0, 5)
    .map((sector, index) => ({
      name: sector.libelle,
      value: sector._count.applications,
      color: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'][index]
    }));

  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Graphique principal - Candidatures vs Embauches */}
      <Card className="col-span-2 p-6 shadow-none border-none">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Candidatures vs Embauches (6 derniers mois)</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
              <span>Candidatures</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
              <span>Embauches</span>
            </div>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={combinedData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="candidatures"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="embauches"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Graphique en barres - Top secteurs */}
      <Card className="p-6 shadow-none border-none">
        <h3 className="text-lg font-medium mb-4">Top secteurs (candidatures)</h3>
        <div className="h-[250px]">
          {sectorsData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sectorsData.slice(0, 5)}
                layout="horizontal"
                margin={{ left: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="libelle" type="category" width={80} />
                <Tooltip
                  formatter={(value: number) => [value, 'Candidatures']}
                />
                <Bar dataKey="_count.applications" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <span className="text-4xl block mb-2">📊</span>
                <p className="text-sm">Aucune donnée de secteur disponible</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Graphique en secteurs + Métriques */}
      <Card className="p-6 shadow-none border-none">
        <h3 className="text-lg font-medium mb-4">Répartition par secteur</h3>

        {/* Taux de conversion */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{conversionRate}%</div>
            <div className="text-sm text-gray-600">Taux de conversion</div>
            <div className="text-xs text-gray-500 mt-1">
              Candidatures → Embauches
            </div>
          </div>
        </div>

        {/* Graphique en secteurs */}
        <div className="h-[150px]">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [value, 'Candidatures']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <span className="text-4xl block mb-2">🥧</span>
                <p className="text-sm">Aucune candidature par secteur</p>
              </div>
            </div>
          )}
        </div>

        {/* Légende */}
        <div className="mt-4 space-y-2">
          {pieData.length > 0 ? (
            pieData.map((entry, index) => (
              <Link key={entry.name} href="/management/secteurs" className="flex items-center justify-between text-sm hover:bg-gray-50 rounded p-1 -m-1 transition-colors">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="truncate">{entry.name}</span>
                </div>
                <span className="font-medium">{entry.value}</span>
              </Link>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p className="text-sm">Pas encore de données à afficher</p>
              <Link href="/candidatures" className="text-blue-600 hover:text-blue-800 text-sm">
                Voir les candidatures →
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}