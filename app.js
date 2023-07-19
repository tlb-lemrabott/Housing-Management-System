const express = require('express');
const router = require('./routes/userRoutes');
const {run} = require('./models/userModel');

const app = express();

run();

app.use(express.json());

app.use('/system', router);

app.use((err, req, res, next) => {
    if(err){
        res.status(500).send('bad request');
    }
    res.status(500).send('error in back end');
});


app.use((req, res) => {
    console.log(res);
    res.status(500).send('API is not supported');
});


app.listen(3000, () => {
    console.log('server is running on port 3000');
});