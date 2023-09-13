const mongoose = require("mongoose");


const User = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    wallet: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
    cooldown: { 
        work: Number,
        daily: Number,
        steal: Number,
        beg: Number,
        search: Number,
        marry: Number,
        divorce: Number,
        default: {
            work: 0,
            daily: 0,
            steal: 0,
            beg: 0,
            search: 0,
            marry: 0,
            divorce: 0,
        }
    },
    married: { type: Array, default: [] },
});

const Levels = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    xp : { type: Number, default: 0},
    reqXp: { type: Number, default: 100},
    level: { type: Number, default: 0},
    vcXp: { type: Number, default: 0},
    vcReqXp: { type: Number, default: 100},
    vclevel: { type: Number, default: 0},
    TimeSpentVc: { type: Number, default: 0},
    
});

module.exports = { User: mongoose.model("User", User), Levels: mongoose.model("Levels", Levels) }
