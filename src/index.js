const express = require("express");
const app = express();
const port = 8080;

const onePageArticleCount = 10;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { newsArticleModel } = require("./connector");

app.get("/newFeeds", (req, res) => {
  const limit = parseInt(req.query.limit);
  const offset = parseInt(req.query.offset);
  const options = {};
  options.skip = limit * (offset - 1);
  options.limit = limit;
  newsArticleModel.count({}, function (err, totalCount) {
    if (err) {
      res.status(500).send({ message: err.message });
      return;
    }
    newsArticleModel.find({}, {}, options, function (err, result) {
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
