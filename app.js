require("dotenv").config();
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

app.listen(10000, `0.0.0.0`, () => {
  console.log("listening on port 10000");
});

app.use(cors({ methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] }));
app.get("/", cors(), async (req, res) => {
  const newDogSrc = await fetchMoreDogs();
  res.send(newDogSrc);
});

const fetchMoreDogs = async () => {
  let newFetchedDog;
  fetch("https://dog.ceo/api/breeds/image/random")
    .then((response) => response.json())
    .then((data) => {
      newFetchedDog = data.message;
    })
    .catch((err) => console.err(err));
  databaseAdder(newFetchedDog);
  return newFetchedDog;
};

const databaseAdder = async (newFetchedDog) => {
  const newDog = await new DOGDB({
    src: newFetchedDog,
  });
  try {
    await newDog.save();
  } catch (error) {
    console.err(error);
  }
};
