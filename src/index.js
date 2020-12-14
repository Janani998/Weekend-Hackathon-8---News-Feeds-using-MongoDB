const express = require("express");
const app = express();
const port = 8080;

const onePageArticleCount = 10;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { newsArticleModel } = require("./connector");

app.get("/newFeeds", (req, res) => {
  let limit = parseInt(req.query.limit);
  let offset = parseInt(req.query.offset);
  if (!limit || limit < 1 || limit > newsArticleModel.countDocuments()) {
    limit = onePageArticleCount;
  }
  if (!offset || offset < 1 || offset > newsArticleModel.countDocuments()) {
    offset = 1;
  }
  const options = {};
  options.skip = offset - 1;
  options.limit = limit;
  newsArticleModel.countDocuments({}, function (err) {
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
