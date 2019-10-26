const models = require('../models');

const Account = models.Account;

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const getToken = (req, res) => {
  const csrfTokenJSON = {
    csrfToken: req.csrfToken(),
  };
  res.json(csrfTokenJSON);
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'incorrect username or password' });
    }
    const reqC = req;
    reqC.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (req, res) => {
  const name = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;
  console.log(name);
  console.log(pass);
  if (!name || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords dont match' });
  }
  return Account.AccountModel.generateHash(pass, (salt, hash) => {
    const accountData = {
      username: name,
      salt,
      password: hash,
    };
    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();
    savePromise.then(() => {
      const reqC = req;
      reqC.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });
    savePromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already used' });
      }
      return res.status(400).json({ error: 'an error occured' });
    });
  });
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.signup = signup;
module.exports.logout = logout;
module.exports.getToken = getToken;
