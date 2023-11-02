 const express = require("express");
 const cors = require("cors");
 const mysql = require("mysql");
 require('dotenv').config();

 const detailsRouter = require("./routes/DetailsRoute");
 const emailRouter = require("./routes/sendemailRoute");


 const app = express();
 app.use(cors());
 app.use(express.json());
 app.use(express.urlencoded({ extended:false}));

const PORT =7000;

app.get("/",async(req,res)=>{
    console.log("Welcome to the app")
})

app.use("/api/", detailsRouter);
app.use("/api",emailRouter)

//mysql section
const pool = mysql.createPool({
    connectionLimit:10,
    host:'localhost',
    user:'root',
    password:'',
    database:'Creditors'
})

app.get('/api/mysql',(req,res)=>{
    pool.getConnection((err, connection)=>{
        if(err) throw err;
        console.log(`connection in id ${connection.threadId}`);
        connection.query('SELECT * FROM Aspiracredit',(err,rows)=>{
            connection.release();
            if(!err){
                res.send(rows)
            }else{
                console.log(err)
            }

        })
    })
})

app.get('/api/mysql/:id',(req,res)=>{
    pool.getConnection((err, connection)=>{
        if(err) throw err;
        console.log(`connection in id ${connection.threadId}`);
        connection.query('SELECT * FROM Aspiracredit WHERE nationalId = ?',[req.params.id],(err,rows)=>{
            connection.release();

            if(!err){
                res.send(rows)
            }else{
                console.log(err)
            }
            
        })
    })
})

app.post('/api/mysql',(req,res)=>{
    pool.getConnection((err, connection)=>{
        if(err) throw err;
        console.log(`connection in id ${connection.threadId}`);
        const params = req.body;
        connection.query('INSERT INTO Aspiracredit SET ?',params,(err,rows)=>{
            connection.release();
            if(!err){
                // Send a success status along with a JSON response
                res.status(200).json({
                    status: 'success',
                    message: `User with the National id: ${params.nationalId} has been added`
                });
            }else{
                console.log(err)
            }
            
        })
    })
});

app.listen(PORT,()=>{
    console.log(`Server listening on port ${PORT}`);
})
