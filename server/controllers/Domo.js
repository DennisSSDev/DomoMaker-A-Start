const models = require('../models');

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  const name = req.body.name;
  const age = req.body.age;
  const level = req.body.level;

  if (!name || !age || !level) {
    return res.status(400).json({ error: 'Name, Age and Level are required' });
  }

  const domoData = {
    name,
    age,
    level,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);
  const domoPromise = newDomo.save();
  domoPromise.then(() => {
    res.json({
      redirect: '/maker',
    });
  });

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists' });
    }
    return res.status(400).json({ error: 'an error occured' });
  });

  return domoPromise;
};

const getDomos = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occured' });
    }
    return res.json({ domos: docs });
  });
};

const deleteDomo = (req, res) => {
  const name = `${req.body.name}`;
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }
  Domo.DomoModel.removeAllByName(name, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occured' });
    }
    return getDomos(req, res);
  });
};

module.exports.makerPage = makerPage;
module.exports.makeDomo = makeDomo;
module.exports.getDomos = getDomos;
module.exports.deleteDomo = deleteDomo;
