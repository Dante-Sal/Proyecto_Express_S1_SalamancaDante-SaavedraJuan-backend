require('dotenv').config();
const express = require('express');
const app = express();

const PORT = process.env.PORT;

app.get(`/`, (req, res) => {
    res.send(`<strong>200:</strong> Corriendo prueba en el puerto ${PORT}...`);
});

app.listen(PORT, () => {
    console.log(`Bienvenido a KarenFlix!`);
});