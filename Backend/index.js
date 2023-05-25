const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

// we are using port 3001
const port = 3001;

const apiRoutes = require("./routes/backend");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const readline = require('readline').createInterface({
  input: process.stdin,
  // output: process.stdout
});

app.use("/api", apiRoutes);

app.listen(port, () => {
  console.log(`Listening to http://127.0.0.1:${port}`);
});
