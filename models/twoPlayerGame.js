// model for a single-player chess game
// should have two players, thier colors, a fen, a turn, history, and a status

import mongoose from "mongoose";
import { Chess } from "chess.js";

export const GameStatus = {
    IN_PROGRESS: "IN_PROGRESS",
    CHECKMATE: "CHECKMATE",
    STALEMATE: "STALEMATE",
    DRAW: "DRAW",
    INSUFFICIENT_MATERIAL: "INSUFFICIENT_MATERIAL",
    THREEFOLD_REPETITION: "THREEFOLD_REPETITION",
}

export const colors = {
    WHITE: "w",
    BLACK: "b"
}

const game = new Chess();

const twoPlayerGameSchema = mongoose.Schema({
    player1: String,
    player2: String,
    color1: {
        type: String,
        enum: Object.values(colors),
        default: colors.WHITE,
    },
    color2: {
        type: String,
        enum: Object.values(colors),
        default: colors.BLACK,
    },
    fen: {
        type: String,
        default: game.fen()
    },
    history: {
        type: typeof game.history(),
        default: game.history()
    },
    status: {
        type: String,
        enum: Object.values(GameStatus),
        default: GameStatus.IN_PROGRESS
    },
    turn: {
        type: String,
        enum: Object.values(colors),
        default: colors.WHITE,
    },
});
