#! /usr/bin/env node
'use strict';

console.log('This script populates Netflix JSON files to your database.');

const { Sequelize, Op } = require('sequelize');

// Connection à la database
const sequelize = new Sequelize('database', 'username', 'password', {
    dialect: 'sqlite',
    storage: 'data/database.sqlite3', // or ':memory:'
});

// Vérification de la connection
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
    // updatedAt est mis à jour automatiquement si un changement est effectué sur l'entrée
    const item = await foundItem.update(newItem, { fields: ["date"] })
    return { item, wasCreated: false };
}


async function updateOrCreateJSON(ObjectArray) {
    console.log("Updating database.");
    // Loop over JSON entries stored in ObjectArray and updateOrCreateEntry
    const loadPromises = ObjectArray.map(entry => {
        updateOrCreateEntry(Title, {
            name: entry.name,
            type: entry.type,
        }, {
            name: entry.name,
            date: entry.date,
            type: entry.type ? "Seen" : "Rated",
            createdAt: entry.createdAt
        })
    });
    await Promise.all(loadPromises);
}


async function CreateJSON(ObjectArray, is_seen) {
    // renvoie les éléments présents dans database et le fichier JSON
    const titles = await Title.findAll({
        where: {
            type: {
                [Op.in]: ObjectArray.map((item) => item.type),
            },
            name: {
                [Op.in]: ObjectArray.map((item) => item.name),
            },
        }, raw: true
    });
    // console.log(titles);

    // once we get titles continue on
    // flag wasCreated
    let wasCreated = false;
    if (!(Array.isArray(titles) && titles.length)) {
        // Aucune entrée du fichier JSON n'est présente dans la database
        console.log("Repopulating Database");
        wasCreated = true;

        // transaction delete and create (same as migration)
        let transaction;
        try {
            // get transaction
            transaction = await sequelize.transaction();

            // par sécurité on supprime les entrées du fichier JSON
            await Title.destroy({ where: { type: is_seen }, transaction: transaction });
            await Title.bulkCreate(ObjectArray.map(item => {
                return {
                    name: item.name,
                    date: item.date,
                    type: item.type ? "Seen" : "Rated",
                }
            }), { transaction: transaction, validate: true });

            await transaction.commit();
        } catch (err) {
            console.log("Erreur de transaction.");
            // Rollback transaction only if the transaction object is defined
            if (transaction) await transaction.rollback();
        }
    }
    return { titles, wasCreated };
}


async function processJSON(ObjectArray, is_seen) {
    let res = await CreateJSON(ObjectArray, is_seen);
    // once we get res continue on
    if (!(res.wasCreated))
        await updateOrCreateJSON(ObjectArray)
}

// Get models
const Title = require('./models').Title;

// Get JSON files
var json_rated_path = './data/rated_titles.json';
var json_seen_path = './data/seen_titles.json';

(async () => {
    await sequelize.sync({ force: true });
    // Code here
    try {
        const RatedArray = require('./migrate_from_json')(json_rated_path, false);
        const SeenArray = require('./migrate_from_json')(json_seen_path, true);

        await Promise.all([processJSON(RatedArray, false), processJSON(SeenArray, true)]);
    } catch (err) {
        console.error("Loading Error:", err);
    };
})();