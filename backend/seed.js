const mongoose = require('mongoose');
const Incident = require('./models/Incident'); // Vérifie le chemin vers ton modèle
require('dotenv').config();

const mongoURI = process.env.MONGO_URI ;

const typesIncidents = [
  "Kidnapping / Vol en faux taxi (Yango)",
  "Vol à l'arraché (Moto)",
  "Agression à main armée",
  "Vol aux feux tricolores",
  "Pickpocket"
];

const communesAbidjan = [
  { nom: 'Cocody', quartiers: ['Angré', 'Riviera 3', 'Deux Plateaux', 'Bonoumin'] },
  { nom: 'Adjamé', quartiers: ['Forum', 'Liberté', 'Gare Nord'] },
  { nom: 'Yopougon', quartiers: ['Niangon', 'Maroc', 'Siporex', 'Selmer'] },
  { nom: 'Plateau', quartiers: ['Cité Administrative', 'Avenue Chardy'] },
  { nom: 'Marcory', quartiers: ['Zone 4', 'VGE', 'Anoumabo'] },
  { nom: 'Abobo', quartiers: ['Gare', 'PK18', 'Avocatier'] }
];

const generateIncidents = (count) => {
  const incidents = [];
  for (let i = 0; i < count; i++) {
    const communeObj = communesAbidjan[Math.floor(Math.random() * communesAbidjan.length)];
    const type = typesIncidents[Math.floor(Math.random() * typesIncidents.length)];
    
    // Scénario spécifique Yango : surtout le soir en zone résidentielle ou Plateau
    let heure = `${Math.floor(Math.random() * 24)}:00`.padStart(5, '0');
    if (type.includes("Yango")) {
      heure = `${18 + Math.floor(Math.random() * 5)}:30`; // Majorité entre 18h et 23h
    }

    incidents.push({
      commune: communeObj.nom,
      quartier: communeObj.quartiers[Math.floor(Math.random() * communeObj.quartiers.length)],
      typeAgression: type,
      victime: {
        genre: Math.random() > 0.4 ? 'femme' : 'homme', // Statistiquement plus de femmes ciblées pour les taxis
        age: 18 + Math.floor(Math.random() * 30)
      },
      heure: heure,
      date: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)), // 30 derniers jours
      location: {
        type: 'Point',
        // plage plus étroite autour d'Abidjan et arrondi à 4 décimales
        coordinates: [
          Number(( -4.0083 + (Math.random() - 0.5) * 0.04 ).toFixed(4)),
          Number(( 5.3253 + (Math.random() - 0.5) * 0.04 ).toFixed(4))
        ]
      }
    });
  }
  return incidents;
};

const seedDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connecté à MongoDB pour le remplissage...");
    
    // On vide la base actuelle pour ne pas doubler les données
    await Incident.deleteMany({});
    
    const data = generateIncidents(50);
    await Incident.insertMany(data);
    
    console.log("✅ 50 incidents réalistes ajoutés avec succès !");
    process.exit();
  } catch (err) {
    console.error("❌ Erreur :", err);
    process.exit(1);
  }
};

seedDB();