const express = require('express');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'miu.edu';
const {User} = require('../models/userModel');

exports.validateTokenRole = async(req, res, next) => {
    if(!req.headers.authorization){
        next(new Error('Please add authorization field !'));
    }
    const arr = req.headers.authorization.split(' ');
    if(arr.length !== 2){
        next(new Error('Please add Bearer to authorization field !'));
    }

    const token = arr[1];

    try{
        console.log('middlware called');
        const user = jwt.verify(token, SECRET_KEY);
        //console.log('user = ' + user);
        console.log('user role = ' + user.role);
        //req.role = user.role;
        if(user.role != "admin"){
            res.status(405).send({
                success: false,
                message: `You are not allowed for this resouce !`
            });
            return null;
        }
        next();
    }catch(err){
        //console.log('err');
        //next(new Error(err.message));
        res.status(498).send({
            success: false,
            message: `Invalid authorisation key (token) !`
        });
    }
}



exports.validateUserToken = async(req, res, next) => {
    if(!req.headers.authorization){
        next(new Error('Please add authorization field !'));
    }
    const arr = req.headers.authorization.split(' ');
    if(arr.length !== 2){
        next(new Error('Please add Bearer to authorization field !'));
    }

    const token = arr[1];

    try{
        console.log('middlware called');
        const user = jwt.verify(token, SECRET_KEY);
        console.log('user role = ' + user.role);
        next();
    }catch(err){
        res.status(498).send({
            success: false,
            message: `Invalid authorisation key (token) !`
        });
    }
}