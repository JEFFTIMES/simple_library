const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');
const {body,validationResult} = require('express-validator');
const async = require('async');

const { models } = require('mongoose');
const { render } = require('pug');

const index = function(req, res) {

    async.parallel({
        book_count: function(callback) {
            Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        book_instance_count: function(callback) {
            BookInstance.countDocuments({}, callback);
        },
        book_instance_available_count: function(callback) {
            BookInstance.countDocuments({status:'Available'}, callback);
        },
        author_count: function(callback) {
            Author.countDocuments({}, callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments({}, callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
}


// Display list of all books.
const book_list = function(req, res) {

    //use book model to find() all books from database.
    // Display list of all Books.
    // Book.find({}, 'title author')
    //   .populate('author')
    //   .exec(function (err, list_books) {
    //     if (err) { return next(err); }
    //     //Successful, so render
    //     res.render('book_list', { title: 'Book List', book_list: list_books });
    //   });
    const query = Book.find({}, 'title author');
    query.populate('author')
        .sort({title : 'ascending'})
        .exec(function (err, list_books) {
            if (err) { return next(err); }
            res.render('book_list', {title: 'Book List', book_list: list_books});
        });
  
};

// Display detail page for a specific book.
const book_detail = function(req, res) {
    
    //query database with the req.params.id to get the detail of the book.
    const query = Book.find({_id:req.params.id});
    query.populate('author')
        .populate('genre') 
        .exec(function (err, results) {
            if (err) { return next(err); }
            console.log(results[0]);
            res.render('book_detail', {title: results[0].title, book_detail: results[0]})
        });
}

// Display book create form on GET.
const book_create_get = function(req, res, next) {
    // get all authors and genres to render the select of the input form.
    async.parallel(
        {
            genres: function (callback) {
                Genre.find({})
                    .sort({name: 'ascending'})
                    .exec(function (err, genres) {
                        if(err)  return callback(err); 
                        callback(null, genres);
                    });

            },
            authors: function (callback) {
                Author.find({})
                    .sort({name: 'ascending'})
                    .exec(function (err, authors) {
                        if (err) return callback(err);
                        callback(null, authors);
                    });
            }
        },
        function (err, results) {
            if(err) return next(err);
            if (!results){
                const err = new Error('No authors, No genres, please create them first.');
                err.status = 404;
                return next(err);
            }
            console.log(results);
            res.render('book_form', {title: 'Create a book:', authors: results.authors, genres: results.genres});           
        }
    );
}

// Handle book create on POST.
const book_create_post = [
    //Convert the genre to an array
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)) {
            if(req.body.genre === undefined) {
                req.body.genre = [];
            }else{
                req.body.genre = new Array(req.body.genre);
            }
        }
        next();
    },

    // Validate and sanitize fields.
    body('title', 'Title must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('author', 'Author must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
    body('genre.*').escape(),

    //processing the request.
    (req, res, next) => {

        //get the results of the validation and sanitization.
        const errors = validationResult(req);

        //create the new book model instance.
        const book = new Book(
            {
                title: req.body.title,
                author: req.body.author,
                summary: req.body.summary,
                isbn: req.body.isbn,
                genre: req.body.genre
            }
        );

        //check if any empty fields were provided from the request.
        if(!errors.isEmpty()){
            //re-render the input page with reminders.
            async.parallel(
                {
                    authors: function (callback) {
                        Author.find({}, callback)
                            .sort('name')
                            .exec(function (err,authors){
                                if(err) return callback(err);
                                callback(null, authors);
                            });
                    },
                    genres: function (callback) {
                        Genre.find({}, callback)
                            .sort('name')
                            .exec(function (err,genres){
                                if(err) return callback(err);
                                callback(null,genres);
                            });
                    }
                    
                },
                function (err, results){
                    if(err) return next(err);
                    res.render('book_form', {title: 'Create Book:', authors: results.authors, genres: results.genres, errors: errors.array() });
                }
            );
            return;
        }else{

            //check if the book is existing.
            Book.findOne({title: req.body.title})
                .populate(
                    {
                        path: 'author',
                        match: req.body.name
                    }
                )
                .exec(function (err, found_book){
                    if(err) return next(err);
                    if(found_book){
                        res.redirect(found_book.url);
                    }else{
                        book.save(function (err){ 
                            res.redirect(book.url);
                        });
                    }
                });
        }
    }
]

// Display book delete form on GET.
const book_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete GET');
}

// Handle book delete on POST.
const book_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book delete POST');
}

// Display book update form on GET.
const book_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update GET');
}

// Handle book update on POST.
const book_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book update POST');
}

module.exports = {
    index,
    book_list,
    book_detail,
    book_create_get,
    book_create_post,
    book_delete_get,
    book_delete_post,
    book_update_get,
    book_update_post
};