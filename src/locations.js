/**
 * Created by takodaregister on 10/23/18.
 */
var express = require('express');
const app = express();
var MongoClient = require('mongodb').MongoClient;
const serverless = require('serverless-http');

app.get('/', function(req, res) {
    MongoClient.connect('mongodb://lsands:Sandy427!@ds137291.mlab.com:37291/s_garden', (err, db) => {

        var collection = db.collection('locations');
    collection.find({}).toArray(function(err, tree) {
        res.json(tree);
        db.close();
    })
})});



module.exports.handler = serverless(app);