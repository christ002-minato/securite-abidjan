import { useState } from "react";
import { Header } from "./Header";
import { motion } from "motion/react";
import { BarChart3, TrendingUp, Users, Shield } from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { communeRiskLevels, hourlyRiskData, communes } from "../data/mockData";

export function StatsPage() {
  // TODO: BACKEND INTEGRATION
  // Remplacer communeRiskLevels et hourlyRiskData par des appels API
  // Exemple:
  // const [stats, setStats] = useState({ communeRiskLevels: [], hourlyRiskData: [] });
  // useEffect(() => {
  //   Promise.all([
  //     fetch('/api/stats/communes').then(r => r.json()),
  //     fetch('/api/stats/hourly').then(r => r.json())
  //   ]).then(([communes, hourly]) => {
  //     setStats({ communeRiskLevels: communes, hourlyRiskData: hourly });
  //   });
  // }, []);
  
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("month");
  const [selectedCommune, setSelectedCommune] = useState<string>("all");

  const totalIncidents = communeRiskLevels.reduce((sum, c) => sum + c.incidents, 0);
  const avgRisk = (communeRiskLevels.reduce((sum, c) => sum + c.risk, 0) / communeRiskLevels.length).toFixed(1);

  const communeData = communeRiskLevels.find((c) => c.commune === selectedCommune);

  const statsCards = [
    {
      title: "Total signalements",
      value: totalIncidents.toString(),
      icon: BarChart3,
      color: "var(--safecity-blue)",
      bgColor: "var(--safecity-blue)",
    },
    {
      title: "Risque moyen",
      value: `${avgRisk}/10`,
      icon: TrendingUp,
      color: "var(--safecity-amber)",
      bgColor: "var(--safecity-amber)",
    },
    {
      title: "Communes suivies",
      value: "10",
      icon: Shield,
      color: "var(--safecity-green)",
      bgColor: "var(--safecity-green)",
    },
    {
      title: "Utilisateurs actifs",
      value: "12.4k",
      icon: Users,
      color: "var(--safecity-blue-light)",
      bgColor: "var(--safecity-blue-light)",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-100 to-amber-100">
      <Header />

      <div className="pt-36 md:pt-32 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--safecity-blue)] to-[var(--safecity-blue-light)] rounded-2xl shadow-lg mb-4">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-[var(--safecity-blue)] mb-3">
              Statistiques
            </h1>
            <p className="text-[var(--safecity-gray-dark)] max-w-lg mx-auto">
              Visualisez les tendances de sécurité à Abidjan
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {statsCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-[var(--safecity-blue)]/10"
                >
                  <div
                    className="inline-flex items-center justify-center w-10 h-10 rounded-lg mb-3"
                    style={{ backgroundColor: stat.bgColor + "15" }}
                  >
                    <Icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <p className="text-xs text-[var(--safecity-gray-dark)] mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Hourly Risk Chart */}
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-[var(--safecity-blue)]/10"
            >
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--safecity-blue)] mb-2">
                  Risque par heure de la journée
                </h3>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedCommune}
                    onChange={(e) => setSelectedCommune(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-[var(--safecity-gray-dark)]/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--safecity-blue)]/50"
                  >
                    <option value="all">Toutes les communes</option>
                    {communes.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  {communeData && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--safecity-gray)]/50">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: communeData.color }}
                      />
                      <span className="text-sm text-[var(--safecity-gray-dark)]">
                        {communeData.incidents} incidents
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={hourlyRiskData}>
                  <defs>
                    <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="hour"
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    stroke="#d1d5db"
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    stroke="#d1d5db"
                    domain={[0, 10]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="risk"
                    stroke="#1e3a5f"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRisk)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Commune Risk Comparison */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-[var(--safecity-blue)]/10"
            >
              <h3 className="text-lg font-semibold text-[var(--safecity-blue)] mb-6">
                Comparaison des communes
              </h3>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={communeRiskLevels}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="commune"
                    tick={{ fill: "#6b7280", fontSize: 10 }}
                    stroke="#d1d5db"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tick={{ fill: "#6b7280", fontSize: 12 }}
                    stroke="#d1d5db"
                    domain={[0, 10]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="risk" fill="#1e3a5f" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Bottom Info Cards */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 grid md:grid-cols-3 gap-4"
          >
            <div className="bg-gradient-to-br from-[var(--safecity-blue)]/5 to-[var(--safecity-blue-light)]/5 rounded-xl p-6 border border-[var(--safecity-blue)]/10">
              <h4 className="text-sm font-semibold text-[var(--safecity-blue)] mb-2">
                📊 Données en temps réel
              </h4>
              <p className="text-xs text-[var(--safecity-gray-dark)] leading-relaxed">
                Les statistiques sont mises à jour en continu grâce aux signalements de
                la communauté.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[var(--safecity-amber)]/5 to-[var(--safecity-amber-light)]/5 rounded-xl p-6 border border-[var(--safecity-amber)]/10">
              <h4 className="text-sm font-semibold text-[var(--safecity-amber)] mb-2">
                ⚡ Tendances
              </h4>
              <p className="text-xs text-[var(--safecity-gray-dark)] leading-relaxed">
                Identifiez les zones et heures à risque pour mieux planifier vos déplacements.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[var(--safecity-green)]/5 to-[var(--safecity-green-light)]/5 rounded-xl p-6 border border-[var(--safecity-green)]/10">
              <h4 className="text-sm font-semibold text-[var(--safecity-green)] mb-2">
                🤝 Communauté
              </h4>
              <p className="text-xs text-[var(--safecity-gray-dark)] leading-relaxed">
                Plus il y a de signalements, plus nos prédictions sont précises et utiles.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}