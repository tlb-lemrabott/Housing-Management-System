const {ObjectId} = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/userModel');

const SECRET_KEY = 'miu.edu';

exports.signIn = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
        const user = await User.findUserEmail(email);
        if(!user) {
            return res.status(401).send({
                success: false, 
                message: `Invalid email !`
            });
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if(!isEqual) {
            return res.status(401).send({
                success: false, 
                message: `Invalid password !`
            });
        }
        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id.toString(),
                role: user.role,
            },
            SECRET_KEY,
            { expiresIn: '9h' }
        );

        res.status(200).json({
            success: true, 
            token: token
        });
    }catch(err) {
        res.status(500).send({
            success: false,
            message: `error happened while login to the system...${err}`
        });
    }
};


exports.getAllApartments = async (req, res) => {
    try{
        const bldgCode = req.params.bldgCode;
        const result = await User.getAllApartments(bldgCode);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controller while fetching appartement list of building code "${bldgCode}"... ${err}`
        });
    }
};



exports.checkIn = async (req, res) => {
    try{
        const {email, bldgCode, aptCode} = req.body;
        const result = await User.checkIn(email, bldgCode, aptCode);
        res.status(200).send({
            success: true,
            message: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while checking in appartement of code "${aptCode}"... ${err}`
        });
    }
};


exports.checkOut = async (req, res) => {
    try{
        const email = req.body.email;
        const result = await User.checkOut(email);
        res.status(200).send({
            success: true,
            message: result
        });
    }catch(err){
        res.status(500).send({
            success: true,
            message: `Error hapened in controler while checking out from appartement of code "${aptCode}"... ${err}`
        });
    }
};



exports.updloadPicture = async (req, res) => {
    const userId = new ObjectId(req.params.id);
    const file = req.body.file;
    try{
        // const user = await User.findUserById(req.params.id);
        // if (!user) {
        //     return res.status(404).json({ error: 'User not found' });
        // }

        const result = await User.updloadPicture(userId, file);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while uploading a picture for the user od id "${userId}"... ${err}`
        });
    }
};