const request = require('supertest');
const app = require('../../app');
const Membre = require('../../models/membres');

describe('GET /api/membres', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devrait retourner la liste des membres avec un statut 200', async () => {
    const fakeMembres = [
      { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice@mail.com' },
      { id: 2, firstName: 'Bob', lastName: 'Johnson', email: 'bob@mail.com' }
    ];

    Membre.findAll = jest.fn().mockResolvedValue(fakeMembres);

    // On appelle l'API
    const res = await request(app).get('/api/membres');

    // On vérifie le résultat
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeMembres);
    expect(Membre.findAll).toHaveBeenCalled();
  });

  it('devrait retourner une erreur 500 si findAll échoue', async () => {
    Membre.findAll = jest.fn().mockRejectedValue(new Error('Erreur DB'));

    const res = await request(app).get('/api/membres');

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/membres/:id', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    it('devrait retourner le membre avec un id donné avec un status 200', async () => {
        const fakeMembre = [
      { id: 1, firstName: 'Alice', lastName: 'Smith', email: 'alice@mail.com' }
    ];

    Membre.findByPk = jest.fn().mockResolvedValue(fakeMembre)

    const res = await request(app).get('/api/membres/1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeMembre);
    expect(Membre.findByPk).toHaveBeenCalledWith('1');
    }),

    it('devrait retourner une erreur 404 si le membre n\'est pas trouvé', async () => {
        Membre.findByPk = jest.fn().mockResolvedValue(null);

        const res = await request(app).get('/api/membres/999');

        expect(res.statusCode).toBe(404);
        expect(res.body).toEqual({ error: 'Membre non trouvé' });
        expect(Membre.findByPk).toHaveBeenCalledWith('999');
    })
    it('devrait retourner une erreur 500 en cas de problème serveur', async () => {
    Membre.findByPk = jest.fn().mockRejectedValue(new Error('Erreur serveur'));

    const res = await request(app).get('/api/membres/1');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Erreur serveur' });
    expect(Membre.findByPk).toHaveBeenCalledWith('1');
  });

  describe('POST /api/membres', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devrait créer un membre et retourner un statut 201', async () => {
    const fakeMembre = {
      id: 1,
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@mail.com'
    };

    Membre.create = jest.fn().mockResolvedValue(fakeMembre);

    const res = await request(app).post('/api/membres').send({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@mail.com'
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(fakeMembre);
    expect(Membre.create).toHaveBeenCalledWith({
      firstName: 'Alice',
      lastName: 'Smith',
      email: 'alice@mail.com'
    });
  });

  it('devrait retourner une erreur 400 si des champs sont manquants', async () => {
    const res = await request(app).post('/api/membres').send({
      firstName: 'Alice',
      // lastName manquant
      email: 'alice@mail.com'
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({
      error: 'firstName, lastName et email sont requis'
    });
  });

  it('devrait retourner une erreur 500 en cas d\'erreur serveur', async () => {
    Membre.create = jest.fn().mockRejectedValue(new Error('Erreur serveur'));

    const res = await request(app).post('/api/membres').send({
      firstName: 'Bob',
      lastName: 'Dupont',
      email: 'bob@mail.com'
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Erreur serveur' });
    expect(Membre.create).toHaveBeenCalled();
  });
});
describe('PUT /api/membres/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // it('devrait mettre à jour un membre et retourner un statut 200', async () => {
  //   const updatedData = {
  //     firstName: 'AliceUpdated',
  //     lastName: 'SmithUpdated',
  //     email: 'alice.updated@mail.com'
  //   };

  //   const updatedMembre = {
  //     id: 1,
  //     ...updatedData
  //   };

  //   const fakeMembre = {
  //     id: 1,
  //     firstName: 'Alice',
  //     lastName: 'Smith',
  //     email: 'alice@mail.com',
  //     update: jest.fn().mockResolvedValue(updatedMembre)
  //   };

  //   Membre.findByPk = jest.fn().mockResolvedValue(fakeMembre);

  //   const res = await request(app).put('/api/membres/1').send(updatedData);

  //   expect(res.statusCode).toBe(200);
  //   expect(fakeMembre.update).toHaveBeenCalledWith(updatedData);
  //   expect(Membre.findByPk).toHaveBeenCalledWith('1');
  //   expect(res.body).toEqual(expect.objectContaining(updatedData));
  // });

  it('devrait retourner 404 si le membre n\'existe pas', async () => {
    Membre.findByPk = jest.fn().mockResolvedValue(null);

    const res = await request(app).put('/api/membres/999').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@mail.com'
    });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Membre non trouvé dans la base de données' });
    expect(Membre.findByPk).toHaveBeenCalledWith('999');
  });

  it('devrait retourner une erreur 500 en cas de problème serveur', async () => {
    Membre.findByPk = jest.fn().mockRejectedValue(new Error('Erreur serveur'));

    const res = await request(app).put('/api/membres/1').send({
      firstName: 'Bob',
      lastName: 'Dupont',
      email: 'bob@mail.com'
    });

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Erreur serveur' });
    expect(Membre.findByPk).toHaveBeenCalledWith('1');
  });
});

describe('DELETE /api/membres/:id', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('devrait supprimer un membre et retourner un statut 200', async () => {
    const fakeMembre = {
      id: 1,
      destroy: jest.fn().mockResolvedValue(true)
    };

    Membre.findByPk = jest.fn().mockResolvedValue(fakeMembre);

    const res = await request(app).delete('/api/membres/1');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'Membre supprimé avec succès' });
    expect(Membre.findByPk).toHaveBeenCalledWith('1');
    expect(fakeMembre.destroy).toHaveBeenCalled();
  });

  it('devrait retourner 404 si le membre n\'existe pas', async () => {
    Membre.findByPk = jest.fn().mockResolvedValue(null);

    const res = await request(app).delete('/api/membres/999');

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: 'Membre inconnu' });
    expect(Membre.findByPk).toHaveBeenCalledWith('999');
  });

  it('devrait retourner une erreur 500 si une exception est levée', async () => {
    Membre.findByPk = jest.fn().mockRejectedValue(new Error('Erreur serveur'));

    const res = await request(app).delete('/api/membres/1');

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: 'Erreur serveur' });
    expect(Membre.findByPk).toHaveBeenCalledWith('1');
  });
});
});