const camelcaseKeys = require('camelcase-keys');

const login = require('../../controllers/auth/login');

function makeSession() {
  function partialSession() {
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
  }
  const overSession = partialSession() + partialSession();
  const session = overSession.slice(0, 16);
  return session;
}

function AuthRouter(context) {
  makeSession();
  const obj = {};

  obj.create = async (req, res) => {
    const {
      username, password, isDriver, paymentMethods,
    } = req.body;
    if (username && password && isDriver !== undefined && paymentMethods) {
      const passHash = password;
      let userID;
      try {
        const result = await login.createUser(
          context.client,
          username,
          passHash,
          isDriver,
          JSON.stringify(paymentMethods),
        );
        console.log(result);
        userID = result.rows[0].id;
      } catch (e) {
        console.error(e);
        res.status(500).send();
        return;
      }
      const user = await login.getUser(context.client, userID);
      res.status(201).send({ session: makeSession(), user: camelcaseKeys(user) });
    } else {
      res.status(400).send();
    }
  };

  obj.login = async (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
      const passHash = password;
      let userExists;
      try {
        userExists = await login.login(
          context.client,
          username,
          passHash,
        );
      } catch (e) {
        console.error(e);
        res.status(500).send();
        return;
      }
      if (userExists) {
        res.status(201).send();
      } else {
        res.status(401).send();
      }
    } else {
      res.status(400).send();
    }
    res.status(401).send();
  };

  obj.logout = (req, res) => {
    console.log(req, res);
  };

  return obj;
}

module.exports = AuthRouter;
