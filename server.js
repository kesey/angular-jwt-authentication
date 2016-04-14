/**
 * Created by Fabien on 31/03/2016.
 */
var express = require('express');
var faker = require('Faker');
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var jwtSecret = 'fjktsuqytsuqtsuqsqutsfutf';

var user = {
    username: 'kentcdodds',
    password: 'p'
};

var app = express();

app
    .use(cors())
    .use(bodyParser.json())
    .use(expressJwt({ secret: jwtSecret }).unless({ path: ['/login'] }))
    .get('/random-user', function (req, res) {
        var user = faker.helpers.userCard();
        user.avatar = faker.image.avatar();
        res.json(user);
    })
    .post('/login', authenticate, function(req, res) {
        var token = jwt.sign({
            username: user.username
        }, jwtSecret);
        res.send({
            token: token,
            user: user
        });
    })
    .get('/me', function (req, res) {
        res.send(req.user);
    })
    .listen(3000, function () {
        console.log('App listening on localhost:3000');
    });

// UTIL FUNCTIONS

function authenticate(req, res, next) {
    var body = req.body;
    if(!body.username || !body.password){
        res
            .status(400)
            .end('Must provide username or password');
    }
    if(body.username !== user.username || body.password !== user.password){
        res
            .status(401)
            .end('Username or password incorrect');
    }
    next();
}