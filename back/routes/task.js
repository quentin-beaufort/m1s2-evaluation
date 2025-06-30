const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Get all tasks
router.get('/',async(req,res)=>{
    try {
        const tasks = await Task.findAll();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// Get all remaing Tasks
router.get('/remaining',async(req,res)=>{
    try {
        const remainingTasks = await Task.findAll({where: {
            completed: false
        }})
        res.status(200).json(remainingTasks);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// Get all completed Task 
router.get('/completed',async(req,res)=>{
    try {
        const completedTasks = await Task.findAll({where: {
            completed: true
        }})
        res.status(200).json(completedTasks)
    } catch (error) {
        res.status(500).json({error: error.message})
        
    }
})

// Create a new task
router.post('/',async(req,res)=>{
    try {
        const {text,completed,editing} = req.body;

        if (!text){
            return res.status(400).json({
                error : 'Informations manquante'
            })
        }

        const task = await Task.create({
            text,
            completed,
            editing
        })

        res.status(201).json(task)
    } catch(error) {
        res.status(500).json({error: error.message})
    }
})

// Update a task
router.put('/:id',async(req,res)=>{
    try {
        const {text,completed,editing} = req.body;

        const task = await Task.findByPk(req.params.id);
        if(!task){
            return res.status(404).json({
                error: 'Tâche non trouvé dans la base de données'
            })
        }

        await task.update({
            text,
            completed,
            editing
        })
        res.status(200).json(task)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

// Delete a task
router.delete('/:id',async(req,res)=>{
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task){
            return res.status(404).json({
                error: 'Tâches non trouvé dans la DB'
            })
        }
        await task.destroy();

        res.status(200).json({message : 'Membre supprimé avec succès'})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
})

module.exports = router