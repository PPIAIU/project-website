const Joi = require('joi')
const express = require('express')

module.exports.schemaPeriode = Joi.object({
    periode: Joi.object({
        name: Joi.string()
        .min(5)
        .required(),
    })
})