const request = require('supertest');
const app = require('../../app');
const Task = require('../../models/task');

describe('Tests routes /api/tasks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('devrait retourner la liste des tâches avec un statut 200', async () => {
      const fakeTasks = [
        { id: 1, text: 'Tâche 1', completed: false, editing: false },
        { id: 2, text: 'Tâche 2', completed: true, editing: false }
      ];

      Task.findAll = jest.fn().mockResolvedValue(fakeTasks);

      const res = await request(app).get('/api/tasks');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(fakeTasks);
      expect(Task.findAll).toHaveBeenCalled();
    });
  });

  describe('GET /api/tasks/remaining', () => {
    it('devrait retourner la liste des tâches restantes (non complétées)', async () => {
      const fakeRemainingTasks = [
        { id: 1, text: 'Tâche 1', completed: false, editing: false }
      ];

      Task.findAll = jest.fn().mockResolvedValue(fakeRemainingTasks);

      const res = await request(app).get('/api/tasks/remaining');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(fakeRemainingTasks);
      expect(Task.findAll).toHaveBeenCalledWith({ where: { completed: false } });
    });

    it('devrait retourner une erreur 500 si findAll rejette', async () => {
      Task.findAll = jest.fn().mockRejectedValue(new Error('Erreur DB'));

      const res = await request(app).get('/api/tasks/remaining');

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
      expect(Task.findAll).toHaveBeenCalledWith({ where: { completed: false } });
    });
  });

  describe('GET /api/tasks/completed', () => {
    it('devrait retourner la liste des tâches complétées', async () => {
      const fakeCompletedTasks = [
        { id: 2, text: 'Tâche 2', completed: true, editing: false }
      ];

      Task.findAll = jest.fn().mockResolvedValue(fakeCompletedTasks);

      const res = await request(app).get('/api/tasks/completed');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(fakeCompletedTasks);
      expect(Task.findAll).toHaveBeenCalledWith({ where: { completed: true } });
    });

    it('devrait retourner une erreur 500 si findAll rejette', async () => {
      Task.findAll = jest.fn().mockRejectedValue(new Error('Erreur DB'));

      const res = await request(app).get('/api/tasks/completed');

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
      expect(Task.findAll).toHaveBeenCalledWith({ where: { completed: true } });
    });
  });

  describe('POST /api/tasks', () => {
    it('devrait créer une tâche et retourner un statut 201', async () => {
      const newTaskData = {
        text: 'Nouvelle tâche',
        completed: false,
        editing: false
      };
      const fakeTask = { id: 1, ...newTaskData };

      Task.create = jest.fn().mockResolvedValue(fakeTask);

      const res = await request(app).post('/api/tasks').send(newTaskData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(fakeTask);
      expect(Task.create).toHaveBeenCalledWith(newTaskData);
    });

    it('devrait retourner une erreur 400 si le champ text est manquant', async () => {
      const res = await request(app).post('/api/tasks').send({
        completed: false,
        editing: false
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({ error: 'Informations manquante' });
    });

    it('devrait retourner une erreur 500 en cas d\'erreur serveur', async () => {
      Task.create = jest.fn().mockRejectedValue(new Error('Erreur serveur'));

      const res = await request(app).post('/api/tasks').send({
        text: 'Tâche fail',
        completed: false,
        editing: false
      });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
      expect(Task.create).toHaveBeenCalled();
    });
  });

describe('PUT /api/tasks/:id', () => {
  it('devrait mettre à jour une tâche et retourner un statut 200', async () => {
    const updateData = {
      text: 'Tâche mise à jour',
      completed: true,
      editing: false
    };

    const fakeTask = {
      id: 1,
      text: 'Tâche avant maj',
      completed: false,
      editing: false,
      update: jest.fn().mockImplementation(function(data) {
        Object.assign(this, data);
        return Promise.resolve(this);
      })
    };

    Task.findByPk = jest.fn().mockResolvedValue(fakeTask);

    const res = await request(app).put('/api/tasks/1').send(updateData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      ...updateData
    });
    expect(Task.findByPk).toHaveBeenCalledWith('1');
    expect(fakeTask.update).toHaveBeenCalledWith(updateData);
  });

    it('devrait retourner 404 si la tâche n\'existe pas', async () => {
      Task.findByPk = jest.fn().mockResolvedValue(null);

      const res = await request(app).put('/api/tasks/999').send({
        text: 'Test',
        completed: false,
        editing: false
      });

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Tâche non trouvé dans la base de données' });
      expect(Task.findByPk).toHaveBeenCalledWith('999');
    });

    it('devrait retourner 500 en cas d\'erreur serveur', async () => {
      Task.findByPk = jest.fn().mockRejectedValue(new Error('Erreur serveur'));

      const res = await request(app).put('/api/tasks/1').send({
        text: 'Test',
        completed: false,
        editing: false
      });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
      expect(Task.findByPk).toHaveBeenCalledWith('1');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('devrait supprimer une tâche et retourner un statut 200', async () => {
      const fakeTask = {
        id: 1,
        destroy: jest.fn().mockResolvedValue(true)
      };

      Task.findByPk = jest.fn().mockResolvedValue(fakeTask);

      const res = await request(app).delete('/api/tasks/1');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Membre supprimé avec succès' });
      expect(Task.findByPk).toHaveBeenCalledWith('1');
      expect(fakeTask.destroy).toHaveBeenCalled();
    });

    it('devrait retourner 404 si la tâche n\'existe pas', async () => {
      Task.findByPk = jest.fn().mockResolvedValue(null);

      const res = await request(app).delete('/api/tasks/999');

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({ error: 'Tâches non trouvé dans la DB' });
      expect(Task.findByPk).toHaveBeenCalledWith('999');
    });

    it('devrait retourner 500 en cas d\'erreur serveur', async () => {
      Task.findByPk = jest.fn().mockRejectedValue(new Error('Erreur serveur'));

      const res = await request(app).delete('/api/tasks/1');

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('error');
      expect(Task.findByPk).toHaveBeenCalledWith('1');
    });
  });
});
