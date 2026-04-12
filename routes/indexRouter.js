import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.render("index", { title: "Music Instruments Inventory" });
});

export default router;
