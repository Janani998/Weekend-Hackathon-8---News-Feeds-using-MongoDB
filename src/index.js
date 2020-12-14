const express = require("express");
const app = express();
const port = 8080;

const onePageArticleCount = 10;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { newsArticleModel } = require("./connector");

app.get("/newFeeds", paginatedResults(newsArticleModel), (req, res) => {
  res.send(res.paginatedElements);
});

function paginatedResults(model) {
  return async (req, res, next) => {
    const { limit, offset } = req.query;
    const options = {
      limit: parseInt(limit, 10) || 10,
      offset: parseInt(offset, 10) || 0
    };

    const startIndex = (options.offset - 1) * options.limit;
    const endIndex = options.offset * options.limit;

    const results = {};

    if (endIndex < (await model.countDocuments().exec())) {
      results.next = {
        offset: options.offset + 1,
        limit: options.limit
      };
    }

    if (startIndex > 0) {
      results.previous = {
        offset: options.offset - 1,
        limit: options.limit
      };
    }

    try {
      results.results = await model
        .find()
        .limit(options.limit)
        .skip(startIndex)
        .exec();
      res.paginatedElements = results;
      next();
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  };
}
app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
