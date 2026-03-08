const mongoose = require('mongoose');

const incidentSchema = new mongoose.Schema({
  // Localisation
  commune: { 
    type: String, 
    required: true,
    enum: ['Abobo', 'Adjamé', 'Attécoubé', 'Cocody', 'Koumassi', 'Marcory', 'Plateau', 'Port-Bouët', 'Treichville', 'Yopougon'] 
  },
  quartier: { type: String },
  
  // Type d'incident
  typeAgression: { 
    type: String, 
    required: true,
    default: "Vol à l'arraché" 
  },

  // Profil de la victime (ce que ton TripForm envoie)
  victime: {
    genre: { type: String, enum: ['homme', 'femme', 'autre'] },
    age: { type: Number }
  },

  // Temps
  date: { type: Date, default: Date.now },
  heure: { type: String }, // Format "HH:mm" venant de ton input type="time"

  // Coordonnées pour la carte (Format GeoJSON)
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [-4.0083, 5.3253] } // [Longitude, Latitude] par défaut Abidjan
  }
});

// Indexer la localisation pour pouvoir faire des recherches sur carte plus tard
incidentSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Incident', incidentSchema);