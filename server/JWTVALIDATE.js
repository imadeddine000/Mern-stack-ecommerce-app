const jwt = require('jsonwebtoken')
const cookies = require('cookie-parser')

const validatetoken=(req,res,next)=>{
   next()
}

module.exports=validatetoken