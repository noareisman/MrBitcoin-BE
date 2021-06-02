// const postService = require('./post.service')
// const logger = require('../../services/logger.service')

// module.exports = {
//     getPost,
//     getPosts,
//     deletePost,
//     updatePost,
//     addPost,
//     getPostAsPdf
// }

// //get (filtered) posts list
// async function getPosts(req, res) {
//     try {
//         const filterBy = {
//             txt: req.query.txt || '',
//             pageIdx: +req.query.pageIdx || 0
//         }
//         const posts = await postService.query(filterBy)
//         res.json(posts)
//     } catch (err) {
//         logger.error('Failed to get posts', err)
//         res.status(500).send({ err: 'Failed to get posts' })
//     }
// }

// //get post by ID
// async function getPost(req, res) {
//     try {
//         const loggedinUser = req.session.user//server side session
//         const postId = await postService.getById(req.params.id)
//         if (!loggedinUser) {
//             //cookie -last visited posts:
//             var lastVisitedPosts = JSON.parse(req.cookies.lastVisitedPosts || null)
//             if (lastVisitedPosts > 10) {
//                 return res.status(401).send('wait 1h or register to keep exploring the application')
//             }
//             lastVisitedPostsCookie = JSON.stringify(lastVisitedPosts)
//             lastVisitedPosts.unshift(postId)
//             res.cookie('lastVisitedPosts', lastVisitedPostsCookie, { maxAge: 60 * 60 * 1000 })
//             console.log('user visited', lastVisitedPosts)
//         }
//     } catch (err) {
//         logger.error('Failed to get posts', err)
//         res.status(500).send({ err: 'Failed to get posts' })
//     }
// }

// //Add new post
// async function addPost(req, res) {
//     try {
//         // const loggedinUser=JSON.parse(req.cookies.loggedinUser||null)//cookie -loggedin user
//         const loggedinUser = req.session.user//server side session
//         // if (!loggedinUser) return res.status(401).send('Please login')//checked by middleware requireAuth
//         const postOwner = {
//             _id: loggedinUser._id,
//             fullname: loggedinUser.fullname,
//             img: loggedinUser.img
//         }
//         const { title, content } = req.body
//         const post = { title, content, creator: postOwner }
//         const savedPost = await postService.add(post)
//         res.send(savedPost)
//     } catch (err) {
//         logger.error('Failed to add post', err)
//         res.status(500).send({ err: 'Failed to add post' })
//     }
// }
// //update post
// async function updatePost(req, res) {
//     try {
//         const { _id, title, content, creator } = req.body
//         const post = { _id, title, content, creator }
//         const savedPost = await postService.update(post)
//         res.send(savedPost)
//     } catch (err) {
//         logger.error('Failed to update post', err)
//         res.status(500).send({ err: 'Failed to update post' })
//     }
// }

// //make pdf
// async function getPostAsPdf(req, res) {
//     try {
//         const postId = req.params.id
//         const post = await postService.getById(postId)
//         await postService.makePdf(post)
//         res.send(`PDF was created, postID:${postId}`)
//     } catch (err) {
//         logger.error('Failed to make PDF', err)
//         res.status(500).send({ err: 'Failed to make PDF' })
//     }
// }


// //remove post by ID
// async function deletePost(req, res) {
//     try {
//         await postService.remove(req.params.id)
//         res.send({ msg: 'Deleted successfully' })
//     } catch (err) {
//         logger.error('Failed to delete post', err)
//         res.status(500).send({ err: 'Failed to delete post' })
//     }
// }
