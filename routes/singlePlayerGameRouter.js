// router for single player game

import express from "express";
import {
  createSinglePlayerGame,
  getSinglePlayerGame,
  updateSinglePlayerGame,
  deleteSinglePlayerGame,
  getAllSinglePlayerGames,
} from "../controllers/singlePlayerGameController.js";
const router = express.Router();

router.get("/all", getAllSinglePlayerGames);
router.post("/", createSinglePlayerGame);
router.get("/:uid", getSinglePlayerGame);
router.patch("/:uid", updateSinglePlayerGame);
router.delete("/:uid", deleteSinglePlayerGame);

export default router;
