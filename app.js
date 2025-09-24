require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({ origin: `https://dante-sal.github.io` }));

app.listen(PORT, () => {
    console.log(`Bienvenido a KarenFlix!`);
});