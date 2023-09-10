const express = require("express");
const app = express();
const mongoose = require("mongoose");
const DOGDB = require("./model");
const cors = require("cors");
app.use(express.json());

mongoose.connect("mongodb+srv://tommy:1099@hacker-man.mqkqw8a.mongodb.net/DOG");
const db = mongoose.connection;
db.on("error", (err) => console.log(err));
db.once("open", () => console.log("Connected to DB"));

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   next();
// });
app.use(cors({ methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] }));

app.get("/", cors(), async (req, res) => {
  let fetchedDog;
  await fetch("https://dog.ceo/api/breeds/image/random")
    .then((response) => response.json())
    .then((data) => (fetchedDog = data.message));
  res.body = fetchedDog;
  const dog_db_model = new DOGDB({
    src: fetchedDog,
  });
  try {
    const newDog = await dog_db_model.save();
    res.status(201).json(newDog.src);
  } catch (error) {
    console.log(error.message);
  }
});
app.get("/all", async (req, res) => {
  let allDogsArr = [];
  const allDogs = await DOGDB.find();
  allDogs.forEach((dog) => {
    allDogsArr.push(dog.src);
  });
  res.status(201).send(allDogsArr);
});

app.listen(10000, `0.0.0.0`, () => {
  console.log("listening on port 10000");
});
