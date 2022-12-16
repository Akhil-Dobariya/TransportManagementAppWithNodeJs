const JWTHelper = require('./jwt_helper')
const createError = require('http-errors')
const redisClient = require('./init_redis')

function GetYYYYMMDDdate(date){
    console.log('Input '+date);
    var tempDate = new Date(date);

        var year = `${tempDate.getUTCFullYear()}`;
        var month = `${("0"+(tempDate.getUTCMonth()+1)).slice(-2)}`;
        var datee = `${("0"+tempDate.getUTCDate()).slice(-2)}`;

        date = `${year}-${month}-${datee}`;
        console.log('Result '+date);
        return date;
}

async function AuthenticationCheck(req,res,next){
    console.log(req.cookies)
    console.log('Hitting Middleware ' + req.url)

    if(req.url === '/' || req.url.indexOf('login') != -1){
        next()
    }
    else{
        if(req.cookies.authToken === undefined || req.cookies.authToken === '' || req.cookies.authToken === {}){
            res.redirect('/')
        }
        else{
            const accessToken = req.cookies.authToken
            const userId = req.cookies.userEmail

            try {
                await JWTHelper.verifyAccessToken(accessToken, userId).then((payload)=>{
                    console.log(payload)
                    if(payload.aud == userId){
                        next()
                    }
                    else{
                        console.log('prommise resolved but aud not matching')
                    }
                }).catch(async (err)=>{
                    console.log(err)

                    if (err.name === "TokenExpiredError") {
                        console.log('Access token expired, checking refresh token')

                        var refreshToken = null
                        await redisClient.get(userId + 'RefreshToken', (err, result) => {
                            if (err) {
                                console.log(err.message)
                                throw createError.InternalServerError()
                            }
                            else {
                                refreshToken = result
                            }
                        })

                        await JWTHelper.verifyRefreshToken(refreshToken).then(async (jwtPayload) =>{
                            if(userId == jwtPayload.aud){
                                console.log('refresh token verified, Generating new access token')
                                var accessToken = await JWTHelper.signAccessToken(userId)
                                res.setHeader('Set-Cookie',[`authToken=${accessToken};Max-Age=3600;Path=/`])
                                next()
                            }
                        })
                        .catch(async (err) => {
                            console.log('error while verifying refresh token ' + err)
                            res.redirect('/')
                        })
                    }
                    else{
                        res.redirect('login')
                    }
                })
            } catch (error) {
                
                    return next(createError.Unauthorized(err.message))
            }
        }
    }
}

module.exports={
    GetYYYYMMDDdate,
    AuthenticationCheck
};