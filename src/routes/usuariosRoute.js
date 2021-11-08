const express = require('express');
const router = express.Router();
const usuariosService = require('../service/usuariosService');
const jwt = require('jsonwebtoken');

function verifyJwt(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    console.log(bearerHeader);
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).end({
                    message: 'Token inválido'
                });
            } else {
                req.token = bearerToken;
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.status(401).send({
            message: 'Token inválido'
        });
    }
}

router.get('/api/usuarios', verifyJwt, async function(req, res) {
    const usuarios = await usuariosService.getUsuarios();
    res.json(usuarios);
});

router.get('/api/usuarios/:id', verifyJwt, async function(req, res) {
    const usuario = await usuariosService.getUsuario(req.params.id);
    res.json(usuario);
});

router.post('/api/usuarios', verifyJwt, async function(req, res) {
    const newUsuario = await usuariosService.createUsuario(req.body);
    res.json(newUsuario);
});

router.put('/api/usuarios/:id', verifyJwt, async function(req, res) {
    const usuario = req.body;
    const updatedUsuario = await usuariosService.updateUsuario(req.params.id, usuario);
    res.json(updatedUsuario);
});

router.delete('/api/usuarios/:id', verifyJwt, async function(req, res) {
    await usuariosService.deleteUsuario(req.params.id);
    res.end();
});

router.post('/api/usuarios/login', async function(req, res) {
    const usuario = await usuariosService.getUsuarioByEmail(req.body.email);
    if (!usuario) {
        res.status(401).json({
            message: 'Usuário não encontrado'
        });
    } else if (usuario != null && usuario.senha === req.body.senha) {
        res.status(200).json({ token: jwt.sign({ id: usuario.id, nome: usuario.nome }, process.env.JWT_SECRET, { expiresIn: '1h' }) });
    } else {
        res.status(401).json({
            message: 'Senha incorreta'
        });
    }
});

module.exports = router;