#! /usr/bin/env node
'use strict';

console.log('This script populates Netflix JSON files to your database.');

// Get models
const models = require('../models');
const processJSON = require('../populatesqlite').processJSON;

// Vérification de la connection
(async () => {
    try {
        await models.sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

// Get JSON files
var json_rated_path = './data/rated_titles.json';
var json_seen_path = './data/seen_titles.json';

(async () => {
    await models.sequelize.sync();
    // Code here
    try {
        const RatedArray = require('../migrate_from_json')(json_rated_path, false);
        const SeenArray = require('../migrate_from_json')(json_seen_path, true);

        await Promise.all([
            processJSON(RatedArray, false),
            processJSON(SeenArray, true),
        ]);
    } catch (err) {
        console.error("Loading Error:", err);
    };
})();