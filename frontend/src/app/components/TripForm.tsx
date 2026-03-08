import { useState } from "react";
import { motion } from "motion/react";
import { MapPin, Clock, User, Calendar } from "lucide-react";
import { communes, calculateRisk } from "../data/mockData";

interface TripFormProps {
  onResult: (result: { risk: number; advice: string[]; color: string; destination: string }) => void;
}

export function TripForm({ onResult }: TripFormProps) {
  const [gender, setGender] = useState("femme");
  const [age, setAge] = useState("");
  const [destination, setDestination] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit clicked', { gender, age, destination, time });

    if (!age || !destination || !time) {
      console.warn('trip form incomplete', { age, destination, time });
      alert('Veuillez remplir tous les champs du formulaire avant de soumettre.');
      return;
    }

    try {
      // 1. Appel API vers ton backend local
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/evaluate-trip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          gender, 
          age: parseInt(age), 
          destination, 
          time 
        })
      });

      if (!response.ok) throw new Error("Erreur serveur");

      const result = await response.json();
      
      // 2. On envoie le résultat au parent (ton interface change alors)
      onResult({ ...result, destination });

    } catch (error) {
      console.error("Erreur de connexion au backend :", error);
      // Optionnel : utiliser calculateRisk en secours si le serveur est coupé
      const result = calculateRisk(gender, parseInt(age), destination, time);
      onResult({ ...result, destination });
    }
  };

  return (
    <motion.div
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", damping: 25, delay: 0.2 }}
      className="bg-white/85 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-[var(--safecity-blue)]/10"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[var(--safecity-blue)] mb-2">
          Évaluer mon trajet
        </h2>
        <p className="text-sm text-[var(--safecity-gray-dark)]">
          Recevez des conseils personnalisés pour votre sécurité
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Gender */}
        <div>
          <label className="flex items-center gap-2 text-sm text-[var(--safecity-blue)] mb-2">
            <User className="w-4 h-4" />
            Sexe
          </label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--safecity-gray-dark)]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--safecity-blue)]/50 transition-all"
          >
            <option value="femme">Femme</option>
            <option value="homme">Homme</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="flex items-center gap-2 text-sm text-[var(--safecity-blue)] mb-2">
            <Calendar className="w-4 h-4" />
            Âge
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Entrez votre âge"
            min="1"
            max="120"
            required
            className="w-full px-4 py-3 rounded-xl border border-[var(--safecity-gray-dark)]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--safecity-blue)]/50 transition-all"
          />
        </div>

        {/* Destination */}
        <div>
          <label className="flex items-center gap-2 text-sm text-[var(--safecity-blue)] mb-2">
            <MapPin className="w-4 h-4" />
            Destination
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-[var(--safecity-gray-dark)]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--safecity-blue)]/50 transition-all"
          >
            <option value="">Sélectionnez une commune</option>
            {communes.map((commune) => (
              <option key={commune} value={commune}>
                {commune}
              </option>
            ))}
          </select>
        </div>

        {/* Time */}
        <div>
          <label className="flex items-center gap-2 text-sm text-[var(--safecity-blue)] mb-2">
            <Clock className="w-4 h-4" />
            Heure de passage
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-[var(--safecity-gray-dark)]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--safecity-blue)]/50 transition-all"
          />
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-gradient-to-r from-[var(--safecity-blue)] to-[var(--safecity-blue-light)] text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
        >
          Analyser mon trajet
        </motion.button>
      </form>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-4 bg-[var(--safecity-blue)]/5 rounded-xl border border-[var(--safecity-blue)]/10"
      >
        <p className="text-xs text-[var(--safecity-gray-dark)] leading-relaxed">
          💙 <strong>SafeCity</strong> vous accompagne dans vos déplacements à Abidjan.
          Nos recommandations sont basées sur les signalements de la communauté.
        </p>
      </motion.div>
    </motion.div>
  );
}