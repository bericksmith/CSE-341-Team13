const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
    // #swagger.ignore = true
    let message = '';
    let loggedInLinks = '';

    if (req.session.message) {
        message = req.session.message;
        delete req.session.message;
    }

    if (req.isAuthenticated()) {
        loggedInLinks = `<p><a href="/api-docs">View API Docs</a> | <a href="/users">View All Users</a> | <a href="/tickets">View All Tickets</a> | <a href="/events">View All Events</a> | <a href="/speakers">View All Speakers</a></p>  <p><a href="/logout">Logout</a></p>`;
    } else {
        loggedInLinks = `<p><a href="/github">Login with GitHub</a> | <a href="/logout">Logout</a></p>`;
    }

    res.send(`
        <h1>Welcome to the Group 13 Final Project Events API Hub</h1>
        <p>${message}</p>
        ${loggedInLinks}
    `);
});

router.get('/github', // #swagger.ignore = true
    passport.authenticate('github'));

router.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        // #swagger.ignore = true
        req.session.message = 'You are logged in';
        res.redirect('/');
    }
);

router.get('/logout', (req, res, next) => {
    // #swagger.ignore = true
    req.logout((err) => {
        if (err) { 
            return next(err);
        }
        req.session.message = 'You are logged out';
        res.redirect('/');
    });
});

router.use('/users', require('./users'));
router.use('/events', require('./events'));
router.use('/tickets', require('./tickets'));
router.use('/speakers', require('./speakers'));

module.exports = router;