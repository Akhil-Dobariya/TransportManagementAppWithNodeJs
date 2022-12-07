const { json } = require("body-parser");
const sql = require('mssql');
const configs = require('../Configurations/appConfiguration');
const helper = require('../Helpers/Helper');
const session = require("express-session");
const bcrypt = require('bcrypt')

async function AdminTaskIndex(req,res){
    res.status(200).render('./AdminTasks/index');
}

async function CreateUserForm(req,res){
    res.status(200).render('./AdminTasks/CreateUser');
}

async function ViewUser(req,res){
    console.log(req.url);
    var UserIdStr = req.url.split('?')[1];
    var UserID = UserIdStr.split('=')[1];
    console.log('UserId '+UserID);

    let db = null;
    try {
        db = await sql.connect(configs.dbConfig);
        var query = `Select top 1 * from Users where ID=${UserID}`;
        let data = await db.request().query(query);
        
        console.log(data);
        res.status(200).render('./AdminTasks/ViewUser',{data:data.recordset[0]});
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

async function EditUser(req,res){
    console.log(req.url);
    var UserIdStr = req.url.split('?')[1];
    var UserID = UserIdStr.split('=')[1];
    console.log('UserId '+UserID);

    let db = null;
    try {
        db = await sql.connect(configs.dbConfig);
        var query = `Select top 1 * from Users where ID=${UserID}`;
        let data = await db.request().query(query);
        
        console.log(data);
        res.status(200).render('./AdminTasks/EditUser',{data:data.recordset[0]});
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

async function ViewAllUsers(req,res){
    console.log('ViewAllUsers');
    console.log(req.body);
    let db = null;
    try {
        var pageNo = 1;
        var searchKey = '';

        if(req.body.pageToFetch !== undefined){
            pageNo = req.body.pageToFetch;
        }

        if(searchKey==''||searchKey==undefined)
        {
            searchKey='@';
        }

        db = await sql.connect(configs.dbConfig);
        var query = `exec GetUsersByKeyWordSearch @keyWord='${searchKey}',@pageNo='${pageNo}',@rowsPerPage='10'`;
        console.log(query);
        let data  = await db.request().query(query);
        //let data = await db.request().query("select top 12 * from TransportOrderInformation where IsActive=1");
        console.log('data from query' + data);
        //console.log(data);
        res.status(200).render('AdminTasks/ViewAllUsers',{data:data.recordset});
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

async function UpdateUser(req,res){
    
    console.log(req.body);

    const date1 = new Date().toUTCString();
    let date_ob = new Date();
    const date = `${date_ob.getUTCFullYear()}-${("0"+(date_ob.getUTCMonth()+1)).slice(-2)}-${("0"+date_ob.getUTCDate()).slice(-2)} ${("0"+date_ob.getUTCHours()).slice(-2)}:${("0"+date_ob.getUTCMinutes()).slice(-2)}:${("0"+date_ob.getUTCSeconds()).slice(-2)}.000`;

    let db = null;
    try {

        var query = `Update Users set FirstName='${req.body.FirstName}',LastName='${req.body.LastName}',Email='${req.body.Email}',Permissions='${req.body.Permissions}',ETag='${date}',LastUpdatedBy='${req.body.LastUpdatedBy}1' where ID=${req.body.ID}`;

        console.log('Query - ' + query);
        db = await sql.connect(configs.dbConfig);
        let data = await db.request().query(query);
        console.log(data);
        
        // query = `select * from users where ID=${req.body.ID}`;
        // data = await db.request().query(query);
        // console.log(data);

        //res.status(200).render('./AdminTasks/ViewUser',{data:data.recordset[0]});

        res.redirect('/AdminTasks/Task/ViewUser?UserId='+req.body.ID);
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

async function DeleteUser(req,res){
    console.log(req.url);
    var UserIdStr = req.url.split('?')[1];
    var UserID = UserIdStr.split('=')[1];
    console.log('UserId '+UserID);

    let db = null;
    try {
        db = await sql.connect(configs.dbConfig);
        var query = `Update Users set IsActive=0 where ID=${UserID}`;
        let data = await db.request().query(query);

        res.redirect('ViewUsers');
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

async function ViewUsers(req,res){
    console.log('ViewUserUsingSearch');
    console.log(req.body);
    let db = null;
    try {
        var pageNo = 1;
        var searchKey = '';

        if(req.body.pageToFetch !== undefined){
            pageNo = req.body.pageToFetch;
        }

        if(req.body.SearchUser !== undefined){
            searchKey = req.body.SearchUser;
            session.searchKey = req.body.SearchUser;
        }
        else{
            searchKey = session.searchKey;
        }

        if(searchKey==''||searchKey==undefined)
        {
            searchKey='@';
        }

        db = await sql.connect(configs.dbConfig);
        var query = `exec GetUsersByKeyWordSearch @keyWord='${searchKey}',@pageNo='${pageNo}',@rowsPerPage='10'`;
        console.log(query);
        let data  = await db.request().query(query);
        //let data = await db.request().query("select top 12 * from TransportOrderInformation where IsActive=1");
        console.log('data from query' + data);
        //console.log(data);
        res.status(200).render('AdminTasks/ViewAllUsers',{data:data.recordset});
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

async function CreateUser(req,res){
    
    console.log(req.body);

    const date1 = new Date().toUTCString();
    let date_ob = new Date();
    const date = `${date_ob.getUTCFullYear()}-${("0"+(date_ob.getUTCMonth()+1)).slice(-2)}-${("0"+date_ob.getUTCDate()).slice(-2)} ${("0"+date_ob.getUTCHours()).slice(-2)}:${("0"+date_ob.getUTCMinutes()).slice(-2)}:${("0"+date_ob.getUTCSeconds()).slice(-2)}.000`;

    let db = null;
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassWord = await bcrypt.hash(req.body.Password,salt)

        var query = `Insert into Users(FirstName,LastName,Email,Permissions,CreatedDate,ETag,CreatedBy,IsActive,Password) values ('${req.body.FirstName}','${req.body.LastName}','${req.body.Email}','${req.body.Permissions}','${date}','${date}','${req.body.CreatedBy}','1','${hashedPassWord}')`;

        console.log('Query - ' + query);
        db = await sql.connect(configs.dbConfig);
        let data = await db.request().query(query);
        console.log(data);
        
        // query = `select * from users where Email='${req.body.Email}'`;
        // data = await db.request().query(query);
        // console.log(data);

        // res.status(200).render('./AdminTasks/ViewUser',{data:data.recordset[0]});

        res.redirect('/AdminTasks/Task/ViewUsers');
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

module.exports={
    AdminTaskIndex,
    CreateUserForm,
    CreateUser,
    ViewAllUsers,
    ViewUser,
    EditUser,
    UpdateUser,
    DeleteUser,
    ViewUsers
}