
# Project 

RESTful API for Battleship

## Getting Started
**Pre requirements**
- node
- npm
- mongodb

1. Clone this repo
2. Copy `.env.example` file into `.env` file and add credentials.
3. run `npm i`
4. run `sh start.sh` or `npm start`
5. For Test Case: `sh test.sh`
6. Server is running at: [http://localhost:6005](http://localhost:6005)

## End Points
* `/api/v1/board`
    * `GET /`
        * Get all boards
    * `GET /:id`
        * Get single board
    * `POST /`
        * Create new board
    * `POST /:id/ship`
        * Place ship on board
        * **Requires**: `model, location`
        * **Accepts**: `model, location`
        * **Example**: ```{ "model": "battelship", "location": [[0, 1], [0,2], [0, 3], [0, 4]] }```
    * `POST /:id/attack`
        * Attack on ship
        * **Requires**: `location`
        * **Accepts**: `location`
        * **Example**: ```{ "location": [0, 1] }```

## Note
- The board is 10 * 10 Size.
- Accepted ship with max allowed ship and length of ship
  - Name: battleship
    - Ship length: 4
    - Max Allowed: 1
  - Name: cruiser
    - Ship length: 3
    - Max Allowed: 2
  - Name: destroyer
    - Ship length: 2
    - Max Allowed: 3
  - Name: submarine
    - Ship length: 1
    - Max Allowed: 4
