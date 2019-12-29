const Joi = require('joi');

exports.placeShip = Joi.object({
  boardId: Joi
    .string()
    .required()
    .options({
      language: {
        any: {
          empty: 'is required'
        }
      }
    })
    .label('Board Id'),
  model: Joi
    .string()
    .required()
    .valid('battleship', 'cruiser', 'destroyer', 'submarine')
    .options({
      language: {
        any: {
          empty: 'is required'
        }
      }
    })
    .label('Model'),
  location: Joi
    .array()
    .required()
    .min(1)
    .max(4)
    .options({
      language: {
        any: {
          empty: 'is required'
        }
      }
    })
    .label('Location')
});

exports.attack = Joi.object({
  boardId: Joi
    .string()
    .required()
    .options({
      language: {
        any: {
          empty: 'is required'
        }
      }
    })
    .label('Board Id'),
  location: Joi
    .array()
    .required()
    .min(2)
    .max(2)
    .options({
      language: {
        any: {
          empty: 'is required'
        }
      }
    })
    .label('Location')

})