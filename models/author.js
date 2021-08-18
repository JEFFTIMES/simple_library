const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
const { DateTime } = require('luxon');

//create schema for author
const AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, maxLength: 100},
    family_name: {type: String, required: true,maxLength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date}
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
      if(this.date_of_birth){
        lifespan = DateTime.fromJSDate(this.date_of_birth).toFormat('yyyy');//toLocaleString(DateTime.DATE_MED );
        
      }
      lifespan += ' - ';
      if(this.date_of_death){
        lifespan += DateTime.fromJSDate(this.date_of_death).toFormat('yyyy');//toLocaleString(DateTime.DATE_MED);
        
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