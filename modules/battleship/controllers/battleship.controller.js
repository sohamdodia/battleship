const mongoose = require('mongoose');
const Joi = require('joi');
const _ = require('lodash');

const message = require('../../../message');
const helper = require('../../../helper');
const schema = require('../../../schema');


const Board = mongoose.model('board');
const Ship = mongoose.model('ship');
const Attack = mongoose.model('attack');

const validShips = {
  battleship: {
    length: 4,
    max: 1
  },
  cruiser: {
    length: 3,
    max: 2
  },
  destroyer: {
    length: 2,
    max: 3
  },
  submarine: {
    length: 1,
    max: 4
  }
}

const checkTrue = value => value === true;
const checkInt = value => Number.isInteger(value);

/**
 * Function will check that the location is multidemension array wtih 2 values
 * also it will check that the length should be equal to the ship allowed length
 */
const checkValidLocation = (model, location) => {
  //Check if length is valid or not
  const validLength = location.length === validShips[`${model}`].length ? true : false;
  if (!validLength) return false;
  //If filteredLocation length is not match with location, then it means data is corrupted
  let filteredLocation = location.filter(l => l.length === 2);
  if (filteredLocation.length !== location.length) return false;

  //Check if there are not the same data exist like [[0,0], [0,0]]
  filteredLocation = _.uniqBy(filteredLocation, (item) => JSON.stringify(item));
  if (filteredLocation.length !== location.length) return false;

  filteredLocation.forEach(l => {
    if (!checkInt(l[0]) || !checkInt(l[1])) {
      return false;
    }
  })
  //Check if location is in between 10 * 10 size
  for (let i = 0; i < filteredLocation.length; i++) {
    if (filteredLocation[i][0] < 0 || filteredLocation[i][1] < 0 || filteredLocation[i][0] > 10 || filteredLocation[i][1] > 10) {
      return false;
    }
  }
  //If only one location, then return true
  if (filteredLocation.length === 1) {
    return true;
  }
  
  //Check if location is valid horizontal of valid vertical

  //Check if it is horizontal and valid
  let validHorizontalLocation = true, validVerticalLocation = true;
  let horizontalLocation = JSON.parse(JSON.stringify(filteredLocation));
  horizontalLocation.sort((a, b) => a[0] - b[0]);
  horizontalLocation.sort((a, b) => a[1] - b[1]);

  for (let i = 0; i < horizontalLocation.length - 1; i++) {
    if (!(horizontalLocation[i][0] == horizontalLocation[i + 1][0]) || !(Math.abs(horizontalLocation[i][1] - horizontalLocation[i + 1][1]) === 1)) {
      validHorizontalLocation = false;
      break;
    }
  };

  //Check if it is vertical and valid
  let verticalLocation = JSON.parse(JSON.stringify(filteredLocation));
  verticalLocation.sort((a, b) => b[1] - a[1]);
  verticalLocation.sort((a, b) => b[0] - a[0]);
  //Check if it is vertical
  for (let i = 0; i < verticalLocation.length - 1; i++) {
    if (!(verticalLocation[i][1] == verticalLocation[i + 1][1]) || !(Math.abs(verticalLocation[i][0] - verticalLocation[i + 1][0]) === 1)) {
      validVerticalLocation = false;
      break;
    }
  }

  if (!validVerticalLocation && !validHorizontalLocation) {
    return false;
  }
  return true;
}

const checkLocationTaken = (ships, location) => {

  let locationTaken = false;
  const takenLocationArr = [];
  for (let i = 0; i < location.length; i++) {
    for (let j = 0; j < ships.length; j++) {
      for (let k = 0; k < ships[j].location.length; k++) {
        if (ships[j].location[k][0] == location[i][0] && ships[j].location[k][1] == location[i][1]) {
          locationTaken = true;
          takenLocationArr.push(location[i]);
          break;
        }
      }
    }
  }
  return {
    locationTaken,
    takenLocationArr
  }
};


exports.createBoard = async (req, res) => {
  try {
    const board = new Board(req.body);
    const createdBoard = await board.save();

    return res.status(200).send(helper.getCustomSuccessMessage(createdBoard));

  } catch (error) {
    return res.status(500).send(helper.getCustomErrorMessage());
  }
}

exports.getAllBoards = async (req, res) => {
  try {
    const fetchedBoards = await Board.find({});
    return res.status(200).send(helper.getCustomSuccessMessage(fetchedBoards));
  } catch (error) {
    return res.status(500).send(helper.getCustomErrorMessage());
  }
}

exports.getSignleBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const [fetchedBoard, fetchedShips] = await Promise.all([
      Board.findById(id),
      Ship.find({ boardId: id})
    ]);
    if (!fetchedBoard) {
      return res.status(404).send(helper.getCustomErrorMessage({}, message.boardNotFound));
    }

    const json = Object.assign({}, fetchedBoard.toObject());
    json.ships = fetchedShips
    return res.status(200).send(helper.getCustomSuccessMessage(json));
  } catch (error) {
    return res.status(500).send(helper.getCustomErrorMessage());
  }
}

exports.placeShip = async (req, res) => {
  try {
    const { id } = req.params;
    const fetchedBoard = await Board.findById(id);
    if (!fetchedBoard) {
      return res.status(404).send(helper.getCustomErrorMessage({}, message.boardNotFound));
    }
    if (fetchedBoard.state !== 'init') {
      return res.status(400).send(helper.getCustomErrorMessage(
        {}, message.gameStateError(fetchedBoard.state, 'place ship'),
      ));
    }
    const json = { boardId: req.params.id, ...req.body };
    const validationResult = Joi.validate(json, schema.placeShip, { abortEarly: false });
    if (validationResult.error) {
      return res.status(400).send(helper.getCustomErrorMessage(
        validationResult.error, validationResult.error.details[0].message,
      ));
    }

    if (!checkValidLocation(json.model, json.location)) {
      return res.status(400).send(helper.getCustomErrorMessage(
        {}, message.invalidShipLength(json.model, validShips[json.model].length),
      ));
    }
    const fetchedShips = await Ship.find({ boardId: id, model: json.model });
    //If max allowed ship already exist then throw error
    if (fetchedShips.length >= validShips[json.model].max) {
      return res.status(400).send(helper.getCustomErrorMessage(
        {}, message.maxAllowedShips(json.model, validShips[json.model].max),
      ));
    }

    const fetchedAllShips = await Ship.find({ boardId: id });
    const { locationTaken, takenLocationArr } = checkLocationTaken(fetchedAllShips, json.location);
    if (locationTaken) {
      return res.status(400).send(helper.getCustomErrorMessage(
        {}, message.locationTaken(takenLocationArr),
      ));
    }
    const ship = new Ship(json);
    const createdShip = await ship.save();
    const allShipsCount = await Ship.countDocuments({ boardId: json.boardId });
    let totalShips = 0;
    Object.keys(validShips).forEach(key => {
      totalShips += validShips[key].max
    });

    if (allShipsCount === totalShips) {
      await Board.updateOne({ _id: json.boardId }, { state: 'start' });
    }
    return res.status(200).send(helper.getCustomSuccessMessage(createdShip));

  } catch (error) {
    console.log({ error });
    return res.status(500).send(helper.getCustomErrorMessage());
  }
};

exports.attack = async (req, res) => {
  try {
    const { location } = req.body;
    const { id: boardId } = req.params;

    const validationResult = Joi.validate({ ...req.body, boardId: req.params.id }, schema.attack, { abortEarly: false });
    if (validationResult.error) {
      return res.status(400).send(helper.getCustomErrorMessage(
        validationResult.error, validationResult.error.details[0].message,
      ));
    }

    if (location[0] < 0 || location[0] > 10 || location[1] < 0 || location[1] > 10 || !checkInt(location[0]) || !checkInt(location[1])) {
      return res.status(400).send(helper.getCustomErrorMessage(
        {}, message.notValidAttackLocation,
      ));
    }
    const fetchedBoard = await Board.findById(boardId);
    if (fetchedBoard.state === 'end' || fetchedBoard.state === 'init') {
      return res.status(400).send(helper.getCustomErrorMessage(
        {}, message.gameStateError(fetchedBoard.state, 'attack'),
      ));
    }
    const fetchedShips = await Ship.find({ boardId });
    if (!fetchedShips || fetchedShips.length === 0) {
      return res.status(404).send(helper.getCustomErrorMessage(
        {}, message.shipNotFound,
      ));
    }

    const fetchedAttack = await Attack.findOne({ boardId, location });
    if (fetchedAttack) {
      return res.status(400).send(helper.getCustomErrorMessage(
        {}, message.alreadyAttackedLocation,
      ));
    }

    const hittedShip = await Ship.findOne({ boardId, location: { $in: [location] } });
  
    if (hittedShip) { //Ship hit
      let locationIndex = 0;
      for (let i = 0; i < hittedShip.location.length; i++) {
        let l = hittedShip.location[i];
        if (l[0] == location[0] && l[1] == location[1]) {
          locationIndex = i;
        }
      }
      let isHit = hittedShip.isHit;
      isHit[locationIndex] = true;
      await Ship.updateOne({ _id: hittedShip._id }, { isHit });
      const attackData = {
        boardId,
        shipId: hittedShip._id,
        action: 'hit',
        location
      };

      const attack = new Attack(attackData);
      await attack.save();
      const allHittedShip = await Ship.find({ boardId, isHit: { $in: [false] }});
      if (allHittedShip && allHittedShip.length > 0) { //Game is not over yet
        if (isHit.every(checkTrue)) { //if every location is hit
          return res.status(200).send(helper.getCustomSuccessMessage({}, message.attackSunk(hittedShip.model)));
        }
        return res.status(200).send(helper.getCustomSuccessMessage({}, message.attackHit));
      } else {
        //Change the board status
        await Board.updateOne({ _id: boardId }, { state: 'end' });

        //Send the message with total hit and total miss
        const [totalHitMove, totalMissMove] = await Promise.all([
          Attack.countDocuments({ boardId, action: 'hit' }),
          Attack.countDocuments({ boardId, action: 'miss' })
        ]);
        return res.status(200).send(helper.getCustomSuccessMessage({}, message.gameCompleted(totalHitMove, totalMissMove))); 
      }
    } else {
      const attackData = {
        boardId,
        action: 'miss',
        location
      };

      const attack = new Attack(attackData);
      await attack.save();
      return res.status(200).send(helper.getCustomSuccessMessage({}, message.attackMiss));
    }
  } catch (error) {
    console.log({ error });
    return res.status(500).send(helper.getCustomErrorMessage());
  }
};