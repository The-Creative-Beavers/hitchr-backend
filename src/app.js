const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/apiRouter');

function App(port, client) {
  const app = express();
  // line 7-13 tempary solution for local testing between front to backend-servers
  const allowCrossDomain = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  };
  app.use(allowCrossDomain);
  app.use(express.json());
  app.use(cors());
  app.use('/api', apiRouter);

  app.get('/test', async (req, res) => {
    let result;
    try {
      result = await client.query('SELECT $1::text as message', ['test']);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }

    res.send({ foo: result.rows[0].message });
  });

  return app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
}

module.exports = App;
