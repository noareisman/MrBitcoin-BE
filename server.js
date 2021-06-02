// const debug=require('debug')('node-angular')

const express = require('express')
const cookieParser = require('cookie-parser')
const cors=require('cors')
const path=require('path')//used for interacting with the file system
const expressSession=require('express-session')

//creating server
const app = express()
const http=require('http')//default node.js package
const server= http.createServer(app)
//Express App Configuration
const session=expressSession({
    secret: 'some secret token',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})//use server side session for user authentication
app.use(session)
app.use(express.json())//Use body parser to pass JSON data
app.use(cookieParser())//Use cookies

if(process.env.NODE_ENV==='production'){
    app.use(express.static(path.resolve(__dirname,'public')))//Telling express to serve static files fron the public folder
}else{
    const corsOptions={
        origin:['http://127.0.0.1:8080','http://localhost:8080','http://127.0.0.1:3000','http://localhost:3000','http://127.0.0.1:4200','http://localhost:4200'],//ports of frontend
        credentials:true
    }
    app.use(cors(corsOptions))
}

//routes
const contactRoutes=require('./api/contact/contact.routes')
const userRoutes=require('./api/user/user.routes')
const authRoutes=require('./api/auth/auth.routes')
const setupAsyncLocalStorage=require('./middlewares/setupAls.middleware')
app.all('*',setupAsyncLocalStorage)//all routes use this middleware
app.use('/api/contact',contactRoutes)
app.use('/api/user',userRoutes)
app.use('/api/auth',authRoutes)

//Make every server-side-route to match the index.html so when requesting http://localhost:XXXX/index.html/XXX/XXX 
//it will still respond with our SPA (single page app) (the index.html file) and will allow the router to take it from there (even if no route was matched)
//Last fallback
//also allows working with history mode
app.get('/**',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','index.html'))
})

const port = process.env.PORT || 3030

const logger=require('./services/logger.service')
server.listen(port, () => {
    logger.info(`Backend ready at http://localhost:${port}`)
})

console.log('backend is running')












