const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const guid = require('guid');
const transportOrder = require('./Controllers/TransportOrder');
const app = express();

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

app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

app.get('/',(req,res)=>{
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

// app.post('/TransportOrder/Create',(req,res)=>{
//     console.log(req.body);
//     //const formData = JSON.parse(req.body);
//     //console.log("formData"+formData);
//     let to = new TransportOrder();
//     to.Create(req.body);

//     res.redirect('/');
// });
