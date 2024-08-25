const Joi = require('joi')
const express = require('express')

module.exports.memberSchema = Joi.object({
    member: Joi.object({
        name: Joi.string().required(),
        jabatan: Joi.string().required(),
        background: Joi.string().required()
    })
})