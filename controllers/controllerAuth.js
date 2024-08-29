const express = require('express')
const User = require('../models/user')

module.exports.loginForm = (req, res) => {
    res.render('auth/login')
}

module.exports.login = (req, res) => {
    console.log(req.user);
    req.flash('success_msg', 'You are now logged in');
    res.redirect('/home');
}

module.exports.logout = (req, res) => {
    req.logout(function (err)  {
        if (err) { return next(err); } 
        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    });
}