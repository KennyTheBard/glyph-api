const express = require('express');
const crypto = require('crypto');
const humps = require('humps');

const UsersService = require('./services.js');
const {
    ServerError
} = require('../../errors');
const {
    sendMail
} = require('../../mail/services')

const router = express.Router();

router.post('/register', async (req, res, next) => {
    const {
        username,
        email,
        password,
        birth_date,
    } = req.body;

    try {
        let activationCode = crypto.randomBytes(32).toString('hex');
        let id = await UsersService.register(username, email, password, birth_date, activationCode);
        const message = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Glypher.io account activation',
            html: '<p>Click <a href="http://localhost:3001/activate/' + id + '/' + activationCode + '">here</a> to activate</p>'
        };
        sendMail(message);

        res.status(201).end();
    } catch (err) {
        next(err);
    }
});

router.post('/login-username', async (req, res, next) => {
    const {
        username,
        password
    } = req.body;

    try {
        const token = await UsersService.authenticateByUsername(username, password);

        res.status(200).json(humps.camelizeKeys(token));
    } catch (err) {
        next(err);
    }
})

router.post('/login-email', async (req, res, next) => {
    const {
        email,
        password
    } = req.body;

    try {
        const token = await UsersService.authenticateByEmail(email, password);

        res.status(200).json(humps.camelizeKeys(token));
    } catch (err) {
        next(err);
    }
})

router.get('/activate/:id/:code', async (req, res, next) => {
    const {
        id,
        code
    } = req.params;

    try {
        const rows = await UsersService.activate(parseInt(id), code);
        if (rows.length === 0) {
            throw new ServerError('Eroare la activare!', 500);
        }

        res.status(200).json({activated: true});
    } catch (err) {
        next(err);
    }
})

module.exports = router;