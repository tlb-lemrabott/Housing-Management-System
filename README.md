# Housing Management System
## A Custom Backend RESTful API for the Housing Management System - Final Project in Server-Side Programming Course
## Instructions:
### Implement a server to manage buildings in an area using NodeJS, Express.JS and MongoDB
#### Database: MongoDB
* Name: `CS477`
* The collection `users`
```JavaScript
{
    name: String,
    email: String, //unique
    password: String,
    phone: String,
    role: String
}
e.g.
{
    name: "Michael",
    emai: "michael@miu.edu",
    password: "fadfasdfasdfas", //hashed
    phone: "123",
    role: 'admin'
}
* The collection `buildings`
{
    name: String,
    code: String, //unique
    address: String
    apartments: [
        {
            code: String, //unique,
            capacity: Number,
            vacancies: Number,
            residents: [String],
            devices: [
                {
                    code: String,
                    description: String
                }
            ]
        }
    ]
}
e.g.
{
    name: "Vastu",
    code: "VA", //unique
    address: "Fairfield, IA"
    apartments: [
        {
            code: "VA01", //unique,
            capacity: 5,
            vacancies: 4,
            residents: ["michael@miu.edu"],
            devices: [
                {
                    code: "VA01-Net01",
                    description: "Internet device"
                }
            ]
        }
    ]
}
```
### The followings are functions this system should satisfy
* Email of each user is unique
* A role can be either an admin or a user. 
* An admin can perform all functions as below.
- Sign In
- CRUD a user/admin
- CRUD buildings/apartments/devices
- All actions a user can do
* A user can do the following functions.
- Sign In
- Get information of apartments
- Check-in in an apartment
- Check-out an apartment
- Upload a profile picture
* You should initialize an admin user in the database before starting the server for the first time
* The number of residents in a apartment should be less than or equal its capacity
* All codes are unique
* You should write the code in MVC model
* You API should comply with RESTful naming standard
* You should handle all error cases
### Report time: 
* You will have 10 minutes to report to me this Tuesday (03/21/2023)
* You just demostrate the program and answer my question about your code
* You DO NOT need to prepare any report documents
