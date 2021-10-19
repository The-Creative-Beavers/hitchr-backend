const { pool } = require('../../db/db');
const queries = require('./ridesQueries');

const getRide = (req, res) => {
  const { rideId } = parseInt(req.params.rideId, 10);
  pool.query(queries.getRideById, [rideId])
    .then((data) => res.status(200).json(data))
    .catch((err) => console.error(err.stack));
};

const getRides = (req, res) => {
  pool.query(queries.getRides)
    .then((data) => res.status(200).json(data.rows))
    .catch((err) => console.error(err.stack));
};

const postNewRide = (req, res) => {
  const values = [];
  pool.query(queries.createRide, values)
    .then(() => res.status(201))
    .catch((err) => console.error(err.stack));
};

module.exports = { getRide, getRides, postNewRide };
