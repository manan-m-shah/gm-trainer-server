// controller for single player game
// - create a new game
// - get a game
// - update a game
// - delete a game
// - get all games

import SinglePlayerGame, { GameStatus, turn } from "../models/singlePlayerGame.js";
import mongoose from "mongoose";
import { Chess } from "chess.js";

export const getAllSinglePlayerGames = async (req, res) => {
    try {
        const singlePlayerGames = await SinglePlayerGame.find();
        res.status(200).json({ games: singlePlayerGames });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createSinglePlayerGame = async (req, res) => {
    const { player } = req.body;

    const newSinglePlayerGame = new SinglePlayerGame(
        {
            player
        }
    );
    try {
        const singlePlayerGameDocument = await newSinglePlayerGame.save();
        console.log(singlePlayerGameDocument);
        const uid = singlePlayerGameDocument._id;
        res.status(201).json({ message: "Single player game created successfully.", uid });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

export const getSinglePlayerGame = async (req, res) => {
    console.log('getSinglePlayerGame');
    const { uid } = req.params;
    try {
        const singlePlayerGame = await SinglePlayerGame.findById(uid);
        res.status(200).json({ message: "Single player game retrieved successfully.", fen: singlePlayerGame.fen, player: singlePlayerGame.player, uid, history: singlePlayerGame.history, status: singlePlayerGame.status, turn: singlePlayerGame.turn });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateSinglePlayerGame = async (req, res) => {
    const { uid } = req.params;
    const { move } = req.body;
    if (!mongoose.Types.ObjectId.isValid(uid)) return res.status(404).send({ message: `No single player game with id: ${uid}` });

    const game = await SinglePlayerGame.findById(uid);
    const gameCopy = new Chess(game.fen);

    if (gameCopy.turn() === turn.WHITE) {
        let status;
        let gameHistory = game.history;
        gameCopy.move(move)

        status = checkStatus(gameCopy);
        let updatedSinglePlayerGame = await SinglePlayerGame.findByIdAndUpdate(uid, {
            fen: gameCopy.fen(),
            history: gameHistory.concat(gameCopy.history()),
            status,
            turn: gameCopy.turn(),
        }, { new: true });

        if (status === GameStatus.GAME_OVER) {
            return res.status(201).json({
                message: "Single player game updated successfully.",
                fen: updatedSinglePlayerGame.fen,
                history: updatedSinglePlayerGame.history,
                status: updatedSinglePlayerGame.status,
                turn: updatedSinglePlayerGame.turn,
                uid: updatedSinglePlayerGame._id,
            });
        }

        const possibleMoves = gameCopy.moves();
        const newMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        console.log(newMove);
        gameCopy.move(newMove);


        status = checkStatus(gameCopy);

        updatedSinglePlayerGame = await SinglePlayerGame.findByIdAndUpdate(uid, {
            fen: gameCopy.fen(),
            history: gameHistory.concat(gameCopy.history()),
            status,
            turn: gameCopy.turn(),
        }, { new: true });

        console.log(updatedSinglePlayerGame.history);

        return res.status(201).json({
            message: "Single player game updated successfully.",
            fen: updatedSinglePlayerGame.fen,
            history: game.history + updatedSinglePlayerGame.history,
            status: updatedSinglePlayerGame.status,
            turn: updatedSinglePlayerGame.turn,
            uid: updatedSinglePlayerGame._id,
        });
    } else {
        return res.status(400).send({ message: "It is not your turn." });
    }
}

export const deleteSinglePlayerGame = async (req, res) => {
    const { uid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(uid)) return res.status(404).send(`No single player game with id: ${uid}`);
    await SinglePlayerGame.findByIdAndRemove(uid);
    res.json({ message: "Single player game deleted successfully." });
}

const checkStatus = (game) => {
    if (game.isGameOver()) {
        if (game.isCheckmate()) {
            return GameStatus.CHECKMATE;
        } else if (game.isStalemate()) {
            return GameStatus.STALEMATE;
        } else if (game.isDraw()) {
            return GameStatus.DRAW;
        } else if (game.isInsufficientMaterial()) {
            return GameStatus.INSUFFICIENT_MATERIAL;
        } else if (game.isThreefoldRepetition()) {
            return GameStatus.THREEFOLD_REPETITION;
        } else {
            return GameStatus.GAME_OVER;
        }
    } else {
        return GameStatus.IN_PROGRESS;
    }
}
