const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors()); // allow all origins for dev
app.use(express.json()); // parse JSON bodies

// simple in-memory latest value
let latestReading = null;

app.post("/api/temperature", (req, res) => {
    const { temperature } = req.body;

    if (typeof temperature !== "number") {
        return res.status(400).json({ error: "temperature must be a number" });
    }

    latestReading = {
        temperature,
        receivedAt: new Date().toISOString(),
    };

    console.log("New LM35 reading:", latestReading);

    res.json({ status: "ok" });
});

app.get("/api/temperature", (req, res) => {
    if (!latestReading) {
        return res.json({ status: "no_data_yet" });
    }
    res.json({ status: "ok", data: latestReading });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Express API listening on port ${PORT}`);
});
