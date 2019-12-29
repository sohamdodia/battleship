exports.somethingWentWrong = 'Something went wrong';
exports.boardNotFound = 'Board not found with this id.';
exports.invalidShipLength = (name, length) => `Invalid length for ship type ${name}. It should be ${length} with unique location`;
exports.maxAllowedShips = (name, allowed) => `Maximum ${allowed} ships are allowed of type ${name}`;
exports.locationTaken = (location) => `${location} is already taken, please try different location`;
exports.notValidAttackLocation = 'Location for attack is not valid';
exports.shipNotFound = 'Ships not found with this board id';
exports.alreadyAttackedLocation = 'Attack has been already made on this location';
exports.attackMiss = 'You miss';
exports.attackHit = 'You hit the ship';
exports.attackSunk = (ship) => `You sunk the ship type of ${ship}`;
exports.gameCompleted = (hit, missed) => `You have completed the game in total ${hit} moves. You have total ${missed} missed moves`;
exports.gameStateError = (state, action) => `Game is currently in ${state} state. You cannot ${action}.`