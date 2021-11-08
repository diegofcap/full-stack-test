const usuariosData = require('../data/usuariosData');

exports.getUsuarios = function() {
    return usuariosData.getUsuarios();
};

exports.getUsuario = function(id) {
    return usuariosData.getUsuario(id);
};

exports.createUsuario = function(usuario) {
    return usuariosData.createUsuario(usuario);
};

exports.updateUsuario = function(id, usuario) {
    return usuariosData.updateUsuario(id, usuario);
};

exports.deleteUsuario = function(id) {
    return usuariosData.deleteUsuario(id);
};

exports.getUsuarioByEmail = function(email) {
    return usuariosData.getUsuarioByEmail(email);
};