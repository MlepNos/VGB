const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const gameRoutes = require("./routes/games");
const reviewRoutes = require("./routes/reviews.js")
const authRoutes = require("./routes/auth");

const { connectToDatabase } = require("./controller/connect.js");
require("dotenv").config();

const app = express();

// CORS Middleware
app.use(cors());

app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

app.use("/api/auth", authRoutes);

app.use("/api/game", gameRoutes);
app.use("/api/review", reviewRoutes);

connectToDatabase()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `Server is listening at http://localhost:${process.env.PORT}`
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });