const express=require('express')
const app=express()
const cors=require('cors')
const PORT=3000
const mongoose=require('mongoose')
const userRoute=require('./Router/userRoute')
const adminRoute=require('./Router/adminRoute')
const vendorRoute=require('./Router/vendorRoute')
const cookieParser=require('cookie-parser')
const session=require('express-session')

app.use(cors({
    origin:'http://localhost:5173',
    methods:['GET','POST','DELETE','PATCH'],
    credentials:true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 60000,httpOnly:false },
}));

app.use('/',userRoute)
app.use('/',adminRoute)
app.use('/',vendorRoute)

const DBURL='mongodb://localhost:27017/BRICKMORTAR'
mongoose.connect(DBURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log('mongodb connected to the server')
}).catch(()=>{
    console.log('mongodb connection error')
})


app.listen(PORT,()=>{
    console.log(`server running at port http://localhost:${PORT}`)
})