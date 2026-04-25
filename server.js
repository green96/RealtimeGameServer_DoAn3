const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB connect
mongoose.connect("mongodb+srv://khainhan19_db_user:<db_password>@gamedb.iulvp3w.mongodb.net/?appName=gameDB");

const PlayerSchema = new mongoose.Schema({
    id: String,
    x: Number,
    y: Number,
    z: Number,
    rotY: Number
});

const Player = mongoose.model("Player", PlayerSchema);

// ⚡ RAM storage (quan trọng)
let players = {};

// 🟢 nhận movement (gửi movement lên server)
app.post("/move", (req, res) => {
    const { id, x, y, z, rotY } = req.body;

    players[id] = { x, y, z, rotY };

    res.send({ ok: true });
});

// 🔵 trả danh sách player
app.get("/players", (req, res) => {
    res.json(players);
});

// ❌ player thoát
app.post("/leave", (req, res) => {
    delete players[req.body.id];
    res.send({ ok: true });
});

// 💾 save Mongo mỗi 5 giây
setInterval(async () => {
    for (let id in players) {
        await Player.findOneAndUpdate(
            { id },
            { id, ...players[id] },
            { upsert: true }
        );
    }
    console.log("Saved to MongoDB");
}, 5000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server chạy", PORT));