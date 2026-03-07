import { motion } from "motion/react";
import { X, Shield, AlertTriangle, Heart } from "lucide-react";

interface ResultSidebarProps {
  result: {
    risk: number;
    advice: string[];
    color: string;
    destination: string;
  };
  onClose: () => void;
}

export function ResultSidebar({ result, onClose }: ResultSidebarProps) {
  const getRiskLabel = (risk: number) => {
    if (risk >= 7) return "Élevé";
    if (risk >= 5) return "Modéré";
    return "Faible";
  };

  const getRiskIcon = (risk: number) => {
    if (risk >= 7) return <AlertTriangle className="w-6 h-6" />;
    if (risk >= 5) return <Shield className="w-6 h-6" />;
    return <Heart className="w-6 h-6" />;
  };

  return (
    <div className="bg-white/85 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-[var(--safecity-blue)]/10">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-[var(--safecity-blue)] mb-1">
            Indice de Vigilance
          </h3>
          <p className="text-sm text-[var(--safecity-gray-dark)]">
            {result.destination}
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-[var(--safecity-gray)] rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-[var(--safecity-gray-dark)]" />
        </button>
      </div>

      {/* Risk Score */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <div
          className="rounded-2xl p-6 text-center shadow-lg"
          style={{ backgroundColor: result.color + "15", borderColor: result.color, borderWidth: 2 }}
        >
          <div className="flex justify-center mb-3" style={{ color: result.color }}>
            {getRiskIcon(result.risk)}
          </div>
          <div className="text-5xl font-bold mb-2" style={{ color: result.color }}>
            {result.risk}/10
          </div>
          <div className="text-sm font-medium" style={{ color: result.color }}>
            Risque {getRiskLabel(result.risk)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 bg-[var(--safecity-gray)] rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.risk * 10}%` }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="h-full rounded-full"
            style={{ backgroundColor: result.color }}
          />
        </div>
      </motion.div>

      {/* Advice */}
      <div>
        <h4 className="text-sm font-semibold text-[var(--safecity-blue)] mb-3">
          Conseils de sécurité personnalisés
        </h4>
        <div className="space-y-3">
          {result.advice.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex items-start gap-3 p-3 bg-[var(--safecity-gray)]/50 rounded-xl"
            >
              <span className="text-lg flex-shrink-0">{tip.split(" ")[0]}</span>
              <p className="text-sm text-[var(--safecity-gray-dark)] leading-relaxed">
                {tip.split(" ").slice(1).join(" ")}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-4 bg-gradient-to-r from-[var(--safecity-blue)]/5 to-[var(--safecity-blue-light)]/5 rounded-xl border border-[var(--safecity-blue)]/10"
      >
        <p className="text-xs text-[var(--safecity-gray-dark)] text-center leading-relaxed">
          💙 Votre sécurité est notre priorité. Prenez soin de vous !
        </p>
      </motion.div>
    </div>
  );
}