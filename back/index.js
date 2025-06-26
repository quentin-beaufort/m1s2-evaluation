const express = require('express');
const cors = require('cors');

const sequelize = require('./db.config');

// sequelize.sync({ force: false })
//   .then(() => {
//     console.log('Base de données synchronisée');
//   })
//   .catch(err => {
//     console.error('Erreur lors de la synchronisation:', err);
//   });   

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
  
  testConnection();