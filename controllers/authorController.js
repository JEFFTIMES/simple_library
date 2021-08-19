const Author = require('../models/author');
const Book = require('../models/book');
const async = require('async');
const {DateTime} = require('luxon');

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
  res.send('Not implemented: create author form on GET method.');
}

//create an author on POST method.
const createAuthorOnPOST = function(req, res, next) {
  res.send('Not implemented: create author on POST method.');
}

//display author delete form on GET method.
const deleteAuthorFormOnGET = function(req, res, next) {
  res.send('Not implemented: delete author form on GET method.');
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