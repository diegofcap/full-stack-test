require("dotenv/config");
const axios = require('axios');
const crypto = require('crypto');
const usuariosService = require('../service/usuariosService');
const jwt = require('jsonwebtoken');

const generate = function(length, isEmail) {
    var result = crypto.randomBytes(length).toString('hex');
    if (isEmail) {
        return result + '@test.com';
    }
    return result;
}

const getJwtToken = async() => {
    const users = await usuariosService.getUsuarios();
    const user = users[0];

    return jwt.sign({ id: user.id, nome: user.nome }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

const request = async(url, method, data) => {
    var token = await getJwtToken();
    return axios({
        method: method,
        url: url,
        data: data,
        headers: { Authorization: `Bearer ${token}` }
    });
}

test('Deve adicionar usuário', async() => {
    var userData = { nome: generate(35, false), email: generate(10, true), senha: generate(10, false) };
    const response = await request('http://localhost:3000/api/usuarios', 'post', userData);
    const usuario = response.data;
    expect(usuario.nome).toBe(userData.nome);
    expect(usuario.email).toBe(userData.email);
});

test('Deve obter usuários', async() => {
    const response = await request('http://localhost:3000/api/usuarios', 'get');
    const count = response.data.length;
    expect(count).toBeGreaterThan(0);
});

test('Deve criar um usuário e atualizar as informações', async() => {
    var userData = { nome: generate(35, false), email: generate(10, true), senha: generate(10, false), datacriacao: new Date() };
    const user = await usuariosService.createUsuario(userData);
    user.nome = generate(35, false);
    user.email = generate(10, true);
    user.senha = generate(10, false);

    await request(`http://localhost:3000/api/usuarios/${user.id}`, 'put', user);
    const updatedUser = await usuariosService.getUsuario(user.id);
    expect(updatedUser.nome).toBe(user.nome);
    expect(updatedUser.email).toBe(user.email);
});

test('Deve deletar um usuário', async() => {
    var userData = { nome: generate(35, false), email: generate(10, true), senha: generate(10, false) };
    const user = await usuariosService.createUsuario(userData);
    await request(`http://localhost:3000/api/usuarios/${user.id}`, 'delete');
    expect(await usuariosService.getUsuario(user.id)).toBe(null);
});