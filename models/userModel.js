const {MongoClient, ObjectId} = require('mongodb');

const USERS_COLLECTION_NAME = 'users';
const ADMIN_COLLECTION_NAME = 'admin';
const BLDG_COLLECTION_NAME = 'buildings'

const uri = "mongodb://127.0.0.1:27017"
let client = new MongoClient(uri);
let db = null;
async function main(){
    await client.connect();
    db = client.db('CS477');
}


function run(){
    main().then(() => console.log('DB connected successfully')).catch(err => console.log(err));
}


class User{

    static async createAdmin (name, email, password, phone, role){
        try{
            const admin = db.collection(ADMIN_COLLECTION_NAME);
            const result = await admin.insertOne({ name, email, password, phone, role});
            return result;
        }catch(err){
            console.log(`Error while creating a new admin with name ${name}`);
            return null;
        }
    }

    static async findAdminEmail(email) {
        try{
            const admin = db.collection(ADMIN_COLLECTION_NAME);
            const result = await admin.findOne({ email: email });
            return result;
        }catch(err){
            return `email not found !`;
        }
    }

    static async findUserEmail(email) {
        try{
            const users = db.collection(USERS_COLLECTION_NAME);
            const result = await users.findOne({ email: email });
            return result;
        }catch(err){
            return `email not found !`;
        }
    }


    static async findUserById(id) {
        try{
            const users = db.collection(USERS_COLLECTION_NAME);
            const result = await users.findOne({ _id: id });
            return result;
        }catch(err){
            return `user not found !`;
        }
    }


    static async addUser (name, email, password, phone, role) {
        try{
            const users = db.collection(USERS_COLLECTION_NAME);
            const result = await users.insertOne({ name, email, password, phone, role});
            return result;
        }catch(err){
            return `Error while adding a new user with name ${name}`;
        }
    }

    static async updateUser (userId, update) {
        try{
            const users = db.collection(USERS_COLLECTION_NAME);
            const result = await users.updateOne(
                { _id: userId},
                {$set: update}
            );
            return result;
        }catch(err){
            return `Error while updating the user with id ${userId}.`;
        }
    }

    static async updloadPicture (userId, file) {
        try{
            const users = db.collection(USERS_COLLECTION_NAME);
            const user = await users.findOne({_id: userId});
            if (!user) {
                return `User with id ${userId} not found`;
            }

            const result = await users.updateOne(
                { _id: userId},
                {$set: {"profile": file} }
            );
            return result;
        }catch(err){
            return `Error while updating the user with id ${userId}... ${err}`;
        }
    }

    static async deleteUser (userId) {
        try{
            const users = db.collection(USERS_COLLECTION_NAME);
            const result = await users.deleteOne({_id: userId});
            if(result.deletedCount === 0){
                throw new Error('There is no user with this id !');
            }
            return result;
        }catch(err){
            return `Error while deleting the user with id "${userId}".`;
        }
    }


    static async getUserById(userId) {
        try{
            const users = db.collection(USERS_COLLECTION_NAME);
            const result = await users.findOne({_id: userId});
            return result;
        }catch(err){
            return `Error while geting the user with id "${userId}".`;
        }
    }


    static async getAllUsers() {
        try{
            const users = db.collection(USERS_COLLECTION_NAME);
            const result = await users.find().toArray();
            return result;
        }catch(err){
            return `Error while getting all users...`;
        }
    }
    

    static async addBuilding(name, code, address) {
        try{
            const buildings = db.collection(BLDG_COLLECTION_NAME);
            const result = await buildings.insertOne({ name, code, address});
            return result;
        }catch(err){
            return `Error while adding a bulding with name ${name}`;
        }
    }
    


    static async getBuildingByCode(code) {
        try{
            const buildings = db.collection(BLDG_COLLECTION_NAME);
            const result = await buildings.findOne({code});
            return result;
        }catch(err){
            return`Error while getting the bulding of code ${code}`;
        }
    }


    static async getAllBuildings() {
        try{
            const buildings = db.collection(BLDG_COLLECTION_NAME);
            const result = await buildings.find().toArray();
            return result;
        }catch(err){
            return `Error while getting all buldings from the database...`;
        }
    }


    
    static async updateBuilding(code, update) {
        try{
            const buildings = db.collection(BLDG_COLLECTION_NAME);
            const result = await buildings.updateOne(
                {code},
                {$set: update}
            );
            return result;
        }catch(err){
            return `Error while updating the bulding of code ${code}`;
        }
    }


    static async deleteBuilding(code) {
        try{
            const buildings = db.collection(BLDG_COLLECTION_NAME);
            const result = await buildings.deleteOne({code});
            if(result.deletedCount === 0){
                throw new Error('There is no building with this code !');
            }
            return result;
        }catch(err){
            return `Error happened while deleting the bulding of code "${code}"`;
        }
    }


    static async addApartment(bldgCode, aptCode, capacity, residents) {
        try{
            const apartment = {
                id: new ObjectId(),
                code: aptCode, 
                capacity: capacity,
                vacancies: capacity,
                residents, residents
            }
            const buildings = db.collection(BLDG_COLLECTION_NAME);
            const result = await buildings.updateOne(
                {code: bldgCode},
                {$push: {apartments: apartment}}
            );
            return result;
        }catch(err){
            return `Error happened while adding apartement code "${aptCode}" to bulding code ${bldgCode}`;
        }
    }


    
    static async getApartmentBycode(bldgCode, aptCode) {
        try{
            const buildings = db.collection(BLDG_COLLECTION_NAME);
            const result = await buildings.findOne(
                {code: bldgCode},
            );
            if (result) {
                const apartment = result.apartments.find(a => a.code === aptCode);
                return apartment;
            } else {
                return `Building not found for code "${bldgCode}"`;
            }
        }catch(err){
            return `Error happened while getting the apartement of code "${aptCode}"`;
        }
    }


    static async updateApartment(bldgCode, aptCode, newCapacity) {
        try{
            console.log('values : '+ bldgCode, aptCode, newCapacity);
            const buildings = db.collection(BLDG_COLLECTION_NAME);
            
            const building = await buildings.findOne({ code: bldgCode });
            console.log('bldg code = ' + bldgCode);
            const apartment = building.apartments.find((apt) => apt.code === aptCode);
            console.log('apt code = ' + aptCode);

            console.log(apartment.capacity, newCapacity);


            if(newCapacity < apartment.capacity){
                return `Error : new capacity must be greater than current capacity !`;
            }
            console.log('apartment.capacity = ' + apartment.capacity);
            apartment.capacity = newCapacity;

            const residentCount = apartment.residents.length;
            console.log('apartment.residents = ' + apartment.residents);
            const newVacancies = newCapacity - residentCount;
            
            apartment.vacancies = newVacancies;
            
            const result = await buildings.updateOne(
                { code: bldgCode, "apartments.code": aptCode },
                { $set: { "apartments.$.capacity": newCapacity, "apartments.$.vacancies": newVacancies } }
            );
            
            return result;

        }catch(err){
            return `Error happened while updating the apartement of code "${aptCode}"`;
        }
    }


    static async deleteApartment(bldgCode, aptCode) {
        try{
            const buildings = db.collection(BLDG_COLLECTION_NAME);
            const existed = await buildings.findOne({"apartments.code": aptCode});
            if(!existed){
                throw new Error(`There is no teacher with this id: ${aptCode}.`);
            }
            const result = await buildings.updateOne(
                {code: bldgCode},
                {$pull: { apartments: {code: aptCode} } }
            );
            return result;
        }catch(err){
            return `Error happened while deleting the apartement of code "${aptCode}"`;
        }
    }

    static async getAllApartments(bldgCode) {
        try{
            const buildings = db.collection(BLDG_COLLECTION_NAME);
            const result = await buildings.findOne(
                {code: bldgCode},
                { apartments: 1 }
            );
            return result.apartments;
        }catch(err){
            return `Error happened while fetching apartement list from the database..."`;
        }
    }



    static async addDevice(bldgCode, aptCode, deviceCode, description) {
        try{
            const device = {
                id: new ObjectId(),
                code: deviceCode, 
                description: description
            }
            const buildings = db.collection(BLDG_COLLECTION_NAME);
            const result = await buildings.updateOne(
                {code: bldgCode, "apartments.code": aptCode},
                {$push: {"apartments.$[a].devices": device} },
                {arrayFilters: [{"a.code": aptCode}] } 
            );
            return result;
        }catch(err){
            return `Error happened while adding device code "${deviceCode}" to apartment code ${aptCode}`;
        }
    }


    static async getDeviceById(bldgCode, aptCode, deviceCode) {
        try{
            const buildings = db.collection(BLDG_COLLECTION_NAME);
            const result = await buildings.findOne(
                { code: bldgCode, "apartments.code": aptCode },
                { "apartments.$": 1 }
            );
            if (!result) {
                return `Building not found for code "${bldgCode}"`;
            }
            
            const apartment = result.apartments[0];
            
            if (!apartment) {
                return `Apartment not found for code "${aptCode}"`;
            }
            
            const device = apartment.devices.find(d => d.code === deviceCode);
            
            if (!device) {
                return `Device not found for code "${deviceCode}" in apartment "${aptCode}"`;
            }
            return device;
        }catch(err) {
            return `Error happened while fetching device code "${deviceCode}"...`;
        }
    }

    
    static async updateDevice(bldgCode, aptCode, deviceCode, newDescription) {
        try{
            const buildings = db.collection(BLDG_COLLECTION_NAME);
            const result = await buildings.updateOne(
                {code: bldgCode},
                {$set: {"apartments.$[a].devices.$[d].description" : newDescription} },
                {arrayFilters: [{"a.code": aptCode}, {"d.code": deviceCode}] }
            );
            return result;
        }catch(err) {
            return `Error happened while updating device of code "${deviceCode}"...`;
        }
    }
    

    static async deleteDevice(bldgCode, aptCode, deviceCode) {
        try{
            const buildings = db.collection(BLDG_COLLECTION_NAME);
            const result = await buildings.updateOne(
                {code: bldgCode},
                {$pull: {"apartments.$[a].devices" : {code: deviceCode}} },
                {arrayFilters: [{"a.code": aptCode}] }
            );
            return result;
        }catch(err) {
            return `Error happened while deleting the device of code "${deviceCode}"...`;
        }
    }

    
    static async getAllDevices(bldgCode, aptCode) {
        try{
            const buildings = db.collection(BLDG_COLLECTION_NAME);
            const result = await buildings.findOne(
                {code: bldgCode, "apartments.code": aptCode},
                { "apartments.$": 1 }
            );

            if(!result) {
                return null;
            }
            
            const apartment = result.apartments[0];
            const devices = apartment.devices || [];
            
            return devices;
        }catch(err) {
            return `Error happened while deleting the device of code "${deviceCode}"...`;
        }
    }


    static async checkIn(userEmail, bldgCode, aptCode) {
        try{
            const users = db.collection(USERS_COLLECTION_NAME);
            const buildings = db.collection(BLDG_COLLECTION_NAME);

            const user = await users.findOne({ email: userEmail });
            if (!user) {
                return `User with email ${userEmail} not found!`;
            }
      
            const building = await buildings.findOne({ code: bldgCode });
            if (!building) {
                return `Building with code ${bldgCode} not found!`;
            }
            
            const apartment = building.apartments.find((apt) => apt.code === aptCode);
            if (!apartment) {
                return `Apartment with code ${aptCode} not found in building ${bldgCode}!`;
            }
            
            if (apartment.residents.includes(userEmail)) {
                return `User ${userEmail} is already checked in to apartment ${aptCode}!`;
            }
            
            if (apartment.vacancies === 0) {
                return `Apartment ${aptCode} is already full!`;
            }
            
            apartment.residents.push(userEmail);
            apartment.vacancies--;
            await buildings.updateOne(
                { code: bldgCode, 'apartments.code': aptCode },
                { $set: { 'apartments.$': apartment } }
            );
            return `User ${userEmail} checked in to apartment ${aptCode}!`;
        } catch (err) {
            return `Error happened in UserModel while checking in the apartment ${aptCode}...${err}`;
        }
    }



    static async checkOut(userEmail) {
        try{
            const users = db.collection(USERS_COLLECTION_NAME);
            const buildings = db.collection(BLDG_COLLECTION_NAME);
            
            const user = await users.findOne({ email: userEmail });
            if (!user) {
                return `User with email ${userEmail} not found!`;
            }
      
            const building = await buildings.findOne({ 'apartments.residents': userEmail });
            if (!building) {
                return `User ${userEmail} is not checked in to any apartment!`;
            }
            
            const apartment = building.apartments.find((apt) => apt.residents.includes(userEmail));
    
            if (!apartment) {
                return `Apartment not found for user ${userEmail} in building ${building.code}!`;
            }
            
            const residentIndex = apartment.residents.findIndex((resident) => resident === userEmail);
            
            if (residentIndex === -1) {
                return `User ${userEmail} is not checked in to apartment ${apartment.code}!`;
            }
            
            apartment.residents.splice(residentIndex, 1);
            apartment.vacancies++;
            
            await buildings.updateOne(
                { code: building.code, 'apartments.code': apartment.code },
                { $set: { 'apartments.$': apartment } }
            );

            return `User ${userEmail} checked out of apartment ${apartment.code} in building ${building.code}!`;

        } catch (err) {
            return `Error happened while checking out of the apartment "${aptCode}"...`;
        }
      }



}




module.exports = {
    User,
    run
};