const { json } = require("body-parser");
const sql = require('mssql');
const configs = require('../Configurations/appConfiguration');
const helper = require('../Helpers/Helper');
var qs = require('querystring');

class TransportOrder{
    Create(data){
        console.log('TransportOrder -> Create - '+ data.SenderMobileNo);
    }
}

async function CreateOrder(req, res){
    const date1 = new Date().toUTCString();
    let date_ob = new Date();
    const date = `${date_ob.getUTCFullYear()}-${("0"+(date_ob.getUTCMonth()+1)).slice(-2)}-${("0"+date_ob.getUTCDate()).slice(-2)} ${("0"+date_ob.getUTCHours()).slice(-2)}:${("0"+date_ob.getUTCMinutes()).slice(-2)}:${("0"+date_ob.getUTCSeconds()).slice(-2)}.000`;
    console.log('TransportOrder -> Create - '+ req.body);

    let db = null;
    try {
        console.log('Req CreateID '+ req.body.CreateID);
        console.log('Req InvoiceDate '+ req.body.InvoiceDate);
        console.log('Req Sender '+ req.body.Sender);
        console.log('Req Receiver '+ req.body.Receiver);
        console.log('Req ItemInfo '+ req.body.ItemInfo);
        console.log('Req Quantity '+ req.body.Quantity);
        console.log('Req UnitPrice '+ req.body.UnitPrice);
        console.log('Req TotalPrice '+ req.body.TotalPrice);
        console.log('Req PaidPrice '+ req.body.PaidPrice);
        console.log('Req ReceivedBy '+ req.body.ReceivedBy);
        console.log('Req SenderMobileNo '+ req.body.SenderMobileNo);
        console.log('Req ReceiverMobileNo '+ req.body.ReceiverMobileNo);
        console.log('Req InvoiceGeneratedBy '+ req.body.InvoiceGeneratedBy);
        console.log('Req ETag '+ date);
        console.log('Req InvoiceGeneratedByEmail '+ req.body.InvoiceGeneratedByEmail);
        console.log('Req ReceivedOn '+ req.body.ReceivedOn);
        console.log('Req IsActive '+ "1");
        var test = JSON.stringify(req.body);
        console.log('stringified - '+test);

        var query = `Insert into TransportOrderInformation(CreateID,InvoiceDate,Sender,Receiver,ItemInfo,Quantity,UnitPrice,TotalPrice,PaidPrice,ReceivedBy,SenderMobileNo,ReceiverMobileNo,InvoiceGeneratedBy,ETag,InvoiceGeneratedByEmail,IsActive,ReceivedOn) values ('${req.body.CreateID}','${req.body.InvoiceDate}','${req.body.Sender}','${req.body.Receiver}','${req.body.ItemInfo}','${req.body.Quantity}','${req.body.UnitPrice}','${req.body.TotalPrice}','${req.body.PaidPrice}','${req.body.ReceivedBy}','${req.body.SenderMobileNo}','${req.body.ReceiverMobileNo}','${req.body.InvoiceGeneratedBy}','${date}','${req.body.InvoiceGeneratedByEmail}','1','${req.body.ReceivedOn}')`;

        console.log('Query - ' + query);
        db = await sql.connect(configs.dbConfig);
        let data = await db.request().query(query);
        console.log('data from query' + data);
        console.log(data);
        query = `select * from TransportOrderInformation where CreateID='${req.body.CreateID}'`;
        console.log('get ' + query);
        data = await db.request().query(query);
        console.log(data);

        var tempDate = helper.GetYYYYMMDDdate(data.recordset[0].InvoiceDate);

        data.recordset[0].InvoiceDate = tempDate;
        console.log("InvoiceDate - "+data.recordset[0].InvoiceDate);

        tempDate = helper.GetYYYYMMDDdate(data.recordset[0].ReceivedOn);

        data.recordset[0].ReceivedOn = tempDate;
        console.log("ReceivedOn - "+data.recordset[0].ReceivedOn);

        res.status(200).render('TransportOrder/View',{data:data.recordset[0]});
    } catch (error) {
        console.log(error);
    }
    finally {
        if(db != null){
            console.log('closing db connnection');
        db.close();
        }
    }
}

async function UpdateOrder(req, res){
    const date1 = new Date().toUTCString();
    let date_ob = new Date();
    const date = `${date_ob.getUTCFullYear()}-${("0"+(date_ob.getUTCMonth()+1)).slice(-2)}-${("0"+date_ob.getUTCDate()).slice(-2)} ${("0"+date_ob.getUTCHours()).slice(-2)}:${("0"+date_ob.getUTCMinutes()).slice(-2)}:${("0"+date_ob.getUTCSeconds()).slice(-2)}.000`;
    console.log('TransportOrder -> Update - '+ req.body);
    console.log(req.body);

    let db = null;
    try {
        console.log('Req CreateID '+ req.body.CreateID);
        console.log('Req InvoiceDate '+ req.body.InvoiceDate);
        console.log('Req Sender '+ req.body.Sender);
        console.log('Req Receiver '+ req.body.Receiver);
        console.log('Req ItemInfo '+ req.body.ItemInfo);
        console.log('Req Quantity '+ req.body.Quantity);
        console.log('Req UnitPrice '+ req.body.UnitPrice);
        console.log('Req TotalPrice '+ req.body.TotalPrice);
        console.log('Req PaidPrice '+ req.body.PaidPrice);
        console.log('Req ReceivedBy '+ req.body.ReceivedBy);
        console.log('Req SenderMobileNo '+ req.body.SenderMobileNo);
        console.log('Req ReceiverMobileNo '+ req.body.ReceiverMobileNo);
        console.log('Req InvoiceGeneratedBy '+ req.body.InvoiceGeneratedBy);
        console.log('Req ETag '+ date);
        console.log('Req InvoiceGeneratedByEmail '+ req.body.InvoiceGeneratedByEmail);
        console.log('Req ReceivedOn '+ req.body.ReceivedOn);
        console.log('Req IsActive '+ "1");
        var test = JSON.stringify(req.body);
        console.log('stringified - '+test);

        var query = `Update TransportOrderInformation set Sender='${req.body.SenderName}',Receiver='${req.body.ReceiverName}',SenderMobileNo='${req.body.SenderMobile}',ReceiverMobileNo='${req.body.ReceiverMobile}',ItemInfo='${req.body.ItemInfo}',Quantity='${req.body.Quantity}',UnitPrice='${req.body.Price}',TotalPrice='${req.body.TotalAmount}',PaidPrice='${req.body.Paid}',ReceivedOn='${req.body.ReceivedDate}',ReceivedBy='${req.body.ReceivedBy}',ETag='${date}' where SystemInvoiceId=${req.body.InvoiceID}`;

        console.log('Query - ' + query);
        db = await sql.connect(configs.dbConfig);
        let data = await db.request().query(query);
        console.log(data);
        query = `select * from TransportOrderInformation where SystemInvoiceId=${req.body.InvoiceID}`;
        console.log('get ' + query);
        data = await db.request().query(query);
        console.log(data);

        var tempDate = helper.GetYYYYMMDDdate(data.recordset[0].InvoiceDate);

        data.recordset[0].InvoiceDate = tempDate;
        console.log("InvoiceDate - "+data.recordset[0].InvoiceDate);

        tempDate = helper.GetYYYYMMDDdate(data.recordset[0].ReceivedOn);

        data.recordset[0].ReceivedOn = tempDate;
        console.log("ReceivedOn - "+data.recordset[0].ReceivedOn);

        res.status(200).render('TransportOrder/View',{data:data.recordset[0]});
    } catch (error) {
        console.log(error);
    }
    finally {
        if(db != null){
            console.log('closing db connnection');
        db.close();
        }
    }
}

async function ViewOrder(req,res){
    console.log(req.url);
    var invoiceIdStr = req.url.split('?')[1];
    var invoiceId = invoiceIdStr.split('=')[1];
    console.log('InvoiceID '+invoiceId);

    let db = null;
    try {
        db = await sql.connect(configs.dbConfig);
        var query = `select top 1 * from TransportOrderInformation where SystemInvoiceId=${invoiceId}`;
        let data = await db.request().query(query);
        
        var tempDate = helper.GetYYYYMMDDdate(data.recordset[0].InvoiceDate);

        data.recordset[0].InvoiceDate = tempDate;
        console.log("InvoiceDate - "+data.recordset[0].InvoiceDate);

        tempDate = helper.GetYYYYMMDDdate(data.recordset[0].ReceivedOn);

        data.recordset[0].ReceivedOn = tempDate;
        console.log("ReceivedOn - "+data.recordset[0].ReceivedOn);

        console.log(data);
        res.status(200).render('TransportOrder/View',{data:data.recordset[0]});
    } catch (error) {
        console.log(error);
    }
    finally{
        if(db != null){
            console.log('closing db connnection');
        db.close();
        }
    }
}

async function EditOrder(req,res){
    console.log(req.url);
    var invoiceIdStr = req.url.split('?')[1];
    var invoiceId = invoiceIdStr.split('=')[1];
    console.log('InvoiceID '+invoiceId);

    let db = null;
    try {
        db = await sql.connect(configs.dbConfig);
        var query = `select top 1 * from TransportOrderInformation where SystemInvoiceId=${invoiceId}`;
        let data = await db.request().query(query);
        
        var tempDate = helper.GetYYYYMMDDdate(data.recordset[0].InvoiceDate);

        data.recordset[0].InvoiceDate = tempDate;
        console.log("InvoiceDate - "+data.recordset[0].InvoiceDate);

        tempDate = helper.GetYYYYMMDDdate(data.recordset[0].ReceivedOn);

        data.recordset[0].ReceivedOn = tempDate;
        console.log("ReceivedOn - "+data.recordset[0].ReceivedOn);

        console.log(data);
        res.status(200).render('TransportOrder/Edit',{data:data.recordset[0]});
    } catch (error) {
        console.log(error);
    }
    finally{
        if(db != null){
            console.log('closing db connnection');
        db.close();
        }
    }
}

async function ViewAllOrders(req,res){
    let db = null;
    try {
        db = await sql.connect(configs.dbConfig);
        let data = await db.request().query("select top 12 * from TransportOrderInformation");
        console.log('data from query' + data);
        console.log(data);
        res.status(200).render('TransportOrder/OrderList',{data:data.recordset});
    } catch (error) {
        console.log(error);
    }
    finally{
        if(db != null){
            console.log('closing db connnection');
        db.close();
        }
    }
}

module.exports = {
    CreateOrder,
    ViewAllOrders,
    ViewOrder,
    EditOrder,
    UpdateOrder
};
