const {ObjectId} = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/userModel');

const SECRET_KEY = 'miu.edu';

exports.createAdmin = (req, res) => {
    try{
        const {name, email, phone, role} = req.body;
        const password = req.body.password;
        const hashedPassword = bcrypt.hashSync(password, 8);
        User.createAdmin(name, email, hashedPassword, phone, role);
        res.status(200).send({
            success: true,
            message: `admin with name ${name} and role ${role} was created successfully.`
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while creating an admin... ${err}`
        });
    }
};

exports.signIn = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
        const user = await User.findAdminEmail(email);
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


exports.addUser = async (req, res) => {
    try{
        const {name, email, phone, role} = req.body;
        const password = req.body.password;
        const hashedPassword = bcrypt.hashSync(password, 8);
        
        const user = await User.findUserEmail(email);

        if(user) {
            return res.status(409).send({
                success: false, 
                message: `email already exist!`
            });
        }
        else{
            const result = await User.addUser(name, email, hashedPassword, phone, role);
            return res.status(200).send({
                success: true,
                data: result,
            });
        }
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while adding a user... ${err}`
        });
    }
};


exports.updateUser = async (req, res) => {
    try{
        const userId = new ObjectId(req.params.id);
        const { name, email, phone } = req.body;
        
        const update = {};
        if (name !== undefined) {
            update.name = name;
        }
        if (email !== undefined) {
            update.email = email;
        }
        if (phone !== undefined) {
            update.phone = phone;
        }
        
        const result = await User.updateUser(userId, update);
        res.status(200).send({
            success: true,
            data: result,
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while udating a user... ${err}`
        });
    }
};


exports.deleteUser = async (req, res) => {
    try{
        const userId = new ObjectId(req.params.id);
        const result = await User.deleteUser(userId);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while deleting a user... ${err}`
        });
    }
};


exports.getUserById = async (req, res) => {
    try{
        const userId = new ObjectId(req.params.id);
        const result = await User.getUserById(userId);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while fetching  a user... ${err}`
        });
    }
};


exports.getAllUsers = async (req, res) => {
    try{
        const result = await User.getAllUsers();
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while fetching  all users... ${err}`
        });
    }
};



exports.addBuilding = async (req, res) => {
    try{
        const {name, code, address} = req.body;
        const result = await User.addBuilding(name, code, address);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while adding a building... ${err}`
        });
    }
};


exports.getBuildingByCode = async (req, res) => {
    try{
        const code = req.params.code;
        const result = await User.getBuildingByCode(code);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while fetching a building... ${err}`
        });
    }
};


exports.getAllBuildings = async (req, res) => {
    try{
        const result = await User.getAllBuildings();
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while fetching all buildings... ${err}`
        });
    }
};



exports.updateBuilding = async (req, res) => {
    try{
        const code = req.params.code;
        const {name, address} = req.body;
        
        const update = {};
        if (name !== undefined) {
            update.name = name;
        }
        if (address !== undefined) {
            update.address = address;
        }
        const result = await User.updateBuilding(code, update);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while updating a building infos... ${err}`
        });
    }
};



exports.deleteBuilding = async (req, res) => {
    try{
        const code = req.params.code;
        const result = await User.deleteBuilding(code);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while deleting a building... ${err}`
        });
    }
};


exports.addApartment = async (req, res) => {
    try{
        const bldgCode = req.params.bldgCode;
        const {code, capacity} = req.body;
        const residents = []; 
        const result = await User.addApartment(bldgCode, code, capacity, residents);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while adding appartement with code "${aptCode}"... ${err}`
        });
    }
};


exports.getApartmentBycode = async (req, res) => {
    try{
        const bldgCode = req.params.bldgCode;
        const aptCode = req.params.aptCode;
        const result = await User.getApartmentBycode(bldgCode, aptCode);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controller while fetching the appartement of code "${aptCode}"... ${err}`
        });
    }
};


exports.updateApartment = async (req, res) => {
    try{
        const bldgCode = req.params.bldgCode;
        const aptCode = req.params.aptCode;
        const newCapacity = req.body.capacity;
        const result = await User.updateApartment(bldgCode, aptCode, newCapacity);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controller while updating the appartement of code "${aptCode}"... ${err}`
        });
    }
};


exports.deleteApartment = async (req, res) => {
    try{
        const bldgCode = req.params.bldgCode;
        const aptCode = req.params.aptCode;
        const result = await User.deleteApartment(bldgCode, aptCode);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controller while deleting the appartement of code "${aptCode}"... ${err}`
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


exports.addDevice = async (req, res) => {
    try{
        const bldgCode = req.params.bldgCode;
        const aptCode = req.params.aptCode;
        const {code, description} = req.body;
        const result = await User.addDevice(bldgCode, aptCode, code, description);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while adding appartement with code "${aptCode}"... ${err}`
        });
    }
};


exports.getDeviceById = async (req, res) => {
    try{
        const bldgCode = req.params.bldgCode;
        const aptCode = req.params.aptCode;
        const deviceCode = req.params.deviceCode;
        const result = await User.getDeviceById(bldgCode, aptCode, deviceCode);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while fetching device with code "${deviceCode}"... ${err}`
        });
    }
};


exports.updateDevice = async (req, res) => {
    try{
        const bldgCode = req.params.bldgCode;
        const aptCode = req.params.aptCode;
        const deviceCode = req.params.deviceCode;
        const newDescription = req.body.description;
        const result = await User.updateDevice(bldgCode, aptCode, deviceCode, newDescription);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while updating the device of code "${deviceCode}"... ${err}`
        });
    }
};


exports.deleteDevice = async (req, res) => {
    try{
        const bldgCode = req.params.bldgCode;
        const aptCode = req.params.aptCode;
        const deviceCode = req.params.deviceCode;
        const result = await User.deleteDevice(bldgCode, aptCode, deviceCode);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while deleting the device of code "${deviceCode}"... ${err}`
        });
    }
};


exports.getAllDevices = async (req, res) => {
    try{
        const bldgCode = req.params.bldgCode;
        const aptCode = req.params.aptCode;
        const result = await User.getAllDevices(bldgCode, aptCode);
        res.status(200).send({
            success: true,
            data: result
        });
    }catch(err){
        res.status(500).send({
            success: false,
            message: `Error hapened in controler while fetching device list of the apartment code "${aptCode}"... ${err}`
        });
    }
};