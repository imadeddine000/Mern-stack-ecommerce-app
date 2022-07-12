const express=require('express')
const mongoose=require('mongoose')
const Product=require('./Models/products')
const User=require('./Models/users')
const cors =require('cors')
const path=require('path')
const app=express()
const bcrypt=require('bcrypt')
app.use(cors())
app.use(express.json())
const cookieParser=require('cookie-parser')
app.use(cookieParser())
const createToken = require('./JWT')

mongoose.connect(URI,()=>{
    console.log('database connected ...')
})
app.post('/addproduct',(req,res)=>{
    const title=req.body.title;
    const img=req.body.img;
    const price=req.body.price;

    const product=new Product({
        title:title,
        price:price,
        img:img
     })
     product.save()
     res.send({message:'product added successfully'})
    
})

app.post('/admins',(req,res)=>{
    const username=req.body.username
    bcrypt.hash(req.body.password,10,(err,hash)=>{
        if(err) console.log(err)

        const user=new User({
            username:username,
            password:hash
        })
        user.save()
    })
    
})

app.get('/products',(req,res)=>{
    Product.find((err,docs)=>{
        if(err) console.log(err)
        res.send(docs)
    })
})

app.post('/delete',(req,res)=>{
    const id = req.body.id
    
    Product.findByIdAndRemove(id,(err)=>{
        if(err){console.log(err)}
    })

})

app.post('/login',(req,res)=>{
    const username=req.body.username
    const password=req.body.password

    User.findOne({username},(err,obj)=>{
        if(err){
            console.log(err)
           
        }else if(!obj){
            console.log('username does not exist')
            res.send({message:"please enter a valid username and password",state:false})
        }
        else{
            bcrypt.compare(password,obj.password,(err,result)=>{
                if(err){

                }
                else if(result){
                    const token = createToken(username,result._id)
                    return res.status(200).send({token:token,state:true})
                }
                else(!result)
                    res.send({message:"incorrect username or password",state:false})
            })
        }
        
    })
    

})

app.get('/',(req,res)=>{
    res.send('hello')
})
app.listen(process.env.PORT||3001,()=>{console.log('app running')})