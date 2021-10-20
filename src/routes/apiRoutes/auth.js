const bcrypt = require('bcrypt');
const login = require('../../controllers/auth/login');

function hashPassword(password) {
  return bcrypt.hash(password, 10).then(p => p.slice(0, 30));
}

module.exports.create = async (req, res) => {
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
      console.log(passHash.length);
      await login.createUser(
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

module.exports.login = async (req, res) => {
  if (login(req.body.username, await bcrypt.hash(req.body.password, 10))) {
    res.send();
  } else {
    res.status(401).send();
  }
};

module.exports.logout = (req, res) => {
  console.log(req, res);
};
