
const { AsyncLocalStorage } = require('async_hooks');
const asyncLocalStorage = new AsyncLocalStorage();// creates an object in which data could be stored

// The AsyncLocalStorage singleton- only one such object
module.exports = asyncLocalStorage;
