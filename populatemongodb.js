#! /usr/bin/env node

console.log('This script populates Netflix JSON files to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.mjrok.mongodb.net/netflix?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

// Get models
var Title = require('./models/titlemongodb')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


function titleCreate(json_file_path, TitleMethod) {
    let jsonData = require(json_file_path);
    console.log(jsonData);

    for (var dateString of Object.keys(jsonData)) {
        var title = new TitleMethod({ title_name: jsonData[dateString], date: dateString });
        // Convert the Model instance to a simple object using Model's 'toObject' function
        // to prevent weirdness like infinite looping...
        var upsertData = title.toObject();
        // Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
        delete upsertData._id;
        // Do the upsert, which works like this: If no Contact document exists with 
        // title_name = title.title_name, then create a new doc using upsertData.
        // Otherwise, update the existing doc with upsertData
        TitleMethod.update({ title_name: title.title_name }, upsertData, { upsert: true }, function (err) { if (err) return console.log(err); })
    }
}

// Get JSON files
var json_rated_path = './data/rated_titles.json';
var json_seen_path = './data/seen_titles.json';

titleCreate(json_rated_path, Title.RatedTitle);
titleCreate(json_seen_path, Title.SeenTitle);