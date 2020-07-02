'use strict';
module.exports = (json_file_path, title_type) => {
    var jsonData = require(json_file_path);
    var ObjectArray = [];
    for (var dateString of Object.keys(jsonData)) {
        var title = {
            name: jsonData[dateString],
            date: dateString,
            type: title_type,
            createdAt: new Date().toDateString(),
            updatedAt: new Date().toDateString()
        };
        console.log(title);
        ObjectArray.push(title);
    }
    return ObjectArray;
};