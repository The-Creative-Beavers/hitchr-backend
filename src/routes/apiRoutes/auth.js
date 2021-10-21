const bcrypt = require('bcrypt');
const login = require('../../controllers/auth/login');

function hashPassword(password) {
  return bcrypt.hash(password, 10).then((p) => p.slice(0, 30));
}

function AuthRouter(context) {
  const obj = {};

  obj.create = async (req, res) => {
    const p1 = await hashPassword('password');
    const p2 = await hashPassword('password');
    console.log(p1, p2);
    const {
      username, password, isDriver, paymentMethods,
    } = req.body;
    if (username && password && isDriver !== undefined && paymentMethods) {
      let passHash;
      try {
        passHash = await hashPassword(password);
      } catch (e) {
        console.error(e);
        res.status(500).send();
        return;
      }
      try {
        await login.createUser(
          context.client,
          username,
          passHash,
          isDriver,
          JSON.stringify(paymentMethods),
        );
      } catch (e) {
        console.error(e);
        res.status(500).send();
        return;
      }
      res.status(201).send();
    } else {
      res.status(400).send();
    }
  };

  obj.login = async (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
      let passHash;
      try {
        passHash = await hashPassword(password);
      } catch (e) {
        console.error(e);
        res.status(500).send();
        return;
      }
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
