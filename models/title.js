var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TitleSchema = new Schema(
    {
        title_name : {type: String, required: true, maxlength: 100},
        date : {type: String, required: true},
    }
);

//Export model
module.exports = {
    SeenTitle: mongoose.model('SeenTitle', TitleSchema),
    RatedTitle: mongoose.model('RatedTitle', TitleSchema),
};