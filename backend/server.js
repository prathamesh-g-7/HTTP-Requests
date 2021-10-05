import express from "express";
import mongoose from "mongoose";
import { MongoClient } from "mongodb";
import userSchema from "./userModel.js";

const app = express();
app.use(express.json());

// DB config
const mongoURI =
  "mongodb+srv://admin:AtHaoRroNldFmHr7@cluster0.ghi5h.mongodb.net/users?retryWrites=true&w=majority";
mongoose.connect(mongoURI, {
  // useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("DB connected");
});

// post method
app.post("/users", async (req, res) => {
  const userData = req.body;

  try {
    userSchema.create(userData, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

// get method
app.get("/users", (req, res) => {
  userSchema.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// delete method
app.delete("/users", (req, res) => {
  MongoClient.connect(mongoURI, (err, db) => {
    if (err) throw err;

    const usernameToDelete = req.body.username;

    const dbo = db.db("users");

    dbo
      .collection("users")
      .deleteOne({ username: usernameToDelete }, (err, result) => {
        if (err) throw err;
        res
          .status(202)
          .send(`User Delted Successfully with username=${usernameToDelete}`);
      });
  });
});

// put method
app.put("/users/:username", (req, res) => {
  MongoClient.connect(mongoURI, (err, db) => {
    if (err) throw err;

    const name = req.params.username;
    const updatedName = req.body.username;

    const dbo = db.db("users");

    dbo.collection("users").findOne({ username: name }, (err, result) => {
      if (err) throw err;

      result.username = updatedName;
      res.status(201).send(result);
    });
  });
});

// options method
app.options("/api", cors, function (req, res, next) {
  console.log("OPTIONS route:", req.headers);
  res.sendStatus(200);
});

// middleware for options method
function cors(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, sso-token, Content-Length, X-Requested-With"
  );
  next();
}

// listen
app.listen(3200);
