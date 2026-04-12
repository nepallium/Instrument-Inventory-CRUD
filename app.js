import express from "express";
import "dotenv/config";
import path from "path";
import indexRouter from "./routes/indexRouter.js";
import productsRouter from "./routes/productsRouter.js";
import categoriesRouter from "./routes/categoriesRouter.js";

const app = express();

app.use(express.urlencoded({ extended: true }));

// ejs
app.set("views", path.join(import.meta.dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(import.meta.dirname, "public");
app.use(express.static(assetsPath));

// routes
app.use("/", indexRouter);
app.use("/products", productsRouter);
app.use("/categories", categoriesRouter);

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
