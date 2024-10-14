const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

module.exports = {
    createUser: async (db, userData) => {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = { ...userData, password: hashedPassword };
        await db.collection('users').insertOne(user);
        return user;
    },
    findById: async (db, id) => {
        return await db.collection('users').findOne({ _id: ObjectId(id) });
    }
};
