require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const { UserUtils } = require('./utils/userUtils');
const { specs } = require('./swagger/swagger');

const app = express();

let PORT = parseInt(process.env.PORT?.trim());
if (!Number.isFinite(PORT) || PORT < 3000 || PORT > 3999) PORT = 3103;

app.use(express.json());
app.use(cors({ origin: 'https://dante-sal.github.io' }));
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs));
app.use('/', require('./routes'));

app.listen(PORT, async () => {
    console.log('Bienvenido a KarenFlix!');
    await UserUtils.hashAll();
});