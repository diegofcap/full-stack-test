const express = require('express');
const axios = require('axios');
const router = express.Router();
const usuariosService = require('../service/usuariosService');
const jwt = require('jsonwebtoken');
var path = require('path');

function verifyAuthUser(req, res, next) {
    if (req.session.loggedin) {
        next();
    } else {
        res.writeHead(301, { Location: 'http://localhost:3000/login' });
        res.end();
    }
}

router.get('/', verifyAuthUser, async function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'dashboard.html'));
});

router.post('/beers', verifyAuthUser, async function(req, res) {
    var page = (req.body.start / req.body.length) + 1;
    var length = req.body.length;
    var url = `https://api.punkapi.com/v2/beers?page=${page}&per_page=${length}`;

    var search = req.body.search.value;

    if (search != '') {
        url = url + `&beer_name=${search}`;
    }

    var beers = await axios({
        method: 'get',
        url: url
    });

    var result = new Object();
    result.draw = req.body.draw;
    result.recordsTotal = 250; //tive que colocar o valor hard coded porque a API não retorna essa informação
    result.recordsFiltered = 250; //tive que colocar o valor hard coded porque a API não retorna essa informação
    result.data = beers.data;
    res.json(result);
});

router.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
});

router.get('/logout', function(req, res) {
    req.session.destroy();
    res.writeHead(301, { Location: 'http://localhost:3000/login' });
    res.end();
});

router.post('/login', async function(req, res) {
    const usuario = await usuariosService.getUsuarioByEmail(req.body.email);
    if (!usuario) {
        res.status(401).json({
            message: 'Usuário não encontrado'
        });
    } else if (usuario != null && usuario.senha === req.body.senha) {
        req.session.loggedin = true;
        req.session.username = usuario.nome;
        req.session.userId = usuario.id;
        req.session.token = jwt.sign({ id: usuario.id, nome: usuario.nome }, 'secret', { expiresIn: '1h' });
        res.status(200).json({ token: req.session.token });
    } else {
        res.status(401).json({
            message: 'Senha incorreta'
        });
    }
});

module.exports = router;