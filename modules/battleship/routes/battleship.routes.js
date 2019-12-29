const urlController = require('../controllers/battleship.controller');

module.exports = (app) => {
  app.route('/api/v1/board').get(urlController.getAllBoards)
  app.route('/api/v1/board/:id').get(urlController.getSignleBoard)
  app.route('/api/v1/board').post(urlController.createBoard);
  app.route('/api/v1/board/:id/ship').post(urlController.placeShip);
  app.route('/api/v1/board/:id/attack').post(urlController.attack);
};
