const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

require('../models/Ideas');
const idea = mongoose.model('ideas');

router.get('/', ensureAuthenticated, (req, res) => {
    idea.find({ user: req.user.id })
        .sort({ date: 'desc' })
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
            });
        });
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});


//Process form 
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({ text: 'Please add a title.' });
    }
    if (!req.body.details) {
        errors.push({ text: 'Please add details about your idea.' })
    }

    if (errors.length > 0) {
        res.render('/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        };
        new idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Video idea added.')
                res.redirect('/ideas');
            });
    }
});
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            if (idea.user !== req.user.id) {
                req.flash('error_msg', 'Not Authorized');
                res.redirect('/ideas');
            } else {
                res.render('ideas/edit', {
                    idea: idea
                });
            }
        });
});

// Edit phone process
router.put('/:id', ensureAuthenticated, (req, res) => {
    idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save()
                .then(idea => {
                    req.flash('success_msg', 'Video idea updated.')

                    res.redirect('/ideas')
                });
        });
});
//Delete edit idea
router.delete('/:id', ensureAuthenticated, (req, res) => {
    idea.remove({
            _id: req.params.id
        })
        .then(() => {
            req.flash('success_msg', 'Video idea removed.')
            res.redirect('/ideas');
        });
});


module.exports = router;