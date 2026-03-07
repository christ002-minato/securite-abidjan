import { motion } from "motion/react";
import { communeRiskLevels } from "../data/mockData";

interface InteractiveMapProps {
  selectedCommune?: string;
}

export function InteractiveMap({ selectedCommune }: InteractiveMapProps) {
  // TODO: BACKEND INTEGRATION
  // Remplacer communeRiskLevels par un appel API pour obtenir les données de risque en temps réel
  // Exemple:
  // const [heatmapData, setHeatmapData] = useState([]);
  // useEffect(() => {
  //   fetch('/api/map/heatmap')
  //     .then(res => res.json())
  //     .then(data => setHeatmapData(data));
  // }, []);
  
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-amber-50 to-pink-100">
      {/* Sunset overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-200/30 via-transparent to-blue-100/20"></div>
      
      {/* Simplified Map Background */}
      <div className="w-full h-full relative overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #9ca3af 1px, transparent 1px),
              linear-gradient(to bottom, #9ca3af 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Heatmap zones - positioned to look like an abstract city map */}
        <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="greenZone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style={{ stopColor: "#10b981", stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: "#10b981", stopOpacity: 0 }} />
            </radialGradient>
            <radialGradient id="yellowZone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style={{ stopColor: "#f59e0b", stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: "#f59e0b", stopOpacity: 0 }} />
            </radialGradient>
            <radialGradient id="orangeZone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style={{ stopColor: "#fb923c", stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: "#fb923c", stopOpacity: 0 }} />
            </radialGradient>
            <radialGradient id="redZone" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style={{ stopColor: "#ef4444", stopOpacity: 0.7 }} />
              <stop offset="100%" style={{ stopColor: "#ef4444", stopOpacity: 0 }} />
            </radialGradient>
          </defs>

          {/* Heatmap circles representing different communes */}
          {communeRiskLevels.map((commune, index) => {
            const positions = [
              { x: 150, y: 150 }, // Cocody
              { x: 500, y: 200 }, // Yopougon
              { x: 350, y: 120 }, // Adjamé
              { x: 280, y: 250 }, // Plateau
              { x: 350, y: 380 }, // Marcory
              { x: 220, y: 340 }, // Treichville
              { x: 480, y: 380 }, // Koumassi
              { x: 600, y: 450 }, // Port-Bouët
              { x: 420, y: 280 }, // Attécoubé
              { x: 580, y: 150 }, // Abobo
            ];

            const pos = positions[index] || { x: 400, y: 300 };
            const gradient =
              commune.risk >= 7
                ? "redZone"
                : commune.risk >= 6
                ? "orangeZone"
                : commune.risk >= 5
                ? "yellowZone"
                : "greenZone";

            const isSelected = selectedCommune?.toLowerCase() === commune.commune.toLowerCase();

            return (
              <g key={commune.commune}>
                <motion.circle
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 90 : 70}
                  fill={`url(#${gradient})`}
                  className="transition-all duration-300"
                />
                <motion.text
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  className="text-sm font-semibold pointer-events-none"
                  fill={isSelected ? "#1e3a5f" : "#4b5563"}
                  style={{ fontSize: isSelected ? "16px" : "12px" }}
                >
                  {commune.commune}
                </motion.text>
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-md rounded-xl shadow-lg p-4"
        >
          <h4 className="text-xs font-semibold text-[var(--safecity-blue)] mb-2">
            Niveau de risque
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[var(--safecity-green)]"></div>
              <span className="text-xs text-[var(--safecity-gray-dark)]">Faible (1-4)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[var(--safecity-amber)]"></div>
              <span className="text-xs text-[var(--safecity-gray-dark)]">Modéré (5-6)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[var(--safecity-orange)]"></div>
              <span className="text-xs text-[var(--safecity-gray-dark)]">Élevé (7-8)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[var(--safecity-red)]"></div>
              <span className="text-xs text-[var(--safecity-gray-dark)]">Très élevé (9-10)</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}