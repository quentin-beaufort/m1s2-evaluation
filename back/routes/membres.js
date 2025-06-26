const express = require('express');
const router = express.Router();
const Membre = require('../models/membres');

// Get all Membres
router.get('/', async (req, res) => {
    try {
        const membres = await Membre.findAll();
        res.status(200).json(membres);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get member by ID test
router.get('/:id', async (req, res) => {
    try {
        const membre = await Membre.findByPk(req.params.id);
        if (!membre) {
            return res.status(404).json({ error: 'Membre non trouvé' });
        }
        res.status(200).json(membre);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create a member
router.post('/', async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        
        // Validation basique
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ 
                error: 'firstName, lastName et email sont requis' 
            });
        }
        
        const membre = await Membre.create({
            firstName,
            lastName,
            email
        });
        
        res.status(201).json(membre); // ✅ 201 pour création
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a member
router.put('/:id', async (req, res) => {
    try {
        const { firstName, lastName, email } = req.body;
        
        const membre = await Membre.findByPk(req.params.id);
        if (!membre) {
            return res.status(404).json({ error: 'Membre non trouvé dans la base de données' });
        }

        await membre.update({
            firstName,
            lastName,
            email
        });
        
        res.status(200).json(membre);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a membre
router.delete('/:id', async (req, res) => {
    try {
        const membre = await Membre.findByPk(req.params.id);
        if (!membre) {
            return res.status(404).json({ error: 'Membre inconnu' });
        }

        await membre.destroy();

        res.status(200).json({ message: 'Membre supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;