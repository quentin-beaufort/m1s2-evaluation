const express = require('express');
const cors = require('cors');
const Membre = require('./models/membres'); 
const sequelize = require('./db.config');

const app = express();

app.use(express.json()); // Pour parser le JSON
app.use(express.urlencoded({ extended: true }));

// Importer les routes
const membresRoutes = require('./routes/membres');

app.use('/api/membres',membresRoutes);

app.use(cors({
    origin: 'http://212.83.130.191',
    credentials: true
}))

async function testConnection() {
    try {
      await sequelize.authenticate();
      console.log('✅ Connexion réussie à la base de données');
      
      // Forcer la synchronisation
      await sequelize.sync({ force: false });
      console.log('✅ Synchronisation terminée');
      
      // Lister les modèles définis
      console.log('Modèles définis:', Object.keys(sequelize.models));
      
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  }
  
  const PORT = process.env.PORT || 3000;

  testConnection().then(()=>{
    app.listen(PORT,()=>{
        console.log(`🚀 Serveur démarré sur http://localhost:${PORT}}`);
    })
  });