const models = require('../models');

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'an error occured' });
    }
    return res.render('app', { domos: docs });
  });
};

const makeDomo = (req, res) => {
  const name = req.body.name;
  const age = req.body.age;

  if (!name || !age) {
    return res.status(400).json({ error: 'Both Name and Age are required' });
  }
  const domoData = {
    name,
    age,
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

module.exports.makerPage = makerPage;
module.exports.makeDomo = makeDomo;
