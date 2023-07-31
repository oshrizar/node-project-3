const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const apiRouter = require("./routes/api");
const config = require("config");
const initialData = require("./initialData/initialData");

const app = express();

console.log("file", config.get("file"));

app.use(cors());

app.use(
  logger(
    ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
  )
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/admin", express.static(path.join(__dirname, "admin")));

initialData();
app.use("/api", apiRouter);
app.use((req, res, next) => {
  res.status(404).json({ err: "page not found" });
});

module.exports = app;
