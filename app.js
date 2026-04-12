import express from "express";
import "dotenv/config";
import path from "node:path";

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("hello world"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// 404 handler
app.use((req, res, next) => {
  const err = new Error("404 not found");
  err.status = 404;
  next(err);
});

// final err handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT || 3000, (err) => {
  if (err) throw err;

  console.log(`Server listening on port ${PORT}`);
});
