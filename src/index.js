/**
 * Created by takodaregister on 10/23/18.
 */
var express = require('express');
const app = express();
var MongoClient = require('mongodb').MongoClient;
const serverless = require('serverless-http');

/* GET home page. */
app.get('/', function(req, res, next) {
    res.render('index.jade', { title: 'Express' });
});

module.exports.handler = serverless(app);
