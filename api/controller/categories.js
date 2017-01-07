const modelService = require('../service/modelService');

function mainCategories(req, res) {
  const model = modelService.getModel();
  const mainCategories = model.mainCategories;

  if (!(mainCategories && mainCategories.length)) {
    var err = new Error('No categories in model?');
    err.status = 404;
    next(err);
    return;
  }

  res.set('Content-Type', 'text/xml');
  res.render('mainCategories', {
    categories: mainCategories
  });
}

function additionalCategories(req, res) {
  const model = modelService.getModel();
  const additionalCategories = model.additionalCategories;

  if (!(additionalCategories && additionalCategories.length)) {
    var err = new Error('No categories in model?');
    err.status = 404;
    next(err);
    return;
  }

  res.set('Content-Type', 'text/xml');
  res.render('additionalCategories', {
    categories: additionalCategories
  });
}


module.exports = {
  mainCategories: mainCategories,
  additionalCategories: additionalCategories
};