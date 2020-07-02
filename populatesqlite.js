#! /usr/bin/env node

console.log('This script populates Netflix JSON files to your database.');

const { Sequelize } = require('sequelize');
const async = require('async');
var app = require('./app');

const sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: 'data/database.sqlite3', // or ':memory:'
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

async function updateOrCreateEntry(model, where, newItem) {
    // First try to find the record
    const foundItem = await model.findOne({ where });
    if (!foundItem) {
        // Item not found, create a new one
        const item = await model.create(newItem)
        return { item, wasCreated: true };
    }
    // Found an item, update it
    // const item = await model.update(newItem, { where, returning: true, plain: true});
    // updatedAt est mis à jour automatiquement
    const item = await foundItem.update(newItem, { fields: ["date"] })
    return { item, wasCreated: false };
}

async function updateOrCreateJSON(json_path, is_seen) {
    const ObjectArray = require('./migrate_from_json')(json_path, is_seen);
    async.each(ObjectArray, async (entry, callback) => {
        await updateOrCreateEntry(Title, {
            name: entry.name,
            type: entry.type,
        }, {
            name: entry.name,
            date: entry.date,
            type: entry.type ? "Seen": "Rated",
            createdAt: entry.createdAt
        }).then(result => {
            console.log("Entry:", entry.name, "\nWas created:", result.wasCreated);
            if (result.wasCreated)
                console.log(result.item.dataValues);
        }).catch(err => {
            // print the error details
            callback(console.log(err));
        });
    }, err => {
        if (err) {
            // One of the iterations produced an error.
            // All processing will now stop.
            console.log('An entry failed to process: ', err);
        } else {
            console.log('All entries have been processed successfully');
        }
    });
}

// Get models
var Title = app.get('models').Title;

// Get JSON files
var json_rated_path = './data/rated_titles.json';
var json_seen_path = './data/seen_titles.json';

(async () => {
    await sequelize.sync({ force: true });
    // Code here
    await updateOrCreateJSON(json_rated_path, false);
    await updateOrCreateJSON(json_seen_path, true);
})();