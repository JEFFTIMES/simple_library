const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const path = '/catalog/book/'

//create the schema
const BookSchema = new Schema(
  {
    title: {type: String, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'Author', required: true}, // refer the id of each author in the 'Author' model
    summary: {type: String, required: true},
    isbn: {type: String, required: true},
    genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}] // refer the 'Genre' id.
  }
);

//setup the virtual property
BookSchema
.virtual('url')
.get(function() {
  return path + this._id;
});

//create and export the model
module.exports = mongoose.model('Book', BookSchema);