


// // const postService=require('../api/post/post.service')
// const userService=require('../api/user/user.service')
// const contactService=require('../api/contact/contact.service')

// //conection URL
// const url='mongodb://localhost:27017'



//connecting node to DATA BASE
var config;

// keys.js - figure out what set of credentials to return
if (process.env.NODE_ENV === 'production') {
  // we are in production - return the prod set of keys
  config = require('./prod')
} else {
  // we are in development - return the dev keys!!!
  config = require('./dev')
}

module.exports = config