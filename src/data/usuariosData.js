const db = require('../utils/db');
const Usuario = require('../models/Usuario');

exports.getUsuarios = async() => {
    return await Usuario.findAll();
};

exports.getUsuario = async(id) => {
    return await Usuario.findByPk(id);
};

exports.createUsuario = async(usuario) => {
    const { nome, email, senha } = usuario;
    const novoUsuario = await Usuario.create({ nome, email, senha });
    return novoUsuario;
};

exports.updateUsuario = async(id, usuario) => {
    const { nome, email, senha } = usuario;

    const usuarioBD = await Usuario.findByPk(id);
    usuarioBD.nome = nome;
    usuarioBD.email = email;
    usuarioBD.senha = senha;
    await usuarioBD.save();
    return usuarioBD;
};

exports.deleteUsuario = async(id) => {
    await Usuario.destroy({ where: { id } });
    return null;
};

exports.getUsuarioByEmail = async(email) => {
    return await Usuario.findOne({
        where: {
            email: email
        }
    });
};