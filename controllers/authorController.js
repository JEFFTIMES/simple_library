const Author = require('../models/author');

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

//query the details of an author
const dispalyAuthorDetails = function(req, res, next) {
  const query = Author.find({_id:req.params.id})
  query.exec(function(err, results){
    if(err) return next(err);
    console.log(results);
    res.render('author_detail', {title: 'Author Details: ', author_detail: results[0]});
  });
  
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
  dispalyAuthorDetails,
  createAuthorFormOnGET,
  createAuthorOnPOST,
  deleteAuthorFormOnGET,
  deleteAuthorOnPOST,
  updateAuthorResultOnGET,
  updateAuthorOnPOST
}