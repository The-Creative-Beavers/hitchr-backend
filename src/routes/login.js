const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('from the login route');
});

module.exports = router;
