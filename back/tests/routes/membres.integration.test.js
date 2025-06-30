const request = require('supertest');
const express = require('express');
const membresRouter = require('../../routes/membres');
const Membre = require('../../models/membres'); 
const sequelize = require('../../db.config');

const app = express();
app.use(express.json());
app.use('/api/membres', membresRouter);

describe('Tests d’intégration API /api/membres', () => {
  // Avant tous les tests, sync la DB (reset tables).
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  // Après chaque test, vide la table membres
  afterEach(async () => {
    await Membre.destroy({ where: {} });
  });

  // Après tous les tests, ferme la connexion DB
  afterAll(async () => {
    await sequelize.close();
  });

  let membreId;

  test('POST /api/membres - crée un membre', async () => {
    const res = await request(app)
      .post('/api/membres')
      .send({
        firstName: 'Jean',
        lastName: 'Dupont',
        email: 'jean.dupont@example.com'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.firstName).toBe('Jean');

    membreId = res.body.id;
  });

  test('GET /api/membres - récupère tous les membres', async () => {
    // Prépare un membre en DB
    await Membre.create({
      firstName: 'Alice',
      lastName: 'Martin',
      email: 'alice.martin@example.com'
    });

    const res = await request(app).get('/api/membres');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test('GET /api/membres/:id - récupère un membre par id', async () => {
    const membre = await Membre.create({
      firstName: 'Bob',
      lastName: 'Durand',
      email: 'bob.durand@example.com'
    });

    const res = await request(app).get(`/api/membres/${membre.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe('Bob');
  });

  test('GET /api/membres/:id - renvoie 404 si membre non trouvé', async () => {
    const res = await request(app).get('/api/membres/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('PUT /api/membres/:id - met à jour un membre', async () => {
    const membre = await Membre.create({
      firstName: 'Claire',
      lastName: 'Lemoine',
      email: 'claire.lemoine@example.com'
    });

    const res = await request(app)
      .put(`/api/membres/${membre.id}`)
      .send({ firstName: 'Claire-modifiée', lastName: 'Lemoine', email: 'claire.lemoine@example.com' });

    expect(res.statusCode).toBe(200);
    expect(res.body.firstName).toBe('Claire-modifiée');
  });

  test('PUT /api/membres/:id - 404 si membre introuvable', async () => {
    const res = await request(app)
      .put('/api/membres/999999')
      .send({ firstName: 'X', lastName: 'Y', email: 'x@y.com' });

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('DELETE /api/membres/:id - supprime un membre', async () => {
    const membre = await Membre.create({
      firstName: 'David',
      lastName: 'Noel',
      email: 'david.noel@example.com'
    });

    const res = await request(app).delete(`/api/membres/${membre.id}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Membre supprimé avec succès');

    const membreDeleted = await Membre.findByPk(membre.id);
    expect(membreDeleted).toBeNull();
  });

  test('DELETE /api/membres/:id - 404 si membre inconnu', async () => {
    const res = await request(app).delete('/api/membres/999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  test('POST /api/membres - 400 si champs manquants', async () => {
    const res = await request(app).post('/api/membres').send({ firstName: 'A' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
