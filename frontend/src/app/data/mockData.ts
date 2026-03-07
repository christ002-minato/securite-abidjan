// Mock data for SafeCity

export const communes = [
  "Cocody",
  "Yopougon",
  "Adjamé",
  "Plateau",
  "Marcory",
  "Treichville",
  "Koumassi",
  "Port-Bouët",
  "Attécoubé",
  "Abobo",
];

export interface Incident {
  id: string;
  type: "agression" | "vol" | "harassment" | "autre";
  commune: string;
  location: string;
  time: string;
  date: string;
  severity: "low" | "medium" | "high";
  description: string;
}

export const recentIncidents: Incident[] = [
  {
    id: "1",
    type: "vol",
    commune: "Adjamé",
    location: "Près du Forum",
    time: "22:30",
    date: "2026-03-05",
    severity: "high",
    description: "Vol de téléphone signalé",
  },
  {
    id: "2",
    type: "harassment",
    commune: "Cocody",
    location: "Rue des Jardins",
    time: "19:15",
    date: "2026-03-05",
    severity: "medium",
    description: "Harcèlement verbal",
  },
  {
    id: "3",
    type: "agression",
    commune: "Yopougon",
    location: "Marché Sideci",
    time: "21:00",
    date: "2026-03-04",
    severity: "high",
    description: "Tentative d'agression",
  },
  {
    id: "4",
    type: "vol",
    commune: "Plateau",
    location: "Avenue Chardy",
    time: "18:45",
    date: "2026-03-04",
    severity: "medium",
    description: "Vol à l'arraché",
  },
  {
    id: "5",
    type: "autre",
    commune: "Marcory",
    location: "Zone 4",
    time: "20:30",
    date: "2026-03-03",
    severity: "low",
    description: "Comportement suspect",
  },
];

export interface RiskLevel {
  commune: string;
  risk: number; // 1-10
  color: string;
  incidents: number;
}

export const communeRiskLevels: RiskLevel[] = [
  { commune: "Cocody", risk: 3, color: "#10b981", incidents: 12 },
  { commune: "Yopougon", risk: 7, color: "#fb923c", incidents: 34 },
  { commune: "Adjamé", risk: 8, color: "#ef4444", incidents: 45 },
  { commune: "Plateau", risk: 4, color: "#34d399", incidents: 18 },
  { commune: "Marcory", risk: 5, color: "#f59e0b", incidents: 22 },
  { commune: "Treichville", risk: 6, color: "#fbbf24", incidents: 28 },
  { commune: "Koumassi", risk: 6, color: "#fbbf24", incidents: 26 },
  { commune: "Port-Bouët", risk: 5, color: "#f59e0b", incidents: 20 },
  { commune: "Attécoubé", risk: 7, color: "#fb923c", incidents: 31 },
  { commune: "Abobo", risk: 8, color: "#ef4444", incidents: 42 },
];

export interface HourlyRisk {
  hour: string;
  risk: number;
}

export const hourlyRiskData: HourlyRisk[] = [
  { hour: "00h", risk: 8 },
  { hour: "02h", risk: 9 },
  { hour: "04h", risk: 7 },
  { hour: "06h", risk: 3 },
  { hour: "08h", risk: 2 },
  { hour: "10h", risk: 2 },
  { hour: "12h", risk: 3 },
  { hour: "14h", risk: 3 },
  { hour: "16h", risk: 4 },
  { hour: "18h", risk: 5 },
  { hour: "20h", risk: 6 },
  { hour: "22h", risk: 8 },
];

export function calculateRisk(
  gender: string,
  age: number,
  destination: string,
  time: string
): {
  risk: number;
  advice: string[];
  color: string;
} {
  let risk = 5;

  // Commune risk
  const communeData = communeRiskLevels.find(
    (c) => c.commune.toLowerCase() === destination.toLowerCase()
  );
  if (communeData) {
    risk = communeData.risk;
  }

  // Time risk
  const hour = parseInt(time.split(":")[0]);
  if (hour >= 22 || hour < 6) {
    risk += 2;
  } else if (hour >= 18 || hour < 8) {
    risk += 1;
  }

  // Gender and age
  if (gender === "femme" && age < 30) {
    risk += 1;
  }

  risk = Math.min(10, Math.max(1, risk));

  // Generate advice
  const advice: string[] = [];
  if (risk >= 7) {
    advice.push("🚨 Risque élevé - Privilégiez un transport avec une personne de confiance");
    advice.push("💡 Partagez votre trajet avec un proche");
    advice.push("📱 Gardez votre téléphone chargé et accessible");
  } else if (risk >= 5) {
    advice.push("⚠️ Risque modéré - Restez vigilant(e)");
    advice.push("👥 Évitez les zones peu éclairées");
    advice.push("🕐 Préférez les heures de forte affluence");
  } else {
    advice.push("✅ Risque faible - Conditions favorables");
    advice.push("😊 Profitez de votre trajet en toute sérénité");
    advice.push("👀 Restez néanmoins attentif(ve) à votre environnement");
  }

  if (destination.toLowerCase() === "adjamé") {
    advice.push("📍 Évitez les ruelles sombres près du Forum à cette heure");
  }

  const color =
    risk >= 7
      ? "#ef4444"
      : risk >= 5
      ? "#f59e0b"
      : "#10b981";

  return { risk, advice, color };
}
