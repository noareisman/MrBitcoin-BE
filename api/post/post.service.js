// //********FOR WORKING WITH MONGO-DB AS DB********
// const dbService = require('../../services/db.service')
// const ObjectId = require('mongodb').ObjectId
// //***********************************************//

// const utilService = require('../../services/util.service')

// module.exports = {
//     query,
//     getById,
//     remove,
//     add,
//     update,
//     makePdf,
// }

// const PAGE_SIZE = 6

// function query(filterBy = {}) {
//     const criteria = _buildCriteria(filterBy)
//     if (filterBy.txt) {
//         criteria.title = { $regex: new RegExp(filterBy.txt, 'i') }
//     }
//     if (filterBy.pageIdx) {
//         criteria.pageIdx = filterBy.pageIdx
//     }
//     if (filterBy.avgRate) {
//         criteria.avgRate = { $gte: filterBy.avgRate }
//     }
//     try {
//         const collection = await dbService.getCollection('post')//creating connection
//         // const posts = await collection.find(criteria).toArray()
//         const posts = await collection.aggregate([
//             {
//                 $match:filterBy// criteria
//             },
//             {
//                 //what other collection we need to look into for the aggregation
//                 $lookup:{
//                     localField:'',//property name in origin collection
//                     from:'',//origin collection name
//                     foreignField:'',//property name in other collection 
//                     as:'someName'// aggragate under this name
//                 },
//             },
//             {
//                 $unwind:'$someName'
//             }
//         ]).toArray()
//         return posts
//     } catch (err) {
//         console.log(`ERROR: Cannot get posts`)
//         throw err

//     }

//     function _buildCriteria(filterBy) {

//     }
//     // const startIdx = filterBy.pageIdx * PAGE_SIZE
//     // posts = posts.slice(startIdx, startIdx + PAGE_SIZE)
//     // return Promise.resolve(posts)
// }

// async function getById(postId) {
//     try {
//         const collection = await dbService.getCollection('post')//creating connection
//         const post = await collection.findOne({ "_id": ObjectId(postId) })
//         return post
//     } catch (err) {
//         console.log(`ERROR:cannot find post by id: ${postId}`)
//         throw err
//     }
// }

// async function remove(postId) {
//     try {
//         const store = asyncLocalStorage.getStore()
//         const { userId, isAdmin } = store
//         const query = { _id: ObjectId(postId) }
//         if (!isAdmin) query.creatorId = ObjectId(userId)//only creator of post or admin can make changes
//         const collection = await dbService.getCollection('post')//creating connection
//         return await collection.deleteOne(query)
//     } catch (err) {
//         console.log(`ERROR:cannot delete post ${postId}`)
//         throw err
//     }
// }


// async function update(post) {
//     const collection = await dbService.getCollection('post')
//     try {
//         // use only updatable fields!
//         const postToSave = {
//             _id: ObjectId(post._id),
//             createdAt:post.createdAt,
//             title:post.title,
//             content:post.content,
//             creator:post.creator,
//             comments: {
//                 txtComments: post.txtComments,
//                 rating:post.rating,
//                 emojiComments: post.emojiComments
//             },
//             attachedFiles:post.attachedFiles
//         }
//         const store = asyncLocalStorage.getStore()
//         const { userId, isAdmin } = store
//         const query = { _id: ObjectId(post._id) }
//         if (!isAdmin) query.creatorId = ObjectId(userId)//only creator of post or admin can make changes
//         await collection.updateOne(query, { $set: post })
//         return post
//     } catch (err) {
//         console.log(`ERROR:cannot update post ${post._id}`)
//         throw err
//     }
// }

// async function add(post) {
//     try {
//         //use only updatable fields!
//         const postToSave = {
//             createdAt:Date.now(),
//             title:post.title,
//             content:post.content,
//             creator:post.creator,
//             comments: {
//                 txtComments: post.txtComments,
//                 rating:post.rating,
//                 emojiComments: post.emojiComments
//             },
//             attachedFiles:post.attachedFiles
//         }
//         const collection = await dbService.getCollection('post')
//         await collection.insetOne(postToSave)
//         return postToAdd// return from mongo with ID
//     } catch (err) {
//         console.log(`ERROR:cannot add post ${post._id}`)
//         throw err
//     }
// }


// function makePdf(post) {
//     //CREATING PDF FILE
// const fs = require('fs')
// const PDFDocument = require('pdfkit');
// const doc = new PDFDocument;
//     const pdf = doc({
//         size: 'LEGAL',
//         info: {
//             title: `${post.title}`,
//             autor: 'Cookin'
//         }
//     })
//     pdf.pipe(fs.createWriteStream('./data/cookin.pdf'))
//     pdf.fontSize(14).text('Cookin:' + post.title + '/n' + post.content).moveDown(1)
//     pdf.end()
// }