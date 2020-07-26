const model = require('../Models/model.js');

// controllers for explor page
const ideaController = {};

// middleware to get all ideas data from database
ideaController.getIdeas = (req, res, next) => {
  const queryText = 'SELECT * FROM Ideas';

  model.query(queryText, (err, results) => {
    if (err) {
      console.log(err);
      return next({
        log: `error occurred at getIdeas middleware. error message is: ${err}`,
        status: 400,
        message: { err: 'An error occurred' },
      });
    }
    console.log('results', results.rows);
    res.locals.ideas = results.rows;
    return next();
  });
};

// INSERT INTO Ideas (name, description, why, when_start, when_end, who, image, creator_username) VALUES ('scratch', 'scratch project', 'for fun', '2020-07-25', '2020-08-15', '3', 'image.png', 'hello1');

// we need to know who's submitting the idea
ideaController.submitIdea = (req, res, next) => {
  const {
    name,
    description,
    why,
    dateStart,
    dateEnd,
    teamNumber,
    imageURL,
    username,
  } = req.body;

  // will need to get user's username (may need to modify database to grab user_id instead...)
  // front end to modify date to following format YYYY-MM-DD
  // if dateEnd is not given, front end to assign it as null

  // if imageurl or endDate is falsy, then we have to omit from query text/value so that it will default to default image or date(null)
  let queryText;
  let queryValue;
  if (!dateEnd && !imageURL) {
    queryText = `INSERT INTO Ideas (name, description, why, when_start, who, creator_username) VALUES ($1, $2, $3, $4, $5, $6)`;
    queryValue = [name, description, why, dateStart, teamNumber, username];
  } else if (!imageURL) {
    queryText = `INSERT INTO Ideas (name, description, why, when_start, when_end, who, creator_username) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    queryValue = [
      name,
      description,
      why,
      dateStart,
      dateEnd,
      teamNumber,
      username,
    ];
  } else if (!dateEnd) {
    queryText = `INSERT INTO Ideas (name, description, why, when_start, who, image, creator_username) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    queryValue = [
      name,
      description,
      why,
      dateStart,
      teamNumber,
      imageURL,
      username,
    ];
  }

  model.query(queryText, queryValue, (err) => {
    if (err) {
      console.log(err);
      return next({
        log: `error occurred at submitIdea middleware. error message is: ${err}`,
        status: 400,
        message: { err: 'An error occurred' },
      });
    }
    return next();
  });
};

module.exports = ideaController;
