/**
 * Created by takodaregister on 10/23/18.
 */
var express = require('express');
const app = express();
const serverless = require('serverless-http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var users = require('./users');
var s_garden = require('./s_garden_get');
var locations = require('./locations');
var index = require('./index');

var engine = require("ejs-locals");
var passport = require("passport");
var session = require("express-session");


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("ejs", engine);
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "tank and spank",
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);
app.use('/s_garden_trees', s_garden);
app.use('/locations', locations);

app.use('/s_garden_trees/:slug', function(req, res) {
    MongoClient.connect('mongodb://lsands:Sandy427!@ds137291.mlab.com:37291/s_garden', (err, db) => {
        var treeId = req.params.slug;
    var collection = db.collection('s_garden');
    collection.find({'id': treeId}).toArray(function (err, tree) {
        res.json(tree);
        db.close();
    })
})
});

app.post('/s_garden', function (req, res) {
    var tree = req.body;
    MongoClient.connect('mongodb://lsands:Sandy427!@ds137291.mlab.com:37291/s_garden', (err, db) => {
        var collection = db.collection('s_garden');
    collection.insertOne(tree, function(err, res) {
        if (err) throw err;
        console.log("1 record inserted");

    });
    res.writeHead(301,
        {Location: "takoda-register.com"}
    );
    res.end();
})
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports.handler = serverless(app);
