// model for a single-player chess game
// should have a player, a game, a uid

import mongoose from "mongoose";
import { Chess } from "chess.js";

export const GameStatus = {
    IN_PROGRESS: "IN_PROGRESS",
    CHECKMATE: "CHECKMATE",
    STALEMATE: "STALEMATE",
    DRAW: "DRAW",
    INSUFFICIENT_MATERIAL: "INSUFFICIENT_MATERIAL",
    THREEFOLD_REPETITION: "THREEFOLD_REPETITION",
    GAME_OVER : "GAME_OVER"
}

export const turn = {
    WHITE: "w",
    BLACK: "b"
}

const game = new Chess();

const singlePlayerGameSchema = mongoose.Schema({
    player: String,
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
        default: turn.WHITE,
    },
});

const SinglePlayerGame = mongoose.model('SinglePlayerGame', singlePlayerGameSchema);

export default SinglePlayerGame;
