import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import jwt from "jsonwebtoken"

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser())

const db = new pg.Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});



app.post("/login",(req,res)=>{

    const {email,password} = req.body
    if(email !== process.env.USER_NAME || password !== process.env.USER_PASSWORD){
        return res.redirect("/login")
    }

    const token = jwt.sign({email},process.env.ACCESS_TOKEN,{expiresIn:"1h"})

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });


    res.sendFile("dashbord.html",{root:"public"})
    
})

app.get("/login",(req,res)=>{
   return res.sendFile("index.html",{root:"public"})
})

app.get("/logout",(req,res)=>{
    res.clearCookie("token")
    res.redirect("/login")
})



function auth(req,res,next){

    const token = req.cookies.token

    if(!token){
      return  res.redirect("/login")
    }

    try{
       const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
       req.user = decoded;
       next() 
    }catch(e){
       return res.redirect("/login")
    }
    

}


app.get("/api/data", auth, async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM carriers");
        res.json(result.rows);   
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
});


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



