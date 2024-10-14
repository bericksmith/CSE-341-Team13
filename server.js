require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger/swagger.json');
const app = express();
const port = process.env.PORT || 5000;

MongoClient.connect(process.env.MONGO_URI)
    .then(client => {
        console.log('Connected to MongoDB');
        const db = client.db('finalproject');
        app.locals.db = db;

        app.use(bodyParser.json());
        app.use(cors());
        app.use(express.urlencoded({ extended: true }));

        app.use(session({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true
        }));
        app.use(passport.initialize());
        app.use(passport.session());

        require('./config/passport')(passport);

        app.use('/', require('./routes/index'));
        app.use('/users', require('./routes/users'));
        app.use('/tickets', require('./routes/tickets'));

        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(error => {
        console.error('Failed to connect to MongoDB:', error);
    });
