import { motion } from "motion/react";
import { AlertCircle, Clock, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

interface IncidentItem {
  id: string;
  type: string;
  severity: string;
  date?: string;
  commune: string;
  location: string;
  time: string;
  description: string;
}

export function IncidentFeed() {
  const [incidents, setIncidents] = useState<IncidentItem[]>([]);

  // ignore la variable en développement pour ne pas pointer le backend en ligne
  const API_BASE = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetch(`${API_BASE}/api/incidents/recent`)
      .then(async res => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} - ${text}`);
        }
        return res.json();
      })
      .then(data => {
        if (!Array.isArray(data)) {
          console.warn('IncidentFeed got non-array data', data);
          setIncidents([]);
        } else {
          setIncidents(data);
        }
      })
      .catch(err => {
        console.error('Erreur fetch incidents', err);
        setIncidents([]);
      });
  }, []);

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case "agression":
        return "🚨";
      case "vol":
        return "👜";
      case "harassment":
        return "⚠️";
      default:
        return "📍";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "var(--safecity-red)";
      case "medium":
        return "var(--safecity-amber)";
      default:
        return "var(--safecity-green)";
    }
  };

  return (
    <div className="py-4 px-4 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-[var(--safecity-blue)]" />
        <h3 className="font-semibold text-[var(--safecity-blue)]">
          Incidents récents signalés
        </h3>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {Array.isArray(incidents) && incidents.map((incident, index) => (
          <motion.div
            key={incident?.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex-shrink-0 w-72 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 border border-[var(--safecity-gray)]"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getIncidentIcon(incident.type)}</span>
                <div>
                  <p className="text-sm font-medium text-[var(--safecity-blue)] capitalize">
                    {incident.type}
                  </p>
                  <div
                    className="w-2 h-2 rounded-full mt-1"
                    style={{ backgroundColor: getSeverityColor(incident.severity) }}
                  />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-[var(--safecity-gray-dark)]">{incident.date}</p>
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm text-[var(--safecity-gray-dark)]">
                <MapPin className="w-4 h-4" />
                <span>
                  {incident.commune} - {incident.location}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--safecity-gray-dark)]">
                <Clock className="w-4 h-4" />
                <span>{incident.time}</span>
              </div>
            </div>

            <p className="text-sm text-[var(--safecity-gray-dark)] leading-relaxed">
              {incident.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}