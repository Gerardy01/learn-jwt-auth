require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());



const userData = [
    {
        username: "Gerardy",
        age: 21
    },
    {
        username: "Budi",
        age: 20
    },
]

app.get('/profile/:id',authenticateToken, (req, res) => {

    const tokenUsername = req.user.username

    if (req.params.id == tokenUsername) {
        return res.status(200).json(userData.filter(data => data.username === tokenUsername));
    }

    res.status(200).json(userData);
});

app.post('/login', (req, res) => {

    // after doing authentication

    const username = req.body.username;
    const payLoad = {
        username: username
    }

    const accessToken = jwt.sign(payLoad, process.env.ACCESS_TOKEN_SECRET);
    res.status(200).json({
        accessToken: accessToken
    });
});



// midleware to authenticate
function authenticateToken(req, res, next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send({
                msg: 'failed to authenticate'
            });
        }

        req.user = user;
        next();
    });
}



app.listen(3000, () => {
    console.log('server berjalan di port 3000');
});