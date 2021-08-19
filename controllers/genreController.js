const Genre = require('../models/genre');
const Book = require('../models/book');
const async = require('async');

// Display list of all Genre.
exports.genre_list = function(req, res) {
    //res.send('NOT IMPLEMENTED: Genre list');
    Genre.find({})
        .sort('name')
        .exec(function(err, genres){
            if(err) return next(err);
            res.render('genre_list',{title: 'Genres', genre_list:genres});
        });


};

// Display detail page for a specific Genre.
exports.genre_detail = function(req, res) {
    //res.send('NOT IMPLEMENTED: Genre detail: ' + req.params.id);
    
    //async.parallel usage: (give tasks in an object)
    //define anonymous functions to enclose each task.
    //put all the anonymous functions in an object and give each function an unique name represents the result it could produce.
    //pass a callback function as the parameter to the enclosing function.
    //process the real tasks inside each enclosing function, at the end of the processing call the callback() function.
    //pass the result got by the processing as the second parameter to the callback(null, results) function with null as the first parameter,
    //or, call the callback(err) function with an error as the first parameter instead.
    //after the object parameter passed to the parallel(), pass a final callback function which receive two parameters (error, results) 
    //for the final processing of the parallel tasks.
    //in the final processing callback, deal with the error first, because the caller of the parallel function
    //is a middleware function of the express framework, here should return a next(err).
    //after the dealing with the error, it is time to process the final result, the final result is an object which property names 
    //are the name given to the anonymous enclosing function for each task, the values are the results produced by the tasks inside the anonymous functions .
    async.parallel(
        {
            genres: function (callback) {
                Genre.find({_id: req.params.id})
                    .exec(function (err, genres){
                        if(err) return callback(err);
                        callback(null, genres);
                    }); 
            },
            books: function (callback) {
                Book.find({genre: req.params.id})
                    .populate('author')
                    .sort('title')
                    .exec(function (err, books){
                        if(err) return callback(err);
                        callback(null,books);
                    });
            }
        }, function(error, results){
            if(error) return next(error);
            //console.log(results);
            if(results===null){ //no genre found.
                const err = new Error('No Genres found.');
                err.status = 404;
                return next(err);
            }
            res.render('genre_detail',{title: results.genres[0].name, books: results.books})
        }

    );
    
    // Genre.find({_id: req.params.id})
    //     .exec(function(err, genres){
    //         if(err) return next(err);
    //         console.log(genres[0]);
    //         res.render('genre_detail',{title: genres[0].name, genre_detail:genres[0]});
    //     });
};

// Display Genre create form on GET.
exports.genre_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre create GET');
};

// Handle Genre create on POST.
exports.genre_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre create POST');
};

// Display Genre delete form on GET.
exports.genre_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Genre update POST');
};