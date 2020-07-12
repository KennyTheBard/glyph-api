const express = require('express');
const morgan = require('morgan'); //middleware de logare
const helmet = require('helmet'); //middleware de securitate
const cors = require('cors'); //middleware de cors

const routes = require('./routes');
const errorHandler = require('./middleware/error');

require('dotenv').config()

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan(':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length]'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/v1', routes);

// handler de erori declarat ca middleware
app.use(errorHandler());

app.listen(process.env.PORT, () => {
    console.log(`App is listening on ${process.env.PORT}`);
});