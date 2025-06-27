const app = require('../back/app');
const sequelize = require('./db.config');

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion réussie à la base de données');

    await sequelize.sync({ force: false });
    console.log('✅ Synchronisation terminée');

    console.log('Modèles définis:', Object.keys(sequelize.models));
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

const PORT = process.env.PORT || 3000;

testConnection().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  });
});
