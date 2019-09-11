const Stock = require('../models/Stock.js');

module.exports = async function cleanDatabaseBeforeTests() {
    console.log('Inside function for cleaning databases!');

    try {

        await Stock.deleteOne({ stock: 'TEST' });

    } catch(err) {

        throw Error('Failed to delete test docs from database!');

    }
}