import { useState } from "react";
import { Header } from "./Header";
import { TripForm } from "./TripForm";
import { ResultSidebar } from "./ResultSidebar";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Shield, Clock, TrendingUp } from "lucide-react";

interface TripResult {
  risk: number;
  advice: string[];
  color: string;
  destination: string;
}

export function TripPlannerPage() {
  const [result, setResult] = useState<TripResult | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-100 to-amber-100">
      <Header />

      <div className="pt-36 md:pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--safecity-blue)] mb-4">
              Planificateur de Trajet
            </h1>
            <p className="text-lg text-gray-700 max-w-2xl mx-auto">
              Évaluez la sécurité de votre trajet à Abidjan et recevez des conseils personnalisés
            </p>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-[var(--safecity-blue)]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Communes</p>
                  <p className="text-2xl font-bold text-[var(--safecity-blue)]">10+</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Trajets analysés</p>
                  <p className="text-2xl font-bold text-green-600">2.5k+</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Clock className="w-6 h-6 text-[var(--safecity-yellow)]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Temps réel</p>
                  <p className="text-2xl font-bold text-[var(--safecity-yellow)]">24/7</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Précision</p>
                  <p className="text-2xl font-bold text-purple-600">95%</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Form */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <TripForm onResult={setResult} />

              {/* Tips Section */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-8 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
              >
                <h3 className="text-xl font-bold text-[var(--safecity-blue)] mb-4">
                  💡 Conseils de Sécurité
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--safecity-yellow)] text-xl">✓</span>
                    <span className="text-gray-700">
                      Privilégiez les heures de jour pour vos déplacements
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--safecity-yellow)] text-xl">✓</span>
                    <span className="text-gray-700">
                      Restez vigilant dans les zones à forte affluence
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--safecity-yellow)] text-xl">✓</span>
                    <span className="text-gray-700">
                      Partagez votre itinéraire avec un proche
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-[var(--safecity-yellow)] text-xl">✓</span>
                    <span className="text-gray-700">
                      Gardez vos objets de valeur hors de vue
                    </span>
                  </li>
                </ul>
              </motion.div>
            </motion.div>

            {/* Right Side - Results */}
            <div>
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 50, opacity: 0 }}
                    transition={{ type: "spring", damping: 25 }}
                  >
                    <ResultSidebar result={result} onClose={() => setResult(null)} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white/60 backdrop-blur-sm rounded-2xl p-12 shadow-lg flex flex-col items-center justify-center text-center h-full min-h-[500px]"
                  >
                    <div className="mb-6">
                      <Shield className="w-24 h-24 text-[var(--safecity-blue)]/30 mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold text-[var(--safecity-blue)] mb-3">
                      Évaluez votre trajet
                    </h3>
                    <p className="text-gray-600 max-w-md">
                      Remplissez le formulaire pour obtenir une analyse de sécurité détaillée et des recommandations personnalisées pour votre trajet.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}