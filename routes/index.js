const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', (req, res) => {
    let message = '';
    let loggedInLinks = '';

    if (req.session.message) {
        message = req.session.message;
        delete req.session.message;
    }

    if (req.isAuthenticated()) {
        loggedInLinks = `<p><a href="/api-docs">View API Docs</a> | <a href="/logout">Logout</a></p>`;
    } else {
        loggedInLinks = `<p><a href="/github">Login with GitHub</a> | <a href="/logout">Logout</a></p>`;
    }

    res.send(`
        <h1>Welcome to the Group 13 Final Project - Event API</h1>
        <p>${message}</p>
        ${loggedInLinks}
    `);
});

router.get('/github', passport.authenticate('github'));

router.get('/github/callback', 
    passport.authenticate('github', { failureRedirect: '/' }),
    (req, res) => {
        req.session.message = 'You are logged in';
        res.redirect('/');
    }
);

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { 
            return next(err);
        }
        req.session.message = 'You are logged out';
        res.redirect('/');
    });
});

module.exports = router;