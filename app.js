const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const guid = require('guid');
const transportOrder = require('./Controllers/TransportOrder');
const adminTasks = require('./Controllers/AdminTaskController');
const app = express();
var IsLoggedIn = false;

//for logging
const morgan = require('morgan');
const TransportOrder = require('./Controllers/TransportOrder');
const { json } = require('body-parser');
//register view engine
app.set('view engine','ejs');

app.listen('3001');

app.use(express.json());
app.use(express.urlencoded());
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.static('JavaScriptSPA'))


app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.get('*',(req,res,next)=>{
    console.log('Middlewareee');
    console.log(req.url);

    if(req.url.indexOf('login') != -1 ){
    var loginqstr = req.url.split('?')[1];
    var login = loginqstr.split('=')[1];

    if(login==1){
        IsLoggedIn = true;
    }
}
    if (IsLoggedIn) {
        next();
    } else {
        console.log('Not Logged In, Redirecting to sign in page');
        //res.redirect(__dirname+'/JavaScriptSPA/index');
        //res.sendFile(path.join(__dirname + '/JavaScriptSPA/index.html'));
        res.redirect('/');
    }
});

app.get('/home',(req,res)=>{
console.log('home comingg');
    // var loginqstr = req.url.split('?')[1];
    // var login = loginqstr.split('=')[1];

    if(IsLoggedIn){
        IsLoggedIn = true;
        res.status(200).render('index');
    }
    else{

    }

    //res.redirect('index');
});

app.get('/',(req,res)=>{

    console.log('first///');
    res.sendFile(path.join(__dirname + '/JavaScriptSPA/index.html'));

    //res.redirect(__dirname+'/JavaScriptSPA/index');
    //res.status(200).render('login');
});

app.get('/index',(req,res)=>{
    res.status(200).render('index');
});

app.get('/TransportOrder/Create',(req,res)=>{
    const id = guid.create().value;
    console.log('ID ' + id);
    res.status(200).render('TransportOrder/Create',{ID:id});
});

app.post('/TransportOrder/Create',transportOrder.CreateOrder);

app.get('/TransportOrder/Orders',transportOrder.ViewAllOrders);

app.get('/TransportOrder/ViewOrder',transportOrder.ViewOrder);

app.get('/TransportOrder/EditOrder',transportOrder.EditOrder);

app.post('/TransportOrder/EditOrder',transportOrder.UpdateOrder);

app.get('/TransportOrder/DeleteOrder',transportOrder.DeleteOrder);

app.get('/AdminTasks/Tasks',adminTasks.AdminTaskIndex);

app.get('/AdminTasks/Task/CreateUser',adminTasks.CreateUserForm);

app.get('/AdminTasks/Task/ViewUsers',adminTasks.ViewAllUsers);

app.post('/AdminTasks/Task/CreateUser',adminTasks.CreateUser);

app.get('/AdminTasks/Task/ViewUser',adminTasks.ViewUser);

app.get('/AdminTasks/Task/EditUser',adminTasks.EditUser);

app.post('/AdminTasks/Task/EditUser',adminTasks.UpdateUser);

app.get('/AdminTasks/Task/DeleteUser',adminTasks.DeleteUser);

// app.post('/TransportOrder/Create',(req,res)=>{
//     console.log(req.body);
//     //const formData = JSON.parse(req.body);
//     //console.log("formData"+formData);
//     let to = new TransportOrder();
//     to.Create(req.body);

//     res.redirect('/');
// });
