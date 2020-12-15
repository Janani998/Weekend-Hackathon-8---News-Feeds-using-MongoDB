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
    offset = 0;
  }
  if (isNaN(offset)) {
    offset = 0;
  }
  if (isNaN(limit) || limit <= 0) {
    limit = onePageArticleCount;
    if (!offsetReceived) {
      offset = 0;
    }
  }

  newsArticleModel
    .find()
    .then((result) => {
      let startIndex = 0;
      startIndex += offset;
      let returnedArray = [];
      for (let i = startIndex; i < startIndex + limit; i++) {
        returnedArray.push(result[i]);
      }
      res.status(200).send(returnedArray);
    })
    .catch((error) => error.message);
});
app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
