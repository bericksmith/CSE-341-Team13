const express = require('express');
const passport = require('passport');
const { route } = require('./users');
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
        loggedInLinks = `
            <button><a href="/api-docs">API Docs</a></button>
            <button><a href="/users">Users</a></button>
            <button><a href="/tickets">Tickets</a></button>
            <button><a href="/events">Events</a></button>
            <button><a href="/speakers">Speakers</a></button> 
            <button><a href="/venues">Venues</a></button>
            <button><a href="/logout">Logout</a></button>`;
    } else {
        loggedInLinks = `<button><a href="/github">Login with GitHub</a></button>`;
    }

    res.send(`
        <html>

        <head>
            <style>
                body {
                    background: linear-gradient(to bottom, #ccffff 0%, #99ccff 100%);
                    text-align: center;
                }
                h1,h2   {
                    color: blue; 
                    text-align: center;
                    padding: 2%;
                }
                p    {
                    color: red;
                    margin: 0 10% 0 10%;
                    padding: 2%;
                }
                button {
                    background-color: lightyellow;
                    color: blue; padding: 15px 32px;
                    text-align: center;
                    text-decoration: none;
                    border-radius: 8px;
                    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
                    font-size: 16px;
                    margin: 4px 2px;
                    cursor: pointer;
                    padding: 1%;
                }
                div {
                    display: flex;
                    flex-direction: row;
                    justify-content: center;
                    padding: 3%;
                }
            </style>
        </head>

        <body>

            <h1>Event Planning API</h1>

            <h2>Welcome to the Group 13 Final Project Events API Hub</h2>
            <p>Our team has created an Event Management API that is designed to help organize and carryout events like workshops, celebrations, concerts, and conferences.  The API helps organizers to manage aspects of event planning: users, ticket sales, venues, speakers, and events.  Each collection stores information with specific attributes. Login and click on each collection to explore the data available for each collection.  This system securely stores data and makes event management efficient so that the event will be smooth and enjoyable.</p>

            <p>${message}</p>
            
            <div>
            ${loggedInLinks}
            </div>
            
        </body>
        </html>
        
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
router.use('/venues', require('./venues'));

module.exports = router;