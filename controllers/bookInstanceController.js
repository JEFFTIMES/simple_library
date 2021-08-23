const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');

const {body,validationResult} = require('express-validator');
const book = require('../models/book');


// Display list of all BookInstances.
exports.bookinstance_list = function(req, res) {
    BookInstance.find()
        .populate('book')
        .exec(function (err, list_bookinstances) {
        if (err) { return next(err); }
        // Successful, so render
        res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
        });
};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function(req, res) {
    BookInstance.find({_id: req.params.id})
        .populate('book')
        .exec(function (err, results){
            if(err) { return next(err); }
            console.log(results);
            res.render('bookinstance_detail', {title: results[0].book.title, detail: results[0]})
        });
    //res.send('NOT IMPLEMENTED: BookInstance detail: ' + req.params.id);
};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function(req, res,next) {
    Book.find({},'title')
        .sort()
        .exec(function (err,books){
            if(err) return next(err);
            res.render('bookinstance_form', {title: 'Create Book Instance:', book_list: books});
        })
};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
    
    //validating input.
    body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
    body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }).escape(),
    body('status').escape(),
    body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(),

    //new middleware to re-render the form or save the data.
    (req, res, next) => {
        //check if any errors from input form.
        const errors = validationResult(req);
        
        //create model instance with input data.
        const bookinstance = new BookInstance(
            {
                book: req.body.book,
                imprint: req.body.imprint,
                status: req.body.status,
                due_back: req.body.due_back
            }
        );
        //if any errors, render the form with reminders.
        if(!errors.isEmpty()){
            Book.find({},'title')
                .sort()
                .exec(function (err,books){
                    if(err) return next(err);
                    res.render('bookinstance_form', {title: 'Create Book Instance:', book_list: books, selected: bookinstance.book._id, errors:errors.array()});
                })
        }else{
            //otherwise, save the data.
            bookinstance.save(function (err){
                if(err) return next(err);
                res.redirect(bookinstance.url)
            });
        }
    }

]

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete GET');
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance delete POST');
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: BookInstance update POST');
};