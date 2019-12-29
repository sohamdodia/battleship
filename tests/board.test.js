const expect = require('expect');
const request = require('supertest');
const { app } = require('../server');
const Board = require('../modules/battleship/models/board.model')

before((done) => {
  Board.deleteMany({}).then(() => {
    done();
  });
});

describe('Board APIs', () => {
  let boardId;
  describe('POST /api/v1/board', () => {
    it('Should create a new board', (done) => {
      request(app)
        .post('/api/v1/board')
        .expect(200)
        .expect(res => {
          boardId = res.body.data._id;
          expect(res.body.status).toBe(true);
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
    it('Should always create board with init state', (done) => {
      request(app)
        .post('/api/v1/board')
        .send({
          stage: 'start'
        })
        .expect(200)
        .expect(res => {
          expect(res.body.status).toBe(true)
          expect(res.body.data.state).toBe('init')
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
  });
  describe('GET /api/v1/board', () => {
    it('Should return 4 boards', (done) => {
      request(app)
        .get('/api/v1/board')
        .expect(200)
        .expect(res => {
          expect(res.body.status).toBe(true);
          expect(res.body.data).toHaveLength(4);
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
  });
  describe('GET /api/v1/board/:id', () => {
    it('Should return 404 when board not found', (done) => {
      request(app)
        .get(`/api/v1/board/5e076914f88182c7410c55af`)
        .expect(404)
        .expect(res => {
          expect(res.body.status).toBe(false);
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
    it('Should return 500 when invalid is passed', (done) => {
      request(app)
        .get(`/api/v1/board/abc`)
        .expect(500)
        .expect(res => {
          expect(res.body.status).toBe(false);
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
    it('Should return the board with passed it', (done) => {
      request(app)
        .get(`/api/v1/board/${boardId}`)
        .expect(200)
        .expect(res => {
          expect(res.body.status).toBe(true);
          expect(res.body.data._id).toBe(boardId)
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    })
  })
})
