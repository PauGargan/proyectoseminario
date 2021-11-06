var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const db = require('../models');
const usuarios = db.usuarios;
const administradores = db.administradores;
const organizaciones = db.organizaciones;
const donantes = db.donantes;

const ROL_ADMINISTRADOR = 1;
const ROL_ORGANIZACION = 2;
const ROL_DONANTE = 3;
const ACCESS_TOKEN_SECRET = "0807a101f4ed349c5a5c0bcde06e4feb3f12f4b47de7c007adc129435c9742291f9c38add730813fe5aa0054dddf2fb94046fd55a3c226b7eb4445cf5898b614";

module.exports = {
    // Log in de Usuarios
    autenticar(req, res) {
        var parametros = {
            email: req.body.email,
            password: req.body.password
        }
        return usuarios
            .findOne({ where: { email: parametros.email } })
            .then(result => {
                if (!bcrypt.compareSync(parametros.password, result.password)) { res.status(400).send({ message: 'Contraseña o usuario incorrectos.' }) }
                else {
                    console.log(process.env);
                    var token = jwt.sign({ email: parametros.email, id: result.id, rol: result.rol }, ACCESS_TOKEN_SECRET, { expiresIn: 86400 });
                    res.status(200).send({ token: token, email: parametros.email, id: result.id, rol: result.rol });
                }
            })
            .catch(error => res.status(400).send({ message: 'Ocurrion un error al intentar buscar los datos.', error }))
    },
    
    // Creacion de Usuarios
    crearAdministrador(req, res) {
        var parametros = {
            email: req.body.email,
            password: req.body.password,

            nombre: req.body.nombre,
            apellido: req.body.apellido
        }

        return usuarios
            .findOne({ where: { email: parametros.email }, limit: 1 })
            .then(result => {
                if (result !== null) { res.status(401).send({ message: "El usuario ya existe." }) }
                else {
                    return administradores
                        .create({
                            nombre: parametros.nombre,
                            apellido: parametros.apellido,
                        })
                        .then(result => {
                            return usuarios
                                .create({
                                    email: parametros.email,
                                    password: bcrypt.hashSync(parametros.password, 8),
                                    rol: ROL_ADMINISTRADOR,
                                    id: result.id,
                                })
                                .then(result => res.status(200).send({ email: parametros.email, nombre: parametros.nombre, apellido: parametros.apellido, rol: ROL_ADMINISTRADOR, id: result.id }) )
                                .catch(error => res.status(400).send({ message: 'Ocurrio un error al intentar crear el usuario.', error }))
                        })
                        .catch(error => res.status(400).send({ message: 'Ocurrio un error al intentar crear el administrador.', error }))
                } 
            }).catch(error => res.status(400).send({ message: 'Ocurrio un error al intentar conseguir los datos.', error }))
    },
    crearOrganizacion(req, res) {
        var parametros = {
            email: req.body.email,
            password: req.body.password,
            
            nombre: req.body.nombre,
            mision: req.body.mision
        }

        return usuarios
            .findOne({ where: { email: parametros.email }, limit: 1 })
            .then(result => {
                if (result !== null) { res.status(401).send({ message: "El usuario ya existe." }) }
                else {
                    return organizaciones
                        .create({
                            nombre: parametros.nombre,
                            mision: parametros.mision,
                            aprobacion: false,
                            fechaDeAlta: new Date(Date.now()).toISOString()
                        })
                        .then(result => {
                            return usuarios
                                .create({
                                    email: parametros.email,
                                    password: bcrypt.hashSync(parametros.password, 8),
                                    rol: ROL_ORGANIZACION,
                                    id: result.id,
                                })
                                .then(result => res.status(200).send({ email: parametros.email, nombre: parametros.nombre, mision: parametros.mision, aprobacion: false, rol: ROL_ORGANIZACION, id: result.id }))
                                .catch(error => res.status(400).send({ message: 'Ocurrio un error al intentar crear el usuario.', error }))
                        })
                        .catch(error => res.status(400).send({ message: 'Ocurrio un error al intentar crear la organizacion.', error }))
                }
            }).catch(error => res.status(400).send({ message: 'Ocurrio un error al intentar conseguir los datos.', error }))
    },
    crearDonante(req, res) {
        var parametros = {
            email: req.body.email,
            password: req.body.password,

            nombre: req.body.nombre,
            apellido: req.body.apellido
        }

        return usuarios
            .findOne({ where: { email: parametros.email }, limit: 1 })
            .then(result => {
                if (result !== null) { res.status(401).send({ message: "El usuario ya existe." }) }
                else {
                    return organizaciones
                        .create({
                            nombre: parametros.nombre,
                            apellido: parametros.apellido,
                            validacion: true
                        })
                        .then(result => {
                            return usuarios
                                .create({
                                    email: parametros.email,
                                    password: bcrypt.hashSync(parametros.password, 8),
                                    rol: ROL_DONANTE,
                                    id: result.id,
                                })
                                .then(result => res.status(200).send({ email: parametros.email, nombre: parametros.nombre, apellido: parametros.apellido, validacion: true, rol: ROL_ADMINISTRADOR, id: result.id }))
                                .catch(error => res.status(400).send({ message: 'Ocurrio un error al intentar crear el usuario.', error }))
                        })
                        .catch(error => res.status(400).send({ message: 'Ocurrio un error al intentar crear el donante.', error }))
                }
            }).catch(error => res.status(400).send({ message: 'Ocurrio un error al intentar conseguir los datos.', error }))
    },

    // Modificacion de Usuarios
    modificarUsuario(req, res) {
        var parametros = {
            email: req.body.email,
            password: req.body.password,
        }
        
        return usuarios
            .findOne({ where: { email: parametros.email } })
            .then(result => {
                result
                    .update({ password: bcrypt.hashSync(parametros.password, 8) })
                    .then(() => res.status(200).send({ message: "La contraseña se a modificado correctamente." }))
                    .catch(error => res.status(400).send({ message: 'An error ocurred while updating the data.', error }))
            }).catch(error => res.status(400).send({ message: 'An error ocurred while fetching the data.', error }))
    },
    modificarAdministrador(req, res) {
        var parametros = {
            id: req.body.id,
            nombre: req.body.nombre,
            apellido: req.body.apellido
        }
        
        return administradores
            .findOne({ where: { id: parametros.id } })
            .then(result => {
                if (result === null) { error => res.status(400).send({ message: "Rol incorrecto.", error }) }
                else {
                    if (parametros.nombre == null) { parametros.nombre = result.nombre; }
                    if (parametros.apellido == null) { parametros.apellido = result.apellido; }
                    result.update({ nombre: parametros.nombre, apellido: parametros.apellido })
                        .then(() => res.status(200).send({ message: "El administrador se a modificado correctamente.", result }))
                        .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar modificar el administrador.", error }))
                }
            }).catch(error => res.status(400).send({ message: "Ocurrio un error al intentar buscar el administrador.", error }))
    },
    modificarOrganizacion(req, res) {
        var parametros = {
            id: req.body.id,
            nombre: req.body.nombre,
            mision: req.body.mision,
            aprobacion: req.body.aprobacion
        }

        return organizaciones
            .findOne({ where: { id: parametros.id } })
            .then(result => {
                if (result === null) { error => res.status(400).send({ message: "La organizacion no existe.", error }) }
                else {
                    if (parametros.nombre == null) { parametros.nombre = result.nombre; }
                    if (parametros.mision == null) { parametros.mision = result.mision; }
                    if (parametros.aprobacion == null) { parametros.aprobacion = result.aprobacion; }
                    result.update({ nombre: parametros.nombre, mision: parametros.mision, aprobacion: parametros.aprobacion })
                        .then(() => res.status(200).send({ message: "La organizacion se a modificado correctamente.", result }))
                        .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar modificar la organizacion.", error }))
                }
            }).catch(error => res.status(400).send({ message: "Ocurrio un error al intentar buscar la organizacion.", error }))
    },
    modificarDonante(req, res) {
        var parametros = {
            id: req.body.id,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            validacion: req.body.validacion
        }

        return donantes
            .findOne({ where: { id: parametros.id } })
            .then(result => {
                if (result === null) { error => res.status(400).send({ message: "Rol incorrecto.", error }) }
                else {
                    if (parametros.nombre == null) { parametros.nombre = result.nombre; }
                    if (parametros.apellido == null) { parametros.apellido = result.apellido; }
                    if (parametros.validacion == null) { parametros.validacion = result.validacion; }
                    result.update({ nombre: parametros.nombre, apellido: parametros.apellido, validacion: parametros.validacion })
                        .then(() => res.status(200).send({ message: "El donante se a modificado correctamente.", result }))
                        .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar modificar el donante.", error }))
                }
            }).catch(error => res.status(400).send({ message: "Ocurrio un error al intentar buscar el donante.", error }))
    },
    aprobarOrganizacion(req, res) {
        var parametros = {
            id: req.body.id,
            aprobacion: req.body.aprobacion
        }
        return organizaciones
            .findOne({ where: { id: parametros.id } })
            .then(result => {
                if (parametros.aprobacion == null) { parametros.aprobacion = !result.aprobacion; }
                result
                    .update({ aprobacion: parametros.aprobacion })
                    .then(result => res.status(200).send({ message: "La organizacion se a modificado correctamente.", result }))
                    .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar modificar la organizacion.", error }))
            })
            .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar conseguir la organización.", error }))
    },
    validarDonante(req, res) {
        var parametros = {
            id: req.body.id,
            validacion: req.body.validacion
        }
        return donantes
            .findOne({ where: { id: parametros.id } })
            .then(result => {
                if (parametros.validacion == null) { parametros.validacion = !result.validacion; }
                result
                    .update({ validacion: parametros.validacion })
                    .then(result => res.status(200).send({ message: "El donante se a modificado correctamente.", result }))
                    .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar modificar el donante.", error }))
            })
            .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar conseguir el donante.", error }))
    },

    // Ver Usuarios
    verAdministrador(req, res) {
        var parametros = {
            id: req.params.id,
        }
        return administradores
            .findOne({ where: { id: parametros.id } })
            .then(result => res.status(200).send({ message: "Encontrado", result }))
            .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar conseguir la organización.", error }))
    },
    verOrganizacion(req, res) {
        var parametros = {
            id: req.params.id,
        }
        return organizaciones
            .findOne({ where: { id: parametros.id } })
            .then(result => res.status(200).send({message: "Encontrado", result}))
            .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar conseguir la organización.", error }))
    },
    verDonantes(req, res) {
        var parametros = {
            id: req.params.id,
        }
        return donantes
            .findOne({ where: { id: parametros.id } })
            .then(result => res.status(200).send({ message: "Encontrado", result }))
            .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar conseguir la organización.", error }))
    },

    // Listar Usuarios
    listarUsuarios(req, res) {
        var parametros = {}
        return usuarios
            .findAll()
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar conseguir las organizaciones.", error }))
    },
    listarAdministradores(req, res) {
        var parametros = {}
        return administradores
            .findAll()
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar conseguir las organizaciones.", error }))
    },
    listarOrganizaciones(req, res) {
        var parametros = { }
        return organizaciones
            .findAll()
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar conseguir las organizaciones.", error }))
    },
    listarDonantes(req, res) {
        var parametros = {}
        return donantes
            .findAll()
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar conseguir los donantes.", error }))
    },
    listarOrganizacionesAprobadas(req, res) {
        var parametros = { }
        return organizaciones
            .findAll({ where: { aprobacion: true } })
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar conseguir las organizaciones.", error }))
    },
    listarOrganizacionesPorAprobacion(req, res) {
        var parametros = {
            aprobacion: req.params.aprobacion,
        }
        return organizaciones
            .findAll({ where: { aprobacion: parametros.aprobacion } })
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar conseguir las organizaciones.", error }))
    },
    listarDonantesValidos(req, res) {
        var parametros = { }
        return donantes
            .findAll({ where: { validacion: true } })
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar conseguir los donantes.", error }))
    },
    listarDonantesPorValidacion(req, res) {
        var parametros = {
            validacion: req.params.validacion,
        }
        return donantes
            .findAll({ where: { validacion: parametros.validacion } })
            .then(result => res.status(200).send(result))
            .catch(error => res.status(400).send({ message: "Ocurrio un error al intentar conseguir los donantes.", error }))
    },
}