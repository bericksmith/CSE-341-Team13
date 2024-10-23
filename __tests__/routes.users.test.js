const request = require('supertest');
const express = require('express');
const userRouter = require('../routes/users');
const userController = require('../controllers/userController');

const app = express();
app.use(express.json());
app.use('/users', userRouter);

jest.mock('../controllers/userController');

describe('User Routes - GET Endpoints - Team 13', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('call getUsers controller on GET /users', async () => {
    userController.getUsers.mockImplementation((req, res) => {
      res.status(200).json({ users: [{ fname: 'John', lname: 'Doe' }] });
    });

    const res = await request(app).get('/users');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('users');
    expect(userController.getUsers).toHaveBeenCalledTimes(1);
  });

  it('call getUserById controller on GET /users/:id', async () => {
    userController.getUserById.mockImplementation((req, res) => {
      res.status(200).json({ user: { fname: 'Jane', lname: 'Smith' } });
    });

    const res = await request(app).get('/users/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(userController.getUserById).toHaveBeenCalledTimes(1);

    const req = userController.getUserById.mock.calls[0][0];
    expect(req.params).toEqual({ id: '1' });
  });
});
