const express = require('express')
const router = express.Router()
const createError = require('http-errors')
//const User = require('../Models/User.model')
const {authSchema} = require('../helpers/validation_schema')
const { signAccessToken, signRefreshToken,verifyRefreshToken } = require('../helpers/jwt_helper')
//const { create } = require('../Models/User.model')
const { ref } = require('@hapi/joi')
const redisClient = require('../helpers/init_redis')
const configs = require('../Configurations/appConfiguration');
const sql = require('mssql');
const bcrypt = require('bcrypt')

// const UserSchema = new Schema({
//     email:{
//         type:String,
//         required:true,
//         lowercase:true,
//         unique:true
//     },
//     password:{
//         type:String,
//         required:true
//     }
// })

// router.post('/register', async(req,res,next)=>{
//     //console.log(req.body)
//     try {
//         //const {email,password} = req.body

//         // if(!email || !password){
//         //     throw createError.BadRequest()
//         // }
//         const result = await authSchema.validateAsync(req.body)
//         console.log(result)

//         const doesExist = await User.findOne({email:result.email})

//         if(doesExist){
//             throw createError.Conflict(`${result.email} already exists`)
//         }
//         else{
//             const user = new User({email:result.email,password:result.password})
//             const savedUser = await user.save()

//             const accessToken = await signAccessToken(user.id)
//             const refreshToken = await signRefreshToken(user.id)
//             res.send({accessToken,refreshToken})
//         }

//     } catch (error) {
//         if (error.isJoi === true) {
//             error.status=422
//         }
//         next(error)
//     }
    
// })

router.post('/login', async(req,res,next)=>{
    var db = null;
   try {
        console.log(req.body)
        //const result = await UserSchema.validateAsync(req.body)
        //const user = await User.findOne({email:result.email})
        db = await sql.connect(configs.dbConfig);
        var query = `Select top 1 * from Users where email='${req.body.email}'`;
        let data = await db.request().query(query);
        
        console.log(data);

        if(data.recordset.length < 1){
            throw createError.NotFound("User not registered")
            //res.render('login',{message:'User not registered'})
        }

        const isMatch = await bcrypt.compare(req.body.password,data.recordset[0].Password)

        if(!isMatch){
            throw createError.Unauthorized("Username/Password is not valid")
        }

        const accessToken = await signAccessToken(data.recordset[0].Email)
        const refreshToken = await signRefreshToken(data.recordset[0].Email)

        req.sessionStore.userid = data.recordset[0].Email
        req.session.accessToken = accessToken
        req.session.refreshToken = refreshToken
        req.sessionStore.accessToken = accessToken
        req.sessionStore.refreshToken = refreshToken
        res.redirect('/home')

   } catch (error) {
    if(error.isJoi===true) {
        return next(createError.BadRequest("Invalid UserName/Password"))    
    }
        next(error)
   }
   finally{
    if(db != null){
        console.log('closing db connnection');
    db.close();
    }
}
})

router.get('/logout', async(req,res,next)=>{
    try {
        console.log(req.sessionStore.accessToken)
        const refreshToken = req.sessionStore.refreshToken
        if(!refreshToken){
            throw createError.BadRequest()
        }

        const userId = await verifyRefreshToken(refreshToken)
        redisClient.del(userId+"RefreshToken",(err,val)=>{
            if(err){
                console.log(err.message)
                throw createError.InternalServerError()
            }

            console.log('deleted-'+val)
            // req.sessionStore.destroy(req.session.id)
            // req.session.destroy()
            //res.send('You have been logged out successfully...!!!')
        })

        redisClient.del(userId+"AccessToken",(err,val)=>{
            if(err){
                console.log(err.message)
                throw createError.InternalServerError()
            }

            console.log('deleted-'+val)
            
        })

            req.sessionStore.destroy(req.session.id)
            req.session.destroy()
            res.send('You have been logged out successfully...!!!')
        
    } catch (error) {
        next(error)
    }
})

router.post('/refresh-token', async(req,res,next)=>{
    try {
        const{refreshToken} = req.body
        if(!refreshToken){
            throw createError.BadRequest()
        }

        const userId = await verifyRefreshToken(refreshToken)
        const accessToken = await signAccessToken(userId)
        const refToken = await signRefreshToken(userId)
        res.send({accessToken,refreshToken:refToken})
    } catch (error) {
        next(error)
    }
})

module.exports = router