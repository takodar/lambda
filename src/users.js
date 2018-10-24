var express = require('express');
const app = express();
const serverless = require('serverless-http');

/* GET users listing. */
app.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

module.exports.handler = serverless(app);