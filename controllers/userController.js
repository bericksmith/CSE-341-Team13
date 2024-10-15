const { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

// Get all users
exports.getUsers = async (req, res) => {
    //#swagger.tags=['Users']
    const db = req.app.locals.db;

    try {
        const users = await db.collection('users').find().toArray();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: 'An error occurred while fetching users', error });
    }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    //#swagger.tags=['Users']
    const db = req.app.locals.db;
    const { id } = req.params;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: 'An error occurred while fetching the user', error });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    //#swagger.tags=['Users']
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const db = req.app.locals.db;
    const { fname, lname, email, password, role, status, dob, location } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            fname,
            lname,
            email,
            password: hashedPassword,
            role,
            status,
            dob: new Date(dob),
            location,
            created_at: new Date()
        };

        await db.collection('users').insertOne(newUser);
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: 'An error occurred while creating the user', error });
    }
};

// Update a user by ID
exports.updateUser = async (req, res) => {
    //#swagger.tags=['Users']
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const db = req.app.locals.db;
    const { id } = req.params;
    const updateData = req.body;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const result = await db.collection('users').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error("Error updating user by ID:", error);
        res.status(500).json({ message: 'An error occurred while updating the user', error });
    }
};

// Delete a user by ID
exports.deleteUser = async (req, res) => {
    //#swagger.tags=['Users']
    const db = req.app.locals.db;
    const { id } = req.params;

    try {
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error("Error deleting user by ID:", error);
        res.status(500).json({ message: 'An error occurred while deleting the user', error });
    }
};
