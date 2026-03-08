import { useState } from "react";
import { Header } from "./Header";
import { motion } from "motion/react";
import { MapPin, Clock, AlertCircle, Camera, Send, CheckCircle } from "lucide-react";
import { communes } from "../data/mockData";

export function SignalPage() {
  const [formData, setFormData] = useState<IncidentFormData>({
    type: "",
    commune: "",
    location: "",
    description: "",
    severity: "modéré",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ignore la variable lors du développement local
    const API_BASE = import.meta.env.DEV ? '' : import.meta.env.VITE_API_URL || '';
    try {
      const response = await fetch(`${API_BASE}/api/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          setFormData({
            type: "",
            commune: "",
            location: "",
            description: "",
            severity: "modéré",
          });
        }, 3000);
      } else {
        alert('Échec de l\'enregistrement : ' + (data.error || data.message));
      }
    } catch (err) {
      console.error('Erreur réseau signalement', err);
      alert('Impossible de contacter le serveur.');
    }
  };

  const incidentTypes = [
    { value: "vol", label: "Vol", icon: "👜" },
    { value: "agression", label: "Agression", icon: "🚨" },
    { value: "harassment", label: "Harcèlement", icon: "⚠️" },
    { value: "autre", label: "Autre", icon: "📍" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-orange-100 to-amber-100">
      <Header />

      <div className="pt-36 md:pt-32 pb-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--safecity-blue)] to-[var(--safecity-blue-light)] rounded-2xl shadow-lg mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-[var(--safecity-blue)] mb-3">
              Signaler un incident
            </h1>
            <p className="text-[var(--safecity-gray-dark)] max-w-lg mx-auto">
              Votre signalement aide la communauté à rester informée et en sécurité.
              Toutes les informations sont anonymes.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-[var(--safecity-blue)]/10"
          >
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Incident Type */}
                <div>
                  <label className="text-sm font-medium text-[var(--safecity-blue)] mb-3 block">
                    Type d'incident
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {incidentTypes.map((type) => (
                      <motion.button
                        key={type.value}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, type: type.value })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.type === type.value
                            ? "border-[var(--safecity-blue)] bg-[var(--safecity-blue)]/5"
                            : "border-[var(--safecity-gray)] hover:border-[var(--safecity-blue)]/30"
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{type.icon}</span>
                        <span className="text-sm font-medium text-[var(--safecity-blue)]">
                          {type.label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Commune */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--safecity-blue)] mb-2">
                    <MapPin className="w-4 h-4" />
                    Commune
                  </label>
                  <select
                    value={formData.commune}
                    onChange={(e) => setFormData({ ...formData, commune: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-[var(--safecity-gray-dark)]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--safecity-blue)]/50 transition-all"
                  >
                    <option value="">Sélectionnez une commune</option>
                    {communes.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--safecity-blue)] mb-2">
                    <MapPin className="w-4 h-4" />
                    Lieu précis (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Optionnel : lat,long (env. 4 déc.) ou lieu précis"
                    className="w-full px-4 py-3 rounded-xl border border-[var(--safecity-gray-dark)]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--safecity-blue)]/50 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-[var(--safecity-blue)] mb-2 block">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    placeholder="Décrivez brièvement ce qui s'est passé..."
                    className="w-full px-4 py-3 rounded-xl border border-[var(--safecity-gray-dark)]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--safecity-blue)]/50 transition-all resize-none"
                  />
                </div>

                {/* Photo Upload (optional) */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-[var(--safecity-blue)] mb-2">
                    <Camera className="w-4 h-4" />
                    Photo (optionnel)
                  </label>
                  <div className="border-2 border-dashed border-[var(--safecity-gray-dark)]/20 rounded-xl p-6 text-center hover:border-[var(--safecity-blue)]/30 transition-colors cursor-pointer">
                    <Camera className="w-8 h-8 text-[var(--safecity-gray-dark)] mx-auto mb-2" />
                    <p className="text-sm text-[var(--safecity-gray-dark)]">
                      Cliquez pour ajouter une photo
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-[var(--safecity-blue)] to-[var(--safecity-blue-light)] text-white py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Envoyer le signalement
                </motion.button>

                {/* Privacy Note */}
                <p className="text-xs text-[var(--safecity-gray-dark)] text-center leading-relaxed">
                  🔒 Votre signalement est anonyme et confidentiel. Vos données sont utilisées
                  uniquement pour améliorer la sécurité de la communauté.
                </p>
              </form>
            ) : (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--safecity-green)]/10 rounded-full mb-4">
                  <CheckCircle className="w-10 h-10 text-[var(--safecity-green)]" />
                </div>
                <h3 className="text-2xl font-semibold text-[var(--safecity-blue)] mb-2">
                  Merci pour votre signalement !
                </h3>
                <p className="text-[var(--safecity-gray-dark)] max-w-md mx-auto">
                  Votre contribution aide à renforcer la sécurité de notre communauté à Abidjan.
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-6 grid md:grid-cols-2 gap-4"
          >
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-[var(--safecity-blue)]/10">
              <h4 className="text-sm font-semibold text-[var(--safecity-blue)] mb-2">
                💙 Pourquoi signaler ?
              </h4>
              <p className="text-xs text-[var(--safecity-gray-dark)] leading-relaxed">
                Chaque signalement enrichit notre base de données et aide d'autres personnes
                à éviter les zones à risque.
              </p>
            </div>
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-[var(--safecity-blue)]/10">
              <h4 className="text-sm font-semibold text-[var(--safecity-blue)] mb-2">
                🛡️ Sécurité des données
              </h4>
              <p className="text-xs text-[var(--safecity-gray-dark)] leading-relaxed">
                Aucune information personnelle n'est collectée. Votre anonymat est garanti.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

interface IncidentFormData {
  type: string;
  commune: string;
  location: string;
  description: string;
  severity: string;
}