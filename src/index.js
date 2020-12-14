const express = require("express");
const app = express();
const port = 8080;

const onePageArticleCount = 10;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { newsArticleModel } = require("./connector");

app.get("/newFeeds", (req, res) => {
  const { limit, offset } = req.query;
  const query = {};
  const options = {
    limit: parseInt(limit, 10) || 10,
    offset: parseInt(offset, 10) || 0
  };
  query.skip = options.limit * (options.offset - 1);
  query.limit = options.limit;
  newsArticleModel.count({}, function (err) {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    newsArticleModel.find({}, {}, query, function (err, result) {
      if (err) {
        res.status(500).send({ message: err.message });
        return;
      } else {
        res.status(200).send(result);
      }
    });
  });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
