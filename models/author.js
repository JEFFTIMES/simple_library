const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const { DateTime } = require('luxon');

//create schema for author
const AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true,maxLength: 100},
    dateOfBirth: {type: Date},
    dateofDeath: {type: Date}
  }
);

//create name virtual property for author's name
AuthorSchema
  .virtual('name')
  .get(
    function () {
      return this.first_name + ' ' + this.family_name;
    }
  );

//create virtual property for author for author's lifespan
AuthorSchema
  .virtual('lifespan')
  .get(
    function () { 
      let lifespan = '';
      if(this.dateOfBirth){
        lifespan = DateTime.fromJSDate(this.dateOfBirth).toLocaleString(DateTime.DATETIME_MED);
      }
      lifespan += ' - ';
      if(this.dateOfDeath){
        lifespan += DateTime.fromJSDate(this.dateofDeath).toLocaleString(DateTime.DATETIME_MED);
      }
      return lifespan;
    }
  );

//create virtual property for author's url.
AuthorSchema
  .virtual('url')
  .get(
    function () {
    let url = '/catalog/author/' + this._id;
    return url;
    }
  );

//creeate and export model
module.exports = mongoose.model('Author', AuthorSchema);