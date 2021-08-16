const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//new the schema
const GenreSchema = new Schema(
  {
    name: {type: String, required: true, maxLength:100, minLength:3},
  }
);

//setup the virtual property
GenreSchema
.virtual('url')
.get(function () {
  return '/catalog/genre/' + this._id;
});

//create and export the model
module.exports = mongoose.model('Genre',GenreSchema);