const app = require('../back/app');
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

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

// Start server
async function startServer() {
  try {
    await testConnection();
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Serveur démarré sur le port ${PORT}`);
      console.log(`📋 Health check disponible sur http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage du serveur:', error);
    process.exit(1);
  }
}

startServer();