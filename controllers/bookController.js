const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');

const async = require('async');
const { models } = require('mongoose');

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
    
    
    // res.json( 
    //     {
    //         bookDetail : req.params.id,
    //         finished : 'NOT IMPLEMENTED'
    //     } 
    // );

    //query dataabase with the req.params.id to get the detail of the book.
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
const book_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create GET');
}

// Handle book create on POST.
const book_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Book create POST');
}

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