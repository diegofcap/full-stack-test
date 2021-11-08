require("dotenv/config");

(async() => {
    const db = require('./utils/db');
    const express = require('express');
    const session = require('express-session');
    const path = require('path');
    const nocache = require('nocache');

    const Usuario = require('./models/Usuario');

    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }

    await db.sync();

    const app = express();

    app.use(express.json());
    app.use(session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    }));

    app.use(nocache());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(__dirname + '/public'));
    app.use('/', require('./routes/frontRoute'));
    app.use('/', require('./routes/usuariosRoute'));

    app.listen(process.env.PORT || 3000, () => {
        console.log(`Servidor iniciado na porta ${process.env.PORT || 3000}`);
    });
})();