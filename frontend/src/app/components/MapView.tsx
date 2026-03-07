import { useState } from "react";
import { Header } from "./Header";
import { InteractiveMap } from "./InteractiveMap";
import { IncidentFeed } from "./IncidentFeed";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp, ChevronDown } from "lucide-react";

export function MapView() {
  const [showIncidents, setShowIncidents] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-100 to-amber-100">
      <Header />

      {/* Main Content */}
      <div className="pt-16 md:pt-20 h-screen flex flex-col">
        <div className="flex-1 relative overflow-hidden">
          {/* Background Map */}
          <InteractiveMap selectedCommune={undefined} />
        </div>

        {/* Incident Feed - Bottom */}
        <div className="relative">
          {/* Toggle Button for Incidents */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowIncidents(!showIncidents)}
            className="absolute -top-12 right-4 z-30 bg-white/90 backdrop-blur-md px-4 py-2 rounded-t-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <span className="text-sm font-medium text-[var(--safecity-blue)]">
              Incidents récents
            </span>
            {showIncidents ? (
              <ChevronDown className="w-4 h-4 text-[var(--safecity-blue)]" />
            ) : (
              <ChevronUp className="w-4 h-4 text-[var(--safecity-blue)]" />
            )}
          </motion.button>

          <AnimatePresence>
            {showIncidents && (
              <motion.div
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-gradient-to-r from-orange-100/80 via-amber-100/80 to-orange-100/80 backdrop-blur-sm border-t border-[var(--safecity-gray)]"
              >
                <IncidentFeed />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}