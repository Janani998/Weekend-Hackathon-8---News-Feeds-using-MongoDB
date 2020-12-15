const express = require("express");
const app = express();
const port = 8080;

const onePageArticleCount = 10;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const { newsArticleModel } = require("./connector");

app.get("/newFeeds", (req, res) => {
  let limitReceived = req.query.limit;
  let offsetReceived = req.query.offset;
  let limit = parseInt(limitReceived, 10);
  let offset = parseInt(offsetReceived, 10);
  if (!limitReceived) {
    limit = onePageArticleCount;
  }
  if (!offsetReceived) {
    offset = 1;
  }
  if (isNaN(offset)) {
    offset = 1;
  }
  if (isNaN(limit)) {
    limit = onePageArticleCount;
    if (!offsetReceived) {
      offset = 1;
    }
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
