const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const guid = require('guid');
const transportOrder = require('./Controllers/TransportOrder');
const adminTasks = require('./Controllers/AdminTaskController');
const app = express();
const session = require('express-session')
var cookie = require('cookie');
const AuthRoute = require('./Routes/Auth.route')
const helper = require('./Helpers/Helper')
const cookieParser = require('cookie-parser');

//for logging
const morgan = require('morgan');
const TransportOrder = require('./Controllers/TransportOrder');
const { json } = require('body-parser');
const { response } = require('express');
//register view engine
app.set('view engine', 'ejs');

app.listen('3001');

app.use(session({

    // It holds the secret key for session
    secret: 'ThisIsSessionSecret',
    // Forces the session to be saved
    // back to the session store
    resave: false,

    cookie: { maxAge: 1000*60*60*24 },

    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: true
}));

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use(morgan('dev'))

//app.use(express.static('public'));
//app.use(express.static('JavaScriptSPA'));

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')));

app.get('/favicon.ico', (req,res,next)=>{
    res.send('')
})

app.get('*', helper.AuthenticationCheck)
app.post('*', helper.AuthenticationCheck)
// app.get('*',async (req,res,next)=>{
//     console.log(req.cookies.authToken)
//     console.log('Hitting Middleware ' + req.url)

//     if(req.url === '/' || req.url.indexOf('login') != -1){
//         next()
//     }
//     else{
//         if(req.cookies.authToken === undefined || req.cookies.authToken === '' || req.cookies.authToken === {}){
//             res.redirect('/')
//         }
//         else{
//             const accessToken = req.cookies.authToken
//             const refreshToken = req.sessionStore.refreshToken
//             const userId = req.cookies.userId

//             try {
//                 await JWTHelper.verifyAccessToken(accessToken, userId).then((payload)=>{
//                     console.log(payload)
//                     if(payload.aud == userId){
//                         next()
//                     }
//                     else{
//                         console.log('prommise resolved but aud not matching')
//                     }
//                 }).catch(async (err)=>{
//                     console.log(err)

//                     if (err.name === "TokenExpiredError") {
//                         console.log('Access token expired, checking refresh token')

//                         await JWTHelper.verifyRefreshToken(refreshToken).then(async (userId) =>{
//                             if(req.sessionStore.userid == userId){
//                                 req.sessionStore.accessToken = await JWTHelper.signAccessToken(req.sessionStore.userid)
//                                 //req.sessionStore.refreshToken = await JWTHelper.signRefreshToken(req.sessionStore.userid)
//                                 res.setHeader('Set-Cookie',`authToken=${req.sessionStore.accessToken};Max-Age=3600;Path=/`)
//                                 res.setHeader('Set-Cookie',`userId=${data.recordset[0].Email};Max-Age=3600;Path=/`)

//                                 next()
//                             }
//                         })
//                         .catch(async (err) => {
//                             console.log('error while verifying refresh token ' + err)
//                             res.redirect('/')
//                         })

//                         // req.sessionStore.accessToken = await JWTHelper.signAccessToken(req.sessionStore.userid)
//                         // req.sessionStore.refreshToken = await JWTHelper.signRefreshToken(req.sessionStore.userid)

//                         // next()
//                     }
//                     else{
//                         res.redirect('login')
//                     }
//                 })
//             } catch (error) {
                
//                     return next(createError.Unauthorized(err.message))
//             }
//         }
//     }
// })

// app.post('*',async (req,res,next)=>{
//     console.log(req.cookies.authToken)
//     console.log('Hitting Middleware ' + req.url)

//     if(req.url === '/' || req.url.indexOf('login') != -1){
//         next()
//     }
//     else{
//         if(req.cookies.authToken === undefined || req.cookies.authToken === '' || req.cookies.authToken === {}){
//             res.redirect('/')
//         }
//         else{
//             const accessToken = req.cookies.authToken
//             const refreshToken = req.sessionStore.refreshToken

//             try {
//                 await JWTHelper.verifyAccessToken(accessToken, req.sessionStore.userid).then((payload)=>{
//                     console.log(payload)
//                     if(payload.aud == req.sessionStore.userid){
//                         next()
//                     }
//                     else{
//                         console.log('prommise resolved but aud not matching')
//                     }
//                 }).catch(async (err)=>{
//                     console.log(err)

//                     if (err.name === "TokenExpiredError") {
//                         console.log('Access token expired, checking refresh token')

//                         await JWTHelper.verifyRefreshToken(refreshToken).then(async (userId) =>{
//                             if(req.sessionStore.userid == userId){
//                                 req.sessionStore.accessToken = await JWTHelper.signAccessToken(req.sessionStore.userid)
//                                 //req.sessionStore.refreshToken = await JWTHelper.signRefreshToken(req.sessionStore.userid)
//                                 res.setHeader('Set-Cookie',`authToken=${req.sessionStore.accessToken};Max-Age=3600;Path=/`)
//                                 next()
//                             }
//                         })
//                         .catch(async (err) => {
//                             console.log('error while verifying refresh token ' + err)
//                             res.redirect('/')
//                         })

//                         // req.sessionStore.accessToken = await JWTHelper.signAccessToken(req.sessionStore.userid)
//                         // req.sessionStore.refreshToken = await JWTHelper.signRefreshToken(req.sessionStore.userid)

//                         // next()
//                     }
//                     else{
//                         res.redirect('login')
//                     }
//                 })
//             } catch (error) {
                
//                     return next(createError.Unauthorized(err.message))
//             }
//         }
//     }
// })

app.use('/auth', AuthRoute)

app.post('/LoginAuthReq',(req,res,next)=>{
    console.log('login auth req');

    console.log(req.body);
    console.log(req.body.IsLoggedIn);
});

app.post('/login',(req,res,next)=>{
    console.log('login request');

    console.log(req.body)
    res.render('login')
});

app.get('/home', (req, res) => {
    console.log('home comingg')
    res.render('index')
    //res.render('login');
});

app.get('/', (req, res) => {
    //console.log('firstlogsleshrequesttt');
    console.log('firstrequesttt ' + req.url);

    //console.log(req.sessionStore);

    res.status(200).render('login')

    //res.sendFile(path.join(__dirname + '/JavaScriptSPA/index.html'));
    //res.redirect(__dirname+'/JavaScriptSPA/index');
    //res.status(200).render(__dirname+'/JavaScriptSPA/index.ejs',{originalReqURL:req.url});
});

app.get('/auth', (req, res) => {
    console.log('firstlogsleshrequesttt');
    console.log('firstrequesttt ' + req.url);
    res.redirect(`'${req.url.split('=')[2]}'`);
    //res.status(200).render(__dirname+'/JavaScriptSPA/index.ejs',{originalReqURL:req.url});
});

app.get('/index', (req, res) => {
    res.status(200).render('index');
});

app.get('/TransportOrder/Create', (req, res) => {
    const id = guid.create().value;
    console.log('ID ' + id);
    res.status(200).render('TransportOrder/Create', { ID: id });
});

app.post('/TransportOrder/Create', transportOrder.CreateOrder);

app.get('/TransportOrder/Orders', transportOrder.ViewAllOrders);

app.post('/TransportOrder/Orders', transportOrder.ViewOrdersByDate);

app.get('/TransportOrder/ViewOrder', transportOrder.ViewOrder);

app.get('/TransportOrder/EditOrder', transportOrder.EditOrder);

app.post('/TransportOrder/EditOrder', transportOrder.UpdateOrder);

app.get('/TransportOrder/DeleteOrder', transportOrder.DeleteOrder);

app.get('/AdminTasks/Tasks', adminTasks.AdminTaskIndex);

app.get('/AdminTasks/Task/CreateUser', adminTasks.CreateUserForm);

app.get('/AdminTasks/Task/ViewUsers', adminTasks.ViewAllUsers);

app.post('/AdminTasks/Task/CreateUser', adminTasks.CreateUser);

app.get('/AdminTasks/Task/ViewUser', adminTasks.ViewUser);

app.get('/AdminTaskController/ViewUser', adminTasks.ViewUser);

app.get('/AdminTaskController/ViewUsers', adminTasks.ViewUsers);

app.post('/AdminTaskController/ViewUsers', adminTasks.ViewUsers);

app.get('/AdminTasks/Task/EditUser', adminTasks.EditUser);

app.get('/AdminTaskController/EditUser', adminTasks.EditUser);

app.post('/AdminTasks/Task/EditUser', adminTasks.UpdateUser);

app.post('/AdminTaskController/EditUser', adminTasks.UpdateUser);

app.get('/AdminTasks/Task/DeleteUser', adminTasks.DeleteUser);

app.get('/AdminTaskController/DeleteUser', adminTasks.DeleteUser);

app.use(async(req,res,next)=>{
    console.log('redirectinggg '+ req.url)
    res.redirect('/')
})

app.use((err,req,res,next)=>{
    res.status(err.status || 500)
    res.send({
        error:{
            status:err.status||500,
            message:err.message
        }
    })
})