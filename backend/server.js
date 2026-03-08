const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error('⚠️ MONGO_URI non défini – vérifie ton .env ou les variables Render');
}


const app = express();

// Middlewares
app.get('/', (req, res) => {
  res.send("🚀 Le Backend de SafeCity Abidjan est en ligne et fonctionnel !");
});
app.use(express.json());
app.use(cors());

// import des modèles
const Incident = require('./models/Incident');

// Configuration de connexion avec détection d'erreur immédiate
mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 5000 // N'attend que 5 secondes max
})
.then(() => console.log("✅ RÉUSSITE : Connecté à MongoDB Atlas !"))
.catch(err => {
  console.error("❌ ÉCHEC CRITIQUE MongoDB :");
  console.error("Message :", err.message);
  console.error("Code d'erreur :", err.code);
});

// Middleware pour vérifier la connexion avant chaque requête
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      error: "Service temporairement indisponible", 
      details: "La base de données n'est pas encore prête." 
    });
  }
  next();
});

// --- TES ROUTES (TODO du Figma) ---

// 1. Récupérer les incidents pour la Heatmap (regroupés par commune/quartier)
app.get('/api/map/heatmap', async (req, res) => {
    try {
        const agg = await Incident.aggregate([
            // ne conserver que documents qui ont des coords valides
            { $match: { 'location.coordinates.1': { $exists: true } } },
            {
                $group: {
                    _id: { commune: '$commune', quartier: '$quartier' },
                    count: { $sum: 1 },
                    coords: { $avg: '$location.coordinates' },
                },
            },
        ]);
        const heatmap = agg
            .filter(item => item.coords && item.coords.length >= 2)
            .map(item => ({
                commune: item._id.commune,
                quartier: item._id.quartier,
                lat: item.coords[1],
                lng: item.coords[0],
                intensity: item.count,
            }));
        res.json(heatmap);
    } catch (err) {
        console.error('Erreur heatmap', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// 2. Enregistrer un nouveau signalement
app.post('/api/incidents', async (req, res) => {
    try {
        const payload = req.body;
        const incident = new Incident(payload);
        await incident.save();
        res.status(201).json({ message: 'Signalement enregistré !', incident });
    } catch (err) {
        console.error('Erreur sauvegarde incident', err);
        res.status(400).json({ error: 'Données invalides', details: err.message });
    }
});

// endpoint pour récupérer les derniers signalements
app.get('/api/incidents/recent', async (req, res) => {
    try {
        const recent = await Incident.find().sort({ date: -1 }).limit(20).lean();
        const transformed = recent.map(doc => ({
            id: doc._id,
            type: doc.typeAgression || doc.type || 'autre',
            severity: doc.severity || 'low',
            date: doc.date ? doc.date.toISOString() : undefined,
            commune: doc.commune,
            location: doc.quartier || doc.location?.coordinates?.join(', ') || '',
            time: doc.heure || '',
            description: doc.description || '',
        }));
        res.json(transformed);
    } catch (err) {
        console.error('Erreur récupération récents', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});



// évaluation de trajet basé sur incidents et profil
app.post('/api/evaluate-trip', async (req, res) => {
  const { gender, age, destination, time } = req.body;

  try {
    // nombre d'incidents dans la commune
    const incidentCount = await Incident.countDocuments({ commune: destination });

    let riskLevel = 1;
    const advices = [];

    // facteur démographique
    if (gender === 'femme') {
      riskLevel += 1;
      advices.push("Faites attention, certaines agressions ciblent les femmes.");
    }
    if (age && age < 25) {
      riskLevel += 0.5;
      advices.push("Évitez les zones isolées à votre âge.");
    }

    // heure nocturne
    if (time) {
      const hour = parseInt(time.split(':')[0], 10);
      if (hour < 6 || hour > 22) {
        riskLevel += 2;
        advices.push("Il fait nuit : privilégiez les transports sûrs ou un accompagnant.");
      }
    }

    // incidents locaux
    riskLevel += incidentCount * 0.5;
    if (incidentCount > 0) {
      advices.push(`Il y a ${incidentCount} signalement(s) dans cette commune.`);
    }

    // normalisation
    if (riskLevel > 10) riskLevel = 10;
    if (riskLevel < 1) riskLevel = 1;

    res.json({
      risk: Math.round(riskLevel * 10) / 10,
      advice: advices,
      color: riskLevel > 5 ? '#EF4444' : '#10B981',
    });
  } catch (err) {
    console.error('Erreur evaluate-trip', err);
    res.status(500).json({ error: 'Erreur calcul' });
  }
});

// statistiques par commune
app.get('/api/stats/communes', async (req, res) => {
  try {
    const agg = await Incident.aggregate([
      { $group: { _id: '$commune', count: { $sum: 1 } } },
    ]);
    res.json(agg.map(item => ({ commune: item._id, incidents: item.count })));
  } catch (err) {
    console.error('Erreur stats communes', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// statistiques horaires (optionnellement par commune)
app.get('/api/stats/hourly', async (req, res) => {
  try {
    const { commune } = req.query;
    const matchStage = commune ? { $match: { commune } } : null;
    const pipeline = [];
    if (matchStage) pipeline.push(matchStage);
    pipeline.push(
      {
        $group: {
          _id: { $substr: ['$heure', 0, 2] },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } }
    );
    const agg = await Incident.aggregate(pipeline);
    res.json(agg.map(item => ({ hour: item._id, incidents: item.count })));
  } catch (err) {
    console.error('Erreur stats hourly', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));


