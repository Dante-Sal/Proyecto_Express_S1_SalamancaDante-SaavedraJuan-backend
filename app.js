require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({ origin: `https://Dante-Sal.github.io` }));

app.get(`/`, (req, res) => {
    res.json({ status: `ok` });
});

app.listen(PORT, () => {
    console.log(`Bienvenido a KarenFlix!`);
});