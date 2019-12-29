module.exports = {
  invalidRangeData: {
    model: 'battleship',
    location: [11, 11]
  },
  invalidShipName: {
    model: 'somename',
    location: [0, 0]
  },
  notEnoughLocationLength: {
    model: 'battleship',
    location: [[0,0], [0,1], [0,2]]
  },
  invalidSingleLocation: {
    model: 'battleship',
    location: [0, 1, 2, 3]
  },
  invalidSameData: {
    model: 'battleship',
    location: [[0,0], [0,0], [0,0], [0,0]]
  },
  inconsistentData: {
    model: 'cruiser',
    location: [[0,1], [1,2], [2, 3]]
  },
  validHorizontalData: {
    model: 'cruiser',
    location: [[0,0], [0,1], [0,2]]
  },
  overlappingData: {
    model: 'cruiser',
    location: [[0,0], [1,0], [2,0]]
  },
  validVerticalData: {
    model: 'cruiser',
    location: [[1,1], [2,1], [3,1]]
  },
  validDataForMaxLimit: {
    model: 'cruiser',
    location: [[2,1], [2,2], [2, 3]]
  },
  validData: [
    {
      model: 'destroyer',
      location: [[3,1], [3,2]]
    },
    {
      model: 'destroyer',
      location: [[3,3], [3,4]]
    },
    {
      model: 'destroyer',
      location: [[4,1], [4,2]]
    },
    {
      model: 'battleship',
      location: [[0,0], [0,1], [0,2], [0,3]]
    },
    {
      model: 'cruiser',
      location: [[1,1], [1,2], [1,3]]
    },
    {
      model: 'cruiser',
      location: [[2,1], [2,2], [2,3]]
    },
    {
      model: 'submarine',
      location: [[5,1]]
    },
    {
      model: 'submarine',
      location: [[5,2]]
    },
    {
      model: 'submarine',
      location: [[5,3]]
    },
    {
      model: 'submarine',
      location: [[5,4]]
    }
  ]
};