const Joi = require('joi')
const express = require('express')

module.exports.divisiSchema = Joi.object({
    divisi: Joi.object({
        name: Joi.string().required(),
        deskripsi: Joi.string().required()
    }).required()
})