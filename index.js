require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT ||4091;

app.get("/",(req,res) => 
    {res.send("Hello World! Phattarahon ");
});

app.listen (port,() => 
    {console.log (`Example app listening at http://localhost:${port}`);
});