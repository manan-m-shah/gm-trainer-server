// model for player
// players can login with google
// only email from google will be stored

import mongoose from "mongoose";

const playerSchema = mongoose.Schema({
    email: String,
});