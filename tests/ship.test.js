const expect = require('expect');
const request = require('supertest');
const { app } = require('../server');
const constants = require('./constants');
const Board = require('../modules/battleship/models/board.model')
const Ship = require('../modules/battleship/models/ship.model')

let boardId;
before((done) => {
  Board.deleteMany({}).then(() => {
    Ship.deleteMany({}).then(() => {
      let board = new Board();
      board.save().then((data) => {
        boardId = data._id;
        done();
      })
    })
  });
});

describe('Ship APIs', () => {
  describe('POST /api/v1/board/:id/ship', () => {
    it('Should return 404 if no board found', (done) => {
      request(app)
        .post(`/api/v1/board/5e076914f88182c7410c55af/ship`)
        .expect(404)
        .expect(res => {
          expect(res.body.status).toBe(false)
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
    it('Should not able to put ship with blank data', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/ship`)
        .expect(400)
        .expect(res => {
          expect(res.body.status).toBe(false)
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
    it('Should not able to put ship with out of grid location', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/ship`)
        .send(constants.invalidRangeData)
        .expect(400)
        .expect(res => {
          expect(res.body.status).toBe(false)
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
    it('Should not able to put ship with invalid name', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/ship`)
        .send(constants.invalidShipName)
        .expect(400)
        .expect(res => {
          expect(res.body.status).toBe(false)
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
    it('Should not able to put ship with not enough location length', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/ship`)
        .send(constants.notEnoughLocationLength)
        .expect(400)
        .expect(res => {
          expect(res.body.status).toBe(false)
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
    it('Should not able to put ship with single location', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/ship`)
        .send(constants.invalidSingleLocation)
        .expect(400)
        .expect(res => {
          expect(res.body.status).toBe(false)
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
    it('Should not able to put ship with same data', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/ship`)
        .send(constants.invalidSameData)
        .expect(400)
        .expect(res => {
          expect(res.body.status).toBe(false)
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
    it('Should not able to put ship with inconsistent data', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/ship`)
        .send(constants.inconsistent)
        .expect(400)
        .expect(res => {
          expect(res.body.status).toBe(false)
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
    it('Should able to put ship with valid horizontal data', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/ship`)
        .send(constants.validHorizontalData)
        .expect(200)
        .expect(res => {
          expect(res.body.status).toBe(true)
          expect(res.body.data.model).toBe(constants.validHorizontalData.model)
          expect(res.body.data.location).toStrictEqual(constants.validHorizontalData.location)
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
    it('Should not able to put ship with overlapping data', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/ship`)
        .send(constants.overlappingData)
        .expect(400)
        .expect(res => {
          expect(res.body.status).toBe(false)
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
    it('Should able to put ship with valid vertical data', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/ship`)
        .send(constants.validVerticalData)
        .expect(200)
        .expect(res => {
          expect(res.body.status).toBe(true)
          expect(res.body.data.model).toBe(constants.validVerticalData.model)
          expect(res.body.data.location).toStrictEqual(constants.validVerticalData.location)
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
    it('Should not able to put more than allowed ship', (done) => {
      request(app)
        .post(`/api/v1/board/${boardId}/ship`)
        .send(constants.validDataForMaxLimit)
        .expect(400)
        .expect(res => {
          expect(res.body.status).toBe(false)
        })
        .end(err => {
          if (err) {
            return done(err);
          }
          done();
        })
    });
  });
});