const express = require('express');
const validator = require('../middleware/middleware');
const adminController = require('../controllers/AdminController');
const userController = require('../controllers/UserController');
const multer = require('multer');
const upload = multer({ dest: 'myUploads/' });

const router = express.Router();


router.post('/createAdmin', adminController.createAdmin);
router.post('/admin/signIn', adminController.signIn);

router.post('/admin/addUser', validator.validateTokenRole, adminController.addUser);
router.get('/admin/getUser/:id', validator.validateTokenRole, adminController.getUserById);
router.put('/admin/updateUser/:id', validator.validateTokenRole, adminController.updateUser);
router.delete('/admin/deleteUser/:id', validator.validateTokenRole, adminController.deleteUser);
router.get('/admin/getUsers', validator.validateTokenRole, adminController.getAllUsers);


router.post('/admin/addBuilding', validator.validateTokenRole, adminController.addBuilding);
router.get('/admin/getBuilding/:code', validator.validateTokenRole, adminController.getBuildingByCode);
router.put('/admin/updateBuilding/:code', validator.validateTokenRole, adminController.updateBuilding);
router.delete('/admin/deleteBuilding/:code', validator.validateTokenRole, adminController.deleteBuilding);
router.get('/admin/getBuildings', validator.validateTokenRole, adminController.getAllBuildings);


router.put('/admin/building/:bldgCode/addApartment', validator.validateTokenRole, adminController.addApartment);
router.get('/admin/building/:bldgCode/getApartment/:aptCode', validator.validateTokenRole, adminController.getApartmentBycode);
router.patch('/admin/building/:bldgCode/updateApartment/:aptCode', validator.validateTokenRole, adminController.updateApartment);
router.delete('/admin/building/:bldgCode/deleteApartment/:aptCode', validator.validateTokenRole, adminController.deleteApartment);
router.get('/admin/building/:bldgCode/getApartments', validator.validateTokenRole, adminController.getAllApartments);

router.put('/admin/building/:bldgCode/apartment/:aptCode/addDevice', validator.validateTokenRole, adminController.addDevice);
router.get('/admin/building/:bldgCode/apartment/:aptCode/getDevice/:deviceCode', validator.validateTokenRole, adminController.getDeviceById);
router.patch('/admin/building/:bldgCode/apartment/:aptCode/updateDevice/:deviceCode', validator.validateTokenRole, adminController.updateDevice);
router.delete('/admin/building/:bldgCode/apartment/:aptCode/deleteDevice/:deviceCode', validator.validateTokenRole, adminController.deleteDevice);
router.get('/admin/building/:bldgCode/apartment/:aptCode/getDevices', validator.validateTokenRole, adminController.getAllDevices);


router.post('/user/signIn', userController.signIn);
router.get('/user/building/:bldgCode/getApartments', validator.validateUserToken, userController.getAllApartments);
router.put('/user/reservation/checkIn', validator.validateUserToken, userController.checkIn);
router.put('/user/reservation/checkOut', validator.validateUserToken, userController.checkOut);
router.put('/user/uploadPicture/:id', validator.validateUserToken, userController.updloadPicture);


module.exports = router;