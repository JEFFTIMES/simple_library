const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');
const {DateTime} = require('luxon');
const { body,validationResult } = require('express-validator');


//query all authors
const listAuthors = function(req, res, next) {
  const query = Author.find({});
  query.sort({name:'ascending'})
    .exec(function(err,authors){
        if(err) return next(err);
        res.render('author_list', {title: 'Author List:' , author_list: authors});
    });
  
  //res.send('Not implemented: author list.');
}

//query the details of an author along with his/her books
const displayAuthorDetails = function(req, res, next) {
  // const query = Author.find({_id:req.params.id})
  // query.exec(function(err, results){
  //   if(err) return next(err);
  //   console.log(results);
  //   res.render('author_detail', {title: 'Author Details: ', author_detail: results[0]});
  // });
  async.parallel(
    {
      authors: function (callback) {
        Author.find({_id:req.params.id})
          .exec(function(err, authorsResults){
            if(err) return callback(err);
            callback(null, authorsResults);
          })
      },
      books: function (callback) {
        Book.find({author: req.params.id})
          .exec(function(err, booksResults){
            if(err) return callback(err);
            callback(null, booksResults);
          })
      }
    }, 
    function (err, results) {
      if(err) return next(err);
      console.log(results);
      if(results.authors[0] === null){
        const err = new Error('No Author Found.');
        err.status = 404;
        return next(err);
      }
      let tmp = DateTime.fromJSDate(results.authors[0].date_of_birth).toLocaleString(DateTime.DATE_MED);
      results.date_of_birth_formatted = tmp;
      console.log(tmp);
      tmp = DateTime.fromJSDate(results.authors[0].date_of_death).toLocaleString(DateTime.DATE_MED);
      console.log(tmp);
      results.date_of_death_formatted = tmp;
      console.log(results);
      res.render(
        'author_detail', 
        {
          title: 'Author Details: ', 
          author_detail: results.authors[0],
          books: results.books,
          date_of_birth_formatted: results.date_of_birth_formatted,
          date_of_death_formatted: results.date_of_death_formatted      
        }
      );
    }
  );
}


//display author create form on GET method.
const createAuthorFormOnGET = function(req, res, next) {
  res.render('author_form',{title: 'Create an Author:'});  
}

//create an author on POST method.
const createAuthorOnPOST = [
  //validate and sanitize the inputs
  body('first_name')
    .trim()
    //.isEmpty()
    //.withMessage('Please input the first name.')
    .isLength({min:2})
    .withMessage('Please enter at least 2 characters for the first name.')
    .isAlphanumeric()
    .withMessage('Alphanumeric is required for the first name.')
  ,
  body('family_name')
    .trim()
    //.isEmpty()
    //.withMessage('Please input the family name.')
    .isLength({min:2})
    .withMessage('Please enter at least 2 characters for the family name.')
    .isAlphanumeric()
    .withMessage('Alphanumeric is required for the family name.')
  ,
  body('data_of_birth')
    .optional({checkFalsy:true})
    .isISO8601()
    .withMessage('Invalid date formation')
    .toDate()
  ,
  body('data_of_death')
  .optional({checkFalsy:true})
  .isISO8601()
  .withMessage('Invalid date formation')
  .toDate()
  ,
  
  (req, res) => {
    //get the validation results.
    const errors = validationResult(req);

    const author = new Author(
      {
        first_name:req.body.first_name, 
        family_name:req.body.family_name, 
        date_of_birth:req.body.date_of_birth, 
        date_of_death:req.body.date_of_death
      }
    );

    //if there are any errors, re-render the input page with reminders.
    if(!errors.isEmpty()){
      res.render(
        'author_form', 
        {
          title: 'Create an Author:', 
          author:
          {
            first_name:req.body.first_name,
            family_name:req.body.family_name,
            date_of_birth:req.body.date_of_birth,
            date_of_death:req.body.date_of_death
          }, 
          errors: errors.array()
        }
      );
    }else{
    
      //check if the author is already exists.
      Author.findOne({first_name:req.body.first_name,family_name:req.body.family_name})
        .exec(function (err,found_author){
          if(err) return next(err);
          //if author exists, redirect to the details page.
          if(found_author){ 
            res.redirect(found_author.url);
          }else{
            author.save(function (err) {
              if(err) return next(err);
              res.redirect(author.url);
            });
          }
        });
    }
  }
]

//display author delete form on GET method.
const deleteAuthorFormOnGET = function(req, res, next) {
  async.parallel({
    author: function(callback) {
        Author.findById(req.params.id).exec(callback)
    },
    authors_books: function(callback) {
      Book.find({ 'author': req.params.id }).exec(callback)
    },
}, function(err, results) {
    if (err) { return next(err); }
    if (results.author==null) { // No results.
        res.redirect('/catalog/authors');
    }
    // Successful, so render.
    res.render('author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books } );
});
}

//delete an author on POST method.
const deleteAuthorOnPOST = function(req, res, next){
  res.send('Not implemented: delete author on POST method.');
}

//display author update on GET method.
const updateAuthorResultOnGET = function(req, res, next) {
  res.send('Not implemented: update author result on GET method.');
}

//handle author update on POST method.
const updateAuthorOnPOST = function(req, res, next){
  res.send('Not implemented: update author on POST method.');
}


// export the controllers
module.exports = {
  listAuthors,
  displayAuthorDetails,
  createAuthorFormOnGET,
  createAuthorOnPOST,
  deleteAuthorFormOnGET,
  deleteAuthorOnPOST,
  updateAuthorResultOnGET,
  updateAuthorOnPOST
}