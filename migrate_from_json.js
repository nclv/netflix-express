'use strict';
module.exports = (json_file_path, title_type) => {
    var jsonData = require(json_file_path);
    var ObjectArray = [];
    for (var dateString of Object.keys(jsonData)) {
        var title = {
            name: jsonData[dateString],
            date: dateString,
            type: title_type,
            createdAt: new Date(),  // nécessaire pour les seeders
            updatedAt: new Date()  // nécessaire pour les seeders
        };
        // console.log(title);
        ObjectArray.push(title);
    }
    return ObjectArray;
};