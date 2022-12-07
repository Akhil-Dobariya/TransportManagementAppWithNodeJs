const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const { create } = require('../Models/User.model')
const redisClient = require('./init_redis')
const configs = require('../Configurations/appConfiguration');
const { boolean, expression } = require('@hapi/joi');

function signAccessToken(userId){
    console.log('useridd' + userId)
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = configs.JWTConfig.ACCESS_TOKEN_SECRET
            const options = {
                audience: userId,
                expiresIn: configs.JWTConfig.ACCESS_TOKEN_VALIDITY,
                issuer: 'LocalHost'
            }

            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    reject(createError.InternalServerError())
                    //reject(err)
                }
                else {
                    resolve(token)
                }
            })
        })
}

async function verifyAccessToken(req,res,next){
    const token = req.session.accessToken
    console.log(req.session)
    return new Promise((resolve, reject) => {
        JWT.verify(token, configs.JWTConfig.ACCESS_TOKEN_SECRET, async (err, payload) => {
            if (err) {
                //throw err
                if (err.name === "JsonWebTokenError") {
                    reject(err)
                    console.log(err.message)
                    //throw createError.Unauthorized()
                }
                // else if (err.name === "TokenExpiredError")
                // {
                //     req.session.accessToken = await signAccessToken(req.session.userid)
                //     req.session.refreshToken = await signRefreshToken(req.session.userid)
                // } 
                else {
                    //throw err
                    reject(err)
                    //throw new Error(err.message) //createError.Unauthorized(err.message)
                }
            }
            else{
                resolve(payload)
            }

            //return payload
            //req.payload = payload
            //resolve(payload)
            //next()
        })
    })
}

function signRefreshToken(userId){
    console.log('useridd' + userId)
        return new Promise((resolve, reject) => {
            const payload = {}
            const secret = configs.JWTConfig.REFRESH_TOKEN_SECRET
            const options = {
                audience: userId,
                expiresIn: configs.JWTConfig.REFRESH_TOKEN_VALIDITY,
                issuer: 'LocalHost'
            }

            JWT.sign(payload, secret, options, (err, token) => {
                if (err) {
                    console.log(err.message)
                    reject(createError.InternalServerError())
                    //reject(err)
                }
                else {

                    redisClient.set(userId+'RefreshToken', token,'EX',365*24*60*60, (err, reply) => {
                        if (err) {
                            console.log(err.message)
                            reject(createError.InternalServerError())
                            return
                        }

                        resolve(token)
                    })

                    //resolve(token)
                }
            })
        })
}

function verifyRefreshToken(refreshToken){
    return new Promise((resolve, reject) => {
        JWT.verify(refreshToken, configs.JWTConfig.REFRESH_TOKEN_SECRET, (err, payload) => {
            if (err) {
                return reject(createError.Unauthorized())
            }
            else {
                const userId = payload.aud

                redisClient.get(userId+'RefreshToken',(err,result)=>{
                    if(err){
                        console.log(err.message)
                        reject(createError.InternalServerError())
                        return
                    }

                    console.log('refreshToken-'+refreshToken)
                    console.log('fromredis-'+result)
                    if(refreshToken===result){
                        return resolve(userId)
                    }

                    reject(createError.Unauthorized())
                })

                //resolve(userId)
            }
        })
    })
}

module.exports = {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken

    // signAccessToken: (userId) => {
    //     console.log('useridd' + userId)
    //     return new Promise((resolve, reject) => {
    //         const payload = {}
    //         const secret = configs.JWTConfig.ACCESS_TOKEN_SECRET
    //         const options = {
    //             audience: userId,
    //             expiresIn: configs.JWTConfig.ACCESS_TOKEN_VALIDITY,
    //             issuer: 'LocalHost'
    //         }

    //         JWT.sign(payload, secret, options, (err, token) => {
    //             if (err) {
    //                 console.log(err.message)
    //                 reject(createError.InternalServerError())
    //                 //reject(err)
    //             }
    //             else {
    //                 resolve(token)
    //                 //console.log('settingvalueinredis')
    //                 // redisClient.SET(userId,token,(err,reply)=>{
    //                 //     if(err){
    //                 //         console.log(err.message)
    //                 //         reject(createError.InternalServerError())
    //                 //         return
    //                 //     }
    //                 //     resolve(token)
    //                 // })

    //                 // redisClient.set(userId, token,'EX',365*24*60*60, (err, reply) => {
    //                 //     if (err) {
    //                 //         console.log(err.message)
    //                 //         reject(createError.InternalServerError())
    //                 //         return
    //                 //     }

    //                 //     resolve(token)
    //                 // })
    //                 // redisClient.get(userId,(err,value)=>{
    //                 //     console.log(value)
    //                 // })
    //                 //resolve(token)

    //             }
    //         })
    //     })
    // },

    // verifyAccessToken: (req, res, next) => {
    //     const token = req.session.accessToken
    //     JWT.verify(token, configs.JWTConfig.ACCESS_TOKEN_SECRET, (err, payload) => {
    //         if (err) {
    //             if (err.name === "JsonWebTokenError") {
    //                 console.log(err.message)
    //                 return next(createError.Unauthorized())
    //             }
    //             else if(err.name === "TokenExpiredError")
    //             {
    //                 req.session.accessToken = signAccessToken(req.session.userid)
    //                 req.session.refreshToken = signRefreshToken(req.session.userid)
    //             } 
    //             else {
    //                 return next(createError.Unauthorized(err.message))
    //             }
    //         }

    //         //return payload
    //         req.payload = payload
    //         //next()
    //     })
    // },

    // signRefreshToken: (userId) => {
    //     console.log('useridd' + userId)
    //     return new Promise((resolve, reject) => {
    //         const payload = {}
    //         const secret = configs.JWTConfig.REFRESH_TOKEN_SECRET
    //         const options = {
    //             audience: userId,
    //             expiresIn: configs.JWTConfig.REFRESH_TOKEN_VALIDITY,
    //             issuer: 'LocalHost'
    //         }

    //         JWT.sign(payload, secret, options, (err, token) => {
    //             if (err) {
    //                 console.log(err.message)
    //                 reject(createError.InternalServerError())
    //                 //reject(err)
    //             }
    //             else {

    //                 redisClient.set(userId+'RefreshToken', token,'EX',365*24*60*60, (err, reply) => {
    //                     if (err) {
    //                         console.log(err.message)
    //                         reject(createError.InternalServerError())
    //                         return
    //                     }

    //                     resolve(token)
    //                 })

    //                 //resolve(token)
    //             }
    //         })
    //     })
    // },

    // verifyRefreshToken: (refreshToken) => {
    //     return new Promise((resolve, reject) => {
    //         JWT.verify(refreshToken, configs.JWTConfig.REFRESH_TOKEN_SECRET, (err, payload) => {
    //             if (err) {
    //                 return reject(createError.Unauthorized())
    //             }
    //             else {
    //                 const userId = payload.aud

    //                 redisClient.get(userId+'RefreshToken',(err,result)=>{
    //                     if(err){
    //                         console.log(err.message)
    //                         reject(createError.InternalServerError())
    //                         return
    //                     }

    //                     console.log('refreshToken-'+refreshToken)
    //                     console.log('fromredis-'+result)
    //                     if(refreshToken===result){
    //                         return resolve(userId)
    //                     }

    //                     reject(createError.Unauthorized())
    //                 })

    //                 //resolve(userId)
    //             }
    //         })
    //     })
    // }

    // verifyAccessToken: (accessToken) => {
    //     return new Promise((resolve, reject) => {
    //         JWT.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    //             if (err) {
    //                 return reject(createError.Unauthorized())
    //             }
    //             else {
    //                 const userId = payload.aud

    //                 redisClient.get(userId+'AccessToken',(err,result)=>{
    //                     if(err){
    //                         console.log(err.message)
    //                         reject(createError.InternalServerError())
    //                         return
    //                     }

    //                     console.log('refreshToken- '+accessToken)
    //                     console.log('fromredis- '+result)
    //                     if(accessToken===result){
    //                         return resolve(userId)
    //                     }

    //                     reject(createError.Unauthorized())
    //                 })

    //                 //resolve(userId)
    //             }
    //         })
    //     })
    // }
}