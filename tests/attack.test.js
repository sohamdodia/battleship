const expect = require('expect');
const request = require('supertest');
const { app } = require('../server');
const constants = require('./constants');
const Board = require('../modules/battleship/models/board.model');

let boardId;
before((done) => {
  const board = new Board();
  board.save().then((data) => {
    boardId = data._id;
    done();
  })
});
describe('Attack APIs', () => {
  describe('Placing the ship', () => {
    constants.validData.forEach(d => {
      it(`Placing the ship: ${d.model}`, (done) => {
        request(app)
          .post(`/api/v1/board/${boardId}/ship`)
          .send(d)
          .expect(200)
          .expect(res => {
            expect(res.body.status).toBe(true)
          })
          .end(err => {
            if (err) {
              return done(err);
            }
            done();
          });
      });
    });
  });
  describe('Attacking on Ship', () => {
    constants.validData.slice(1, constants.validData.length - 1).forEach(d => {
      d.location.forEach(l => {
        it('Should attack on the ship', (done) => {
          request(app)
            .post(`/api/v1/board/${boardId}/attack`)
            .send({
              location: l
            })
            .expect(200)
            .expect(res => {
              expect(res.body.status).toBe(true);
            })
            .end(err => {
              if (err) {
                return done(err);
              }
              done();
            });
        });
      });
    });
  });
  describe('POST /api/v1/board/:id/attack', () => {
    it('Should not attack with invalid data', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/attack`)
        .send({
          location: [1]
        })
        .expect(400)
        .expect(res => {
          expect(res.body.status).toBe(false);
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('Should not attack with out of range index', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/attack`)
        .send({
          location: [11, 11]
        })
        .expect(400)
        .expect(res => {
          expect(res.body.status).toBe(false);
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('Should return you miss', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/attack`)
        .send({
          location: [10, 10]
        })
        .expect(200)
        .expect(res => {
          expect(res.body.status).toBe(true);
          expect(res.body.message).toBe('You miss');
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('Should return you miss', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/attack`)
        .send({
          location: [9, 9]
        })
        .expect(200)
        .expect(res => {
          expect(res.body.status).toBe(true);
          expect(res.body.message).toBe('You miss');
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('Should return you hit the ship', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/attack`)
        .send({
          location: constants.validData[0].location[0]
        })
        .expect(200)
        .expect(res => {
          expect(res.body.status).toBe(true);
          expect(res.body.message).toBe('You hit the ship');
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('Should not allow to attack on same location', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/attack`)
        .send({
          location: constants.validData[0].location[0]
        })
        .expect(400)
        .expect(res => {
          expect(res.body.status).toBe(false);
          expect(res.body.message).toBe('Attack has been already made on this location');
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('Should return you sunk the ship type of', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/attack`)
        .send({
          location: constants.validData[0].location[1]
        })
        .expect(200)
        .expect(res => {
          expect(res.body.status).toBe(true);
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('should return game over with steps', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/attack`)
        .send({
          location: constants.validData[constants.validData.length - 1].location[0]
        })
        .expect(200)
        .expect(res => {
          expect(res.body.status).toBe(true);
          expect(res.body.message).toBe('You have completed the game in total 20 moves. You have total 2 missed moves')
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
    it('should not allow to attack once game is over', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/attack`)
        .send({
          location: [8,8]
        })
        .expect(400)
        .expect(res => {
          expect(res.body.status).toBe(false);
          expect(res.body.message).toBe('Game is currently in end state. You cannot attack.')
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
});