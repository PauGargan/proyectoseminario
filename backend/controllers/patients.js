const Sequelize = require('sequelize');
const db = require('../models');
const patients = db.patients;
const users = db.users;

module.exports = {

    /**
     * Patients Create
     */
    create (req, res) {
        return patients
            .create({
                user_id: req.body.userId,
                dni: req.body.dni,
                es_particular: req.body.esParticular,
                obra_social: req.body.obraSocial,
                obra_social_plan: req.body.obraSocialPlan
            })
            .then(patients => res.status(200).send(patients))
            .catch(error => res.status(400).send(error))
    },

    /**
     * Patients Update
     */
    update (req, res) {
        return patients
            .findOne({
                where: {
                    id: req.body.patient_id
                }
            })
            .then(patient => { 
                delete req.body.patient_id;
                return patient
                    .update(req.body)
                    .then(patient => res.status(200).send(patient))
                    .catch(error => res.status(400).send(error))
            })
            .catch(error => res.status(400).send(error))
    },

    /**
     * List of Patients
     */
    list (_, res) {
        return patients
            .findAll({
                include: [{
                    model: users,
                    as: "users"
                }]
            })
            .then(patients => res.status(200).send(patients))
            .catch(error => res.status(400).send(error))
    },

    /**
     * Find a Patients
     */
    find (req, res) {
        return patients
            .findOne({
                where: {
                    dni: req.params.dni,
                },
                include: [{
                    model: users,
                    as: "users"
                }]
            })
            .then(patients => res.status(200).send(patients))
            .catch(error => res.status(400).send(error))
    },
}