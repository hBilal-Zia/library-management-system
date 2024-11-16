const express = require('express');
const cors = require('cors');
const { createServer } = require('node:http');
const { verifyToken } = require('./middlewears/checkToken')
const {setupSocket} = require('./socket')
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 8080;
const app = express();
const server = createServer(app);

app.use(cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')));



setupSocket(server)

app.get('/health', (req, res) => {
    res.status(200).send({ "message": "Server is Up" });
});


app.use('/', require('./routes/viewsRoutes'))
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', verifyToken, require('./routes/bookRoutes'));
app.use('/api/genres', require('./routes/genreRoutes'));
app.use('/api/users', verifyToken, require('./routes/userRoutes'))

server.listen(PORT, () => {
    console.log(`Server is listening at Port = ${PORT}`);
});
